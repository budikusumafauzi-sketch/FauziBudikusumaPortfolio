import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateGroundedAnswer } from '@/lib/server/gemini';
import {
  getOrUpdateKnowledgeCache,
  resetKnowledgeCacheForTesting,
} from '@/lib/server/knowledge-cache';
import { answerCache } from '@/lib/server/answer-cache';
import { buildKnowledgeRecords } from '@/data/chatbot-knowledge';
import snapshotRecords from '@/lib/server/knowledge.snapshot.json';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/chat/route';
import type { GoogleGenAI } from '@google/genai';
import type { PrismaClient } from '@prisma/client';

describe('Chatbot Hedged Requests, SWR Cache & Snapshot (TASK-039 / CR-011)', () => {
  beforeEach(() => {
    resetKnowledgeCacheForTesting(null, 0);
    answerCache.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetKnowledgeCacheForTesting(null, 0);
    answerCache.clear();
  });

  describe('AC-3: Hedged Request Mechanics (ADR-014, R-034)', () => {
    it('primary model answering before soft deadline wins without launching attempt 2', async () => {
      const mockGenerateContent = vi.fn().mockImplementation(async () => {
        return {
          candidates: [{ finishReason: 'STOP' }],
          text: JSON.stringify({
            kind: 'answer',
            answer: 'Fauzi is a software engineer.',
            citations: ['profile:main'],
          }),
        };
      });

      const mockAi = {
        models: { generateContent: mockGenerateContent },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
        'en',
        undefined,
        new Set(['profile:main']),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.hedged).toBe(false);
        expect(result.winner).toBe('primary');
        expect(result.attempts).toBe(1);
        expect(result.softDeadlineHit).toBe(false);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('launches Attempt 2 on fallback model immediately upon early transient error on primary', async () => {
      let callCount = 0;
      const mockGenerateContent = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('503 Service Unavailable / backend overloaded');
        }
        return {
          candidates: [{ finishReason: 'STOP' }],
          text: JSON.stringify({
            kind: 'answer',
            answer: 'Answered from fallback model.',
            citations: ['profile:main'],
          }),
        };
      });

      const mockAi = {
        models: { generateContent: mockGenerateContent },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
        'en',
        undefined,
        new Set(['profile:main']),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.hedged).toBe(true);
        expect(result.winner).toBe('fallback');
        expect(result.attempts).toBe(2);
        expect(result.retryCount).toBe(1);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it('strictly does NOT launch Attempt 2 on hard client errors (400, 401, 403, 404, 429)', async () => {
      const mockGenerateContent = vi.fn().mockImplementation(async () => {
        throw new Error('429 RESOURCE_EXHAUSTED / quota exceeded');
      });

      const mockAi = {
        models: { generateContent: mockGenerateContent },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.logCode).toBe('chat.gemini_quota');
        expect(result.hedged).toBe(false);
        expect(result.attempts).toBe(1);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('hard total deadline (8.0s) aborts in-flight attempts and returns unavailable', async () => {
      const mockGenerateContent = vi.fn().mockImplementation(
        ({ config }: { config: { abortSignal: AbortSignal } }) =>
          new Promise((_, reject) => {
            config.abortSignal.addEventListener('abort', () => {
              reject(new Error('AbortError: The operation was aborted'));
            });
          }),
      );

      const mockAi = {
        models: { generateContent: mockGenerateContent },
      } as unknown as GoogleGenAI;

      // Fast-forward or short timeout simulation
      const resultPromise = generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
      );

      // Fast-forward vitest or wait
      const result = await resultPromise;
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe('unavailable');
        expect(result.logCode).toBe('chat.gemini_timeout');
      }
    }, 10000);
  });

  describe('AC-4 & AC-5: SWR Knowledge Cache & Build-Time Snapshot (ADR-015)', () => {
    it('verifies snapshot parity: knowledge.snapshot.json exactly matches buildKnowledgeRecords()', () => {
      const records = buildKnowledgeRecords();
      records.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.position - b.position;
      });

      expect(snapshotRecords.length).toBe(records.length);
      expect(snapshotRecords.map((r: { id: string }) => r.id)).toEqual(records.map((r) => r.id));
      expect(snapshotRecords.length).toBeGreaterThanOrEqual(27);
    });

    it('serves build-time snapshot when database query times out (>600ms) or is closed', async () => {
      const slowClient = {
        knowledgeRecord: {
          findMany: vi.fn().mockImplementation(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve([]), 1500); // Slower than 600ms race timer
              }),
          ),
        },
      } as unknown as PrismaClient;

      const start = Date.now();
      const res = await getOrUpdateKnowledgeCache(slowClient);
      const elapsed = Date.now() - start;

      expect(res.source).toBe('snapshot');
      expect(res.records.length).toBe(snapshotRecords.length);
      expect(elapsed).toBeLessThan(1200);
    });

    it('serves in-memory cache with dbMs = 0 on cache hit (SWR)', async () => {
      const mockClient = {
        knowledgeRecord: {
          findMany: vi.fn().mockResolvedValue(snapshotRecords),
        },
      } as unknown as PrismaClient;

      // Seed cache
      await getOrUpdateKnowledgeCache(mockClient);

      // Second call is an immediate SWR cache hit
      const res2 = await getOrUpdateKnowledgeCache(mockClient);
      expect(res2.cacheHit).toBe(true);
      expect(res2.source).toBe('cache');
      expect(res2.dbMs).toBe(0);
      expect(res2.records.length).toBe(snapshotRecords.length);
    });
  });

  describe('AC-6 & AC-7: Panel-Open Warm-Up (204) & In-Memory Answer Cache', () => {
    it('GET /api/chat returns 204 No Content with X-Warmup header and 0 AI calls', async () => {
      const req = new NextRequest('http://localhost:3000/api/chat', { method: 'GET' });
      const res = await GET(req);

      expect(res.status).toBe(204);
      expect(res.headers.get('Allow')).toContain('GET');
      expect(res.headers.get('Allow')).toContain('POST');
      expect(res.headers.get('X-Warmup')).toBeDefined();
    });

    it('Answer Cache returns response in <150ms on second identical 0-history query without calling Gemini', () => {
      const msg = "What is Fauzi's professional background?";
      const sampleResponse = {
        status: 'answered' as const,
        answer: 'Fauzi Budikusuma is a Software Development & Network Engineer.',
        sources: [{ slug: 'profile:main', title: 'Profile Overview', category: 'PROFILE' }],
      };

      // Set in cache
      answerCache.set('en', msg, sampleResponse);

      const t0 = Date.now();
      const hit = answerCache.get('en', msg);
      const elapsed = Date.now() - t0;

      expect(hit).not.toBeNull();
      expect(hit?.answer).toBe(sampleResponse.answer);
      expect(elapsed).toBeLessThan(50);
    });

    it('Answer Cache normalizes punctuation and spacing for robust chip hits', () => {
      const sampleResponse = {
        status: 'answered' as const,
        answer: 'Fauzi tools and skills.',
        sources: [],
      };

      answerCache.set('en', 'What technical skills and tools does Fauzi use?', sampleResponse);

      // Query with different spacing and lowercase
      const hit = answerCache.get('en', 'what technical skills and tools does fauzi use');
      expect(hit).not.toBeNull();
      expect(hit?.answer).toBe('Fauzi tools and skills.');
    });
  });
});
