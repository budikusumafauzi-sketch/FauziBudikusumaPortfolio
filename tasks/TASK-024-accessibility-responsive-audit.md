# TASK-024 — Accessibility and responsive audit

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 7 — Quality and security review |
| **Hat** | QA / Reviewer |
| **Priority** | P0 |
| **Depends on** | TASK-023 |
| **Owner input needed** | none |
| **Skills** | `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Independently audit the whole site (including chat and lightbox) for accessibility and responsive defects and fix every finding or record an owner-approved exception.

## 2. Source requirements
`PRD.md` NFR-A11Y-01/02, NFR-RSP-01, ACC-04, ACC-11, ACC-12 · `DESIGN.md` §10

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §9, §10
- `DESIGN.md` §3.3, §6, §7, §10
- `ui-verification` skill

## 4. Preconditions
- Phase 6 exit met.

## 5. In scope
- Full `ui-verification` run on the **production build**: 4 widths × 2 themes × (chat closed/open, lightbox open, mobile menu open).
- Keyboard-only walkthrough of the entire page; focus order; focus return; dialog and chat semantics; skip/landmark structure; heading order.
- Screen-reader semantics review (names, roles, live regions, marquee duplicates, alt text).
- Complete the final contrast table for every text/background pair actually used, including text over images; fix failures with tokens.
- Reduced-motion and theme-flash re-check; touch behavior of carousels/gallery.
- Fix findings in the owning files; re-test.

## 6. Out of scope — do NOT do
- New features or redesign; changing the approved look to fix contrast beyond token tuning (report conflicts instead).

## 7. Files
**Allowed to create / modify**
- Component/style files that need fixes
- `tests/**`
- `DESIGN.md` §3.3 (final contrast record)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Run the audit and record findings with severity.
2. Fix; re-run affected checks.
3. Write the final table: finding → fix/exception → evidence.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** All audit matrix cells inspected with screenshots listed.
- **AC-2** Zero known keyboard traps, missing names, focus-return failures or horizontal overflow.
- **AC-3** Every text/background pair meets WCAG AA for its size (ratios recorded) or has an owner-approved exception.
- **AC-4** Reduced-motion and theme-flash behavior verified again.
- **AC-5** `pnpm verify` green after fixes.

## 10. Verification
- V-VISUAL
- V-A11Y
- V-STATIC
- V-SCOPE

## 11. Blocked / stop conditions
- A fix requires changing the approved design → stop event with the smallest proposal.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-024: <summary>`.)*
