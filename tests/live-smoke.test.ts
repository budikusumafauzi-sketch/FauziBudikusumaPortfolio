/**
 * TASK-022 — Live End-to-End Grounded Smoke Test.
 *
 * Runs against the actual POST /api/chat route handler using live .env credentials:
 * - Reads verified records from Neon PostgreSQL (portfolio_runtime read-only role)
 * - Sends prompt with grounding rules to Gemini API via @google/genai
 * - Verifies HTTP 200, status: "answered", grounded reply length > 20, and non-empty sources
 */

import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';

describe('Live End-to-End Grounded Smoke Test (TASK-022)', () => {
  it('executes live grounded query against Neon DB and Gemini API with strict HTTP 200 answered', async () => {
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
    const body = await res.json();

    console.log('\n=== LIVE GROUNDED SMOKE TEST RESULTS ===');
    console.log('HTTP Status:', res.status);
    console.log('Chat Status:', body.status);
    console.log('Reply Text:\n', body.reply || body.answer);
    if (body.sources) {
      console.log('Sources Count:', body.sources.length);
      console.log('Sources Cited:', body.sources.map((s: { title: string }) => s.title).join(' | '));
    }
    console.log('========================================\n');

    // Strict assertion: Must be HTTP 200 and status: "answered"
    expect(res.status).toBe(200);
    expect(body.status).toBe('answered');
    expect(body.reply.length).toBeGreaterThan(20);
    expect(body.sources.length).toBeGreaterThan(0);

    // Verify grounded facts: Must mention verified records from Neon DB
    const replyLower = body.reply.toLowerCase();
    const hasCertificationMatch =
      replyLower.includes('mtcna') ||
      replyLower.includes('mikrotik') ||
      replyLower.includes('cybersecurity') ||
      replyLower.includes('google');
    const hasExperienceMatch =
      replyLower.includes('kominfo') ||
      replyLower.includes('internship') ||
      replyLower.includes('dinas');

    expect(hasCertificationMatch || hasExperienceMatch).toBe(true);
  }, 35000); // 35s timeout for live network call
});
