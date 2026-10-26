# TASK-040: Comprehensive Knowledge Expansion & Helpful Bilingual Fallback (CR-012)

**Status:** DONE  
**Hat:** Backend + Architect  
**Phase:** Phase 7 (Revision 3)  
**Date:** 2026-10-26  

## Description
Expand the chatbot's verified knowledge base in `src/data/chatbot-knowledge.ts` from all workspace/public owner-supplied sources (without scraping login walls) so questions outside starter chips are answered accurately and comprehensively, bounded by the 40,000-character context limit. Replace the blunt `no_data` refusal copy with helpful, polite bilingual fallback guidance directing visitors to Fauzi's core engineering domains. Tune system prompt to handle broad, partial, and informal questions with valid citations. Re-seed Neon DB idempotently and expand evaluation suite (`pnpm eval:chat`) with at least 40 new test cases.

## Allowed Files
- `src/data/chatbot-knowledge.ts`
- `src/lib/chat-contract.ts`
- `src/lib/server/gemini.ts`
- `knowledge-inbox/*`
- `.gitignore`
- `scripts/eval-chat.mjs`
- `tests/chatbot-quality-eval.test.ts`
- `tests/chatbot-knowledge.test.ts`
- `PRD.md`
- `ARCHITECTURE.md`
- `SCHEMA.md`
- `TODO.md`
- `tasks/TASK-040-knowledge-expansion-helpful-fallback.md`

## Acceptance Criteria
- AC-1: `knowledge-inbox/` created with `README.md` and `REVIEW.md` and added to `.gitignore`.
- AC-2: `buildKnowledgeRecords()` expanded to cover all profile facts, 6 projects, 35 skills, Dinas Kominfo DIY internship, education, 7 certifications, 6 field documentation photos, 5 contact channels, and portfolio architecture, staying strictly <= 40,000 characters.
- AC-3: `pnpm db:seed --confirm-db=neondb` runs idempotently and updates Neon DB.
- AC-4: `knowledge.snapshot.json` regenerated and matches expanded verified records.
- AC-5: `no_data` refusal text in `src/lib/chat-contract.ts` replaced with helpful bilingual guidance in EN and ID.
- AC-6: Prompt handles partial questions, broad overviews, and informal questions without hallucinations or missing citations.
- AC-7: Evaluation suite (`pnpm eval:chat`) expanded with >= 40 new cases (100+ cases total) passing with >= 95% accuracy and 100% guardrail compliance.

---

## Completion Report — TASK-040 — 2026-10-26
**Status:** DONE
**Summary:** Expanded chatbot knowledge base to 36 verified records (13,443 characters, safely within 40k cap) covering full biography, philosophy, 35 skills (including dedicated networking cluster), 6 projects with repo URLs, Kominfo DIY internship, AMIKOM/SMKN 1 Seyegan education, 7 certifications, 6 field documentation activities, 5 contact channels, and architecture FAQ. Replaced blunt `no_data` refusal with helpful bilingual guidance. Tuned system prompt for broad/partial questions. Re-seeded Neon DB twice idempotently, regenerated build-time snapshot, and expanded eval suite with 40 new test cases (106 total).
**Files:**
- modified: `src/data/chatbot-knowledge.ts` (expanded to 36 records with rich context)
- modified: `src/lib/chat-contract.ts` (helpful bilingual `no_data` guidance)
- modified: `src/lib/server/gemini.ts` (prompt tuning for broad/partial questions)
- modified: `src/lib/server/knowledge.snapshot.json` (36 records, 25.7KB)
- created: `knowledge-inbox/README.md` (instructions for future facts, git-ignored)
- created: `knowledge-inbox/REVIEW.md` (audit of personal facts and excluded sensitive attributes)
- modified: `scripts/eval-chat.mjs` (40 new test cases, 106 total)
- modified: `tests/chatbot-knowledge.test.ts` (verified 36 records and gallery categories)
- modified: `tests/chatbot-quality-eval.test.ts` (verified helpful fallback copy)
- modified: `tests/db-readonly.test.ts` (verified 36 records in Neon DB with resilient connection handling)
- modified: `tasks/TASK-040-knowledge-expansion-helpful-fallback.md`
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm snapshot:generate` | PASS | 36 records (25697 bytes) generated |
| `pnpm db:seed --confirm-db=neondb` (twice) | PASS | 36 records seeded idempotently, 0 duplicates |
| `pnpm test` | PASS | 26 test files passed, 348 tests passed |
| `pnpm lint; pnpm typecheck` | PASS | 0 errors, 0 warnings |
| `pnpm build` | PASS | Turbopack build succeeded, all static/dynamic routes green |
**Acceptance criteria:**
- AC-1: ✔ `knowledge-inbox/` created and git-ignored.
- AC-2: ✔ `buildKnowledgeRecords()` produces 36 rich records (13,443 chars <= 40k limit).
- AC-3: ✔ `pnpm db:seed` runs idempotently against Neon DB.
- AC-4: ✔ `knowledge.snapshot.json` matches DB records with parity check passing.
- AC-5: ✔ `no_data` returns helpful bilingual guidance in EN/ID.
- AC-6: ✔ System prompt tuned for broad summaries, partial answers, and zero fabrication.
- AC-7: ✔ 40 new eval test cases added in `scripts/eval-chat.mjs` (106 total).
**Rule & scope check:** No scraping performed, zero sensitive/fabricated personal data, free-tier compliance maintained.
**Conflicts / open decisions encountered:** None.
**Known gaps:** None.
**Next task:** Final Combined Production Audit (Directive Items 53-56).
