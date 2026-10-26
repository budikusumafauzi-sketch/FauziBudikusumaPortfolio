# TASK-039: Chatbot Tail-Latency (~2s) and 30-min Idle-Failure Elimination (CR-011)

**Status:** TODO  
**Hat:** Backend + Database  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Eliminate chatbot idle failures after 30+ minutes and reduce tail latency to ~2s (median <= 2.0s, p95 <= 4.0s, repeated chips <= 150ms). Replace sequential Gemini retry with a parallel Hedged Request (`ADR-014`) using a distinct fallback model family starting at soft deadline (2.8s) or early transient error. Remove the database from the critical request path using a 12-hour Stale-While-Revalidate (SWR) cache and a 600ms database-vs-snapshot race against `knowledge.snapshot.json` (`ADR-015`). Provide a panel-open warm-up endpoint (`GET /api/chat` -> 204 No Content, R-037). Add an in-memory Answer Cache for 0-history questions (TTL 30m). Add slow-request UI notice (at 4s). Suppress raw Prisma `Closed` error dumps with clean operational logging.

## Allowed Files
- `src/app/api/chat/route.ts`
- `src/lib/chat-contract.ts`
- `src/lib/server/gemini.ts`
- `src/lib/server/knowledge.ts`
- `src/lib/server/db.ts`
- `src/lib/server/answer-cache.ts`
- `src/components/chat/chat-widget.tsx`
- `scripts/generate-knowledge-snapshot.mjs`
- `src/lib/server/knowledge.snapshot.json`
- `package.json`
- `.env`
- `.env.example`
- `tests/chat-hedged.test.ts`
- `tests/chat-cache-retry.test.ts`
- `tests/gemini.test.ts`
- `PRD.md`
- `ARCHITECTURE.md`
- `SCHEMA.md`
- `DESIGN.md`
- `TODO.md`
- `tasks/TASK-039-idle-failure-hedged-requests-snapshot.md`

## Acceptance Criteria
- AC-1: Telemetry log line `[CHAT:METRIC]` includes source (`cache|db|snapshot`), hedged, winner, attempts, softDeadlineHit, promptTokens, outputTokens, thoughtsTokens, answerCache, dbMs, aiMs, totalMs. No visitor message text or secrets logged.
- AC-2: Raw `prisma:error Error in PostgreSQL connection: Error { kind: Closed }` lines are suppressed; connection recovery is logged cleanly under `chat.db_closed_connection_recovered`.
- AC-3: Hedged request (`ADR-014`, `R-034`) starts Attempt 2 on `GEMINI_FALLBACK_MODEL` if Attempt 1 on `GEMINI_MODEL` exceeds soft deadline (2.8s) or hits early transient failure. Winner aborts loser. Zero hedge on 4xx/429. Max 2 attempts total; hard total deadline 8.0s.
- AC-4: SWR in-memory knowledge cache TTL is 12 hours with background asynchronous refresh.
- AC-5: `scripts/generate-knowledge-snapshot.mjs` runs at prebuild/build and produces `src/lib/server/knowledge.snapshot.json`. On cold start, DB load races 600ms timer; if DB takes > 600ms or fails, snapshot is served immediately (`source=snapshot`) without stalling AI call.
- AC-6: `GET /api/chat` returns `204 No Content` and warms cache/connection with 0 AI calls and 0 API keys. Chat widget fires GET on panel open.
- AC-7: In-memory Answer Cache (TTL 30m, max 200 entries) serves repeated 0-history questions in < 150ms.
- AC-8: Chat widget displays subtle bilingual helper line if request is in flight > 4s.
- AC-9: Live soak & idle verification achieves 0 `unavailable` errors, 0 raw Prisma dumps, median latency <= 2.2s, p95 <= 4.0s.
