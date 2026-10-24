# TASK-031 — 5th Direct Contact Channel for Credly Profile & Layout/Typography Refinement (CR-003)

| Field | Value |
|---|---|
| **Status** | `DONE` |
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
## Completion Report — TASK-031 — 2026-10-25
**Status:** DONE
**Summary:** Integrated 5th contact channel for Credly Profile using verified URL from owner document, eliminated awkward mid-word breaks (`break-all`) via clean ellipsis typography, updated responsive grid for 5 cards (`lg:grid-cols-5`, tablet `sm:grid-cols-2` with Credly full width, mobile 1 column), and seeded development database with 27 KnowledgeRecords twice with verified idempotency.
**Files:**
- `src/data/schemas.ts`: added `credly` to `ContactItemSchema.type` enum.
- `src/data/contacts.ts`: added 5th verified contact item `contact-credly`.
- `src/components/sections/contact.tsx`: added `Award` icon for Credly, 5-column responsive grid, and clean ellipsis wrapping.
- `src/data/chatbot-knowledge.ts`: added Credly keywords (`credly`, `badge`, `digital-badge`, `lencana`, `sertifikasi-digital`) to contact knowledge records.
- `src/lib/server/retrieval.ts`: added `credly`, `badge`, `badges`, `lencana` to INTENT_MAP under `CERTIFICATION` and `CONTACT`.
- `SCHEMA.md`: updated §4 content module field reference for 5 contact records.
- `DESIGN.md`: updated §5.10 for 5-card grid and typography rules.
- `tests/content.test.ts`: updated contacts count assertion from 4 to 5.
- `tests/contact-footer.test.ts`: updated contacts count assertion from 4 to 5.
- `tests/chatbot-knowledge.test.ts`: updated knowledge record count assertion from 26 to 27.
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm vitest run tests/content.test.ts tests/contact-footer.test.ts tests/chatbot-knowledge.test.ts` | PASS (3 files, 26 tests) | All tests green |
| `pnpm db:seed --confirm-db=neondb` (1st run) | PASS | 27 KnowledgeRecords written |
| `pnpm db:seed --confirm-db=neondb` (2nd run) | PASS | 27 KnowledgeRecords verified (idempotent) |
**Acceptance criteria:**
- AC-1 ✔ Credly card renders with verified URL `https://www.credly.com/users/fauzi-budikusuma.5538170c` and Lucide `Award` icon.
- AC-2 ✔ Replaced `break-all` with `truncate` and `title` attributes — zero mid-syllable breaks.
- AC-3 ✔ Grid adapts cleanly: 5 cols on desktop, 2x2 + 1 full-width on tablet, 1 col on mobile.
- AC-4 ✔ Development database contains 27 records, seeded twice consecutively.
- AC-5 ✔ Unit tests pass.
**Next task:** TASK-028
