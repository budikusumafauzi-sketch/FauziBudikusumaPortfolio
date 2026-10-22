---
name: prisma-postgres
description: Use for any work on the Prisma schema, migrations, seed script, PostgreSQL roles/permissions, or the read-only negative write test for the portfolio knowledge table. Covers safe environment handling and idempotent seeding. Not for UI or Gemini logic.
---

# Prisma + PostgreSQL procedure

## When to use
TASK-017, TASK-018, TASK-025 (re-test), TASK-026 (production migration/seed, only as that task authorizes).

## Required inputs
`SCHEMA.md` (all), `ARCHITECTURE.md` §6, §9, §11, `RULES.md` §5, and the current official Prisma and Neon docs (versions change; follow what is installed).

## Safety first
- Never print connection strings or passwords (R-022). Verify variables are *set* only.
- Two credentials: privileged `MIGRATION_DATABASE_URL` (local only) and read-only `DATABASE_URL` (runtime).
- Identify the **target** before any write: print host + database name with credentials redacted. Development targets only unless the task says otherwise (R-043).
- Forbidden: reset/force-reset, drop/truncate on non-disposable data, hand-edited schema, editing applied migrations (R-042, R-047, R-048).

## Procedure A — schema and migration (TASK-017)
1. Re-read `SCHEMA.md` §3. Write `prisma/schema.prisma` matching it (or document the justified difference and update `SCHEMA.md` in the same task).
2. `prisma validate`; generate the client.
3. Create a versioned migration against the **development** database; inspect the generated SQL (no surprise drops).
4. Confirm the build still passes without DB credentials (no page imports Prisma).
5. Sync `SCHEMA.md` with the executable schema.

## Procedure B — seed (TASK-018)
1. `buildKnowledgeRecords()` derives records from `src/data/` (pure function, unit-tested).
2. Keep only `VERIFIED` content; validate **all** records with Zod and the privacy lint **before** any write; abort on the first invalid record.
3. Print the target; require the confirmation flag matching the database name.
4. Upsert by `id` in one transaction. Prune is opt-in and prints a dry-run list first.
5. **Idempotency evidence:** run twice; row count and content unchanged. **Invalid-record evidence:** a bad record in a test writes nothing.

## Procedure C — runtime role and negative write test
1. Create the runtime role with SQL (not a console shortcut that may grant broader rights; verify in current Neon docs): `CONNECT`, schema `USAGE`, `SELECT` on the knowledge table only; role-level `statement_timeout`.
2. After every migration that creates/replaces the table, re-check the grants.
3. Using **only the runtime credential**: `SELECT` must succeed; `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `CREATE TABLE`, `DROP TABLE` must each fail with a permission error. Record sanitized results.
4. Confirm the privileged URL is absent from `.env.example` values, client code, and the deployment environment list.

## Outputs
Schema + migration files, seed + tests, role setup record, negative write evidence, updated `SCHEMA.md`.

## Stop conditions
Only one database exists and dev-only commands would hit it (stop event; ask) · provider limits prevent separate roles (report; never weaken the read-only requirement) · any step would need a destructive action on a non-disposable DB.
