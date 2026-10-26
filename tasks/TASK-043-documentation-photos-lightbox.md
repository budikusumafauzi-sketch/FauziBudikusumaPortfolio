# TASK-043: Field Documentation Photos, Titles & Interactive Lightbox Preview (CR-015)

**Status:** TODO  
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
