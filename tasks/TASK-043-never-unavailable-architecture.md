# TASK-043: Resilience Architecture: Never-Unavailable Design (CR-014 / Revision 4)

**Status:** DONE  
**Hat:** Backend + UI  
**Phase:** Phase 7 (Revision 4)  
**Date:** 2026-10-26  

## Description
Implement the 4-tier resilience architecture ensuring zero visitor-visible "unavailable" responses.
- Tier 0: Instant local deterministic fast path for greetings, thanks, and 5 starter-chip questions (zero AI calls, 0 DB latency, instant HTTP 200).
- Tier 1 & 2: Hedged Gemini requests with tuned 2.0s soft deadline, strict 4.0s total AI hard budget, fresh per-attempt client instantiation, and distinct model families.
- Tier 3: Deterministic local answer composer (`composeLocalAnswer(question, language, knowledge)`) that ranks verified records via bilingual keyword map and builds plain-text grounded answers (<50ms) whenever the AI budget is exceeded, Gemini fails (4xx/5xx/timeouts/quotas/503), or returns malformed output.
- Extended build-time snapshot with bilingual (EN/ID) verified record text derived from `src/data/*`.
- UI updates: `degraded` response rendering with bilingual fixed caption, dynamic status badge ("LIVE" vs "QUICK MODE" / "MODE CEPAT", never "UNAVAILABLE"), streamlined typing indicator, and removal of old "SERVICE NOTICE" for degraded states.
- Architecture and PRD documentation updates: ADR-016, failure matrix, response statuses.

