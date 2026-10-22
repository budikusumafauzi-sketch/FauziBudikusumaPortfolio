# TASK-002 — Next.js foundation

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 1 — Project foundation |
| **Hat** | Architect |
| **Priority** | P0 |
| **Depends on** | TASK-001, Gate G0 passed |
| **Owner input needed** | none |
| **Skills** | `release-verification` (versions) |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Create the Next.js (App Router, TypeScript, Tailwind) project with pnpm in the repository root **without touching existing documents**, with a neutral placeholder page, correct ignore rules, and recorded versions. Install only what this task uses; later tasks install their own libraries when first needed.

## 2. Source requirements
`ARCHITECTURE.md` §3, §4, §5 · `RULES.md` R-021, R-070…R-074, R-094 · `PRD.md` NFR-PERF-03/04

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §3–§5, §11 (env names)
- `RULES.md` R-021, R-022, R-070…R-074, R-094
- Current official Next.js and Tailwind installation docs (versions at implementation time)

## 4. Preconditions
- Gate G0 passed (owner wrote the start authorization; recorded in `PRD.md` §15).
- Node.js LTS and pnpm available (install pnpm via the supported route if missing; no global system changes beyond what the package manager docs require — if impossible, report).

## 5. In scope
- Scaffold Next.js App Router + TypeScript + ESLint + Tailwind with `src/` directory and the `@/*` alias. If the scaffolder refuses a non-empty directory, scaffold into a temporary folder and move files in **without overwriting any existing document**.
- Remove default demo content (logos, sample styles/pages) leaving a neutral placeholder page.
- `.gitignore` that ignores `node_modules`, build output, `.env*` **except** `.env.example`, logs, OS files.
- `.env.example` with the **names** from `ARCHITECTURE.md` §11 and dummy/empty values only.
- Strict TypeScript. Commit the lockfile.
- Record installed versions (Next, React, Tailwind, Node, pnpm) in the report.

## 6. Out of scope — do NOT do
- Fonts, tokens, theme, any section or component (Phase 2+).
- Additional libraries (`next-themes`, `lucide-react`, `motion`, `embla-carousel-react`, `zod`, Prisma, Gemini SDK) — installed by the tasks that use them.
- Test tooling (TASK-003).
- Any real `.env` file with values.

## 7. Files
**Allowed to create / modify**
- `package.json`, `pnpm-lock.yaml`, `next.config.*`, `tsconfig.json`, ESLint/PostCSS/Tailwind config as generated
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- `.gitignore`, `.env.example`
- `public/` (remove demo files only)

**Must NOT change**
- All existing Markdown documents, `tasks/`, `.agents/`, `design/approved/*`.
- Any real secret value.

## 8. Implementation guidance
1. Check the OS/shell; pick cross-platform commands.
2. Scaffold per current docs; keep the generated structure unless it conflicts with `ARCHITECTURE.md` §4.
3. Clean demo content; set a neutral page (e.g. a plain text title) so the build has a route.
4. Write `.gitignore`, `.env.example`.
5. `pnpm install`, `pnpm dev` (confirm 200 on `/`, then stop the server), `pnpm build`.
6. Confirm `git diff` shows no change to pre-existing documents.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** `pnpm install` completes cleanly with a committed lockfile.
- **AC-2** `pnpm dev` serves `/` with HTTP 200; the dev server is stopped afterwards.
- **AC-3** `pnpm build` succeeds **with no `.env` present** (no DB/Gemini credentials needed).
- **AC-4** `git check-ignore .env .env.local` confirms they are ignored; `.env.example` is tracked and contains names only.
- **AC-5** Existing documents and `design/approved/*` are byte-identical to before.
- **AC-6** No demo assets/styles remain; no libraries beyond the framework baseline were added.
- **AC-7** Versions are recorded in the Completion Report.

## 10. Verification
- V-STATIC (`pnpm lint`, `pnpm build`).
- V-SCOPE (`git diff --name-only` vs allow-list; `package.json` dependency list).
- V-SEC: `.gitignore` check; confirm `.env.example` has no real values.

## 11. Blocked / stop conditions
- Scaffolder cannot run in the environment (network/permissions) → report with the exact error.
- Tailwind/Next version incompatibility → follow the current docs; if unresolved after 3 attempts mark `BLOCKED`.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-002: <summary>`.)*
