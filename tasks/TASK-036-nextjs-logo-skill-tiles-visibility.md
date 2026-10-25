# TASK-036 — Next.js Logo in Technical Stack & Tile Visibility (CR-008)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Revision 2 & Optimization) |
| **Hat** | UI + Database |
| **Priority** | P0 |
| **Depends on** | TASK-035 |
| **Owner input needed** | none (URL provided in workspace) |
| **Skills** | `design-implementation`, `ui-verification`, `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Add the official **Next.js** logo to the Technical Stack marquee under the Frontend category as a locally hosted SVG asset (`public/assets/skills/nextjs.svg`), ensure high-contrast visibility across dark and light themes for Next.js and all other dark-colored skill tiles, update knowledge records and re-seed the development database twice to prove idempotency per Owner Change Request CR-008.

## 2. Source requirements
- `PRD.md` §8.2, §15 (CR-008)
- `DESIGN.md` §5.5 (DS-SKL)
- `SCHEMA.md` §5
- Directives Items 21–27

## 3. Required reading
- `dokumen informasi/A. Desain dan aset visual/logo skills/link` (lines 39–40)
- `src/data/skills.ts`
- `src/components/sections/skills.tsx`
- `src/data/chatbot-knowledge.ts`

## 4. In scope
- Read Next.js URL from `dokumen informasi/A. Desain dan aset visual/logo skills/link` (line 40).
- Download SVG asset once to `public/assets/skills/nextjs.svg` (`R-019`). Record source URL as a comment in `src/data/skills.ts`.
- Validate asset safety: valid SVG type, 749 bytes (< 100 KB), zero `<script>`, `on*=`, `foreignObject`, or external `href` tags.
- Update `src/data/schemas.ts` to allow local asset paths in `SkillItemSchema.iconUrl`.
- Add `Next.js` (`skill-nextjs`) to `src/data/skills.ts` under Frontend group with `verification: "VERIFIED"` (dated comment `2026-10-25`).
- Implement dual-theme contrast handling in `src/components/sections/skills.tsx` using `dark:invert` for Next.js and 8 other dark-colored icons: GitHub, Rust, Flask, Fastify, Expo, Framer Motion, Prisma, SQLAlchemy.
- Update `buildKnowledgeRecords()`, re-seed Neon development database twice (`pnpm db:seed --confirm-db=neondb`), proving idempotency.
- Update unit tests in `tests/skills.test.ts` and `tests/content.test.ts` (35 verified skills total).
- Pass `pnpm build` and verification checks.

## 5. Out of scope
- Hotlinking external SVG assets at runtime (`R-019`).
- Changing non-monochrome skill icon colors.

## 6. Files
**Allowed to modify / create:**
- `public/assets/skills/nextjs.svg`
- `src/data/skills.ts`
- `src/data/schemas.ts`
- `src/components/sections/skills.tsx`
- `tests/skills.test.ts`
- `tests/content.test.ts`
- `PRD.md` §8.2, §15
- `DESIGN.md` §5.5
- `TODO.md`
- `tasks/TASK-036-nextjs-logo-skill-tiles-visibility.md`

## 7. Acceptance criteria
- **AC-1** Next.js SVG downloaded locally to `public/assets/skills/nextjs.svg` and source documented in `skills.ts`.
- **AC-2** SVG validated safe (<100 KB, no executable code or external references).
- **AC-3** `Next.js` marked `VERIFIED` under `Frontend` group in `skillsData` (35 verified skills total).
- **AC-4** Dual-theme contrast handling (`dark:invert`) applied to Next.js and 8 dark-colored skill icons.
- **AC-5** Neon development database seeded twice with `--confirm-db=neondb` with identical record counts (idempotency proven).
- **AC-6** Marquee accessibility verified: single non-duplicated `"Next.js"` in `sr-only` list, seamless loop, pause on hover/focus.
- **AC-7** All unit tests and `pnpm build` pass.

## 8. Completion Report — TASK-036 — 2026-10-25
**Status:** DONE
**Summary:** Integrated official Next.js SVG logo locally at `public/assets/skills/nextjs.svg` without runtime CDN hotlinking. Expanded verified skills inventory to 35. Resolved dual-theme visibility issues by applying `dark:invert` contrast handling to Next.js and 8 dark-colored skill icons (GitHub, Rust, Flask, Fastify, Expo, Framer Motion, Prisma, SQLAlchemy) so all skill tiles render crisp and legible against dark surfaces in dark mode. Executed two consecutive development database seeds, proving 100% idempotent upsert.

**Files:**
- `public/assets/skills/nextjs.svg` (CREATED): Official 749-byte sanitized SVG.
- `src/data/schemas.ts` (MODIFIED): Allowed local `/assets/skills/*` paths in `SkillItemSchema.iconUrl`.
- `src/data/skills.ts` (MODIFIED): Added `Next.js` (`skill-nextjs`) under `Frontend` with status `VERIFIED` (dated `2026-10-25`).
- `src/components/sections/skills.tsx` (MODIFIED): Implemented `DARK_THEME_INVERT_SKILLS` set applying `dark:invert` for high contrast in dark mode.
- `tests/skills.test.ts` (MODIFIED): Updated screen-reader list test for 35 skills, Next.js tile, and `dark:invert` assertions.
- `tests/content.test.ts` (MODIFIED): Updated skill validation test to assert 35 skills and disk existence of local assets.
- `PRD.md` §8.2, §15 (MODIFIED): Documented Next.js local asset, 35 skills, and recorded CR-008.
- `DESIGN.md` §5.5 (MODIFIED): Updated marquee specifications with 35 skills and dual-theme contrast handling.

**Dependencies added:** none.

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| SVG Security Inspection | PASS | 749 bytes; 0 `<script>`, 0 `on*=`, 0 `foreignObject`, 0 external `href` |
| `pnpm db:seed --confirm-db=neondb` (Run 1) | PASS | 27 KnowledgeRecords written (SKILL: 5 records including Next.js) |
| `pnpm db:seed --confirm-db=neondb` (Run 2) | PASS | Exactly 27 KnowledgeRecords (Idempotency confirmed) |
| `pnpm vitest run tests/skills.test.ts` | PASS | 5/5 tests passed (35 skills, Next.js tile, dark:invert verified) |
| `pnpm vitest run tests/content.test.ts` | PASS | 10/10 tests passed (Skill schema and asset disk paths verified) |
| `pnpm vitest run tests/chatbot-knowledge.test.ts` | PASS | 8/8 tests passed |
| `pnpm build` | PASS | Production compilation & static generation successful in 4.5s |

**Acceptance criteria:**
- AC-1 ✔ — Next.js logo stored locally at `public/assets/skills/nextjs.svg`.
- AC-2 ✔ — SVG validated safe and lightweight (<100 KB).
- AC-3 ✔ — 35 verified skills with Next.js in Frontend group.
- AC-4 ✔ — Dual-theme contrast handling implemented.
- AC-5 ✔ — Database seeding proven idempotent.
- AC-6 ✔ — Single `sr-only` announcement in marquee.
- AC-7 ✔ — All test suites pass.

**Next task:** TASK-037 (CR-009)
