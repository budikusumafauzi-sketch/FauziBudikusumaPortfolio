# TASK-029 — Permanent Full-Color Hero Portrait (CR-001)

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-024 |
| **Owner input needed** | none |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Ensure the Hero section portrait renders permanently in full natural color by default, removing any grayscale filter or hover dependency per Owner Change Request CR-001.

## 2. Source requirements
`PRD.md` FR-HRO-01, CR-001 · `DESIGN.md` §5.3

## 3. Required reading
- `PRD.md` §6.4, §15 (CR-001)
- `DESIGN.md` §5.3
- `src/components/sections/hero.tsx`

## 4. In scope
- Inspect `src/components/sections/hero.tsx` and verify portrait image rendering.
- Remove any `grayscale`, `filter`, or `group-hover:grayscale-0` classes from the portrait image.
- Preserve portrait framing: `CornerFrame` crimson corners, technical border, aspect ratio `4:5`, `priority` loading.
- Verify portrait displays in full color across dark and light themes, and across all viewports without touch/hover dependency.

## 5. Out of scope
- Changing other sections' hover treatments.
- Changing portrait geometry or layout frame.

## 6. Files
**Allowed to modify:**
- `src/components/sections/hero.tsx`
- `src/app/globals.css` (if portrait classes reside there)
- `tests/hero.test.ts`
- `DESIGN.md` §5.3

## 7. Acceptance criteria
- **AC-1** Hero portrait renders in natural full color immediately on page load with zero hover action needed.
- **AC-2** Full color is persistent across both dark and light themes.
- **AC-3** Full color works on touch devices (mobile/tablet) without hover simulation.
- **AC-4** Aspect ratio, outer glow, crimson corners, and zero CLS are maintained.
- **AC-5** `pnpm verify` passes.

## 8. Verification
- `pnpm verify`
- Visual DOM inspection in dark and light themes across 375px, 768px, 1280px, 1440px.

## 9. Completion Report
*(Appended upon completion)*
