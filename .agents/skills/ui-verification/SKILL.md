---
name: ui-verification
description: Use to verify any UI work for responsive layout, dark/light themes, keyboard and focus behavior, reduced motion, contrast, modal and chat-widget accessibility, and visual match to design/approved/. Produces evidence for the completion report. Not for database or API testing.
---

# UI verification (responsive + accessibility + fidelity)

## When to use
At the end of every UI task, at Gates G2/G3, in TASK-016, TASK-023 and TASK-024.

## Required inputs
A running dev or production build, the cited PNGs, `DESIGN.md` §4–§10, `PRD.md` NFR-A11Y / NFR-RSP.

## Tools
Use what exists; do not add dependencies without approval. Antigravity's browser/preview agent covers screenshots and interaction. Playwright only if the owner approved it (OD-01). If no browser capability is available, say so and mark the task `PARTIAL` (never claim a visual pass).

## Procedure
1. **Matrix.** Wide desktop (≥ 1440), laptop (≈ 1280), tablet (≈ 768), mobile (≈ 360–390) × dark + light. Add chat closed/open and lightbox open where those exist.
2. **Overflow.** At each width: no horizontal page scroll, no clipped/truncated text (emails, handles, titles), no controls off-screen, nothing hidden under the sticky bar or the chat launcher.
3. **Fidelity.** Compare against the cited PNGs per `DESIGN.md` §14; fill the difference table.
4. **Projects grid.** Verify 3/2/1 columns and the never-stretch last row with 4, 5 and 6 cards.
5. **Keyboard walk.** Tab through the whole page: logical order, visible focus ring on every control, Enter/Space activate, Escape closes menu/chat/lightbox, focus returns to the trigger after the dialog closes, no keyboard trap.
6. **Semantics.** Landmarks, heading order, accessible names on icon-only buttons, dialog role/name, marquee duplicates hidden from assistive tech with one readable list, meaningful alt text (decorative = empty alt).
7. **Reduced motion.** Emulate `prefers-reduced-motion: reduce`: marquee becomes a static grid, entrance/overlay motion removed, carousel still operable.
8. **Theme.** Hard-reload in each theme: no wrong-theme flash; the toggle works; all new states are legible in both.
9. **Contrast.** Measure new foreground/background pairs, including text over images. Minimum WCAG AA for the text size. Record the ratios.
10. **Touch.** Hover is never the only access; tap targets adequate; gallery/carousel does not block vertical scrolling on touch (`pan-y`).
11. **Failure states.** For chat: force the API to return 503/429 and confirm the rest of the page stays usable.

## Outputs
Screenshot list (viewport × theme × state), difference table, a11y checklist (✔/✘), contrast ratios, defects fixed.

## Stop conditions
A defect that needs a design change (report as conflict) · inability to render the page (report `BLOCKED`).