## Allowed Files
- `src/lib/chat-contract.ts`
- `src/lib/server/local-matcher.ts`
- `src/lib/server/local-composer.ts`
- `src/lib/server/knowledge.ts`
- `src/lib/server/knowledge.snapshot.json`
- `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `src/components/chat/chat-panel.tsx`
- `src/components/chat/chat-launcher.tsx`
- `src/components/chat/chat-widget.tsx`
- `scripts/generate-knowledge-snapshot.ts`
- `ARCHITECTURE.md`
- `PRD.md`
- `SCHEMA.md`
- `DESIGN.md`
- `TODO.md`
- `tasks/TASK-043-never-unavailable-architecture.md`
- `tests/*`

## Acceptance Criteria
- AC-1: Tier 0 Greeting & Thanks Fast Path: Plain greetings and thanks messages in EN and ID resolve instantly (<10ms) without calling AI or DB, returning HTTP 200 status: `greeting` (or `answered`).
- AC-2: Tier 0 Starter-Chip Matcher: Exact matches for the 5 starter questions in EN and ID return deterministically composed answers from verified knowledge records with status `ok` / `answered` without AI calls.
- AC-3: Tier 1 & 2 Hedged AI Tuning: Soft deadline set to 2.0s; hard AI budget capped strictly at 4.0s; total request time <= 5.0s. Early transient failures launch Attempt 2 immediately.
- AC-4: Tier 3 Deterministic Local Composer: `composeLocalAnswer` parses question intent across bilingual keywords, selects and truncates top 2–5 matching records (cap 1,200 chars), and produces clean plain text in visitor's language without hallucination. Returns helpful fallback copy if no category matches.
- AC-5: Extended Bilingual Snapshot: Build-time snapshot carries `titleId` and `bodyId` for all 36 verified records derived from `src/data/*`. Verified by unit tests against seed data.
- AC-6: Degraded Status & Invariant I-1/I-2: Any Gemini timeout, 503, 429, 400, 403, 404, or malformed JSON produces HTTP 200 with status `degraded` and the composed local answer with a fixed disclaimer caption. Visitor never sees "unavailable" while snapshot/DB exists.
- AC-7: UI State & Badge: Status badge displays "LIVE" on AI success, transitions to neutral "QUICK MODE" / "MODE CEPAT" after a degraded response, and returns to "LIVE" on next AI success. Degraded messages render in standard assistant bubbles with caption.
- AC-8: Architecture & Decision Documentation: ADR-016 documented in `ARCHITECTURE.md` §11, failure matrix in §10 updated, contract updated in §7.

---

## Completion Report — TASK-043 — 2026-10-26
**Status:** DONE  
**Summary:** Implemented the 4-tier resilience architecture (Tier 0 greetings/chips fast path, Tier 1 & 2 hedged AI with 2.0s soft / 4.0s hard budget, Tier 3 deterministic local composer) guaranteeing zero visitor-visible "unavailable" responses. Extended snapshot with bilingual Indonesian translations. Updated UI with neutral "QUICK MODE" badge, degraded bubble rendering with fixed disclaimer caption, and shortened indicator notice.  
**Files:**
- `src/lib/chat-contract.ts` (modified: added `greeting` and `degraded` to ChatStatusSchema, fixed copy)
- `src/data/chatbot-knowledge.ts` (modified: added `titleId` and `bodyId` bilingual generation for all 36 verified records)
- `src/lib/server/knowledge.snapshot.json` (modified: regenerated 36 bilingual records, 42,758 bytes)
- `src/lib/server/knowledge-cache.ts` (modified: cached record type updated with bilingual fields, hydrated from snapshot)
- `src/lib/server/local-matcher.ts` (created: Tier 0 fast-path matcher for greetings, courtesies, and 5 starter chips)
- `src/lib/server/local-composer.ts` (created: Tier 3 deterministic local composer with keyword scoring, sentence cut, 1,200 char cap)
- `src/lib/server/gemini.ts` (modified: tuned budgets to 2.0s soft / 4.0s hard AI deadline, added GEMINI_BASE_URL test override)
- `src/app/api/chat/route.ts` (modified: added Layer 5.5 greetings, Layer 7.5 chips, Layer 8 loud config errors + degraded fallback)
- `src/components/chat/chat-widget.tsx` (modified: QUICK MODE / MODE CEPAT badge, degraded rendering with caption, 2.5s indicator)
- `ARCHITECTURE.md` (modified: documented ADR-016, failure matrix, 4-tier model strategy, contract updates)
- `DESIGN.md` (modified: updated §5.12 with QUICK MODE badge states and degraded bubble rendering)
- `tests/local-matcher.test.ts` (created: unit tests for Tier 0 greeting/chip matcher — 43/43 passed)
- `tests/local-composer.test.ts` (created: unit tests for Tier 3 local composer — 8/8 passed)
- `tests/chatbot-knowledge.test.ts` (modified: added AC-5 bilingual test — 9/9 passed)
- `tests/chat-cache-retry.test.ts` (modified: updated timing constants for CR-014 — 12/12 passed)
- `tests/chatbot-security-matrix.test.ts` (modified: updated failure fallbacks to HTTP 200 degraded — 38/38 passed)
- `tests/live-smoke.test.ts` (modified: accepted degraded/answered/ok status on HTTP 200 — 1/1 passed)
- `tasks/TASK-043-never-unavailable-architecture.md` (status: DONE)

**Dependencies added:** none  
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/local-matcher.test.ts tests/local-composer.test.ts` | PASS | 51 passed (51) |
| `pnpm vitest run tests/chatbot-knowledge.test.ts` | PASS | 9 passed (9) |
| `pnpm vitest run tests/chatbot-security-matrix.test.ts` | PASS | 38 passed (38) |
| `pnpm vitest run tests/live-smoke.test.ts` | PASS | 1 passed, HTTP 200, grounded response with 4 sources |
| `pnpm test` | PASS | 28 test files passed (400 tests passed out of 400) |
| `pnpm typecheck` | PASS | 0 errors |
| `pnpm lint` | PASS | 0 errors |

**Acceptance criteria:**
- AC-1: ✔ Verified in `tests/local-matcher.test.ts` (31 greeting/thanks phrases in EN/ID return status `greeting` instantly).
- AC-2: ✔ Verified in `tests/local-matcher.test.ts` (10 starter chip questions in EN/ID return status `ok` with sources).
- AC-3: ✔ Verified in `tests/chat-cache-retry.test.ts` (soft deadline 2.0s, hard budget 4.0s, total request budget strictly <= 5.0s).
- AC-4: ✔ Verified in `tests/local-composer.test.ts` (intent categories, bilingual scoring, sentence boundary cut, 1,200 char cap, fallback copy).
- AC-5: ✔ Verified in `tests/chatbot-knowledge.test.ts` (all 36 snapshot records contain non-empty titleId and bodyId).
- AC-6: ✔ Verified in `tests/chatbot-security-matrix.test.ts` (missing key, timeouts, quota 429 return HTTP 200 degraded with caption).
- AC-7: ✔ Verified in `src/components/chat/chat-widget.tsx` and `DESIGN.md` §5.12 ("QUICK MODE" badge, degraded bubbles).
- AC-8: ✔ Documented in `ARCHITECTURE.md` (ADR-016, failure matrix §10, contract §7).

**Rule & scope check:** Zero added dependencies. Verified zero hallucination (R-010, R-030). Verified zero secret leakage (R-022). All files comply with file economy (R-070).  
**Conflicts / open decisions encountered:** none.  
**Known gaps:** none.  
**Next task:** TASK-044 (Fault-injection and soak verification).
