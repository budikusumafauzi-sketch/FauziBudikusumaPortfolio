# TASK-021 — Gemini integration and failure handling

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 5 — Chatbot backend |
| **Hat** | Backend |
| **Priority** | P0 |
| **Depends on** | TASK-020 |
| **Owner input needed** | `GEMINI_API_KEY` from an unbilled free-tier project in the local `.env` (OD-05); model name decision |
| **Skills** | `grounded-chatbot` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Call Gemini server-side with the prompt contract, hard limits, output validation, and controlled responses for every failure mode.

## 2. Source requirements
`ARCHITECTURE.md` §8.3, §9, §10, §11 · `PRD.md` CB-05…CB-10 · `RULES.md` R-020, R-022, R-031…R-035, R-039, R-050

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §8.3, §10, §11
- `RULES.md` §3, §4, §6
- Current official Gemini API docs: SDK package, model names, free-tier quotas and data-use terms (OD-05)

## 4. Preconditions
- TASK-020 done. The owner placed `GEMINI_API_KEY` in the local `.env` (the agent never asks for it in chat). Billing is not enabled on that project.

## 5. In scope
- Verify OD-05 from official docs; record package, model, quota and data terms with date in `ARCHITECTURE.md` §11. If free-tier use is not allowed for this purpose → stop event with a free alternative.
- `src/lib/env.ts`: Zod env validation **lazily at request time** (`server-only`).
- `src/lib/server/gemini.ts`: official SDK, model from `GEMINI_MODEL`, constant system instruction, FACTS then QUESTION layout, low temperature, output cap, abort-signal timeout, **no tools**, **no retries**.
- Output validation (non-empty, finish reason, length cap, control characters stripped) and error classification (missing key, quota/429, timeout, 5xx/network, bad output) → `unavailable`/fallback responses; operational log codes only.
- Plain-text answers; never HTML.
- Tests with a mocked SDK for every failure class; optional ≤ 10 live smoke questions (sanitized notes).

## 6. Out of scope — do NOT do
- Tools/function calling/grounding/search, streaming UI, retries, caching services, any paid feature.

## 7. Files
**Allowed to create / modify**
- `src/lib/env.ts`, `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `tests/gemini.test.ts`
- `package.json` (+ official Gemini SDK)
- `.env.example` (names only)
- `ARCHITECTURE.md` §7, §11 (records)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Read the current SDK docs; configure only the options listed above.
2. Implement the call and the failure mapping; keep the prompt in one constant.
3. Test every row of `ARCHITECTURE.md` §10 that involves Gemini; assert the SDK is not called on `no_data`/`out_of_scope`.
4. Run the optional live smoke after tests pass; stop at 10 calls.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** A grounded question returns `ok` with plain text based only on retrieved facts (live smoke note).
- **AC-2** Missing key, quota, timeout, 5xx, empty/blocked output each produce the specified controlled response (tests).
- **AC-3** No tools are configured; no retry exists (code + test).
- **AC-4** `no_data` and `out_of_scope` never call Gemini (spy assertions).
- **AC-5** No secret appears in responses, logs or test output.
- **AC-6** Timeout/token/length limits recorded in `ARCHITECTURE.md` §7; eligibility recorded in §11.

## 10. Verification
- V-CHAT
- V-STATIC
- V-SEC
- V-SCOPE

## 11. Blocked / stop conditions
- Key missing → owner-only input (BLOCKED; tests still run with mocks).
- Quota/eligibility problem or billing prompt → stop event; never enable billing.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-021: <summary>`.)*
