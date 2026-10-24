# TASK-030 — "Overview" Navigation Link to Page Top (CR-002)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-029 |
| **Owner input needed** | none |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Add "Overview" as the first navigation link targeting `#home` across desktop navbar, mobile hamburger drawer, and footer navigation per Owner Change Request CR-002.

## 2. Source requirements
`PRD.md` FR-NAV-01, FR-FTR-01, CR-002 · `DESIGN.md` §5.1, §5.11

## 3. Required reading
- `PRD.md` §6.2, §15 (CR-002)
- `src/data/site-config.ts`
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`

## 4. In scope
- In `src/data/site-config.ts`, prepend `{ label: "Overview", href: "#home" }` to navigation items.
- Ensure desktop navbar displays "Overview" before "Profile & Journey".
- Ensure mobile navigation drawer displays "Overview" as the first item.
- Ensure footer navigation lists "Overview" before "Profile & Journey".
- Clicking "Overview" scrolls smoothly to page top (`scrollY = 0`), with instant jump when `prefers-reduced-motion` is active.
- Mobile menu closes automatically upon clicking "Overview".
- Brand logo continues to function and scroll to top.

## 5. Out of scope
- Adding skip links or unrequested navigation buttons.

## 6. Files
**Allowed to modify:**
- `src/data/site-config.ts`
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`
- `tests/navigation.test.ts`
- `tests/contact-footer.test.ts`
- `DESIGN.md` §5.1

## 7. Acceptance criteria
- **AC-1** "Overview" appears as the first navigation link in desktop navbar, mobile menu, and footer.
- **AC-2** Clicking "Overview" scrolls to page top (`#home`).
- **AC-3** Mobile menu closes upon selection.
- **AC-4** Desktop navbar layout does not break or overflow at 1024px.
- **AC-5** `pnpm verify` passes.

## 8. Verification
- `pnpm vitest run tests/navigation.test.ts`
- `pnpm vitest run tests/contact-footer.test.ts`
- Click and scroll tests across desktop and mobile drawer.

## 9. Completion Report — TASK-030 — 2026-10-24
**Status:** DONE
**Summary:** Added "Overview" targeting `#home` as the first navigation link across the desktop navbar, mobile drawer, and footer quick links. Clicking "Overview" scrolls smoothly to page top (`#home`), and closes the mobile drawer automatically on mobile viewports.

**Files:**
- `src/data/site-config.ts` (MODIFIED): Prepended `{ label: "Overview", href: "#home" }` to `navItems`.
- `src/components/layout/footer.tsx` (MODIFIED): Prepended `{ href: "#home", label: "Overview" }` to footer `navLinks`.
- `tests/navigation.test.ts` (MODIFIED): Updated test to assert 6 links starting with Overview.
- `tests/contact-footer.test.ts` (MODIFIED): Updated test to assert Overview link in Footer.
- `DESIGN.md` §5.1 (MODIFIED): Updated navigation specification.

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/navigation.test.ts` | PASS | 3/3 passed (Overview confirmed as first link targeting #home) |
| `pnpm vitest run tests/contact-footer.test.ts` | PASS | 8/8 passed (Footer renders Overview link before Profile) |
| Layout check at 1024px | PASS | Desktop navbar links fit cleanly without wrapping |

**Acceptance criteria:**
- AC-1 ✔ — "Overview" is first link in desktop navbar, mobile menu, and footer.
- AC-2 ✔ — Clicking "Overview" targets `#home`.
- AC-3 ✔ — Mobile drawer closes on selection.
- AC-4 ✔ — Desktop navbar does not break at 1024px.
- AC-5 ✔ — `pnpm verify` green.

**Next task:** TASK-031 (CR-003)
