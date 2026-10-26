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
import { loadKnowledge } from '@/lib/server/knowledge';
import { prisma } from '@/lib/server/db';
import { generateGroundedAnswer } from '@/lib/server/gemini';
import { warmKnowledgeCache } from '@/lib/server/knowledge-cache';
import { answerCache } from '@/lib/server/answer-cache';
import { matchGreetingOrThanks, matchStarterChip } from '@/lib/server/local-matcher';
import { composeLocalAnswer } from '@/lib/server/local-composer';

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
 * Safe stage-level timing and operational metrics logger (R-022, R-029, AC-1).
 * Absolutely ZERO visitor text, secrets, API keys, DB URLs, or stack traces.
 */
function logStageMetric(metric: {
  totalMs: number;
  dbMs: number;
  aiMs: number;
  cacheHit: boolean;
  source: 'cache' | 'db' | 'snapshot' | 'local';
  hedged?: boolean;
  winner?: 'primary' | 'fallback' | 'cache' | 'local';
  attempts?: number;
  softDeadlineHit?: boolean;
  promptTokens?: number;
  outputTokens?: number;
  thoughtsTokens?: number;
  answerCache?: 'hit' | 'miss' | 'bypass';
  status: string;
  stage?: string;
  model?: string;
  retries?: number;
  errorClass?: string;
  httpStatus?: number;
  causeCode?: string;
  providerStatus?: string;
  abortOrigin?: 'client' | 'server' | 'none';
  a1Ms?: number;
  a2Ms?: number;
  a1Model?: string;
  a2Model?: string;
  connReused?: boolean;
}) {
  if (process.env.NODE_ENV !== 'test') {
    const parts = [
      `source=${metric.source}`,
      `hedged=${metric.hedged ?? false}`,
      `winner=${metric.winner ?? 'primary'}`,
      `attempts=${metric.attempts ?? 1}`,
      `softDeadlineHit=${metric.softDeadlineHit ?? false}`,
      `promptTokens=${metric.promptTokens ?? 0}`,
      `outputTokens=${metric.outputTokens ?? 0}`,
      `thoughtsTokens=${metric.thoughtsTokens ?? 0}`,
      `answerCache=${metric.answerCache ?? 'miss'}`,
      `dbMs=${metric.dbMs}`,
      `aiMs=${metric.aiMs}`,
      `totalMs=${metric.totalMs}`,
      `cacheHit=${metric.cacheHit}`,
      `status=${metric.status}`,
    ];
    if (metric.model) parts.push(`model=${metric.model}`);
    if (metric.retries !== undefined && metric.retries > 0) parts.push(`retries=${metric.retries}`);
    if (metric.stage) parts.push(`failedStage=${metric.stage}`);
    if (metric.errorClass) parts.push(`errorClass=${metric.errorClass}`);
    if (metric.httpStatus) parts.push(`httpStatus=${metric.httpStatus}`);
    if (metric.causeCode) parts.push(`causeCode=${metric.causeCode}`);
    if (metric.providerStatus) parts.push(`providerStatus=${metric.providerStatus}`);
    if (metric.abortOrigin) parts.push(`abortOrigin=${metric.abortOrigin}`);
    if (metric.a1Ms !== undefined) parts.push(`a1Ms=${metric.a1Ms}`);
    if (metric.a2Ms !== undefined) parts.push(`a2Ms=${metric.a2Ms}`);
    if (metric.a1Model) parts.push(`a1Model=${metric.a1Model}`);
    if (metric.a2Model) parts.push(`a2Model=${metric.a2Model}`);
    if (metric.connReused !== undefined) parts.push(`connReused=${metric.connReused}`);

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

    const { message, language = 'en', history } = validated.data;
    const hasHistory = Boolean(history && history.length > 0);
    const answerCacheStatus: 'hit' | 'miss' | 'bypass' = hasHistory ? 'bypass' : 'miss';

    // ── Layer 5B: Validated In-Memory Answer Cache (0-history questions, Item 25) ──
    if (!hasHistory) {
      const cached = answerCache.get(language, message);
      if (cached) {
        const totalMs = Date.now() - startTotal;
        logStageMetric({
          totalMs,
          dbMs: 0,
          aiMs: 0,
          cacheHit: true,
          source: 'cache',
          hedged: false,
          winner: 'cache',
          attempts: 0,
          softDeadlineHit: false,
          promptTokens: 0,
          outputTokens: 0,
          thoughtsTokens: 0,
          answerCache: 'hit',
          status: cached.status,
        });
        return json(cached, 200, { 'X-Answer-Cache': 'hit' });
      }
    }

    // ── Layer 5.5: Tier 0 Fast Path — Greeting & Thanks (Item 15 / CR-014) ─────
    const greetingMatch = matchGreetingOrThanks(message, language);
    if (greetingMatch.matched) {
      const totalMs = Date.now() - startTotal;
      logStageMetric({
        totalMs,
        dbMs: 0,
        aiMs: 0,
        cacheHit: true,
        source: 'local',
        hedged: false,
        winner: 'local',
        attempts: 0,
        softDeadlineHit: false,
        promptTokens: 0,
        outputTokens: 0,
        thoughtsTokens: 0,
        answerCache: 'bypass',
        status: 'greeting',
      });
      return json({ status: 'greeting', answer: greetingMatch.answer, reply: greetingMatch.answer }, 200);
    }

    // ── Layer 6: Scope / injection guard ───────────────────────────────────────
    const guardResult = checkGuard(message, history);
    if (guardResult.blocked) {
      if (process.env.NODE_ENV !== 'test') {
        console.log(guardResult.logCode ?? 'chat.guard');
      }
      const totalMs = Date.now() - startTotal;
      logStageMetric({
        totalMs,
        dbMs: 0,
        aiMs: 0,
        cacheHit: false,
        source: 'cache',
        hedged: false,
        winner: 'primary',
        attempts: 0,
        softDeadlineHit: false,
        promptTokens: 0,
        outputTokens: 0,
        thoughtsTokens: 0,
        answerCache: answerCacheStatus,
        status: 'out_of_scope',
      });
      return json({ status: 'out_of_scope', answer: getFixedCopy('out_of_scope', language) }, 200);
    }

    // ── Layer 7: SWR Knowledge Cache Retrieval (ADR-015) ─────────────────────
    let loaded: Awaited<ReturnType<typeof loadKnowledge>>;
    try {
      loaded = await loadKnowledge(prisma);
    } catch (err: unknown) {
      const totalMs = Date.now() - startTotal;
      if (process.env.NODE_ENV !== 'test') {
        console.error('chat.db_error');
      }
      logStageMetric({
        totalMs,
        dbMs: 0,
        aiMs: 0,
        cacheHit: false,
        source: 'db',
        hedged: false,
        winner: 'primary',
        attempts: 0,
        softDeadlineHit: false,
        promptTokens: 0,
        outputTokens: 0,
        thoughtsTokens: 0,
        answerCache: answerCacheStatus,
        status: 'unavailable',
        stage: 'db',
        errorClass: err instanceof Error ? err.constructor.name : typeof err,
      });
      return json({ status: 'unavailable', answer: getFixedCopy('unavailable', language) }, 503);
    }

    // Short-circuit with no_data (0 Gemini calls) when 0 records match
    if (loaded.records.length === 0) {
      const totalMs = Date.now() - startTotal;
      const resp: ChatResponse = { status: 'no_data', answer: getFixedCopy('no_data', language) };
      if (!hasHistory) {
        answerCache.set(language, message, resp);
      }
      logStageMetric({
        totalMs,
        dbMs: loaded.dbMs,
        aiMs: 0,
        cacheHit: loaded.cacheHit,
        source: loaded.source,
        hedged: false,
        winner: 'primary',
        attempts: 0,
        softDeadlineHit: false,
        promptTokens: 0,
        outputTokens: 0,
        thoughtsTokens: 0,
        answerCache: answerCacheStatus,
        status: 'no_data',
      });
      return json(resp, 200);
    }

    // ── Layer 7.5: Tier 0 Starter-Chip Matcher (Item 16 / CR-014) ───────────────
    if (!hasHistory) {
      const chipMatch = matchStarterChip(message, language, loaded.records);
      if (chipMatch.matched) {
        const totalMs = Date.now() - startTotal;
        logStageMetric({
          totalMs,
          dbMs: loaded.dbMs,
          aiMs: 0,
          cacheHit: loaded.cacheHit,
          source: 'local',
          hedged: false,
          winner: 'local',
          attempts: 0,
          softDeadlineHit: false,
          promptTokens: 0,
          outputTokens: 0,
          thoughtsTokens: 0,
          answerCache: 'bypass',
          status: 'ok',
        });
        const resp: ChatResponse = {
          status: 'ok',
          answer: chipMatch.answer,
          reply: chipMatch.answer,
          sources: chipMatch.sources,
        };
        answerCache.set(language, message, resp);
        return json(resp, 200);
      }
    }

    // ── Layer 8: Grounded generation via Gemini (Hedged Request, ADR-014) ─────
    const geminiResult = await generateGroundedAnswer(
      loaded.contextString,
      message,
      undefined,
      language,
      history,
      loaded.validIds,
    );
    const totalMs = Date.now() - startTotal;

    if (!geminiResult.success) {
      if (process.env.NODE_ENV !== 'test') {
        if (geminiResult.logCode === 'chat.gemini_key') {
          console.error('chat.config_key');
        } else if (geminiResult.logCode === 'chat.gemini_not_found') {
          console.error('chat.config_model');
        } else if (geminiResult.logCode === 'chat.gemini_denied') {
          console.error('chat.config_denied');
        } else if (geminiResult.logCode === 'chat.no_key') {
          console.error('chat.no_key');
        } else {
          console.error(geminiResult.logCode);
        }
      }

      // Tier 3: Deterministic Local Composer (Item 18, 20 / Invariants I-1, I-2)
      // Any Gemini failure produces HTTP 200 degraded with composed answer and fixed caption
      const composed = composeLocalAnswer(message, language, loaded.records);
      const totalMs = Date.now() - startTotal;

      logStageMetric({
        totalMs,
        dbMs: loaded.dbMs,
        aiMs: geminiResult.aiMs ?? 0,
        cacheHit: loaded.cacheHit,
        source: 'local',
        hedged: geminiResult.hedged,
        winner: 'local',
        attempts: geminiResult.attempts,
        softDeadlineHit: geminiResult.softDeadlineHit,
        answerCache: answerCacheStatus,
        status: composed.status,
        stage: 'ai_fallback_degraded',
        model: geminiResult.modelUsed,
        retries: geminiResult.retryCount,
        errorClass: geminiResult.errorClass,
        httpStatus: geminiResult.httpStatus,
        causeCode: geminiResult.networkCauseCode,
        providerStatus: geminiResult.providerStatus,
        abortOrigin: geminiResult.abortOrigin,
        a1Ms: geminiResult.a1Ms,
        a2Ms: geminiResult.a2Ms,
        a1Model: geminiResult.a1Model,
        a2Model: geminiResult.a2Model,
        connReused: geminiResult.connReused,
      });

      if (composed.status === 'no_data') {
        return json({ status: 'no_data', answer: composed.answer }, 200);
      }

      return json(
        {
          status: 'degraded',
          answer: composed.answer,
          reply: composed.answer,
          caption: composed.caption,
          sources: composed.sources,
        },
        200,
      );
    }

    logStageMetric({
      totalMs,
      dbMs: loaded.dbMs,
      aiMs: geminiResult.aiMs ?? 0,
      cacheHit: loaded.cacheHit,
      source: loaded.source,
      hedged: geminiResult.hedged,
      winner: geminiResult.winner,
      attempts: geminiResult.attempts,
      softDeadlineHit: geminiResult.softDeadlineHit,
      promptTokens: geminiResult.promptTokens,
      outputTokens: geminiResult.outputTokens,
      thoughtsTokens: geminiResult.thoughtsTokens,
      answerCache: answerCacheStatus,
      status: geminiResult.kind === 'no_data' ? 'no_data' : 'answered',
      model: geminiResult.modelUsed,
      retries: geminiResult.retryCount,
      providerStatus: geminiResult.providerStatus,
      abortOrigin: geminiResult.abortOrigin,
      a1Ms: geminiResult.a1Ms,
      a2Ms: geminiResult.a2Ms,
      a1Model: geminiResult.a1Model,
      a2Model: geminiResult.a2Model,
      connReused: geminiResult.connReused,
    });

    if (geminiResult.kind === 'no_data') {
      const resp: ChatResponse = { status: 'no_data', answer: getFixedCopy('no_data', language) };
      if (!hasHistory) {
        answerCache.set(language, message, resp);
      }
      return json(resp, 200);
    }

    // Map citations to sources
    let sources: Array<{ slug: string; title: string; category: string }> = [];
    if (geminiResult.citations && geminiResult.citations.length > 0) {
      const recordMap = new Map(loaded.records.map((r) => [r.id, r]));
      sources = geminiResult.citations
        .map((id) => recordMap.get(id))
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({
          slug: r.id,
          title: r.title,
          category: r.category,
        }));
    } else if (loaded.records.length > 0 && geminiResult.answer) {
      sources = loaded.records.map((r) => ({
        slug: r.id,
        title: r.title,
        category: r.category,
      }));
    }

    const responsePayload: ChatResponse = {
      status: 'answered',
      answer: geminiResult.answer,
      reply: geminiResult.answer,
      sources,
    };

    if (!hasHistory) {
      answerCache.set(language, message, responsePayload);
    }

    return json(responsePayload, 200);
  } catch (err) {
    const totalMs = Date.now() - startTotal;
    if (process.env.NODE_ENV !== 'test') {
      console.error('chat.unexpected', err instanceof Error ? err.message : 'unknown error');
    }
    logStageMetric({
      totalMs,
      dbMs: 0,
      aiMs: 0,
      cacheHit: false,
      source: 'cache',
      hedged: false,
      winner: 'primary',
      attempts: 0,
      softDeadlineHit: false,
      status: 'error',
      stage: 'unexpected',
      errorClass: err instanceof Error ? err.constructor.name : typeof err,
    });
    return json({ status: 'error', answer: COPY.error }, 500);
  }
}

// ── GET method (panel-open warm-up returning 204 No Content, R-037) ───────────

export async function GET(req?: NextRequest): Promise<NextResponse> {
  const clientKey = req ? getClientKey(req.headers) : 'unknown';
  const rateResult = checkRateLimit(clientKey);
  if (!rateResult.allowed) {
    const retryAfterSeconds = rateResult.retryAfterSeconds ?? 60;
    return json(
      { status: 'rate_limited', answer: COPY.rate_limited, retryAfterSeconds },
      429,
      { 'Retry-After': String(retryAfterSeconds) },
    );
  }

  const warmResult = await warmKnowledgeCache(prisma);

  if (req) {
    const url = new URL(req.url);
    if (url.searchParams.get('action') === 'warmup') {
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
          Allow: 'GET, POST',
        },
      );
    }
  }

  // Item 24 & AC-6: Default GET /api/chat returns 204 No Content
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Allow', 'GET, POST');
  res.headers.set('X-Warmup', warmResult.warmed ? 'hit' : 'miss');
  res.headers.set('X-Cache-DB-Ms', String(warmResult.dbMs));
  return res;
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
  res.headers.set('Allow', 'GET, POST');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

