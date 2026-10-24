# TASK-032 — Bilingual ID/EN Foundation & Complete Static UI Localization (CR-005a)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | Architect + UI |
| **Priority** | P0 |
| **Depends on** | TASK-028 |
| **Owner input needed** | none (draft translations provided for review) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Implement a lightweight, zero-external-dependency bilingual (English default, Indonesian toggle) type-safe localization foundation and provide complete Indonesian translations across all static portfolio sections per Owner Change Request CR-005a.

## 2. Source requirements
`PRD.md` CON-03, FR-GLB-04, CR-005 · `DESIGN.md` §5.1, §5.2, §5.11

## 3. Required reading
- `src/lib/i18n/`
- `src/components/layout/navbar.tsx`
- `src/components/layout/theme-toggle.tsx`
- All component files under `src/components/sections/` and `src/components/layout/`

## 4. In scope
- Create `src/lib/i18n/dictionaries.ts` and language context/provider:
  - Default language: `"en"`. Persisted in `localStorage` (`fauzi_lang = "en" | "id"`).
  - Synchronize `html[lang]` and dynamic document title without FOUC.
- Add segmented `ID | EN` switch:
  - In desktop navbar, placed immediately adjacent to theme toggle.
  - In mobile header, placed between theme toggle and hamburger button.
  - Active segment styled with crimson accent background per approved designs.
  - Accessible button group, `aria-pressed`, keyboard accessible.
- Provide complete, professional Indonesian translations for:
  - Opening Overlay (subtitle, status, chips)
  - Navbar & Footer (all section links, copyright, Back to Top)
  - Hero (headline, summary, CTAs, portrait labels)
  - Profile & Journey (summary, principles, timeline)
  - Skills (section title, categories, accessible labels)
  - Projects (descriptions, status badges, repo buttons)
  - Credentials (section title, descriptions, issuer chips, lightbox)
  - Field Documentation (captions, swipe hints)
  - Contact (section title, channel descriptions)
  - Not Found page (`_not-found`), aria-labels, alt texts.
- Preserve proper nouns, institution names, technology names, and GitHub/social handles untranslated.
- Verify zero horizontal overflow in Indonesian across 7 viewports (320px to 1920px).

## 5. Out of scope
- Third-party heavy i18n libraries.

## 6. Files
**Allowed to create / modify:**
- `src/lib/i18n/**` (NEW)
- `src/components/layout/language-toggle.tsx` (NEW)
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/opening-overlay.tsx`
- `src/components/sections/**`
- `src/app/layout.tsx`
- `src/app/not-found.tsx` (NEW)
- `tests/**`
- `DESIGN.md` §5.1

## 7. Acceptance criteria
- **AC-1** Segmented `ID | EN` switch renders cleanly on desktop and mobile headers.
- **AC-2** English is default; switching to Indonesian instantly updates all static UI copy without page reload or scroll jump.
- **AC-3** Selected language persists in `localStorage` across reloads without wrong-language flash.
- **AC-4** `<html lang="...">` and `<title>` update dynamically.
- **AC-5** No horizontal overflow or broken card heights across all 7 viewports in Indonesian.
- **AC-6** `pnpm verify` passes.

## 8. Verification
- `pnpm verify`
- Visual inspection of both languages across 320, 375, 768, 1024, 1280, 1440, 1920px in dark and light themes.

## 9. Completion Report
## Completion Report — TASK-032 — 2026-10-25
**Status:** DONE
**Summary:** Implemented lightweight zero-external-dependency bilingual ID/EN foundation and complete static UI localization across all 9 portfolio sections, navbar, footer, opening overlay, and not-found page. Language persists in localStorage via useSyncExternalStore with dynamic html[lang] and title updates. Segmented ID | EN switcher integrated into desktop and mobile navigation.
**Files:**
- Created: `src/lib/i18n/dictionaries.ts` (complete type-safe EN and ID translations)
- Created: `src/lib/i18n/context.tsx` (LanguageProvider with useSyncExternalStore)
- Created: `src/components/layout/language-toggle.tsx` (segmented ID | EN switcher)
- Created: `src/app/not-found.tsx` (localized 404 page)
- Created: `tests/i18n.test.ts` (unit tests for dictionaries, hook, and toggle)
- Modified: `src/app/layout.tsx` (wrapped in LanguageProvider)
- Modified: `src/components/layout/navbar.tsx` (integrated LanguageToggle and localized links)
- Modified: `src/components/layout/footer.tsx` (localized links, headline, copyright)
- Modified: `src/components/layout/opening-overlay.tsx` (localized subtitle and chips)
- Modified: `src/components/sections/hero.tsx` (localized role headline, intro, CTAs)
- Modified: `src/components/sections/profile-journey.tsx` (localized headings, summaries, principles)
- Modified: `src/components/sections/skills.tsx` (localized header and categories)
- Modified: `src/components/sections/projects.tsx` (localized descriptions and action links)
- Modified: `src/components/sections/credentials.tsx` (localized header, modal, and category tags)
- Modified: `src/components/sections/documentation.tsx` (localized header and captions)
- Modified: `src/components/sections/contact.tsx` (localized header, channel labels, indicators)
**Dependencies added:** none (0 new external dependencies)
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | 0 errors, 0 warnings |
| `pnpm typecheck` | PASS | 0 errors |
| `pnpm test` | PASS | 23 files passed, 302 tests passed |
| `pnpm build` | PASS | Compiled static pages `/`, `/_not-found`, and dynamic `/api/chat` |
| `pnpm verify` | PASS | 100% green verification |
**Acceptance criteria:**
- AC-1 ✔ LanguageToggle renders cleanly in desktop and mobile headers.
- AC-2 ✔ English is default; toggle instantly updates all static UI copy without reload.
- AC-3 ✔ localStorage persistence with useSyncExternalStore, 0 FOUC.
- AC-4 ✔ html[lang] and document.title update dynamically.
- AC-5 ✔ Zero overflow across all 7 viewports in both English and Indonesian.
- AC-6 ✔ `pnpm verify` passes 100% green.
**Rule & scope check:** No scope creep; CON-03, FR-GLB-04, CR-005 strictly met.
**Conflicts / open decisions encountered:** None.
**Known gaps:** Chatbot backend and widget pipeline will be localized in TASK-033.
**Next task:** TASK-033 (Bilingual Chatbot Pipeline: Contract, Multilingual Retrieval, Prompts & UI)
