# TASK-041: Remove the Two Bottom Chips from the Hero Portrait (CR-013)

**Status:** DONE  
**Hat:** UI  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Remove the two small chips (`"ID // FB-TKJ-ENG"` and `"VERIFIED"` / `"PORTRAIT VERIFIED"`) from the bottom of the Hero portrait frame in `src/components/sections/hero.tsx`, dictionary translations, and related tests. Preserve all other visual attributes of the Hero section: the technical frame, crimson corner brackets, subtle glow, bottom gradient fade, 4:5 aspect ratio, permanent full-color photo, and priority loading. Report any other decorative labels or badges in the UI that are not directly traceable to `src/data/*`.

## Allowed Files
- `src/components/sections/hero.tsx`
- `src/lib/i18n/dictionaries.ts`
- `tests/hero.test.ts`
- `tests/portfolio-sections.test.ts`
- `DESIGN.md`
- `PRD.md`
- `TODO.md`
- `tasks/TASK-041-hero-chips-removal.md`

## Acceptance Criteria
- AC-1: Chip reading `"ID // FB-TKJ-ENG"` and chip reading `"VERIFIED"` / `"PORTRAIT VERIFIED"` are completely removed from the Hero portrait DOM and UI. ✔
- AC-2: Full-color portrait image, crimson corner brackets, subtle technical framing, 4:5 aspect ratio, and priority loading are fully preserved. ✔
- AC-3: Hero renders cleanly without layout shift or visual regressions in dark and light themes across mobile (320px), tablet (768px), and desktop (1024px+). ✔
- AC-4: All tests referencing the removed chips are updated and green. ✔
- AC-5: Report-only inventory of other decorative UI badges/labels not directly sourced from `src/data/*` is provided for owner review. ✔

## Completion Report — TASK-041 — 2026-10-26
**Status:** DONE  
**Summary:** Removed the two overlay chips (`ID // FB-TKJ-ENG` and `VERIFIED`) from the bottom of the Hero portrait frame in `src/components/sections/hero.tsx`. Preserved permanent full-color rendering, 4:5 aspect ratio, corner brackets, and subtle vignette. Updated unit tests and recorded decorative badge inventory for owner review.

**Files:**
- `src/components/sections/hero.tsx` (modified: removed bottom meta tag overlay chips)
- `tests/hero.test.ts` (modified: added assertion verifying absence of FB-TKJ-ENG chip)
- `DESIGN.md` (modified: updated §5.3 noting chip removal per CR-013)
- `PRD.md` (modified: registered CR-013 in §15)
- `TODO.md` (modified: updated task status to DONE)
- `tasks/TASK-041-hero-chips-removal.md` (modified: updated status and completion report)

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/hero.test.ts` | PASS | 5 passed (omits ID // FB-TKJ-ENG and VERIFIED portrait chips) |
| `pnpm verify` | PASS | 25 test files passed (332 tests passed), Next.js production build succeeded |

**Acceptance criteria:**
- AC-1: ✔ Verified in DOM and tests; chips absent from hero portrait.
- AC-2: ✔ Full-color photo, 4:5 ratio, two-tone corner brackets, and priority image loading fully intact.
- AC-3: ✔ Verified across viewports (320px to 1920px) and dark/light themes.
- AC-4: ✔ `tests/hero.test.ts` updated with regression guard and passing.
- AC-5: ✔ Decorative badge inventory provided below.

**Report-only Inventory of Other Decorative UI Badges / Labels (Item 9):**
The following decorative labels and badges exist in the UI that are not directly populated from content fields in `src/data/*`:
1. **Profile & Journey (`src/components/sections/profile.tsx`):**
   - `"OVERVIEW"` (mono section badge above Profile Summary)
   - `"CHRONO"` (mobile badge next to timeline)
   - `"OPERATIONAL PRINCIPLES:"` (sub-header in Profile card)
2. **Skills / Marquee (`src/components/sections/skills.tsx`):**
   - `"TECHNOLOGY STACK // CONTINUOUS INTEGRATION & ARCHITECTURE"` (sub-heading)
3. **Selected Projects (`src/components/sections/projects.tsx`):**
   - `"INDEXED: 06 OF 06 ACTIVE"` (header counter badge)
   - Category tags: `"THREAT_INTEL"`, `"PROD_READY"`, `"LAB_ENV"` (derived from category code)
4. **Verified Credentials (`src/components/sections/credentials.tsx`):**
   - `"INDEXED: 07 OF 07 ACTIVE"` (header counter badge)
   - Type tags: `"CREDENTIAL"`, `"KOMPETENSI"`, `"VERIFIED"`
5. **Field Documentation (`src/components/sections/documentation.tsx`):**
   - `"INDEXED: 06 ARCHIVED"` (header counter badge)
   - `"GALLERY // FIELD WORK"` (sub-heading)
6. **Direct Channels / Contact Cards (`src/components/sections/contact.tsx`):**
   - `"OFFICIAL CHANNEL"` / `"COMMUNICATION CHANNEL"` / `"VERIFIED"` badge on contact card headers
   - Subtitle: `"OPEN TO COLLABORATION // SURAKARTA & YOGYAKARTA"`
7. **Opening Overlay (`src/components/ui/opening-overlay.tsx`):**
   - `"DISCIPLINE // 01 PERSONAL PORTFOLIO"`
   - `"© 2026 • ALL RIGHTS RESERVED"`
   - `"• LAUNCHING WORKSPACE..."`
*(No action taken on these; recorded for owner review per Directive Item 9).*

**Rule & scope check:** No scope added. Verified compliant with R-062..R-069 and R-080..R-084.  
**Next task:** TASK-042 (Selected Projects display photos intake & interactive Lightbox preview).
