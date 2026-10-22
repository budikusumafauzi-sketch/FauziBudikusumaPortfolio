---
name: design-implementation
description: Use when building or changing any visible UI component or section so it matches the approved Stitch exports in design/approved/. Covers reading the right PNG, sampling exact values, building from tokens, and classifying every difference. Do not use for backend, database or chatbot logic.
---

# Design implementation against approved references

**Environment note (ASSUMPTION):** the workspace skill location for Antigravity is `.agents/skills/` (legacy `.agent/skills/` is also supported). If this skill does not auto-load, open and follow it manually.

## When to use
Any task that creates or edits a component, section, layout, style, animation or visual state.

## Required inputs
The task file, `DESIGN.md` (relevant section), `PRD.md` decisions C-xx/OD-xx that touch the component, and the PNG(s) named in `DESIGN.md` §1.

## Procedure
1. **Check decisions first.** Look up every C-xx / DS-xx that affects the component in `PRD.md` §13/§15 and `DESIGN.md` §13. If a needed decision is undecided, leave that component out, mark that part of the task `BLOCKED`, and continue with other work.
2. **Open the PNG at full size** (crop long exports into regions with a script if needed). Write a short list of what must match: order, alignment, spacing rhythm, type hierarchy, card anatomy, aspect ratios, colors, states.
3. **Separate observation from interpretation.** Anything not visible in the PNG (hover, motion, mobile menu) is RECOMMENDED/derived; label it so in the report.
4. **Sample, don't guess.** Take colors from pixels (a small Python/Pillow script is fine), sizes by comparing against known elements. Never invent hex codes, breakpoints or a type scale from memory. Record results in tokens, not in components.
5. **Build from tokens.** Use the centralized tokens in `globals.css`; no raw hex/px scattered in components (R-063). Implement both themes at the same time.
6. **Implement states** per `DESIGN.md` §6 (default, hover, focus-visible, active, disabled/loading/error) and reduced motion per §7.
7. **Use real assets only.** If the real logo/photo/thumbnail/certificate is missing, use the sanctioned development placeholder and record the dependency; never crop the PNG into an asset (R-062).
8. **Never copy the known defects** listed in `DESIGN.md` §12.
9. **Compare** using the `ui-verification` skill (screenshots vs PNG). Classify each difference: *fixed*, *intentional (cite C-xx/OD-xx)*, or *open*. Unexplained differences block completion.

## Outputs
Component code using tokens; updated token table if values were measured; comparison table in the completion report.

## Checks
No scattered raw colors · both themes correct · all states present · no layout shift (dimensions reserved) · no content invented · difference table complete.

## Stop conditions
Undecided design conflict that changes the component · missing required asset (that part is BLOCKED) · the reference cannot be read at sufficient scale (state the limitation; do not fabricate measurements).
