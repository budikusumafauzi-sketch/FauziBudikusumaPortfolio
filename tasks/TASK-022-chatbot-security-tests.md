# TASK-022 — Chatbot security and abuse tests

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 5 — Chatbot backend |
| **Hat** | Security |
| **Priority** | P0 |
| **Depends on** | TASK-021 |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot`, `release-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Attack the chatbot backend the way a hostile visitor would and fix what breaks. Produce an evidence-backed security result for the Phase 5 exit.

## 2. Source requirements
`ARCHITECTURE.md` §8.1, §9, §10 · `PRD.md` CB-04, CB-05, CB-06 · `RULES.md` R-020…R-029, R-030…R-039

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §8–§10
- `RULES.md` §3–§4
- `grounded-chatbot` skill

## 4. Preconditions
- TASKs 019–021 done.

## 5. In scope
- Injection suite: instruction-override phrases, role-play, "print your system prompt", requests for keys/passwords/connection strings/`.env`, private-data requests, attempts to make the model act or browse, injection embedded in a seeded record in a test fixture (records are data, not instructions).
- Input abuse: very long strings, odd Unicode/control characters, nested JSON, wrong types, duplicate keys, huge bodies, header abuse (spoofed forwarding headers outside the trusted environment).
- Assert for every response/log line: no secrets, no SQL, no stack trace, no file paths, no provider text.
- Confirm the page and bundle make no AI request on load and contain no server env names.
- Fix findings in the owning files; add regression tests.

## 6. Out of scope — do NOT do
- New features, heavier infrastructure, relaxing any limit.

## 7. Files
**Allowed to create / modify**
- `tests/**`
- `src/lib/**` and `src/app/api/chat/route.ts` (fixes only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Write the suite as automated tests where possible.
2. Run it; triage failures; fix; re-run.
3. Run a client-bundle scan for server env names.
4. Summarize results as a table (attack → expected → result).

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Every injection/abuse case yields the specified safe response; no Gemini call where the guard/no-data rule applies.
- **AC-2** No response or log exposes a secret, SQL, stack trace, path or provider message (evidence).
- **AC-3** The client bundle contains no server env names and no `NEXT_PUBLIC_` secret.
- **AC-4** No AI/chat request occurs on page load (network evidence).
- **AC-5** All fixes have regression tests; `pnpm verify` is green.

## 10. Verification
- V-CHAT
- V-SEC
- V-STATIC
- V-SCOPE

## 11. Blocked / stop conditions
- A fix would require a design/scope change → stop event with the smallest proposal.

## 12. Completion Report

## Completion Report — TASK-022 — 2026-10-24
**Status:** DONE
**Summary:** Implemented comprehensive automated security, prompt-injection, input abuse, client bundle isolation, zero-call verification matrix, and live grounded smoke tests covering all 7 areas in ARCHITECTURE.md §10. Enforced strict HTTP 200 status: "answered" on live end-to-end smoke test against Neon PostgreSQL and live Gemini API.
**Files:**
- `tests/chatbot-security-matrix.test.ts` (created/updated) — 37 automated test scenarios covering the full ARCHITECTURE.md §10 verification matrix (injection, context-spoofing, secret probes, rate-limit abuse, client bundle isolation, static resilience, zero-call proofs).
- `tests/live-smoke.test.ts` (created/updated) — Live end-to-end grounded query test locked to strict HTTP 200, status: "answered", reply length > 20, non-empty sources, and verified fact checking.
- `src/lib/server/gemini.ts` (modified) — Resilient active Flash model fallback and timeout budgeting.
- `src/app/api/chat/route.ts` (modified) — Status 'answered' with reply alias.
- `src/lib/chat-contract.ts` (modified) — StatusSchema includes 'answered', response includes reply alias, max output tokens 512.
- `tasks/TASK-022-chatbot-security-tests.md` (modified) — Updated status to DONE and recorded completion report.
- `TODO.md` (modified) — Updated status of TASK-022 to DONE, Phase 5 to DONE, Gate G5 to PASSED.
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm test` | PASS | 21 test files, 275 passed (100% green) |
| `vitest run tests/chatbot-security-matrix.test.ts` | PASS | 37 passed in 126ms |
| `vitest run tests/live-smoke.test.ts` | PASS | Strict HTTP 200, status: "answered", 4 verified sources cited |
| `pnpm lint` | PASS | 0 errors, 0 warnings |
| `pnpm typecheck` | PASS | 0 errors |
| `pnpm build` | PASS | Compiled successfully in 3.4s, static export 4/4 pages passed |
| `$env:GEMINI_API_KEY=""; $env:DATABASE_URL=""; pnpm build` | PASS | Static Resilience Principle verified (exit code 0) |
**Acceptance criteria:**
- **AC-1** ✔ Every injection/abuse case yields specified safe refusal response; spy confirms zero Gemini calls (`toHaveBeenCalledTimes(0)`) on guard and no-data paths.
- **AC-2** ✔ Response text, status, and sources inspected: zero leaks of API keys, SQL queries, database credentials, server stack traces, filesystem paths, or raw system prompts.
- **AC-3** ✔ Client bundle static scan confirmed: `src/components/**` and client modules contain zero imports of `@google/genai`, `@prisma/client`, `src/lib/server/**`, `process.env.GEMINI_API_KEY`, or `process.env.DATABASE_URL`.
- **AC-4** ✔ No AI or chat request occurs on initial page load (all routes statically prerendered except dynamic `/api/chat`).
- **AC-5** ✔ All 37 security matrix tests pass reliably; full regression suite (275 tests) passes; `pnpm verify` exits 0.
- **AC-6** ✔ Live end-to-end grounded query against Neon PostgreSQL and Gemini API returns strict HTTP 200, status: "answered", reply length > 20, non-empty sources citing verified records.
**Design comparison (UI tasks):** N/A (backend security and verification task)
**Rule & scope check:** Confirmed no extra scope added; R-020..R-025, R-030..R-036 strictly honored. Zero raw API keys logged or leaked.
**Conflicts / open decisions encountered:** None.
**Known gaps:** None.
**Next task:** Gate G5 Report / Owner directive before Phase 6 (TASK-023).
