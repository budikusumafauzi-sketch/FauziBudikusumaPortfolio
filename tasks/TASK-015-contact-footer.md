# TASK-015 — Direct Channels, footer and Back to Top

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-008; decisions OD-11, DS-03 |
| **Owner input needed** | Approval per contact channel (OD-11); full verified URLs |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the four contact cards, the footer and the Back to Top control with no truncated text.

## 2. Source requirements
`PRD.md` FR-CNT-01…03, FR-FTR-01 · `DESIGN.md` §5.10, §5.11 · OD-11, DS-03

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.10, §14.1 (OD-11)
- `DESIGN.md` §5.10, §5.11
- PNGs `3`, `5`, `6`, `7`

## 4. Preconditions
- TASK-008 done. OD-11 recorded (which channels are approved).

## 5. In scope
- Desktop: 4 cards in a row; mobile: 2×2 with sub-links, per the references. Each card: icon, mono label, value, arrow. Only approved channels with verified full URLs.
- Values wrap/shrink instead of truncating (the light export clips them).
- Links open safely (`rel="noopener noreferrer"`); `mailto:` only if approved.
- Footer: name, location chip (verified), tagline, mono copyright; **Back to Top** as an anchor to `#home` that never overlaps the chat launcher (DS-03).

## 6. Out of scope — do NOT do
- Contact form, email backend, additional channels, analytics.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/contact.tsx`, `src/components/layout/footer.tsx`
- `src/app/page.tsx`

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Build cards and footer; test the longest realistic values at 320–1440 px.
2. Verify focus order and external-link attributes.
3. Compare to PNGs; run `ui-verification`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** No text truncation or clipping at any required width, both themes.
- **AC-2** Only approved channels with verified URLs are rendered; none inferred.
- **AC-3** External links carry `rel="noopener noreferrer"`; keyboard focus visible.
- **AC-4** Footer matches the references; Back to Top works without JavaScript and does not collide with the chat launcher area.
- **AC-5** Mobile 2×2 layout matches `5`/`7`.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-LINKS
- V-SCOPE

## 11. Blocked / stop conditions
- Contacts not approved/verified → BLOCKED for final values; layout proceeds with fixtures.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-015: <summary>`.)*
