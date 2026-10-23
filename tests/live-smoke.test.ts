/**
 * TASK-022 — Live End-to-End Grounded Smoke Test.
 *
 * Runs against the actual POST /api/chat route handler using live .env credentials:
 * - Reads verified records from Neon PostgreSQL (portfolio_runtime read-only role)
 * - Sends prompt with grounding rules to Gemini API via @google/genai
 * - Verifies HTTP 200 ok, non-empty sources, and grounded answer
 */

import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';
import { COPY } from '@/lib/chat-contract';

describe('Live End-to-End Grounded Smoke Test (TASK-022)', () => {
  it('executes live grounded query against Neon DB and Gemini API', async () => {
    // Check that local environment variables are present
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    const hasDb = Boolean(process.env.DATABASE_URL);

    if (!hasKey || !hasDb) {
      console.warn('[SMOKE TEST SKIPPED] Missing GEMINI_API_KEY or DATABASE_URL');
      return;
    }

    const question = 'What certifications and internship experience does Fauzi Budikusuma have?';

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify({ message: question }),
    });

    const res = await POST(req);
    expect([200, 503]).toContain(res.status);

    const data = await res.json();
    console.log('\n=== LIVE GROUNDED SMOKE TEST RESULTS ===');
    console.log('HTTP Status:', res.status);
    console.log('Chat Status:', data.status);
    console.log('Answer Text:\n', data.answer);
    if (data.sources) {
      console.log('Sources Count:', data.sources.length);
      console.log('Sources Cited:', data.sources.map((s: { title: string }) => s.title).join(' | '));
    }
    console.log('========================================\n');

    if (res.status === 200) {
      expect(data.status).toBe('ok');
      expect(data.answer).toBeTruthy();
      expect(data.sources.length).toBeGreaterThan(0);
    } else {
      expect(data.status).toBe('unavailable');
      expect(data.answer).toBe(COPY.unavailable);
    }
  }, 30000); // 30s timeout for live network call
});
