/**
 * POST /api/chat — Portfolio assistant Route Handler.
 *
 * 7-layer defense-in-depth pipeline (ARCHITECTURE.md §8):
 *   1. Method guard (POST only, except lightweight GET warmup → 405)
 *   2. Content-type check (application/json only → 415)
 *   3. Body size limit (→ 413)
 *   4. Rate limit (sliding window per IP → 429)
 *   5. JSON parse + strict Zod validation (→ 400)
 *   6. Deterministic scope / injection guard (→ 200 out_of_scope, 0 DB/Gemini)
 *   7. Knowledge cache retrieval (in-memory 10-min TTL + stale-while-error)
 *   8. Gemini grounded generation (bounded single retry per R-034 → 200 answered | 503)
 *
 * Cache-Control: no-store is set on every response (chat is dynamic).
 * Visitor-safe errors only — no stack traces, SQL, paths or secrets (R-029).
 */

import { type NextRequest, NextResponse } from 'next/server';
import {
  ChatRequestSchema,
  COPY,
  getFixedCopy,
  MAX_BODY_BYTES,
  type ChatResponse,
} from '@/lib/chat-contract';
import { checkRateLimit, getClientKey } from '@/lib/server/rate-limit';
import { checkGuard } from '@/lib/server/guard';
import { retrieveKnowledge, buildContext } from '@/lib/server/retrieval';
import { prisma } from '@/lib/server/db';
import { generateGroundedAnswer } from '@/lib/server/gemini';
import { getOrUpdateKnowledgeCache, warmKnowledgeCache } from '@/lib/server/knowledge-cache';

/** Safe JSON response with cache-control and no internal leakage. */
function json(body: ChatResponse, status: number, extra?: HeadersInit): NextResponse {
  const res = NextResponse.json(body, { status });
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  if (extra) {
    const entries = extra instanceof Headers ? [...extra.entries()] : Object.entries(extra);
    for (const [k, v] of entries) {
      res.headers.set(k, v);
    }
  }
  return res;
}

/**
 * Safe stage-level timing and operational metrics logger (R-022, R-029).
 * Absolutely ZERO visitor text, secrets, API keys, DB URLs, or stack traces.
 */
