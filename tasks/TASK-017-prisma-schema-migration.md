# TASK-017 — Prisma schema and first migration

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 4 — Data preparation and PostgreSQL |
| **Hat** | Database |
| **Priority** | P0 |
| **Depends on** | TASK-008; Phase 4 entry criteria |
| **Owner input needed** | **OWNER ACTION:** a PostgreSQL database (Neon candidate) exists and the privileged connection string is in the local `.env` as `MIGRATION_DATABASE_URL`; a separate development database/branch if the free tier allows (OD-07) |
| **Skills** | `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Finalize the schema decision (OD-03/SCH-01), write `prisma/schema.prisma` and the first versioned migration against a **development** database, and add a server-only Prisma client module.

## 2. Source requirements
`SCHEMA.md` §3, §9–§11 · `ARCHITECTURE.md` §3, §9, §11, ADR-006/008 · `RULES.md` R-040, R-042, R-043, R-047, R-048

## 3. Required reading (only these, only the relevant sections)
- `SCHEMA.md` (all)
- `ARCHITECTURE.md` §5, §6, §9, §11
- `RULES.md` §5
- Current official Prisma and Neon docs (free-tier limits, pooling, datasource configuration for the installed Prisma version)

## 4. Preconditions
- Phase 4 entry criteria (`WORKFLOW.md`): owner action done; OD-07 verified and recorded in `ARCHITECTURE.md` §11 with the date; OD-03 settled.
- Target database identified and confirmed as **development**.

## 5. In scope
- Verify OD-07 from official Neon pages (limits, connection pooling, regions, branch availability) and record the dated result.
- Install Prisma + client (+ any driver adapter the installed version requires).
- Write `schema.prisma` matching `SCHEMA.md` §3 (or document a justified difference and update `SCHEMA.md` in this task).
- Create the migration on the **development** database; review the generated SQL.
- Add `src/lib/server/db.ts` (`import 'server-only'`, singleton Prisma client reading `DATABASE_URL` lazily at request time).
- Confirm `pnpm build` still succeeds without any DB credentials.
- Settle SCH-01…SCH-04 and update `SCHEMA.md`.

## 6. Out of scope — do NOT do
- Seed, role creation, retrieval, any API route.
- Applying anything to a non-development database.
- Any second database or extension.

## 7. Files
**Allowed to create / modify**
- `prisma/schema.prisma`, `prisma/migrations/**`, Prisma config file as required by the installed version
- `src/lib/server/db.ts`
- `package.json`, lockfile
- `SCHEMA.md`, `ARCHITECTURE.md` §11 (records)
- `.env.example` (names only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Read current Prisma docs for the installed major version (where the datasource URL lives, client generation, driver adapters).
2. Write schema + migration; inspect SQL for destructive statements.
3. Run `prisma validate` and generate; run `pnpm verify`.
4. Sync `SCHEMA.md`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** OD-07 verification (with date and source) is recorded.
- **AC-2** `prisma validate` passes; a versioned migration exists and was applied to the development database only.
- **AC-3** `SCHEMA.md` equals `schema.prisma` (differences documented).
- **AC-4** `pnpm verify` is green and `pnpm build` works with no DB env present.
- **AC-5** No page or client component imports Prisma; `db.ts` is server-only.
- **AC-6** No secret was printed or committed.

## 10. Verification
- V-DB (`prisma validate`, migration status)
- V-STATIC
- V-SEC
- V-SCOPE

## 11. Blocked / stop conditions
- No database/credentials → owner-only input (BLOCKED).
- Only one database available → stop event: ask whether dev-only commands may target it (default: no).
- Free tier cannot meet a requirement → report with a free alternative, do not upgrade.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-017: <summary>`.)*
