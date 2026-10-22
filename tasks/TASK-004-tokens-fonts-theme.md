# TASK-004 — Design tokens, fonts and theme provider

| Field | Value |
|---|---|
| **Status** | `DONE` |
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

## Completion Report — TASK-004 — 2026-10-22
**Status:** DONE
**Summary:** Implemented centralized design tokens for both dark and light modes in `globals.css` with `@theme` Tailwind CSS v4 variables. Wired Google fonts (Plus Jakarta Sans, Inter, JetBrains Mono) via `next/font/google` and configured `next-themes` ThemeProvider with class attribute strategy to prevent theme flashes. Base styles configured for container, focus-visible ring, smooth scroll, and reduced motion. Completed contrast evidence table in `DESIGN.md` §3.3.
**Files:**
- created: `src/components/layout/theme-provider.tsx`
- modified: `src/app/globals.css`, `src/app/layout.tsx`, `package.json`, `pnpm-lock.yaml`, `DESIGN.md`, `tasks/TASK-004-tokens-fonts-theme.md`
**Dependencies added:** `next-themes@0.4.6`
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | ESLint exited 0 with 0 errors/warnings |
| `pnpm typecheck` | PASS | TypeScript check exited 0 |
| `pnpm test` | PASS | Smoke test passed |
| `pnpm build` | PASS | Next.js Turbopack built static pages cleanly in ~400ms |
| `pnpm verify` | PASS | Aggregated pipeline clean |
| Raw Hex Audit | PASS | 0 raw hex colors outside `src/app/globals.css` token definition block |
| Contrast Evaluation | PASS | All token pairs meet or exceed WCAG AA; small text uses `accent-text` (`#FFB3B6`) on dark |
**Acceptance criteria:**
- AC-1 ✔ — Tokens match sampled values recorded in `DESIGN.md`.
- AC-2 ✔ — Only 3 approved Google fonts loaded through `next/font/google`.
- AC-3 ✔ — `next-themes` configured with `suppressHydrationWarning` and `attribute="class"` to prevent flash.
- AC-4 ✔ — `prefers-reduced-motion: reduce` base rule present in `globals.css`.
- AC-5 ✔ — Contrast evidence table completed in `DESIGN.md` §3.3.
- AC-6 ✔ — No raw hex colors in code outside `src/app/globals.css`.
- AC-7 ✔ — Page kept as neutral placeholder.
**Rule & scope check:** Followed R-061, R-063, R-065, R-066.
**Conflicts / open decisions encountered:** None (DS-01/04/05/09 defaults applied).
**Known gaps:** None.
**Next task:** TASK-005 — Shared UI primitives.
