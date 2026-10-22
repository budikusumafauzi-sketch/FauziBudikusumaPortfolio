# TASK-020 — Retrieval and no-data fallback

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 5 — Chatbot backend |
| **Hat** | Backend |
| **Priority** | P0 |
| **Depends on** | TASK-018, TASK-019 |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot`, `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Implement the bounded keyword/category retrieval and the fixed `no_data` fallback so Gemini is only reached with relevant verified facts.

## 2. Source requirements
`ARCHITECTURE.md` §8.2, ADR-011 · `SCHEMA.md` §10 · `PRD.md` CB-02, CB-03 · `RULES.md` R-031, R-036

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §8.2, §10
- `SCHEMA.md` §3, §10
- `RULES.md` §4

## 4. Preconditions
- TASK-018 done (seeded development data) and TASK-019 done.

## 5. In scope
- `src/lib/server/retrieval.ts`: normalize → intent categories (before stop-word removal) → tokens → bounded Prisma `findMany` (`take: 20`, parameters built only from server-derived tokens/enums) → application-side scoring (title 3, keyword 2, body 1, category 2; floor 2) → top K and context-size cap.
- Wire into the route: no relevant records → `no_data` (fixed copy), no Gemini call.
- Retrieval test set: for each category at least two in-scope questions; "Tell me about Fauzi"; list-style questions ("What projects has he built?"); nonsense; private-data; injection strings. Tests with a mocked Prisma and (optionally) one integration run against the dev data.
- Tune the intent map/keywords from test failures — never by adding infrastructure.
- Record final K and caps in `ARCHITECTURE.md` §7.

## 6. Out of scope — do NOT do
- Embeddings, vector search, extensions, full-text engines, Gemini calls.

## 7. Files
**Allowed to create / modify**
- `src/lib/server/retrieval.ts`
- `src/app/api/chat/route.ts`
- `tests/retrieval.test.ts`
- `ARCHITECTURE.md` §7 (record)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Implement pure helpers (normalize, tokenize, intent, score) first and unit-test them.
2. Add the DB call with a mocked client in tests.
3. Integrate with the route and the fallback.
4. Check query count per request (one) and result bounds.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Each in-scope test question maps to the intended category and returns records.
- **AC-2** Nonsense, private-data and injection inputs yield `no_data` or `out_of_scope`.
- **AC-3** No Gemini call occurs on the no-match path (spy assertion).
- **AC-4** At most one bounded DB query per request; at most K records and the context cap are respected.
- **AC-5** No client-controlled value reaches a query beyond sanitized tokens.
- **AC-6** Final values recorded in `ARCHITECTURE.md` §7.

## 10. Verification
- V-CHAT
- V-DB (optional integration)
- V-STATIC
- V-SCOPE

## 11. Blocked / stop conditions
- Persistent recall problems → adjust keywords/intent map; propose (don't build) anything heavier as an OD.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-020: <summary>`.)*
