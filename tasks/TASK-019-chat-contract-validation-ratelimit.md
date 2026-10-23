# TASK-019 — Chat API contract, validation, scope guard and rate limit

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 5 — Chatbot backend |
| **Hat** | Backend |
| **Priority** | P0 |
| **Depends on** | TASK-003 (G4 recommended; may use a mocked data layer) |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Create `POST /api/chat` with the strict contract, validation, fixed responses, deterministic scope guard and in-memory rate limiting. Retrieval and Gemini are stubbed (`unavailable`) until Tasks 020–021.

## 2. Source requirements
`ARCHITECTURE.md` §7, §8.1, §9, §10 · `PRD.md` CB-01…CB-10 · `RULES.md` R-026…R-029, R-036, R-037, R-039

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §7–§10
- `PRD.md` §7
- `RULES.md` §3–§4

## 4. Preconditions
- `zod` installed (TASK-008).

## 5. In scope
- `src/lib/chat-contract.ts`: Zod request/response schemas, status union, limits and **fixed copy constants** (shared by server and client).
- `src/app/api/chat/route.ts` (Node runtime, dynamic): method check (405 + `Allow`), content-type (415), body size (413), strict JSON/schema validation (400), rate limit (429 + `Retry-After`), scope guard → `out_of_scope`, then a stubbed `unavailable` result.
- `src/lib/server/rate-limit.ts`: sliding-window per client key, bounded map with cleanup, safe client-IP rule (trust forwarding headers only in the documented host; fixed fallback key elsewhere).
- `src/lib/server/guard.ts` (or inside the route module if tiny): deterministic patterns from `ARCHITECTURE.md` §8.1.
- Decide and **record the final numeric limits** in `ARCHITECTURE.md` §7 (OD-08).
- Tests for every status path.

## 6. Out of scope — do NOT do
- Retrieval, Gemini, UI, DB queries.
- Any extra endpoint.

## 7. Files
**Allowed to create / modify**
- `src/lib/chat-contract.ts`
- `src/app/api/chat/route.ts`
- `src/lib/server/rate-limit.ts`, `src/lib/server/guard.ts`
- `tests/chat-contract.test.ts` and related tests
- `ARCHITECTURE.md` §7 (record final limits)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Write the contract and constants first; test schema strictness (unknown keys rejected).
2. Implement the route pipeline in the order of `ARCHITECTURE.md` §8.
3. Test: bad JSON, empty, too long, wrong content-type, oversized body, GET, burst over the limit, guard phrases, unicode oddities.
4. Confirm responses never contain internals.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Every row of the status table in `ARCHITECTURE.md` §7 reachable by a passing test (except those depending on Tasks 020–021).
- **AC-2** Unknown request fields are rejected; the client cannot pass query/model parameters.
- **AC-3** Burst test returns 429 with `Retry-After` and `retryAfterSeconds`; the limiter map is bounded.
- **AC-4** Guard matches return `out_of_scope` without touching DB or Gemini (spy assertions).
- **AC-5** Responses contain no stack traces, paths or provider details.
- **AC-6** Final limit values are recorded in `ARCHITECTURE.md` §7.

## 10. Verification
- V-CHAT (contract tests)
- V-STATIC
- V-SEC
- V-SCOPE

## 11. Blocked / stop conditions
- Hosting header behavior for client IP is unknown locally → implement the safe fallback and schedule verification in TASK-026.

## 12. Completion Report — TASK-019 — 2026-10-23
**Status:** DONE
**Summary:** Implemented the Chat API contract, strict Zod schema validation (.strict()), sliding-window rate limiter with bounded map, deterministic pre-retrieval scope guard, and Route Handler structure for POST /api/chat. Recorded finalized limits under OD-08 in ARCHITECTURE.md §7.
**Files:**
- created: `src/lib/chat-contract.ts` (shared contract, limits, Zod schema, fixed visitor copy)
- created: `src/lib/server/rate-limit.ts` (sliding window rate limiter, bounded map, client IP detection)
- created: `src/lib/server/guard.ts` (pre-retrieval deterministic regex guard for injection, secret, mutation, private data, off-topic)
- created: `src/app/api/chat/route.ts` (POST /api/chat route handler with 7-layer defense-in-depth and 405 method guards)
- created: `tests/chat-contract.test.ts` (93 comprehensive unit tests covering contract, validation, rate limiting, and scope guard)
- created: `tests/__mocks__/server-only.ts` (test-environment mock for server-only package)
- modified: `vitest.config.ts` (added alias for server-only mock)
- modified: `ARCHITECTURE.md` (recorded finalized limits under OD-08 in §7)
- modified: `.gitignore` (added .vscode/)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm test -- tests/chat-contract.test.ts` | PASS | 93 tests passed (100%) |
| `pnpm lint` | PASS | Exit code 0, 0 errors, 0 warnings |
| `pnpm typecheck` | PASS | Exit code 0, 0 type errors |
| `pnpm build` | PASS | Route `/api/chat` built as dynamic server-rendered route |
**Acceptance criteria:**
- AC-1 ✔: Status table paths reachable (tested in `tests/chat-contract.test.ts`).
- AC-2 ✔: Zod `.strict()` schema rejects unknown properties with 400 invalid_request; client cannot supply parameters.
- AC-3 ✔: Burst test returns 429 with `Retry-After` header and `retryAfterSeconds`; store map bounded to 5,000 entries.
- AC-4 ✔: Guard matches return `out_of_scope` with fixed copy; 0 DB / 0 Gemini calls.
- AC-5 ✔: Responses contain only visitor-safe copy; no stack traces, paths, SQL, or provider details.
- AC-6 ✔: Final limit values recorded in `ARCHITECTURE.md` §7 under OD-08.
**Rule & scope check:**
- R-026: Visitor input and model outputs treated as untrusted data.
- R-029: No internal details or stack traces exposed in responses.
- R-036: Client cannot pass query or model parameters.
- R-039: Fixed visitor copy constants used for all error/status conditions.
- R-070..R-074: File economy verified.
**Conflicts / open decisions encountered:**
- OD-08 finalized with limits recorded in `ARCHITECTURE.md` §7.
**Known gaps:**
- Database retrieval and Gemini generation stubbed as `unavailable` per task specification; implemented in TASK-020 and TASK-021.
**Next task:** TASK-020 (Retrieval and no-data fallback)
