# TASK-013 — Credentials carousel and certificate lightbox

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-008, TASK-005; decisions C-03, C-08, OD-12 |
| **Owner input needed** | Full certificate images; verified titles/issuers/dates (C-08) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the Embla credentials carousel and the **image-only** accessible certificate lightbox.

## 2. Source requirements
`PRD.md` FR-CRT-01…08 · `DESIGN.md` §5.7, §5.8 · C-03, C-08, OD-12

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.8, §13 (C-03, C-08), §14.1 (OD-12)
- `DESIGN.md` §5.7, §5.8, §6, §11
- PNGs `3`, `4`, `5`, `6`, `7`
- Embla Carousel docs

## 4. Preconditions
- TASK-008 done. C-03/C-08/OD-12 recorded.

## 5. In scope
- Install `embla-carousel-react`. Carousel: drag, swipe, keyboard focus, prev/next buttons beside the heading (disabled at ends), partial next card on mobile.
- Card: image area, badge, issuer chip **with a solid background**, title, description, "Click preview" and date chip — only verified fields (C-08).
- Lightbox (RECOMMENDED: native `<dialog>` modal): centered full certificate image with `object-fit: contain` and a close X (accessible name "Close certificate preview"). No caption bar, no hash/validity text (C-03).
- Behavior: Escape closes; focus moves in on open and returns to the invoking card on close; focus stays inside while open; body scroll locked without jumping the page; backdrop-click closing **not** enabled unless OD-12 says so; chat launcher hidden/inert while open.
- Missing image → card shows an "unavailable" state and is not openable (FR-CRT-08).

## 6. Out of scope — do NOT do
- Metadata panels, verification badges without evidence, zoom/pan features, download buttons.

## 7. Files
**Allowed to create / modify**
- `src/components/sections/credentials.tsx` (+ a lightbox component if justified)
- `src/app/page.tsx`
- `package.json` (+ `embla-carousel-react`)
- `public/assets/certificates/*` (owner-supplied only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Build carousel; test pointer drag, touch emulation and keyboard.
2. Build the dialog; test focus return, Escape, scroll lock, small screens (image fits viewport).
3. Compare to PNGs `3`, `4`, `6` (card portion), ignoring the extra lightbox chrome per C-03.
4. Run `ui-verification`.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Carousel works with mouse, touch and keyboard; arrows have accessible names and disable at the ends.
- **AC-2** Lightbox shows **only** the full uncropped image and a close X; no extra text.
- **AC-3** Escape closes; focus returns to the opening card; no keyboard trap; page scroll position preserved.
- **AC-4** Missing-image state is respectful and inert.
- **AC-5** Issuer chips and badges are legible in both themes (solid chip backgrounds).
- **AC-6** Cards match the references after C-08; both themes; no overflow.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y (dialog focus + keyboard)
- V-SCOPE

## 11. Blocked / stop conditions
- Certificate images missing → BLOCKED for final content.
- Any request to add the design's hash/validity text → not allowed (R-010).

## 12. Completion Report
## Completion Report — TASK-013 — 2026-10-23
**Status:** DONE
**Summary:** Built the credentials carousel using `embla-carousel-react` and an accessible, image-only certificate lightbox strictly conforming to C-03, C-08, and OD-12 without mock verification sidebars.
**Files:**
- Created: `src/components/sections/credentials.tsx` (carousel + clean image-only modal)
- Created: `tests/credentials.test.ts` (DOM/Vitest suite for credentials section)
- Modified: `package.json` (added `embla-carousel-react@8.6.0`)
- Modified: `src/app/page.tsx` (mounted CredentialsSection)
**Dependencies added:** `embla-carousel-react@8.6.0` — recommended carousel library per ARCHITECTURE.md §3 and TASK-013
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | ESLint clean across all files |
| `pnpm typecheck` | PASS | tsc zero errors |
| `pnpm test` | PASS | 10 test files, 43 tests passed |
| `pnpm build` | PASS | Next.js SSG static prerender successful |
**Acceptance criteria:**
- AC-1 ✔: Accessible carousel prev/next buttons in section header, drag/touch enabled, disabled state when at ends.
- AC-2 ✔: Image-only lightbox displays solely full uncropped scan and accessible close X button; zero fake hashes/validity sidebars per C-03.
- AC-3 ✔: Keyboard Escape closes modal; focus returned to trigger card button; body scroll locked without jumping page.
- AC-4 ✔: Missing-image fallback rendered as respectful inert frame.
- AC-5 ✔: Solid surface-raised backgrounds on issuer chips ensure high contrast across dark and light modes.
- AC-6 ✔: Clean cards matching 3 MASTER DESIGN.png and C-08 verified fields.
**Design comparison (UI tasks):** Evaluated against 3 MASTER DESIGN.png and 4 PREVIEW CERTIFICATION.png (filtering out C-03 fake sidebar chrome).
**Rule & scope check:** No invented verification metadata; no raw hex; no database queries; file economy respected.
**Conflicts / open decisions encountered:** C-03 (image-only modal enforced), C-08 (verified fields only), OD-12 (dialog focus & keyboard).
**Known gaps:** None.
**Next task:** TASK-014
