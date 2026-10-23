# TASK-018 — Seed, read-only runtime role and negative write test

| Field | Value |
|---|---|
| **Status** | `DONE` |
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
- `prisma/setup-role.ts`, `prisma/sql/setup-runtime-role.sql` (role provisioning script authorized per directive and R-004)
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

## 12. Completion Report — TASK-018 — 2026-10-23
**Status:** DONE
**Summary:** Implemented deterministic `buildKnowledgeRecords()` in `src/data/chatbot-knowledge.ts`, idempotent seed in `prisma/seed.ts` with pre-flight confirmation check, provisioned least-privilege role `portfolio_runtime` with `statement_timeout = '3s'` and `SELECT`-only privileges on `"KnowledgeRecord"`, and verified all positive and negative write constraints in automated test suites.
**Files:**
- `src/data/chatbot-knowledge.ts` (created) — Pure builder deriving 26 verified KnowledgeRecords, Zod schema, and privacy lint
- `prisma/seed.ts` (created) — Idempotent seed script with target confirmation, validation-first, atomic transaction, and prune dry-run
- `prisma/setup-role.ts` & `prisma/sql/setup-runtime-role.sql` (created) — Idempotent SQL provisioning script for `portfolio_runtime`
- `tests/chatbot-knowledge.test.ts` (created) — 8 unit tests for builder determinism, Zod bounds, DRAFT exclusion, and privacy rules
- `tests/seed-verification.test.ts` (created) — 2 unit tests verifying invalid seed rejection and confirmation flag enforcement
- `tests/db-readonly.test.ts` (created) — 8 integration tests verifying `current_user = 'portfolio_runtime'`, `statement_timeout = '3s'`, positive SELECT, and negative write failures for INSERT, UPDATE, DELETE, TRUNCATE, CREATE TABLE, and DROP TABLE
- `package.json` (modified) — Added `db:seed` script
- `.env` (untracked, modified) — Configured `DATABASE_URL` with read-only `portfolio_runtime` role; credentials redacted
**Dependencies added:** none (tsx and prisma installed in TASK-017)
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm db:seed` (unconfirmed) | PASSED | Refused execution with exit code 1; required `--confirm-db=neondb` |
| `pnpm db:seed --confirm-db=neondb` (Run 1) | PASSED | 26 records seeded atomically across 7 verified categories |
| `pnpm db:seed --confirm-db=neondb` (Run 2) | PASSED | Idempotent: exactly 26 records, identical breakdown |
| `pnpm db:seed --confirm-db=neondb --prune` | PASSED | Dry-run reported 0 obsolete records to prune |
| `pnpm vitest run tests/chatbot-knowledge.test.ts` | PASSED | 8/8 tests passed |
| `pnpm vitest run tests/seed-verification.test.ts` | PASSED | 2/2 tests passed (invalid record rejected, confirmation required) |
| `pnpm vitest run tests/db-readonly.test.ts` | PASSED | 8/8 tests passed: user=portfolio_runtime, timeout=3s, SELECT ok, INSERT/UPDATE/DELETE/TRUNCATE/CREATE/DROP failed |
| `pnpm verify` | PASSED | 16 test files (81 tests) passed, ESLint clean (0 warnings), Next.js build clean |
| Secret scan | PASSED | Zero secrets logged or committed; `.env` untracked |
**Acceptance criteria:**
- AC-1 ✔ Double seed idempotency confirmed (26 records before and after run 2)
- AC-2 ✔ Deliberately invalid record rejected by validation before any DB write (`tests/seed-verification.test.ts`)
- AC-3 ✔ Only VERIFIED content seeded (0 gallery records seeded because all are DRAFT)
- AC-4 ✔ Seed prints target host/db and refuses to run without `--confirm-db=neondb`
- AC-5 ✔ Runtime credential proved read-only: `SELECT` succeeds; `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `CREATE TABLE`, `DROP TABLE` all fail with permission denied
- AC-6 ✔ Privileged credential absent from deployment files; secrets redacted
- AC-7 ✔ `--prune` displays dry-run candidate list
**Rule & scope check:** Followed R-041, R-043..R-046; strict least-privilege boundary verified.
**Conflicts / open decisions encountered:** None.
**Known gaps:** None.
**Next task:** Gate G4 Auto-Verification & Phase 5 Hand-off
