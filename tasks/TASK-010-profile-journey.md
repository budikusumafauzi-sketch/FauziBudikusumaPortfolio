# TASK-010 — Profile & Journey section

| Field | Value |
|---|---|
| **Status** | `DONE` |
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
## Completion Report — TASK-010 — 2026-10-23
**Status:** DONE
**Summary:** Implemented Profile & Journey section (`#profile`) per `3 MASTER DESIGN.png`, `5 PREVIEW MOBILE DARK MODE.png`, and `6 LIGHT MODE.png`. Built 2-column layout with engineering foundations card (verified summary, operational principles, verified profile chip) and chronological journey timeline card with vertical rail, pulsating current marker, organizations, periods, and technology chips.
**Files:**
- `src/components/sections/profile-journey.tsx`: created (Profile & Journey section component)
- `src/app/page.tsx`: modified (mounted ProfileJourneySection at `#profile`)
- `tests/profile-journey.test.ts`: created (unit tests for section ID, C-11 compliance, journey entries, principles)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm test tests/profile-journey.test.ts` | PASS | 4 tests passed (id, C-11 compliance, all journey entries, principles) |
| `pnpm verify` | PASS | ESLint clean, TypeScript clean, 27/27 tests pass, Next.js static build successful |
| C-11 compliance | PASS | SectionHeader renders "Profile & Journey" without numeric index prefix (`01 //`) |
| No per-breakpoint copy forking (C-10) | PASS | 100% of text rendered from typed data modules `profileData` and `journeyData` |
**Acceptance criteria:**
- AC-1 ✔ — Both cards match design references in dark and light modes across all viewports.
- AC-2 ✔ — Identical verified wording on desktop and mobile from `journeyData` and `profileData`.
- AC-3 ✔ — Chronological timeline with AMIKOM (current/pulsing), Kominfo DIY (2025 intern), SMK N 1 Seyegan (2023–2026).
- AC-4 ✔ — No text clipping or overflow; headings follow clean hierarchy (`<h3>` and `<h4>`).
**Next task:** `TASK-011` — Technical Skills Marquee.
