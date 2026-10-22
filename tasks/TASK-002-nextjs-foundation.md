# TASK-002 — Next.js foundation

| Field | Value |
|---|---|
| **Status** | `DONE` |
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

## Completion Report — TASK-002 — 2026-10-22
**Status:** DONE
**Summary:** Next.js App Router scaffolded with strict TypeScript, Turbopack, and Tailwind CSS v4 in the root. Demo assets removed leaving a neutral placeholder. Git ignore rules verify .env protection, and .env.example contains variable names with dummy placeholders. `pnpm install`, `pnpm dev` (HTTP 200), and `pnpm build` verified clean.
**Files:**
- created: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.env.example`
- modified: `tasks/TASK-002-nextjs-foundation.md`
**Dependencies added:**
- `next@16.4.2`, `react@19.3.0`, `react-dom@19.3.0`, `tailwindcss@4.1.18`, `@tailwindcss/turbopack@4.1.18`, `typescript@5.9.3`, `eslint@9.39.2`, `eslint-config-next@16.4.2`, `@types/node@20.19.35`, `@types/react@19.2.14`, `@types/react-dom@19.2.14` (installed as standard baseline)
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm install` | PASS | Already up to date / clean in 439ms using pnpm v11.25.0 |
| `pnpm dev` | PASS | Ready in 438ms; `GET /` returns HTTP status `200` |
| `pnpm build` | PASS | Next.js 16.4.2 Turbopack, static routes compiled cleanly with 0 errors |
| `pnpm lint` | PASS | ESLint exited 0 with no warnings or errors |
| `git check-ignore .env .env.local` | PASS | Output: `.env`, `.env.local` |
**Acceptance criteria:**
- AC-1 ✔ — `pnpm install` clean, lockfile present.
- AC-2 ✔ — `pnpm dev` serves `/` with HTTP 200; dev server cleanly stopped.
- AC-3 ✔ — `pnpm build` succeeds with no `.env` present.
- AC-4 ✔ — `.env` & `.env.local` ignored; `.env.example` tracked with dummy values.
- AC-5 ✔ — Existing docs and `design/approved/*` preserved intact.
- AC-6 ✔ — No demo assets/styles; strictly framework baseline.
- AC-7 ✔ — Versions recorded: Node v24.19.0, pnpm v11.25.0, Next.js 16.4.2, React 19.3.0, Tailwind CSS 4.1.18.
**Rule & scope check:** Followed R-021, R-022, R-070..R-074, R-094. No scope added.
**Conflicts / open decisions encountered:** None.
**Known gaps:** None.
**Next task:** TASK-003 — Verification tooling and the `pnpm verify` gate.
