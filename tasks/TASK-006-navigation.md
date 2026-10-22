# TASK-006 — Navigation: sticky bar, mobile menu, theme toggle

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 2 — Design system and shared UI |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-005; decisions C-01, C-02, DS-02, DS-06 |
| **Owner input needed** | Decisions C-01, C-02 (defaults apply if "Approve all RECOMMENDED"); logo asset for the monogram (optional) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Implement the sticky navigation exactly as approved (after C-01/C-02): wordmark, section links, theme toggle, mobile hamburger menu with full keyboard behavior.

## 2. Source requirements
`PRD.md` FR-NAV-01…06, FR-THM-01/03 · `DESIGN.md` §5.1 · decisions C-01, C-02

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.2, §13 (C-01, C-02)
- `DESIGN.md` §5.1, §6, §11
- PNGs `3`, `5`, `6`, `7`

## 4. Preconditions
- TASK-005 done.
- C-01 and C-02 recorded; if undecided, implement **nothing that depends on them** and mark BLOCKED.

## 5. In scope
- Navbar: monogram + wordmark + "PORTFOLIO" mono sub-label; links per the C-02 decision (recommended: Profile & Journey, Projects, Credentials, Documentation, Contact); anchor ids `home, profile, skills, projects, credentials, documentation, contact`.
- Theme toggle with accessible name and current state; `next-themes` connection.
- Mobile hamburger menu (not depicted in the PNGs → derive from tokens, flag DS-06): Escape closes, selecting a link closes, focus returns to the trigger, accessible labels, adequate targets.
- Anchor scroll offset equals the navbar height (never hide a heading).
- Create `src/data/site-config.ts` with navigation entries only (TASK-008 extends it).
- If C-01 is approved as recommended: **no ID/EN switch**.

## 6. Out of scope — do NOT do
- Language switching, search, extra links, CV button in the nav (CV stays in Hero per C-02).
- Section content.

## 7. Files
**Allowed to create / modify**
- `src/components/layout/navbar.tsx`, `theme-toggle.tsx`
- `src/app/layout.tsx`, `src/app/globals.css` (small additions)
- `src/data/site-config.ts`
- `src/app/page.tsx` — empty anchored section stubs **only if** needed to test anchors (reverted or replaced in TASK-009+)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Re-read the decisions and the PNGs; list differences you must reproduce.
2. Build desktop bar, then mobile menu.
3. Test anchor offsets with stub sections.
4. Keyboard walk (Tab, Enter, Escape) and focus-return test.
5. Screenshot comparison at the required widths in both themes.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Desktop and mobile navbars match the approved references (after C-01/C-02), both themes.
- **AC-2** Theme toggle works, persists, has an accessible name/state.
- **AC-3** Mobile menu: opens/closes by button, Escape and link selection; focus returns; no keyboard trap.
- **AC-4** Anchors land with the heading fully visible below the bar.
- **AC-5** No language selector exists if C-01 is approved as recommended.
- **AC-6** Targets ≥ 44 px on mobile (RECOMMENDED) and focus rings are visible.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-SCOPE

## 11. Blocked / stop conditions
- C-01/C-02 undecided → BLOCKED for the affected parts.
- Mobile menu design needs owner input → implement the derived version and list it for Gate G3.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-006: <summary>`.)*
