# TASK-004 — Design tokens, fonts and theme provider

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 2 — Design system and shared UI |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-003; decisions DS-01/04/05/09, OD-10 |
| **Owner input needed** | Decisions on DS-04, DS-05, DS-09 (defaults apply if "Approve all RECOMMENDED") |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Implement the centralized design tokens for **both themes** from the measured values, load the three approved fonts, wire `next-themes` without a wrong-theme flash, and add base styles (container, focus ring, reduced-motion base rule).

## 2. Source requirements
`PRD.md` FR-THM-01…03, NFR-PERF-02, NFR-A11Y-01 · `DESIGN.md` §3, §4, §7, §8 · `RULES.md` R-061, R-063, R-065, R-066

## 3. Required reading (only these, only the relevant sections)
- `DESIGN.md` §3–§4, §7–§8, §13
- `ARCHITECTURE.md` §3, §5
- PNGs `3`, `6`, `5`, `7` (full size)
- Current `next-themes`, `next/font` and Tailwind docs

## 4. Preconditions
- TASK-003 done.
- OD-10 and the DS items above resolved or defaulted per the decision log.

## 5. In scope
- Define semantic color tokens (dark + light) using the sampled values in `DESIGN.md` §3.1–§3.2, and re-sample from the PNGs to confirm each token; fix any wrong value in `DESIGN.md` (OBSERVED).
- Measure from the PNGs and record as tokens: type scale (hero name, section titles, card titles, body, mono labels), letter-spacing roles, container width, gutter, section gap, radii, border widths, shadow/glow. Mark anything not measurable as OPEN.
- Load Plus Jakarta Sans, Inter, JetBrains Mono through `next/font` with only used weights; expose as CSS variables.
- Install and configure `next-themes` (attribute strategy that avoids a flash; default per DS-09).
- Base styles: container, `:focus-visible` ring, reduced-motion base rule, smooth anchor scroll with scroll-margin token.
- Validate breakpoints against the references (OD-10) and record the result.
- Complete the contrast table in `DESIGN.md` §3.3 for every text/background token pair in both themes.

## 6. Out of scope — do NOT do
- Components, sections, content, nav, overlay.
- New colors or fonts not in the references.
- Hard-coding any value outside the token file.

## 7. Files
**Allowed to create / modify**
- `src/app/globals.css`, `src/app/layout.tsx`
- `src/components/layout/theme-provider.tsx`
- `package.json` (+ `next-themes`)
- `DESIGN.md` (record measured tokens/DS resolutions only)
- `src/app/page.tsx` for a **temporary** token preview (must be reverted before DONE)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Write a small throwaway script to sample the PNG pixels again and confirm the tokens.
2. Create tokens with semantic names; map both themes.
3. Wire fonts and theme provider; add `suppressHydrationWarning` only as the library docs require.
4. Create a temporary preview of tokens/typography; compare to the PNGs in both themes; revert the preview.
5. Record measurements and the contrast table in `DESIGN.md`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Every token in both themes equals the sampled/measured value recorded in `DESIGN.md`; no unexplained value.
- **AC-2** Only the three approved fonts (used weights only) load; no duplicate font requests in the network panel.
- **AC-3** Hard reload in dark and in light shows **no wrong-theme flash**; the preference persists.
- **AC-4** `prefers-reduced-motion` base rule exists and is demonstrated under emulation.
- **AC-5** Contrast table is complete; any pair below WCAG AA for its size is flagged and resolved (e.g. `#E11D48` text on dark is not used for small text).
- **AC-6** Grep finds no raw hex colors outside the token file.
- **AC-7** The temporary preview is removed; the page is the neutral placeholder again.

## 10. Verification
- V-STATIC
- V-VISUAL (token preview vs PNGs, both themes, then revert)
- V-A11Y (contrast, focus ring, reduced motion)
- V-SCOPE

## 11. Blocked / stop conditions
- Measurements impossible at the available resolution → mark OPEN, propose a conservative value, report.
- Wrong-theme flash cannot be eliminated with the documented setup after 3 attempts → `BLOCKED` with findings.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-004: <summary>`.)*
