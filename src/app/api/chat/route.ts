/**
 * POST /api/chat — Portfolio assistant Route Handler.
 *
 * 7-layer defense-in-depth pipeline (ARCHITECTURE.md §8):
 *   1. Method guard (POST only → 405)
 *   2. Content-type check (application/json only → 415)
 *   3. Body size limit (→ 413)
 *   4. Rate limit (sliding window per IP → 429)
 *   5. JSON parse + strict Zod validation (→ 400)
 *   6. Deterministic scope / injection guard (→ 200 out_of_scope, 0 DB/Gemini)
 *   7. Knowledge retrieval → Gemini grounded generation (→ 200 ok | 503)
 *      (Retrieval and Gemini are stubbed as unavailable in TASK-019;
 *       implemented in TASK-020 and TASK-021 respectively.)
 *
 * Cache-Control: no-store is set on every response (chat is dynamic).
 * Visitor-safe errors only — no stack traces, SQL, paths or secrets (R-029).
 */

import { type NextRequest, NextResponse } from 'next/server';
import {
  ChatRequestSchema,
  COPY,
  MAX_BODY_BYTES,
  type ChatResponse,
} from '@/lib/chat-contract';
import { checkRateLimit, getClientKey } from '@/lib/server/rate-limit';
import { checkGuard } from '@/lib/server/guard';

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

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
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

    const { message } = validated.data;

    // ── Layer 6: Scope / injection guard ───────────────────────────────────────
    const guardResult = checkGuard(message);
    if (guardResult.blocked) {
      // Operational log code only — no message content (ARCHITECTURE.md §9)
      if (process.env.NODE_ENV !== 'test') {
        console.log(guardResult.logCode ?? 'chat.guard');
      }
      return json({ status: 'out_of_scope', answer: COPY.out_of_scope }, 200);
    }

    // ── Layer 7: Retrieval + Gemini (stubbed in TASK-019) ─────────────────────
    // TASK-020 will replace this with real retrieval.
    // TASK-021 will replace the unavailable return with a Gemini call.
    return json({ status: 'unavailable', answer: COPY.unavailable }, 503);
  } catch (err) {
    // Catch-all: log code only, never expose internals (R-029).
    if (process.env.NODE_ENV !== 'test') {
      console.error('chat.unexpected', err instanceof Error ? err.message : 'unknown error');
    }
    return json({ status: 'error', answer: COPY.error }, 500);
  }
}

// ── Non-POST method guard ──────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
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
