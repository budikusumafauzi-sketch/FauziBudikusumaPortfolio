# TASK-018 — Seed, read-only runtime role and negative write test

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 4 — Data preparation and PostgreSQL |
| **Hat** | Database |
| **Priority** | P0 |
| **Depends on** | TASK-017 |
| **Owner input needed** | Verified content for the records to seed (only `VERIFIED` is seeded) |
| **Skills** | `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Derive chatbot knowledge records from the content modules, seed them idempotently from the developer machine, create the **read-only runtime role**, and **prove** it cannot write.

## 2. Source requirements
`SCHEMA.md` §4, §6, §7, §8 · `ARCHITECTURE.md` §6, §9, ADR-007/008 · `RULES.md` R-041, R-043…R-046

## 3. Required reading (only these, only the relevant sections)
- `SCHEMA.md` §4, §6–§8
- `ARCHITECTURE.md` §6, §9, §11
- `RULES.md` §5

## 4. Preconditions
- TASK-017 done and applied on the development database.

## 5. In scope
- `src/data/chatbot-knowledge.ts`: pure `buildKnowledgeRecords()` deriving records from the modules (grouped `SKILL` records; one record per project/certification/contact/education/experience; `profile:main`), plus clearly flagged supplemental facts only if the owner provided them. Unit-test determinism, unique ids, id/category prefix rule.
- `prisma/seed.ts`: filter `VERIFIED`; Zod + privacy lint over **all** records before any write; print the target (host/db, redacted) and require the confirmation flag; one-transaction upsert by `id`; opt-in `--prune` with dry-run list. Add a `db:seed` script.
- Create the runtime role **with SQL** (see `SCHEMA.md` §8): connect, schema usage, `SELECT` on the table only, `statement_timeout`; generate a strong password locally and store the runtime URL in the local `.env` as `DATABASE_URL` **without printing it**.
- Negative write test (`tests/db-readonly.test.ts`, skipped when env is absent): with the runtime credential, `SELECT` succeeds; `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `CREATE TABLE`, `DROP TABLE` all fail with permission errors.
- Record sanitized evidence; update `SCHEMA.md` §8 if the provider required a variation.

## 6. Out of scope — do NOT do
- Production seeding/migration (TASK-026).
- Admin UI or any HTTP seed trigger.
- Granting the runtime role anything beyond `SELECT` on the table.

## 7. Files
**Allowed to create / modify**
- `src/data/chatbot-knowledge.ts`
- `prisma/seed.ts`
- `tests/**`
- `package.json` (+ `tsx` or the approved runner for the seed)
- local `.env` (untracked; value never printed)
- `.env.example` (names only)
- `SCHEMA.md`

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Write and unit-test `buildKnowledgeRecords()`.
2. Write the seed with pre-flight, validation-first and transaction.
3. Run seed twice and compare counts/content; run an invalid-record case; run prune dry-run.
4. Create the role; run the negative write test with the runtime credential.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Running the seed twice yields the same row count and content (evidence).
- **AC-2** A deliberately invalid record causes the seed to abort with nothing written (evidence).
- **AC-3** Only `VERIFIED` content is seeded; `DRAFT`/`NOT_PROVIDED` never reaches the database (test).
- **AC-4** The seed prints the target and refuses to run without the matching confirmation flag.
- **AC-5** The runtime credential can `SELECT` and **cannot** `INSERT/UPDATE/DELETE/TRUNCATE/CREATE/DROP` (sanitized output for each).
- **AC-6** The privileged URL is not in any file that will be deployed; no secret printed or committed.
- **AC-7** `--prune` shows a dry-run list before deleting.

## 10. Verification
- V-DB (full)
- V-STATIC
- V-SEC
- V-SCOPE

## 11. Blocked / stop conditions
- Provider grants broader privileges than requested and cannot be revoked → report; read-only is mandatory (R-046).
- Seed would target a non-development database → stop event.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-018: <summary>`.)*
