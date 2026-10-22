# TASK-016 — Static site sweep and Gate G3 package

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | QA / Reviewer |
| **Priority** | P0 |
| **Depends on** | TASK-009 … TASK-015 |
| **Owner input needed** | Owner review at Gate G3 |
| **Skills** | `ui-verification`, `design-implementation`, `release-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Assemble all static sections, sweep the whole page for responsive/theme/state/accessibility defects, and prepare the **Gate G3 package**. No new features.

## 2. Source requirements
`PRD.md` ACC-01…ACC-06, ACC-10…ACC-12 (static portion) · `WORKFLOW.md` Phase 3, §9

## 3. Required reading (only these, only the relevant sections)
- `WORKFLOW.md` Phase 3, §7, §9
- `DESIGN.md` §4, §6, §10, §12, §14
- All approved PNGs

## 4. Preconditions
- TASKs 009–015 `DONE` (or explicitly `BLOCKED` only by owner-supplied content).

## 5. In scope
- Verify section order and anchors; scroll offsets; sticky bar behavior.
- Run the full `ui-verification` matrix across the page: 4 widths × 2 themes; overflow; keyboard walk; reduced motion; theme flash; contrast; touch behavior of carousels.
- Re-verify project grid with 4/5/6 cards and lightbox keyboard behavior.
- Fix defects found (inside the files of the relevant task; reopen that task as `REWORK` if needed).
- Check image weights/formats and `next/image` usage; no layout shift.
- Compile the content-dependency list (everything still DRAFT/NOT_PROVIDED).
- Produce the **G3 package** (`WORKFLOW.md` §9).

## 6. Out of scope — do NOT do
- New sections/features, DB or chat code, redesign.

## 7. Files
**Allowed to create / modify**
- Files of Tasks 009–015 (fixes only)
- `tests/**`
- `TODO.md` §1/§5

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Run `pnpm verify`.
2. Walk the page at each viewport/theme; capture screenshots; fill the difference table.
3. Fix and re-verify; list intentional differences with their C-xx/OD-xx.
4. Post the G3 package; set `TODO.md` to "Waiting for Gate G3". Continue with Phase 4/5 only per `WORKFLOW.md` §3.3.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** `pnpm verify` is green.
- **AC-2** All sections are present in the approved order and match the references after recorded decisions; every difference is fixed, intentional (cited), or open (listed).
- **AC-3** No horizontal overflow, clipped text or unreachable controls at any required viewport/theme.
- **AC-4** Keyboard, focus, reduced-motion and theme-flash checks pass.
- **AC-5** The content-dependency list and open questions are in the G3 package.
- **AC-6** Screenshots (4 widths × 2 themes, lightbox open) are listed in the report.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-SCOPE
- V-LINKS (assets/paths present so far)

## 11. Blocked / stop conditions
- Owner gate G3 reached: do not start Phase 6/7/8 until approved.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-016: <summary>`.)*
