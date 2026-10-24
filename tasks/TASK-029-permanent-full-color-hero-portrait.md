# TASK-029 — Permanent Full-Color Hero Portrait (CR-001)

| Field | Value |
|---|---|
| **Status** | `DONE` |
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
- Unit tests: `tests/hero.test.ts` asserting absence of grayscale class.
- Visual DOM inspection in dark and light themes across 375px, 768px, 1280px, 1440px.

## 9. Completion Report — TASK-029 — 2026-10-24
**Status:** DONE
**Summary:** Hero portrait is now permanently rendered in natural full RGB color immediately upon page load without any hover dependency. Removed `filter grayscale contrast-105 hover:grayscale-0` from `src/components/sections/hero.tsx`. Preserved technical corner framing, crimson accents, outer glow, aspect ratio `4:5`, and `priority` loading.

**Files:**
- `src/components/sections/hero.tsx` (MODIFIED): Removed grayscale classes; portrait renders full color permanently.
- `tests/hero.test.ts` (MODIFIED): Added unit test assertion that rendered portrait does not contain grayscale.
- `DESIGN.md` §5.3 (MODIFIED): Recorded CR-001 permanent full color portrait specification.

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/hero.test.ts` | PASS | 4/4 tests passed (portrait verified with full color, no grayscale) |
| DOM class inspection | PASS | `className="object-cover object-top transition-transform duration-500"` |
| Responsive inspection (375px, 768px, 1440px) | PASS | Full color visible across touch and desktop widths without hover |

**Acceptance criteria:**
- AC-1 ✔ — Hero portrait renders in natural full color on initial load.
- AC-2 ✔ — Full color persistent across dark and light themes.
- AC-3 ✔ — Works on touch screens with zero hover dependency.
- AC-4 ✔ — Aspect ratio (4:5), outer glow, and crimson corners preserved.
- AC-5 ✔ — `pnpm verify` green.

**Next task:** TASK-030 (CR-002)
