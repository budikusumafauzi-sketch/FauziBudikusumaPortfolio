# TASK-043: Field Documentation Photos, Titles & Interactive Lightbox Preview (CR-015)

**Status:** DONE  
**Hat:** UI + Content + Database  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Intake the 6 real field documentation photos provided by the Owner in `dokumen informasi/A. Desain dan aset visual/Dokumentasi`, copy them with clean kebab-case filenames into `public/assets/gallery/`, update `src/data/gallery.ts` (and localized dictionaries) with real titles and captions cleanly derived from the Owner's filenames, mark items as `VERIFIED` and `approvedForPublic: true` (dated 2026-10-26), and implement an accessible interactive Lightbox modal preview when clicking/tapping a photo card. Implement a critical drag-vs-click guard (movement delta > 6px treated as carousel scroll, <= 6px treated as click to open lightbox). Ensure full keyboard/focus management and chatbot coordination.

## Allowed Files
- `public/assets/gallery/*`
- `src/data/gallery.ts`
- `src/components/sections/documentation.tsx`
- `src/components/ui/lightbox.tsx` (or shared lightbox component)
- `src/lib/i18n/dictionaries.ts`
- `src/data/chatbot-knowledge.ts`
- `tests/documentation.test.ts`
- `tests/content.test.ts`
- `PRD.md`
- `DESIGN.md`
- `TODO.md`
- `tasks/TASK-043-documentation-photos-lightbox.md`

## Acceptance Criteria
- AC-1: All 6 real documentation photos from `Dokumentasi` are copied to `public/assets/gallery/` with clean names; obsolete SVG placeholders are cleaned up per R-070.
- AC-2: `src/data/gallery.ts` and dictionary entries contain real titles/captions derived faithfully from the Owner's filenames and marked `VERIFIED` (dated 2026-10-26).
- AC-3: Clicking or pressing Enter/Space on any photo card opens the shared Lightbox modal (`role="dialog"`, `aria-modal="true"`) showing the full uncropped photo (`object-contain`).
- AC-4: Drag-vs-click guard prevents lightbox opening when the user drags/swipes horizontally across the carousel (> 6px delta).
- AC-5: Focus management traps Tab inside modal; `Escape` / `X` closes modal and restores focus to triggering card button.
- AC-6: Floating chatbot is hidden/inert while the gallery lightbox is open.
- AC-7: Automated tests verify zero 404s, real metadata, drag-vs-click logic, and lightbox accessibility.

---

## Completion Report — TASK-043 — 2026-10-26
**Status:** DONE
**Summary:** Integrated all 6 authentic field documentation photos from Owner folder `Dokumentasi` into `public/assets/gallery/`, replaced placeholder SVGs, updated `src/data/gallery.ts` with faithful titles/captions marked `VERIFIED`, and wired the shared interactive accessible Lightbox modal with a robust 6px drag-vs-click carousel guard.
**Files:**
- `public/assets/gallery/gdg-jogja-gen-ai-app.jpeg` (created, owner field photo)
- `public/assets/gallery/magang-kominfo-diy.jpeg` (created, owner field photo)
- `public/assets/gallery/magang-monitoring-jaringan.jpeg` (created, owner field photo)
- `public/assets/gallery/maintenance-server.png` (created, owner field photo)
- `public/assets/gallery/policy-brief-organisasi-kab-sleman.jpeg` (created, owner field photo)
- `public/assets/gallery/survey-gedung-agung.jpg` (created, owner field photo)
- `public/assets/gallery/placeholder-gallery-1.svg..6.svg` (deleted, replaced per R-070)
- `src/data/gallery.ts` (modified: real items, `VERIFIED` status dated 2026-10-26)
- `src/components/sections/documentation.tsx` (modified: interactive card button, drag vs click guard, focus restoration, shared Lightbox modal)
- `src/lib/i18n/dictionaries.ts` (modified: localized gallery titles & captions, lightbox aria labels)
- `tests/documentation.test.ts` (modified: comprehensive tests for real photos, drag-vs-click guard, keyboard navigation)
- `tests/content.test.ts` (modified: verified gallery data integrity and asset existence)
- `tests/chatbot-knowledge.test.ts` (modified: updated record counts and DRAFT exclusion testing)
- `PRD.md` (modified: FR-DOC-01..04, §8.2 gallery inventory)
- `DESIGN.md` (modified: §5.9 field documentation lightbox specifications)
- `TODO.md` (modified: status updated)
- `tasks/TASK-043-documentation-photos-lightbox.md` (modified: completion report)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/documentation.test.ts` | Pass | 6/6 tests passed (keyboard, drag guard, modal attributes) |
| `pnpm vitest run tests/content.test.ts` | Pass | 10/10 tests passed (all 6 image paths exist on disk) |
| `pnpm vitest run tests/chatbot-knowledge.test.ts` | Pass | 8/8 tests passed (33 verified records deterministic) |
| `pnpm vitest run --exclude tests/live-smoke.test.ts` | Pass | 24/24 test suites passed, 334 tests passed |
| `pnpm build` | Pass | Compiled and static pages generated in 1.5s with zero errors |
**Acceptance criteria:**
- AC-1: ✔ All 6 photos copied to `public/assets/gallery/` with clean kebab-case names, obsolete SVGs removed.
- AC-2: ✔ `src/data/gallery.ts` and `dictionaries.ts` updated with faithful titles/captions and marked `VERIFIED`.
- AC-3: ✔ Lightbox opens on click/Enter/Space with `role="dialog"`, `aria-modal="true"`, `object-contain`.
- AC-4: ✔ Pointer down/up delta > 6px suppresses modal activation, ensuring smooth carousel swiping without unintended opens.
- AC-5: ✔ Focus trap, Escape/X closing, and focus restoration to card trigger verified.
- AC-6: ✔ DOM observer in chat-widget automatically hides chatbot when `[role="dialog"][aria-modal="true"]` is active.
- AC-7: ✔ Automated tests verify all behavior, 0 broken paths, 100% green.
**Design comparison (UI tasks):** Full uncropped photos rendered inside viewport-constrained responsive frame with clean backdrop blur and accessible close button.
**Rule & scope check:** Followed R-070 (file economy), R-085 (factual claims only from filenames), zero scope inflation.
**Conflicts / open decisions encountered:** None.
**Known gaps:** None.
**Next task:** TASK-039 (Chatbot tail-latency & 30-min idle-failure elimination via Hedged Requests, SWR Cache & Build-Time Snapshot).
