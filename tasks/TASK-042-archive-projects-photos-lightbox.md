# TASK-042: Selected Projects Display Photos Intake & Interactive Lightbox Preview (CR-014)

**Status:** DONE  
**Hat:** UI + Content  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Intake the 6 real project display photos provided by the Owner in `dokumen informasi/A. Desain dan aset visual/Foto Project`, copy them with clean kebab-case filenames into `public/assets/projects/`, update `src/data/projects.ts` to reference these real assets as VERIFIED (dated 2026-10-26), and implement an accessible interactive Lightbox modal preview on project cover click (matching the Credentials & Certifications lightbox interaction pattern per `C-03` and `DESIGN.md` §5.8). Ensure keyboard/focus trap, Escape/X closing, trigger focus restoration, separate repository link click targets, and chatbot inert/hidden coordination.

## Allowed Files
- `public/assets/projects/*`
- `src/data/projects.ts`
- `src/components/sections/projects.tsx`
- `src/components/ui/lightbox.tsx`
- `src/components/sections/credentials.tsx`
- `src/lib/i18n/dictionaries.ts`
- `tests/projects.test.ts`
- `tests/content.test.ts`
- `PRD.md`
- `DESIGN.md`
- `TODO.md`
- `tasks/TASK-042-projects-photos-lightbox.md`

## Acceptance Criteria
- AC-1: All 6 project display photos from `Foto Project` are copied to `public/assets/projects/` with clean deterministic names and matched to `src/data/projects.ts`. ✔
- AC-2: `src/data/projects.ts` marks all project cover images as `VERIFIED` with dated comment (`2026-10-26`), removing placeholder SVG covers. ✔
- AC-3: Clicking or pressing Enter/Space on any project display thumbnail opens the accessible Lightbox modal (`role="dialog"`, `aria-modal="true"`) showing the uncropped project display image (`object-contain`). ✔
- AC-4: Keyboard trap (`Tab`/`Shift+Tab`) works inside the modal; pressing `Escape` or clicking `X` closes the modal and returns focus to the exact trigger button without scroll jump. ✔
- AC-5: Project card footer links (`View Repository` / `Private repository`) remain separate and never trigger the lightbox. ✔
- AC-6: Floating chatbot launcher and panel are hidden/inert while the project lightbox is open. ✔
- AC-7: Automated tests verify asset existence, zero 404s, and lightbox interaction/accessibility. ✔

## Completion Report — TASK-042 — 2026-10-26
**Status:** DONE  
**Summary:** Intaked all 6 authentic project display photos from `Foto Project`, stored with clean kebab-case names in `public/assets/projects/`, updated `src/data/projects.ts` with `VERIFIED` status, removed old placeholder SVGs, created reusable `Lightbox` modal primitive (`src/components/ui/lightbox.tsx`) shared across Projects and Credentials, wired accessible thumbnail buttons with hover previews, separate repository links, focus restoration, and verified zero 404s and green tests.

**Files:**
- `public/assets/projects/*` (intake 6 real photos: `network-monitoring-dashboard.png`, `research-news-intelligence-center.png`, `stacklab.jpg`, `sentinel.png`, `enterprise-network-lab-mikrotik.png`, `enterprise-data-center-network-simulation.png`; deleted 6 SVG placeholders)
- `src/data/projects.ts` (modified: referenced verified real asset paths with dated comment)
- `src/components/ui/lightbox.tsx` (created: shared accessible Lightbox modal with focus trap, Escape/X closing, backdrop click, body scroll locking)
- `src/components/sections/projects.tsx` (modified: interactive thumbnail buttons, hover preview indicators, shared Lightbox modal, focus restoration)
- `src/components/sections/credentials.tsx` (modified: refactored to use shared Lightbox component)
- `src/lib/i18n/dictionaries.ts` (modified: added `viewImage`, `closeModal`, `previewAria` localization in EN and ID)
- `tests/projects.test.ts` (modified: verified accessible preview triggers and separate repo links)
- `tests/content.test.ts` (modified: asserted real project display images exist on disk and have non-zero file sizes)
- `PRD.md` (modified: updated FR-PRJ-02, FR-PRJ-05, and §8.2 projects inventory to VERIFIED)
- `DESIGN.md` (modified: updated §5.6 and §5.8 for project cover lightbox)
- `TODO.md` (modified: updated task status to DONE)
- `tasks/TASK-042-projects-photos-lightbox.md` (modified: updated status and completion report)

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/projects.test.ts tests/content.test.ts tests/credentials.test.ts` | PASS | 23 passed across 3 test suites |
| `pnpm typecheck` | PASS | tsc --noEmit exited 0 |
| `pnpm verify` | PASS | 25 test files passed (334 tests passed), Next.js production build succeeded |

**Acceptance criteria:**
- AC-1: ✔ All 6 project display photos copied to `public/assets/projects/` matching project titles.
- AC-2: ✔ `src/data/projects.ts` updated with VERIFIED comment (2026-10-26); SVG placeholders deleted.
- AC-3: ✔ Thumbnail click opens full Lightbox modal (`role="dialog"`, `aria-modal="true"`).
- AC-4: ✔ Tab/Shift+Tab focus trapped inside modal, Escape/X closes and restores trigger focus.
- AC-5: ✔ Repository link is separate `<a>` or non-link div; never triggers lightbox.
- AC-6: ✔ Verified `isLightboxOpen` in `chat-widget.tsx` observes dialog and hides chatbot launcher.
- AC-7: ✔ Automated tests verify file existence, zero 404s, and interactive accessibility.

**Rule & scope check:** Compliant with R-062..R-074, R-080..R-084. Zero unnecessary dependencies.  
**Next task:** TASK-043 (Field Documentation photos, titles & interactive Lightbox preview).
