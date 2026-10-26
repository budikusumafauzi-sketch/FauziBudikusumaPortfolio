# TASK-040: Comprehensive Knowledge Expansion & Helpful Bilingual Fallback (CR-012)

**Status:** TODO  
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
