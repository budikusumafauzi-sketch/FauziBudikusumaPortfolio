# TASK-031 — 5th Direct Contact Channel for Credly Profile & Layout/Typography Refinement (CR-003)

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | UI + Database |
| **Priority** | P0 |
| **Depends on** | TASK-030 |
| **Owner input needed** | none (URL provided in workspace) |
| **Skills** | `design-implementation`, `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Add a 5th contact card for Fauzi's Credly Profile, fix awkward mid-word breaks across all contact cards, balance the 5-card responsive layout, and update development database knowledge records.

## 2. Source requirements
`PRD.md` FR-CNT-01, CR-003 · `SCHEMA.md` §4 · `DESIGN.md` §5.10

## 3. Required reading
- `dokumen informasi/B. Informasi dan tautan/URL Creadly`
- `src/data/contacts.ts`
- `src/data/schemas.ts`
- `src/components/sections/contact.tsx`
- `src/data/chatbot-knowledge.ts`

## 4. In scope
- Extract verified URL from `dokumen informasi/B. Informasi dan tautan/URL Creadly`:
  `https://www.credly.com/users/fauzi-budikusuma.5538170c`
- Add 5th contact object in `src/data/contacts.ts` (`type: 'credly'`, label `"Credly Profile"`, display text `"credly.com/users/fauzi-budikusuma"`, `approvedForPublic: true`).
- Update Zod schemas in `src/data/schemas.ts` and tests in `tests/content.test.ts`.
- Fix mid-word wrapping in `src/components/sections/contact.tsx` (e.g. `budikusu/ma`, `sk/etch`) using structured ellipsis/display labels.
- Implement responsive grid for 5 cards: 5 columns on desktop (or 3+2), balanced grid on tablet, 2x2 + 1 full-width on mobile.
- Update `src/data/chatbot-knowledge.ts` to include 5th contact record for Credly with bilingual keywords.
- Seed DEVELOPMENT database (`pnpm db:seed --confirm-db=neondb`) twice to verify idempotency (row count 26 -> 27).

## 5. Out of scope
- Adding unverified social platforms or contact forms.

## 6. Files
**Allowed to modify:**
- `src/data/contacts.ts`
- `src/data/schemas.ts`
- `src/components/sections/contact.tsx`
- `src/data/chatbot-knowledge.ts`
- `tests/content.test.ts`
- `tests/contact-footer.test.ts`
- `SCHEMA.md` §4
- `DESIGN.md` §5.10

## 7. Acceptance criteria
- **AC-1** 5th contact card for Credly renders with verified URL and award/badge icon.
- **AC-2** Contact card typography does not break mid-syllable across 320px–1920px.
- **AC-3** 5-card layout is visually balanced across desktop, tablet, and mobile.
- **AC-4** Development database seeded with 27 knowledge records idempotently.
- **AC-5** `pnpm verify` passes.

## 8. Verification
- `pnpm verify`
- `pnpm db:seed --confirm-db=neondb`
- Visual inspection of Direct Channels across 320, 375, 768, 1024, 1280, 1440, 1920px.

## 9. Completion Report
*(Appended upon completion)*