function logStageMetric(metric: {
  totalMs: number;
  dbMs: number;
  aiMs: number;
  cacheHit: boolean;
  status: string;
  stage?: string;
  model?: string;
  retries?: number;
  errorClass?: string;
  httpStatus?: number;
  causeCode?: string;
}) {
  if (process.env.NODE_ENV !== 'test') {
    const parts = [
      `totalMs=${metric.totalMs}`,
      `dbMs=${metric.dbMs}`,
      `aiMs=${metric.aiMs}`,
      `cacheHit=${metric.cacheHit}`,
      `status=${metric.status}`,
    ];
    if (metric.model) parts.push(`model=${metric.model}`);
    if (metric.retries !== undefined && metric.retries > 0) parts.push(`retries=${metric.retries}`);
    if (metric.stage) parts.push(`failedStage=${metric.stage}`);
    if (metric.errorClass) parts.push(`errorClass=${metric.errorClass}`);
    if (metric.httpStatus) parts.push(`httpStatus=${metric.httpStatus}`);
    if (metric.causeCode) parts.push(`causeCode=${metric.causeCode}`);

    console.log(`[CHAT:METRIC] ${parts.join(' ')}`);
  }
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTotal = Date.now();
  try {
    // ── Layer 2: Content-type ──────────────────────────────────────────────────
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return json({ status: 'unsupported_media_type', answer: COPY.unsupported_media_type }, 415);
    }

    // ── Layer 3: Body size limit ────────────────────────────────────────────────
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return json({ status: 'too_large', answer: COPY.too_large }, 413);
    }

    // Read body and enforce byte cap regardless of Content-Length header.
    const bodyBuffer = await req.arrayBuffer();
    if (bodyBuffer.byteLength > MAX_BODY_BYTES) {
      return json({ status: 'too_large', answer: COPY.too_large }, 413);
    }
    const rawBody = new TextDecoder().decode(bodyBuffer);

    // ── Layer 4: Rate limit ────────────────────────────────────────────────────
    const clientKey = getClientKey(req.headers);
    const rateResult = checkRateLimit(clientKey);
    if (!rateResult.allowed) {
      const retryAfterSeconds = rateResult.retryAfterSeconds ?? 60;
      return json(
        { status: 'rate_limited', answer: COPY.rate_limited, retryAfterSeconds },
        429,
        { 'Retry-After': String(retryAfterSeconds) },
      );
    }

    // ── Layer 5: JSON parse + strict Zod validation ────────────────────────────
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return json({ status: 'invalid_request', answer: COPY.invalid_request }, 400);
    }

    const validated = ChatRequestSchema.safeParse(parsed);
    if (!validated.success) {
      return json({ status: 'invalid_request', answer: COPY.invalid_request }, 400);
    }

    const { message, language = 'en' } = validated.data;

    // ── Layer 6: Scope / injection guard ───────────────────────────────────────
    const guardResult = checkGuard(message);
    if (guardResult.blocked) {
      // Operational log code only — no message content (ARCHITECTURE.md §9)
      if (process.env.NODE_ENV !== 'test') {
        console.log(guardResult.logCode ?? 'chat.guard');
      }
      const totalMs = Date.now() - startTotal;
      logStageMetric({
        totalMs,
        dbMs: 0,
        aiMs: 0,
        cacheHit: false,
        status: 'out_of_scope',
      });
      return json({ status: 'out_of_scope', answer: getFixedCopy('out_of_scope', language) }, 200);
    }

    // ── Layer 7: Resilient in-memory knowledge cache retrieval ────────────────
    let cacheHit = false;
    let dbMs = 0;
    let records: Awaited<ReturnType<typeof retrieveKnowledge>> = [];
    try {
      const isTestEnv = process.env.NODE_ENV === 'test';
      const enableCacheInTest = Boolean((globalThis as unknown as { __ENABLE_TEST_CACHE__?: boolean }).__ENABLE_TEST_CACHE__);

      if (isTestEnv && !enableCacheInTest) {
        // Direct retrieval in unit tests that mock prisma.knowledgeRecord.findMany directly
        records = await retrieveKnowledge(prisma, message);
      } else {
        const cacheResult = await getOrUpdateKnowledgeCache(prisma);
        cacheHit = cacheResult.cacheHit;
        dbMs = cacheResult.dbMs;
        records = await retrieveKnowledge(prisma, message, cacheResult.records);
      }
    } catch (err: unknown) {
      const totalMs = Date.now() - startTotal;
      if (process.env.NODE_ENV !== 'test') {
        console.error('chat.db_error');
      }
      logStageMetric({
        totalMs,
        dbMs,
        aiMs: 0,
        cacheHit: false,
        status: 'unavailable',
        stage: 'db',
        errorClass: err instanceof Error ? err.constructor.name : typeof err,
      });
      return json({ status: 'unavailable', answer: getFixedCopy('unavailable', language) }, 503);
    }

    // Short-circuit with no_data (0 Gemini calls) when 0 records match
    if (records.length === 0) {
      const totalMs = Date.now() - startTotal;
      logStageMetric({
        totalMs,
        dbMs,
        aiMs: 0,
        cacheHit,
        status: 'no_data',
      });
      return json({ status: 'no_data', answer: getFixedCopy('no_data', language) }, 200);
    }

    // ── Layer 8: Grounded generation via Gemini (bounded single retry) ────────
    const facts = buildContext(records);
    const geminiResult = await generateGroundedAnswer(facts, message, undefined, language);
    const totalMs = Date.now() - startTotal;

    if (!geminiResult.success) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(geminiResult.logCode);
      }
      logStageMetric({
        totalMs,
        dbMs,
        aiMs: geminiResult.aiMs ?? 0,
        cacheHit,
        status: geminiResult.status,
        stage: 'ai',
        model: geminiResult.modelUsed,
        retries: geminiResult.retryCount,
        errorClass: geminiResult.errorClass,
        httpStatus: geminiResult.httpStatus,
        causeCode: geminiResult.networkCauseCode,
      });
      if (geminiResult.status === 'no_data') {
        return json({ status: 'no_data', answer: getFixedCopy('no_data', language) }, 200);
      }
      return json({ status: 'unavailable', answer: getFixedCopy('unavailable', language) }, 503);
    }

    logStageMetric({
      totalMs,
      dbMs,
      aiMs: geminiResult.aiMs ?? 0,
      cacheHit,
      status: 'answered',
      model: geminiResult.modelUsed,
      retries: geminiResult.retryCount,
    });

    const sources = records.map((r) => ({
      slug: r.id,
      title: r.title,
      category: r.category,
    }));

    return json(
      {
        status: 'answered',
        answer: geminiResult.answer,
        reply: geminiResult.answer,
        sources,
      },
      200,
    );
  } catch (err) {
    // Catch-all: log code only, never expose internals (R-029).
    const totalMs = Date.now() - startTotal;
    if (process.env.NODE_ENV !== 'test') {
      console.error('chat.unexpected', err instanceof Error ? err.message : 'unknown error');
    }
    logStageMetric({
      totalMs,
      dbMs: 0,
      aiMs: 0,
      cacheHit: false,
      status: 'error',
      stage: 'unexpected',
      errorClass: err instanceof Error ? err.constructor.name : typeof err,
    });
    return json({ status: 'error', answer: COPY.error }, 500);
  }
}

// ── GET method (lightweight panel-open warm-up or 405) ─────────────────────────

export async function GET(req?: NextRequest): Promise<NextResponse> {
  if (req) {
    const url = new URL(req.url);
    // Lightweight warm-up when visitor opens chat panel (Item 36, R-037: 0 Gemini calls)
    if (url.searchParams.get('action') === 'warmup' || url.searchParams.get('warmup') === '1') {
      const warmResult = await warmKnowledgeCache(prisma);
      return json(
        {
          status: 'ok',
          answer: 'warmed',
          sources: [],
        },
        200,
        {
          'X-Warmup': warmResult.warmed ? 'hit' : 'miss',
          'X-Cache-DB-Ms': String(warmResult.dbMs),
        },
      );
    }
  }

  return methodNotAllowed();
}

export async function PUT(): Promise<NextResponse> {
  return methodNotAllowed();
}
export async function DELETE(): Promise<NextResponse> {
  return methodNotAllowed();
}
export async function PATCH(): Promise<NextResponse> {
  return methodNotAllowed();
}

function methodNotAllowed(): NextResponse {
  const res = NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  res.headers.set('Allow', 'POST');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
