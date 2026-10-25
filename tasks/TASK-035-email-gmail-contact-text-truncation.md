# TASK-035 — Email to Gmail & Zero Contact Text Truncation (CR-007)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Revision 2 & Optimization) |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-034 |
| **Owner input needed** | none |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Direct the Direct Email contact card to Gmail compose in a new tab (instead of `mailto:` triggering external desktop email clients like Outlook), completely eliminate all text truncation (`...` ellipsis) across all 5 contact cards, introduce natural delimiter wrapping (`<wbr />` after `@`, `/`, `.`, and `-`), and adopt a spacious 3+2 grid layout on desktop/laptop per Owner Change Request CR-007.

## 2. Source requirements
- `PRD.md` FR-CNT-01, FR-CNT-02, §14.3, §15 (CR-007)
- `DESIGN.md` §5.10 (DS-CNT)
- `SCHEMA.md` §5
- Directives Items 16–20

## 3. Required reading
- `PRD.md` §6.10, §15 (CR-007)
- `DESIGN.md` §5.10
- `SCHEMA.md` §5
- `src/components/sections/contact.tsx`
- `src/data/contacts.ts`

## 4. In scope
- Update `src/data/contacts.ts` to set email card `href` to:
  `https://mail.google.com/mail/?view=cm&fs=1&to=budikusumafauzi%40gmail.com` using `encodeURIComponent(emailAddress)`.
- Update `src/data/schemas.ts` and `SCHEMA.md` ensuring the `email` type validates `https://` Gmail compose links while preserving displayed text as `budikusumafauzi@gmail.com`.
- Add bilingual accessible labels in `src/lib/i18n/dictionaries.ts`:
  `"Email Fauzi via Gmail (opens in a new tab)"` / `"Kirim email ke Fauzi lewat Gmail (membuka tab baru)"`.
- Remove all `truncate`, `line-clamp`, `text-overflow: ellipsis`, and clipping classes from contact values in `src/components/sections/contact.tsx`.
- Implement `formatWithBreakableDelimiters()` to insert `<wbr />` after `@`, `/`, `.`, and `-` tokens, avoiding mid-word `break-all` while allowing responsive multi-line wrapping.
- Re-architect the 5-card grid layout:
  - Desktop/laptop (`lg:grid-cols-6`): 3 cards top row (`lg:col-span-2`) + 2 cards bottom row (`lg:col-span-3`).
  - Tablet (`sm:grid-cols-2`): 2 cards per row + 5th card spans 2 columns (`sm:col-span-2`).
  - Mobile (`grid-cols-1`): 1 spacious column stack.
  - Card heights uniform with `h-full`.
- Log "one-click copy email address button" idea into `PRD.md` §14.3 as a future recommendation.
- Update tests in `tests/contact-footer.test.ts` and `tests/content.test.ts`.

## 5. Out of scope
- Building an interactive copy-to-clipboard button or contact message form (`R-027`, `PRD.md` FR-CNT-03).
- Adding default subject or body parameters to the Gmail compose URL.

## 6. Files
**Allowed to modify / create:**
- `src/components/sections/contact.tsx`
- `src/data/contacts.ts`
- `src/data/schemas.ts`
- `src/lib/i18n/dictionaries.ts`
- `tests/contact-footer.test.ts`
- `tests/content.test.ts`
- `PRD.md` §6.10, §14.3, §15
- `DESIGN.md` §5.10
- `SCHEMA.md` §5
- `TODO.md`
- `tasks/TASK-035-email-gmail-contact-text-truncation.md`

## 7. Acceptance criteria
- **AC-1** Email contact card points to `https://mail.google.com/mail/?view=cm&fs=1&to=budikusumafauzi%40gmail.com` with `target="_blank"` and `rel="noopener noreferrer"`.
- **AC-2** Email card provides bilingual accessible name: `"Email Fauzi via Gmail (opens in a new tab)"` / `"Kirim email ke Fauzi lewat Gmail (membuka tab baru)"`.
- **AC-3** Zero `truncate`, zero `line-clamp`, zero `break-all`, and zero `...` ellipsis truncation across all 5 contact cards.
- **AC-4** Programmatic delimiter wrapping via `<wbr />` after `@`, `/`, `.`, and `-` tokens enables natural multi-line display.
- **AC-5** Desktop grid renders 3 cards in top row and 2 cards in bottom row with spacious widths and uniform `h-full` heights.
- **AC-6** `pnpm vitest run tests/contact-footer.test.ts tests/content.test.ts` and production build pass.

## 8. Completion Report — TASK-035 — 2026-10-25
**Status:** DONE
**Summary:** Successfully updated the Direct Email channel to open Gmail compose directly in a new tab, eliminated all text truncation (`...`) across all 5 contact cards, implemented natural delimiter wrapping with `<wbr />`, and created a spacious 3+2 grid layout on desktop/laptop. Recorded the copy address button suggestion in `PRD.md` §14.3 without adding unrequested code.

**Files:**
- `src/data/contacts.ts` (MODIFIED): Email card `href` set dynamically to `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("budikusumafauzi@gmail.com")}`.
- `src/lib/i18n/dictionaries.ts` (MODIFIED): Added `emailAria` to English and Indonesian dictionaries.
- `src/components/sections/contact.tsx` (MODIFIED):
  - Removed `truncate` class.
  - Implemented `formatWithBreakableDelimiters()` to insert `<wbr />` after `@`, `/`, `.`, and `-`.
  - Re-architected grid into `lg:grid-cols-6` (3 cards of `lg:col-span-2` top row, 2 cards of `lg:col-span-3` bottom row).
  - Applied bilingual accessible labels and `target="_blank"` with `rel="noopener noreferrer"`.
- `tests/contact-footer.test.ts` (MODIFIED): Added test assertions for Gmail compose URL, zero truncation classes, `<wbr/>` elements, and safe URL attributes.
- `tests/content.test.ts` (MODIFIED): Updated URL scheme test to validate Gmail compose URL.
- `PRD.md` §6.10, §14.3, §15 (MODIFIED): Updated requirements, logged future copy button recommendation, and recorded CR-007 decision.
- `DESIGN.md` §5.10 (MODIFIED): Documented 3+2 grid layout, zero truncation, and Gmail compose specification.
- `SCHEMA.md` §5 (MODIFIED): Updated contact module documentation for Gmail compose URL support.

**Dependencies added:** none.

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/contact-footer.test.ts` | PASS | 9/9 tests passed (Gmail compose link & zero truncation verified) |
| `pnpm vitest run tests/content.test.ts` | PASS | 10/10 tests passed (Contact schema & Gmail compose validated) |
| `pnpm build` | PASS | Production compilation & static generation successful in 4.5s |
| Truncation class scan in `contact.tsx` | PASS | `truncate`, `line-clamp`, `break-all` not found in contact text |
| Delimiter inspect | PASS | Long handles wrap cleanly at natural tokens (`@`, `/`, `.`, `-`) |

**Acceptance criteria:**
- AC-1 ✔ — Email opens Gmail compose directly in a new tab.
- AC-2 ✔ — Bilingual accessible labels provided for screen readers.
- AC-3 ✔ — Zero ellipsis truncation across all 5 cards.
- AC-4 ✔ — Natural delimiter wrapping enabled.
- AC-5 ✔ — Spacious 3+2 grid on desktop, 2 cols on tablet, 1 col on mobile.
- AC-6 ✔ — All unit tests and production build pass.

**Next task:** TASK-036 (CR-008)
