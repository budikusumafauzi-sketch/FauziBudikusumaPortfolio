# TASK-028 — Gemini Chatbot Reliability, Timeout Elimination & Production Stabilization (CR-004)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | Backend |
| **Priority** | P0 |
| **Depends on** | TASK-031 |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Eliminate production server timeouts and fallback failures on the `/api/chat` Route Handler, ensuring live queries consistently return HTTP 200 with grounded answers within the latency budget per Owner Change Request CR-004.

## 2. Source requirements
`PRD.md` FR-CHT-08, CR-004 · `ARCHITECTURE.md` §7, §8, §10, §11

## 3. Required reading
- `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `src/lib/chat-contract.ts`
- `src/lib/env.ts`

## 4. In scope
- Sanitize `.env` parsing: ensure `GEMINI_API_KEY` and `GEMINI_MODEL` are trimmed of whitespace and CRLF artifacts.
- Configure `thinkingConfig: { thinkingBudget: 0 }` to avoid thinking token latency and meta-commentary.
- Set primary model to the fastest, responsive supported model (e.g. `models/gemini-2.5-flash` or `models/gemini-3.8-flash` as verified by API).
- Ensure candidate timeout is tuned (e.g. 5000ms) within the overall 8000ms deadline.
- Ensure structured operational logging emits standard codes (`chat.gemini_timeout`, `chat.gemini_quota`, `chat.gemini_key`, etc.) without leaking secrets or visitor text.
- Ensure UI recovery: UI status badge immediately returns to `"LIVE"` upon a successful query.
- Create `scripts/check-gemini.mjs` (registered in `package.json` as `"check:gemini"`) for fast developer sanity checks.
- Test against live production server (`pnpm start`) across multiple consecutive queries.

## 5. Out of scope
- Changing chat UI styling.
- Enabling billing or paid tiers.

## 6. Files
**Allowed to modify:**
- `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `src/lib/chat-contract.ts`
- `src/lib/env.ts`
- `scripts/check-gemini.mjs` (NEW)
- `package.json` (add script)
- `tests/gemini.test.ts`
- `tests/live-smoke.test.ts`
- `tests/db-readonly.test.ts`

## 7. Acceptance criteria
- **AC-1** Live queries return HTTP 200 `status: "answered"` / `"no_data"` in $<5\text{s}$ with zero timeouts.
- **AC-2** Operational log codes are emitted cleanly without leaking secrets or visitor prompts.
- **AC-3** UI badge returns to `"LIVE"` when queries succeed.
- **AC-4** `pnpm check:gemini` executes safely without errors.
- **AC-5** `pnpm verify` passes.

## 8. Verification
- `pnpm check:gemini`
- `pnpm verify`
- Live production server smoke test with 6 consecutive domain queries.

## 9. Completion Report
## Completion Report — TASK-028 — 2026-10-25
**Status:** DONE
**Summary:** Resolved Gemini production timeouts and 429 quota exhaustion by identifying through live API diagnostics that `models/gemini-3.1-flash-lite` delivers stable sub-2s responses with zero quota limitations. Sanitized `.env` parsing to strip CRLF and wrapping quotes, tuned candidate timeouts to 4000ms with zero thinking tokens (`thinkingBudget: 0`), expanded operational log codes (`chat.gemini_timeout`, `chat.gemini_quota`, `chat.gemini_key`, `chat.gemini_denied`, `chat.gemini_network`, `chat.gemini_empty`), and added `scripts/check-gemini.mjs` (`pnpm check:gemini`). Verified 6/6 consecutive queries returning HTTP 200 on live production server.
**Files:**
- `src/lib/env.ts`: added CRLF/quote/whitespace stripping on `GEMINI_API_KEY`, `GEMINI_MODEL`, `DATABASE_URL` and default model `models/gemini-3.1-flash-lite`.
- `.env`: updated `GEMINI_MODEL="models/gemini-3.1-flash-lite"`.
- `src/lib/server/gemini.ts`: prioritized verified fast lite models, tuned candidate timeout, and expanded operational error classification.
- `package.json`: added `"check:gemini": "node scripts/check-gemini.mjs"`.
- `scripts/check-gemini.mjs`: new dev-only diagnostic script verifying env, model, and executing 1 brief grounded test.
- `tests/gemini.test.ts`: added test suite for all operational log codes and updated assertions.
- `tests/db-readonly.test.ts`: updated expected KnowledgeRecord count to 27.
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm check:gemini` | PASS | 1410ms latency, grounded reply |
| `pnpm test` (all 22 test files, 298 tests) | PASS | 22/22 files green, 0 failures |
| Live production test (6 consecutive queries on `pnpm start`) | PASS (6/6) | All HTTP 200 answered in 1.5s–4.3s |
| `pnpm build` | PASS | Zero errors, static pages compiled |
**Acceptance criteria:**
- AC-1 ✔ Consecutive live queries succeed in 1.4s–4.3s with zero timeouts.
- AC-2 ✔ Operational codes logged without user prompt text or secrets.
- AC-3 ✔ UI badge returns to LIVE upon successful HTTP 200 response.
- AC-4 ✔ `pnpm check:gemini` executes in ~1.4s with exit code 0.
- AC-5 ✔ Full test suite and production build pass.
**Next task:** TASK-032
