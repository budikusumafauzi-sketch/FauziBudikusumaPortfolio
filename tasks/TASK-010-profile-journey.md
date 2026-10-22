# TASK-010 — Profile & Journey section

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-008, TASK-005 |
| **Owner input needed** | none |
| **Skills** | — |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build Profile & Journey: Profile Summary card and Education & Experience Timeline card.

## 2. Source requirements
`PRD.md` FR-ABT-01…04 · `DESIGN.md` §5.4

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.5
- `DESIGN.md` §5.4
- PNGs `3`, `5`, `6`

## 4. Preconditions
- TASK-008 done (single copy source for journey/profile).

## 5. In scope
- Section header with mono descriptor and rule; two columns desktop, stacked mobile.
- Profile Summary: "OVERVIEW" tag, two specialization chips (first accent-tinted), paragraphs, divider, "OPERATIONAL PRINCIPLES:" with accent bullets.
- Timeline: vertical rail, accent dot for the current item, bold uppercase titles, mono date ranges right-aligned, descriptions, optional chips.
- One data source for all breakpoints (no copy forking). Do not reproduce the stray line break.

## 6. Out of scope — do NOT do
- New fields, achievements, metrics, per-breakpoint copy changes.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/profile-journey.tsx`
- `src/app/page.tsx`

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Render from `profile` and `journey` modules only.
2. Check long-text wrapping and dates alignment at all widths.
3. Compare to the PNGs; run `ui-verification`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Both cards match the references in both themes at all required viewports.
- **AC-2** All text comes from the data modules; identical wording on desktop and mobile.
- **AC-3** Timeline order/dates reflect the data (DRAFT items flagged in the report).
- **AC-4** No overflow or clipped text; headings in logical order.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-SCOPE

## 11. Blocked / stop conditions
- Journey facts unverified → render DRAFT values in development and list them for the owner; do not alter them.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-010: <summary>`.)*
