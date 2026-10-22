# TASK-007 — Opening overlay

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 2 — Design system and shared UI |
| **Hat** | UI |
| **Priority** | P1 |
| **Depends on** | TASK-004, TASK-005; decisions C-05, C-11, DS-07 |
| **Owner input needed** | Real logo file `public/assets/brand/logo-monogram.svg` (until supplied: development placeholder only, task part BLOCKED); decision C-05 headline wording |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Implement the opening overlay from `1 OPENING.png`, with a **fail-safe** so it can never leave a blank or locked screen, and with reduced-motion handling.

## 2. Source requirements
`PRD.md` FR-OPN-01…05 · `DESIGN.md` §5.2, §7 · C-05, C-11 · `RULES.md` R-065

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.3
- `DESIGN.md` §5.2, §7
- PNG `1 OPENING.png` (full size)

## 4. Preconditions
- TASK-005 done. C-05 recorded (headline wording shown in the subtitle).

## 5. In scope
- Layout per the reference: emblem in a square frame with four corner markers (two crimson, two gray), name, mono subtitle, short progress bar, status line "LAUNCHING WORKSPACE…", bottom-left chip, bottom-right copyright. Omit unreadable corner text (C-11).
- Behavior: shown once per browser session (RECOMMENDED; confirm at G3), dismisses itself after the progress completes (short, RECOMMENDED ≈ 1–2 s) with a **hard maximum** (e.g. 4 s) after which it is gone regardless of state.
- **Fail-safe by construction:** a CSS-only auto-hide animation (with `pointer-events: none` at the end) so the overlay disappears even if JavaScript never runs; JS may dismiss earlier. No scroll lock after dismissal; no focus trap; it must not delay essential content.
- Reduced motion: no movement, minimal fade only.
- Use the real logo asset. Until supplied, use a clearly marked development placeholder and mark the part BLOCKED; never trace the PNG.

## 6. Out of scope — do NOT do
- Sound, extra animation, preloaders for content, any analytics.

## 7. Files
**Allowed to create / modify**
- `src/components/layout/opening-overlay.tsx`
- `src/app/layout.tsx`, `src/app/globals.css` (keyframes via tokens)
- `public/assets/brand/logo-monogram.svg` (owner-supplied file only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Build the static layout; compare to `1`.
2. Add the CSS-only timeline and the optional JS early-dismiss.
3. Test fail-safes: disable JS; throttle/block the logo and fonts; force a runtime error in the component — the screen must clear within the hard maximum.
4. Test reduced motion; test mobile fit (derived — flag).

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** At ≈ 1280×1024 the overlay matches `1 OPENING.png` (after C-05/C-11).
- **AC-2** With JavaScript disabled, the overlay disappears on its own within the hard maximum.
- **AC-3** With the logo/fonts blocked, the page is never blank or locked.
- **AC-4** Reduced motion removes nonessential movement.
- **AC-5** After dismissal: scrolling works, nothing is trapped, focus order starts at the page.
- **AC-6** The logo is a real approved asset (or the part is recorded as BLOCKED).

## 10. Verification
- V-STATIC
- V-VISUAL (desktop vs `1`; mobile derived)
- V-A11Y (reduced motion, focus)
- Fail-safe tests listed above with evidence

## 11. Blocked / stop conditions
- Logo missing → BLOCKED for the emblem; continue with the rest.
- C-05 undecided → use the owner-provided text only once decided.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-007: <summary>`.)*
