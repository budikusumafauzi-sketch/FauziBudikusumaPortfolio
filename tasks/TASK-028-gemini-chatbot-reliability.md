# TASK-028 — Gemini Chatbot Reliability, Timeout Elimination & Production Stabilization (CR-004)

| Field | Value |
|---|---|
| **Status** | `TODO` |
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
*(Appended upon completion)*
