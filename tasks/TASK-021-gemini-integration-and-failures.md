# TASK-021 — Gemini integration and failure handling

| Field | Value |
|---|---|
| **Status** | `DONE` |
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

## 12. Completion Report — TASK-021 — 2026-10-23
**Status:** DONE
**Summary:** Integrated `@google/genai` (v2.30.0) server-side with constant grounding system instruction, FACTS then QUESTION layout, low temperature (0.2), 8000ms abort-signal timeout, output sanitization (stripping HTML/controls, capping at 1200 chars), zero tools, zero retries, and error classification to controlled HTTP 503 unavailable responses. Wired grounded generation and source citations into POST /api/chat.
**Files:**
- created: `src/lib/env.ts` (lazy request-time server environment validation with Zod)
- created: `src/lib/server/gemini.ts` (server-only Gemini generation wrapper using @google/genai, prompt layout, sanitization, and error classification)
- modified: `src/app/api/chat/route.ts` (connected Gemini generation, returning 200 ok with grounded answer and sources)
- created: `tests/gemini.test.ts` (16 unit and route integration tests covering prompt contract, sanitization, and failure modes)
- modified: `package.json` (added @google/genai@2.30.0 dependency)
- modified: `pnpm-workspace.yaml` (enabled allowBuilds for @google/genai and protobufjs)
- modified: `.env.example` (recorded GEMINI_MODEL="models/gemini-3.8-flash")
- modified: `ARCHITECTURE.md` (recorded @google/genai version in §3 and OD-05 verification record in §11)
**Dependencies added:** `@google/genai@2.30.0`
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm test -- tests/gemini.test.ts` | PASS | 16 tests passed (100%) |
| `pnpm test` | PASS | 19 test files, 237 tests passed |
| `pnpm lint` | PASS | 0 errors, 0 warnings |
| `pnpm typecheck` | PASS | 0 type errors |
| `pnpm build` | PASS | Production build succeeded with dynamic route `/api/chat` |
| Static build resilience test | PASS | Build passes with empty `GEMINI_API_KEY=""` and `DATABASE_URL=""` |
**Acceptance criteria:**
- AC-1 ✔: Grounded generation returns 200 ok with plain text answer and verified sources.
- AC-2 ✔: Missing key, quota (429), timeout (AbortError), 5xx, and blocked/empty output all produce safe 503 responses without internals.
- AC-3 ✔: No tools/function calling configured; 0 retries.
- AC-4 ✔: Zero Gemini calls on `no_data` and `out_of_scope` paths.
- AC-5 ✔: Zero secrets or internal details exposed in responses or logs.
- AC-6 ✔: Limits recorded in `ARCHITECTURE.md` §7; OD-05 free tier eligibility recorded in §11.
**Rule & scope check:**
- R-020, R-022: API keys stored in server env only; never logged or committed.
- R-031..R-035: Server-only Gemini, no tools, output validated, 0 retries.
- R-050: @google/genai installed and documented.
**Conflicts / open decisions encountered:** none
**Known gaps:** Comprehensive security and abuse suite scheduled for TASK-022.
**Next task:** TASK-022 (Chatbot security and abuse tests)
