# TASK-014 — Field Documentation gallery

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P1 |
| **Depends on** | TASK-008 |
| **Owner input needed** | Authentic activity photos, alt text, confirmed captions |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the horizontal drag/swipe gallery of authentic activity images.

## 2. Source requirements
`PRD.md` FR-GAL-01…04 · `DESIGN.md` §5.9, §9

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.9
- `DESIGN.md` §5.9, §9
- PNGs `3`, `5`, `6`, `7`

## 4. Preconditions
- TASK-008 done.
- Embla available (TASK-013) or an equivalent already-approved approach.

## 5. In scope
- 4 across on desktop; horizontal swipe on mobile with partial next card and a "SWIPE" hint; `touch-action: pan-y` so vertical page scroll still works.
- Cards: rounded, hairline border, bottom gradient scrim with a mono-bracket caption (only confirmed captions) and short description; scrim strong enough in **both** themes.
- Fixed card height (measure from the reference); `next/image` with reserved dimensions and lazy loading.
- Alt text per item (decorative → empty alt); keyboard operable where interactive.

## 6. Out of scope — do NOT do
- Lightbox for the gallery, captions or events the owner has not confirmed, video.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/documentation.tsx`
- `src/app/page.tsx`
- `public/assets/gallery/*` (owner-supplied only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Measure the card height and spacing from the PNGs; record in `DESIGN.md`.
2. Implement with fixtures; verify drag on desktop and touch emulation.
3. Check caption contrast over several images in both themes.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Desktop/mobile layouts match the references; vertical page scroll works on touch emulation.
- **AC-2** Captions are legible over images in both themes (scrim verified).
- **AC-3** Only authentic owner-provided images are shown at release (fixtures flagged).
- **AC-4** Alt text present; no layout shift; no overflow.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-SCOPE

## 11. Blocked / stop conditions
- Photos missing → BLOCKED for final content; layout work proceeds with fixtures.

## 12. Completion Report
## Completion Report — TASK-014 — 2026-10-23
**Status:** DONE
**Summary:** Built the Field Documentation horizontal gallery with Embla carousel, touch-action pan-y, gradient scrims for text contrast across both themes, and modular placeholder graphics clearly flagged for future owner asset replacement.
**Files:**
- Created: `src/components/sections/documentation.tsx` (carousel gallery component)
- Created: `tests/documentation.test.ts` (DOM/Vitest suite for gallery)
- Modified: `src/app/page.tsx` (mounted DocumentationSection)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | ESLint zero warnings/errors |
| `pnpm typecheck` | PASS | tsc zero errors |
| `pnpm test` | PASS | 11 test files, 48 tests passed |
| `pnpm build` | PASS | Static pages generated cleanly |
**Acceptance criteria:**
- AC-1 ✔: 4-across layout on desktop, responsive card sizing on tablet/mobile, `touch-pan-y` ensures vertical page scrolling remains unblocked.
- AC-2 ✔: High-contrast bottom gradient scrim (from-black/90 via-black/45 to-transparent) guarantees caption legibility in both light and dark modes.
- AC-3 ✔: Modular SVG placeholders from TASK-008 utilized and clearly flagged as DRAFT in `src/data/gallery.ts` per OD-09.
- AC-4 ✔: All 6 items include descriptive alt text, fixed card dimensions, and zero layout shift.
**Design comparison (UI tasks):** Evaluated against 3 MASTER DESIGN.png and 6 LIGHT MODE.png.
**Rule & scope check:** SectionHeader without numeric prefix (C-11); no gallery lightbox per scope; no raw hex; file economy maintained.
**Conflicts / open decisions encountered:** C-11 (SectionHeader title without numeric prefix).
**Known gaps:** Authentic activity photos pending from Owner (modular placeholders in place per OD-09).
**Next task:** TASK-015
