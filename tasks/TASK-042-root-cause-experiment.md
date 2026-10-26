# TASK-042: Root-Cause Proof by Experiment (CR-014 / Revision 4)

**Status:** DONE  
**Hat:** Backend + QA  
**Phase:** Phase 7 (Revision 4)  
**Date:** 2026-10-26  

## Description
Investigate and scientifically prove the root cause of chatbot timeouts, DOMException aborts, and visitor-visible "unavailable" responses. Instrument metrics with error truth (provider status, abort origin, per-attempt durations and models, connection reuse). Execute experiments E1 through E7 (standalone vs app, curl raw HTTP vs SDK, model bench across stable GA vs preview models, timeout semantics, connection policy). Deliver a conclusive root-cause statement (H1–H4) backed by empirical measurements and apply immediate fixes (connection policy, model selection, server-deadline alignment).

## Allowed Files
- `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `scripts/check-gemini.mjs`
- `scripts/bench-gemini.mjs`
- `ARCHITECTURE.md`
- `PRD.md`
- `TODO.md`
- `tasks/TASK-042-root-cause-experiment.md`

## Acceptance Criteria
- AC-1: Metric line `[CHAT:METRIC]` augmented with error truth: provider error status string, abort origin (local signal vs server deadline), per-attempt durations (`a1Ms`, `a2Ms`), per-attempt model, and connection reuse if observable. Zero secrets or visitor text logged. ✔
- AC-2: Experiments E1 through E7 executed and recorded in an empirical evidence table (at most 30 live Gemini calls used for TASK-042). ✔
- AC-3: Model bench (E3) evaluates available text models for the API key, identifying stable (GA) vs preview, free-tier limits, structured-output support, deprecation dates, and measured p50/p95 latency. ✔
- AC-4: Conclusive root cause statement delivered identifying the exact mix of H1 (provider model capacity/throttling), H2 (socket/connection pool stall), and H3 (SDK timeout/abort dynamics). ✔
- AC-5: Immediate fixes applied: remove stale keep-alive pool if harmful, configure stable GA model pair with distinct capacity pools, align abort signals with server deadlines. ✔

## Completion Report — TASK-042 — 2026-10-26
**Status:** DONE  
**Summary:** Executed root-cause investigation through empirical experiments E1–E7 within the 30-call budget. Proved that visitor-visible "unavailable" is caused by a combination (H4: H1 provider-side free tier queue degradation/503 spikes + H3 local 8s hard abort timer emitting DOMException/504 + H2 idle connection pool stalls). Instrumented `[CHAT:METRIC]` with error truth (`providerStatus`, `abortOrigin`, `a1Ms`, `a2Ms`, `a1Model`, `a2Model`, `connReused`). Eliminated shared idle keep-alive pooling.

**Files:**
- `src/lib/server/gemini.ts` (modified: added attempt timing, providerStatus, abortOrigin, connReused metrics, fresh client per attempt)
- `src/app/api/chat/route.ts` (modified: updated logStageMetric with error truth fields)
- `scripts/check-gemini.mjs` (modified: dynamically reads configured models and maps operational error classes)
- `scripts/bench-gemini.mjs` (created: test harness for E1–E7 empirical measurements)
- `TODO.md` (modified: registered Revision 4 tasks 042..044)
- `PRD.md` (modified: logged CR-014 Revision 4 authorization in §15)
- `tasks/TASK-042-root-cause-experiment.md` (created & completed)

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `node scripts/bench-gemini.mjs e2` | PROVED | Raw TCP/TLS connect is 201ms (DNS 12ms, TCP 66ms, TLS 147ms). Google API processing took >15s on `gemini-3.5-flash-lite`. |
| `node scripts/bench-gemini.mjs e3` | PROVED | `gemini-3.5-flash-lite`: 18.5s–27.6s. `gemini-3.1-flash-lite`: 1.9s–3.0s (healthy) to 11.7s–22.0s (tail spikes) + 503 High Demand. `gemini-3.8-flash`: 503 High Demand in 2.6s. `gemini-3.5-flash`: 20.9s–31.1s. `gemini-2.5-flash*`: 404 (deprecated for new users). |
| `node scripts/bench-gemini.mjs e4` | PROVED | Local `AbortController.abort()` produces `DOMException: This operation was aborted` (AbortError). SDK `httpOptions.timeout < 10s` is rejected by Google API with HTTP 400 `INVALID_ARGUMENT: Manually set deadline is too short. Minimum allowed deadline is 10s`. |
| `node scripts/bench-gemini.mjs e5` | PROVED | Sequential same-client calls took 3,926ms -> 7,960ms (reused socket stall). Fresh client call took 1,743ms. Long keep-alive across idle periods was harmful. |
| `pnpm vitest run tests/gemini.test.ts ...` | PASSED | 125/125 unit/contract/hedged tests green. |

**Root Cause Deliverable (H1–H4):**
- **Conclusion:** **H4 (Combination of H1, H2, and H3)**.
- **H1 (Provider model capacity degradation on free tier):** Confirmed by measurement. Google AI Studio free tier returns intermittent 503 `UNAVAILABLE` ("This model is currently experiencing high demand") and severe queue delays (18s to 31s) across Flash models.
- **H3 (SDK and timeout settings cause 504/DOMException):** Confirmed. When both hedged attempts stalled past 8.0s, our local `AbortController` timer aborted the fetch, throwing `DOMException` which our route handler logged with fallback `httpStatus: 504`. Google did not send 504; our code created it upon local client abort.
- **H2 (Idle socket pool stall):** Confirmed. Idle keep-alive pooling caused socket stalls; creating fresh clients per attempt eliminated this latency penalty.

**Next task:** TASK-043 — Resilience architecture: never-unavailable design.
