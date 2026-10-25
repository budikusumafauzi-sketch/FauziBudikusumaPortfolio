import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isTransientGeminiError,
  classifyGeminiError,
  generateGroundedAnswer,
  PER_ATTEMPT_TIMEOUT_MS,
  TOTAL_REQUEST_BUDGET_MS,
} from '@/lib/server/gemini';
import {
  getOrUpdateKnowledgeCache,
  warmKnowledgeCache,
  resetKnowledgeCacheForTesting,
  KNOWLEDGE_CACHE_TTL_MS,
} from '@/lib/server/knowledge-cache';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/chat/route';
import type { PrismaClient } from '@prisma/client';
import type { GoogleGenAI } from '@google/genai';

describe('Chatbot Reliability & In-Memory Cache (TASK-037 / CR-009)', () => {
  beforeEach(() => {
    resetKnowledgeCacheForTesting(null, 0);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetKnowledgeCacheForTesting(null, 0);
  });

  describe('Transient vs Non-Retryable Error Classification (R-034)', () => {
    it('correctly classifies transient errors eligible for at most ONE retry', () => {
      expect(isTransientGeminiError(new Error('Timeout after 7000ms'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('fetch failed'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('ECONNRESET connection reset'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('503 Service Unavailable'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('500 Internal Server Error'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('Model is overloaded'), false)).toBe(true);
      expect(isTransientGeminiError(new Error('Request aborted'), true)).toBe(true);
    });

    it('strictly forbids retries for non-transient status codes (400, 401, 403, 404, 429)', () => {
      expect(isTransientGeminiError(new Error('400 Bad Request'), false)).toBe(false);
      expect(isTransientGeminiError(new Error('API_KEY_INVALID: 401 Unauthorized'), false)).toBe(false);
      expect(isTransientGeminiError(new Error('403 PERMISSION_DENIED'), false)).toBe(false);
      expect(isTransientGeminiError(new Error('404 Model Not Found'), false)).toBe(false);
      expect(isTransientGeminiError(new Error('429 RESOURCE_EXHAUSTED Quota exceeded'), false)).toBe(false);

      const errorWithStatus = { status: 429, message: 'Rate limit exceeded' };
      expect(isTransientGeminiError(errorWithStatus, false)).toBe(false);
    });

    it('classifies operational error codes without leaking secrets', () => {
      expect(classifyGeminiError(new Error('Quota exceeded 429'), false)).toBe('chat.gemini_quota');
      expect(classifyGeminiError(new Error('Invalid api key'), false)).toBe('chat.gemini_key');
      expect(classifyGeminiError(new Error('Permission denied 403'), false)).toBe('chat.gemini_denied');
      expect(classifyGeminiError(new Error('AbortError'), true)).toBe('chat.gemini_timeout');
      expect(classifyGeminiError(new Error('fetch failed'), false)).toBe('chat.gemini_network');
    });
  });

  describe('In-Memory Knowledge Cache & Stale-While-Error Fallback', () => {
    const mockRecords = [
      {
        id: 'profile:fauzi',
        category: 'PROFILE',
        title: 'Fauzi Budikusuma',
        body: 'Software Development & Network Engineer.',
        keywords: ['fauzi', 'profile'],
        url: null,
        position: 0,
      },
      {
        id: 'cert:mtcna',
        category: 'CERTIFICATION',
        title: 'MTCNA Certification',
        body: 'MikroTik Certified Network Associate.',
        keywords: ['mtcna', 'mikrotik'],
        url: 'https://mikrotik.com',
        position: 1,
      },
    ];

    it('fetches from DB on cold start and serves from cache on subsequent calls within TTL', async () => {
      const mockFindMany = vi.fn().mockResolvedValue(mockRecords);
      const mockPrisma = { knowledgeRecord: { findMany: mockFindMany } } as unknown as PrismaClient;

      // 1. Cold start
      const first = await getOrUpdateKnowledgeCache(mockPrisma);
      expect(first.cacheHit).toBe(false);
      expect(first.records).toEqual(mockRecords);
      expect(mockFindMany).toHaveBeenCalledTimes(1);

      // 2. Second call within 10-minute TTL
      const second = await getOrUpdateKnowledgeCache(mockPrisma);
      expect(second.cacheHit).toBe(true);
      expect(second.dbMs).toBe(0);
      expect(second.records).toEqual(mockRecords);
      expect(mockFindMany).toHaveBeenCalledTimes(1); // No second DB call
    });

    it('serves stale cached records if database query fails during refresh (stale-while-error)', async () => {
      // Pre-seed cache with existing records, but expired timestamp
      const expiredTimestamp = Date.now() - (KNOWLEDGE_CACHE_TTL_MS + 5000);
      resetKnowledgeCacheForTesting(mockRecords, expiredTimestamp);

      // DB query fails with Neon closed connection
      const mockFindMany = vi.fn().mockRejectedValue(new Error('PostgreSQL connection: Error { kind: Closed, cause: None }'));
      const mockPrisma = { knowledgeRecord: { findMany: mockFindMany } } as unknown as PrismaClient;

      const result = await getOrUpdateKnowledgeCache(mockPrisma);
      expect(result.stale).toBe(true);
      expect(result.records).toEqual(mockRecords);
      expect(result.cacheHit).toBe(true);
    });

    it('warms knowledge cache via warmKnowledgeCache without throwing', async () => {
      const mockFindMany = vi.fn().mockResolvedValue(mockRecords);
      const mockPrisma = { knowledgeRecord: { findMany: mockFindMany } } as unknown as PrismaClient;

      const warmResult = await warmKnowledgeCache(mockPrisma);
      expect(warmResult.warmed).toBe(true);
      expect(warmResult.count).toBe(2);
    });
  });

  describe('Bounded Single Retry against Gemini (R-034)', () => {
    it('executes exactly ONE retry on transient timeout and recovers', async () => {
      let callCount = 0;
      const mockGenerateContent = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('fetch failed ECONNRESET');
        }
        return {
          candidates: [{ finishReason: 'STOP' }],
          text: 'Fauzi Budikusuma is a Software Development & Network Engineer.',
        };
      });

      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.answer).toContain('Fauzi Budikusuma');
        expect(result.retryCount).toBe(1);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it('does NOT retry when encountering a 429 quota or 403 permission error', async () => {
      const mockGenerateContent = vi.fn().mockRejectedValue(new Error('429 RESOURCE_EXHAUSTED Quota exceeded'));

      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe('unavailable');
        expect(result.logCode).toBe('chat.gemini_quota');
        expect(result.retryCount).toBe(0);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('returns unavailable when both initial attempt and retry fail (double fault)', async () => {
      const mockGenerateContent = vi.fn().mockRejectedValue(new Error('Timeout after 7000ms'));

      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      } as unknown as GoogleGenAI;

      const result = await generateGroundedAnswer(
        'Fauzi is a software engineer.',
        'Who is Fauzi?',
        mockAi,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe('unavailable');
        expect(result.logCode).toBe('chat.gemini_timeout');
        expect(result.retryCount).toBe(1);
      }
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });
  });

  describe('Panel-Open Warm-Up Endpoint (Item 36, R-037)', () => {
    it('returns 200 ok on GET /api/chat?action=warmup without calling Gemini', async () => {
      const req = new NextRequest('http://localhost:3000/api/chat?action=warmup', {
        method: 'GET',
      });

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.status).toBe('ok');
      expect(body.answer).toBe('warmed');
      expect(res.headers.get('x-warmup')).toBeDefined();
    });

    it('returns 405 on GET /api/chat without warmup parameter', async () => {
      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'GET',
      });

      const res = await GET(req);
      expect(res.status).toBe(405);
    });
  });

  describe('Timing Constants Verification', () => {
    it('adheres to approved per-attempt and total budgets', () => {
      expect(PER_ATTEMPT_TIMEOUT_MS).toBe(7_000);
      expect(TOTAL_REQUEST_BUDGET_MS).toBe(14_000);
      expect(KNOWLEDGE_CACHE_TTL_MS).toBe(600_000); // 10 minutes
    });
  });
});
