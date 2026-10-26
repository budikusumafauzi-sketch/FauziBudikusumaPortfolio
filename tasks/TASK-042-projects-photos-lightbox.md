# TASK-042: Selected Projects Display Photos Intake & Interactive Lightbox Preview (CR-014)

**Status:** TODO  
**Hat:** UI + Content  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Intake the 6 real project display photos provided by the Owner in `dokumen informasi/A. Desain dan aset visual/Foto Project`, copy them with clean kebab-case filenames into `public/assets/projects/`, update `src/data/projects.ts` to reference these real assets as VERIFIED (dated 2026-10-26), and implement an accessible interactive Lightbox modal preview on project cover click (matching the Credentials & Certifications lightbox interaction pattern per `C-03` and `DESIGN.md` §5.8). Ensure keyboard/focus trap, Escape/X closing, trigger focus restoration, separate repository link click targets, and chatbot inert/hidden coordination.

## Allowed Files
- `public/assets/projects/*`
- `src/data/projects.ts`
- `src/components/sections/projects.tsx`
- `src/components/ui/lightbox.tsx` (or shared lightbox component)
- `src/components/sections/credentials.tsx` (if extracting shared lightbox)
- `src/lib/i18n/dictionaries.ts`
- `tests/projects.test.ts`
- `tests/content.test.ts`
- `PRD.md`
- `DESIGN.md`
- `TODO.md`
- `tasks/TASK-042-projects-photos-lightbox.md`

## Acceptance Criteria
- AC-1: All 6 project display photos from `Foto Project` are copied to `public/assets/projects/` with clean deterministic names and matched to `src/data/projects.ts`.
- AC-2: `src/data/projects.ts` marks all project cover images as `VERIFIED` with dated comment (`2026-10-26`), removing placeholder SVG covers.
- AC-3: Clicking or pressing Enter/Space on any project display thumbnail opens the accessible Lightbox modal (`role="dialog"`, `aria-modal="true"`) showing the uncropped project display image (`object-contain`).
- AC-4: Keyboard trap (`Tab`/`Shift+Tab`) works inside the modal; pressing `Escape` or clicking `X` closes the modal and returns focus to the exact trigger button without scroll jump.
- AC-5: Project card footer links (`View Repository` / `Private repository`) remain separate and never trigger the lightbox.
- AC-6: Floating chatbot launcher and panel are hidden/inert while the project lightbox is open.
- AC-7: Automated tests verify asset existence, zero 404s, and lightbox interaction/accessibility.
