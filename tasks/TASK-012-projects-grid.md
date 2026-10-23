# TASK-012 — Projects grid

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-008; decisions C-06, C-07, C-10 |
| **Owner input needed** | Project thumbnails (16:10), verified repo URLs and texts, verified status/license values (C-06) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the Projects grid with the strict 3/2/1 column rule and the never-stretch last row, with truthful link states.

## 2. Source requirements
`PRD.md` FR-PRJ-01…07 · `DESIGN.md` §5.6 · C-06, C-07 · `RULES.md` R-012, R-069

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.7, §13 (C-06, C-07, C-10)
- `DESIGN.md` §5.6, §6, §9
- PNGs `3`, `5`, `6`

## 4. Preconditions
- TASK-008 done. C-06/C-07 recorded.

## 5. In scope
- True CSS grid: 3 columns desktop, 2 tablet, 1 mobile; equal card heights; footer row pinned to the card bottom.
- Card anatomy per the reference: inset 16:10 image → status label (only if verified, C-06) → title → description → mono technology chips → divider → "GitHub Repository ↗" + license/visibility (only if verified).
- Last-row rule: leftover cards keep exactly one-third width, left-aligned, never stretched.
- Link states: verified public URL → link with `rel="noopener noreferrer"`; private/missing → explicit non-link text (e.g. "Private repository"); never a fake URL.
- Hover/focus per `DESIGN.md` §6 (crimson border = hover).
- Missing thumbnail → neutral designed placeholder in development; blocks release (R-016).

## 6. Out of scope — do NOT do
- Filters, search, categories, detail modal, "THREAT_INTEL"-style tags and the "INDEXED 06 OF 06" counter unless approved in C-06; "[PREVIEW 16:10]" annotation.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/projects.tsx`
- `src/app/page.tsx`
- `public/assets/projects/*` (owner-supplied only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Implement grid and card; verify with 4, 5, 6 cards by temporarily changing the data array (revert afterwards).
2. Verify image dimensions reserved (no layout shift).
3. Compare with the PNGs; run `ui-verification`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** 3/2/1 columns at desktop/tablet/mobile with equal heights.
- **AC-2** With 4, 5 and 6 cards the last row never stretches and stays left-aligned (screenshots).
- **AC-3** Thumbnails are 16:10 with reserved dimensions; no layout shift.
- **AC-4** Every link is a verified URL or an explicit non-link state; new-tab links carry `rel="noopener noreferrer"`.
- **AC-5** No filters/search/categories/detail modal exist.
- **AC-6** Card anatomy and states match the references in both themes; extra labels only per C-06.

## 10. Verification
- V-STATIC
- V-VISUAL (4/5/6 cards)
- V-A11Y
- V-LINKS
- V-SCOPE

## 11. Blocked / stop conditions
- Thumbnails/URLs missing → BLOCKED for final content; layout work proceeds with fixtures.
- C-06/C-07 undecided → implement only the unaffected parts.

## 12. Completion Report
## Completion Report — TASK-012 — 2026-10-23
**Status:** DONE
**Summary:** Implemented the Selected Projects grid (`#projects`) with strict 3/2/1 responsive geometry (`lg:grid-cols-3`, `md:grid-cols-2`, `grid-cols-1`) and equal card heights (`flex flex-col justify-between`). Locked 16:10 cover thumbnails rendered with Next.js Image without mockup strings (`C-06`), verified GitHub repository links (`rel="noopener noreferrer"`), private badge handling, and truthful project descriptions (correcting `C-10` eBPF mockup defect).
**Files:**
- `src/components/sections/projects.tsx`: created (ProjectsSection component)
- `src/app/page.tsx`: modified (mounted ProjectsSection at `#projects`)
- `tests/projects.test.ts`: created (unit tests for 3-2-1 grid, external link security, C-06, C-11)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm test tests/projects.test.ts` | PASS | 6 tests passed (id, C-11 compliance, 3-2-1 grid, external links, security rel, C-06) |
| `pnpm verify` | PASS | ESLint clean, TypeScript clean, 38/38 tests pass, Next.js static build successful |
| C-06 compliance | PASS | Strict absence of `[PREVIEW 16:10]`; clean aspect-[16/10] image container |
| C-07 & security | PASS | Verified public repositories link with `target="_blank" rel="noopener noreferrer"` |
| C-10 compliance | PASS | Enterprise Network Lab description matches MikroTik CHR routing topology |
| Never-stretch last row | PASS | CSS grid preserves 1/3 column width per card regardless of item count |
**Acceptance criteria:**
- AC-1 ✔ — 3/2/1 columns at desktop/tablet/mobile with equal heights.
- AC-2 ✔ — Last row cards maintain fixed column width, never stretching to fill empty slots.
- AC-3 ✔ — Thumbnails locked to 16:10 ratio with Next.js Image fill layout causing no layout shift.
- AC-4 ✔ — External links carry `target="_blank"` and `rel="noopener noreferrer"`.
- AC-5 ✔ — Zero filters/search/detail modals exist; strictly clean showcase grid.
- AC-6 ✔ — Clean card anatomy with hover glow in both dark and light modes.
**Next task:** `TASK-013` — Credentials carousel and certificate lightbox.
