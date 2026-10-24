# TASK-030 — "Overview" Navigation Link to Page Top (CR-002)

| Field | Value |
|---|---|
| **Status** | `TODO` |
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
- `DESIGN.md` §5.1

## 7. Acceptance criteria
- **AC-1** "Overview" appears as the first navigation link in desktop navbar, mobile menu, and footer.
- **AC-2** Clicking "Overview" scrolls to page top (`#home`).
- **AC-3** Mobile menu closes upon selection.
- **AC-4** Desktop navbar layout does not break or overflow at 1024px.
- **AC-5** `pnpm verify` passes.

## 8. Verification
- `pnpm verify`
- Keyboard and click tests across desktop (1024px, 1280px, 1440px) and mobile (375px).

## 9. Completion Report
*(Appended upon completion)*
