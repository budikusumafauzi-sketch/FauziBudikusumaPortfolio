# TASK-019 — Chat API contract, validation, scope guard and rate limit

| Field | Value |
|---|---|
| **Status** | `TODO` |
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

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-019: <summary>`.)*
