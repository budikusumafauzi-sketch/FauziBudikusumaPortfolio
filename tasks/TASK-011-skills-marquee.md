# TASK-011 — Skills marquee

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P1 |
| **Depends on** | TASK-008; decision C-04 |
| **Owner input needed** | Icon→skill mapping and confirmed skill list (C-04) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the seamless, accessible skills marquee with a reduced-motion static fallback.

## 2. Source requirements
`PRD.md` FR-SKL-01…05 · `DESIGN.md` §5.5, §7 · C-04

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.6, §13 (C-04)
- `DESIGN.md` §5.5, §7
- PNGs `3`, `5`

## 4. Preconditions
- TASK-008 done. C-04 recorded; owner skill list provided (else DRAFT fixtures, task part BLOCKED).

## 5. In scope
- Uniform square bordered tiles with icons (Lucide for generic glyphs; owner assets from `public/assets/skills/` for logos).
- CSS-only seamless loop with a duplicated track (`aria-hidden` on the duplicate); pause/slow on hover **and** focus.
- One visually hidden list of skill names for assistive technology (or visible labels if the owner chose so in C-04).
- `prefers-reduced-motion: reduce` → static wrapping grid (no movement).
- Edge fade/clip as in the reference.

## 6. Out of scope — do NOT do
- Percentages, bars, stars, filters, skill detail panels.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/skills.tsx`
- `src/app/globals.css` (keyframes via tokens)
- `src/app/page.tsx`
- `public/assets/skills/*` (owner-supplied only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Compute track width from the item count so the loop is seamless at wide screens.
2. Implement pause behavior and reduced-motion grid.
3. Verify no duplicate screen-reader output.
4. Run `ui-verification`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** The loop is seamless (no jump/gap) at desktop and mobile widths.
- **AC-2** Hover/focus slows or pauses smoothly; behavior is available without hover.
- **AC-3** Reduced motion shows a static, wrapping grid.
- **AC-4** Assistive technology exposes one list of skills (no duplicates).
- **AC-5** Only owner-confirmed skills are shown (or the part is BLOCKED).
- **AC-6** Matches `3`/`5` in both themes.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y (reduced motion + SR semantics)
- V-SCOPE

## 11. Blocked / stop conditions
- Skills list/mapping missing → BLOCKED for final content; layout work may proceed with DRAFT fixtures.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-011: <summary>`.)*
