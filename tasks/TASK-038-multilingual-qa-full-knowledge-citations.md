# TASK-038: Answer Quality, Multilingual Free-Form Q&A, Full Knowledge Context & Structured Citations (CR-010)

**Status:** DONE  
**Hat:** Backend + UI  
**Phase:** Phase 7 (Revision 2 & Optimization)  
**Date:** 2026-10-25  

## Description
Enable the portfolio chatbot to answer free-form visitor questions (not limited to starter chips) with high precision in Indonesian, English, or any visitor language. Replace keyword-matching retrieval with `loadKnowledge()` backed by the in-memory cache, enforcing a hard 40,000-character total knowledge context cap. Implement structured JSON output (`responseSchema`) with strict server-side validation and citation enforcement under `R-031` (replacing replies lacking valid citation with fixed `no_data`). Support conversation history (up to 6 turns) with an untrusted context guardrail and body cap of 6 KB. Verify with a comprehensive >= 60-case automated evaluation suite (`scripts/eval-chat.mjs`).

## Allowed Files
- `src/lib/chat-contract.ts`
- `src/lib/server/knowledge.ts`
- `src/lib/server/guard.ts`
- `src/lib/server/gemini.ts`
- `src/app/api/chat/route.ts`
- `src/components/chat/chat-widget.tsx`
- `src/components/sections/documentation.tsx`
- `prisma/seed.ts`
- `scripts/eval-chat.mjs`
- `package.json`
- `tests/chatbot-quality-eval.test.ts`
- `tests/chatbot-security-matrix.test.ts`
- `PRD.md`
- `ARCHITECTURE.md`
- `SCHEMA.md`
- `TODO.md`
- `tasks/TASK-038-multilingual-qa-full-knowledge-citations.md`

## Acceptance Criteria
- AC-1: API accepts `{ message, language?, history? }` with `.strict()`, capping body at 6 KB (`6144` bytes) and `history` at 6 turns of at most 300 characters each. ✔
- AC-2: `loadKnowledge()` provides all verified public records in a compact format, strictly capped at 40,000 characters (validated in seed and runtime). ✔
- AC-3: Model returns structured JSON (`{ kind, answer, citations }`). If `kind === "answer"`, `citations` must contain at least one valid record ID; otherwise server replaces response with fixed `no_data` (`R-031`). ✔
- AC-4: System instruction grounds replies strictly on facts and responds in the visitor's language (Indonesian, English, Malay, Spanish, Japanese, Arabic, etc.). ✔
- AC-5: Deterministic guardrail scans message and history, blocking injection, secrets, SQL mutations, and private data in < 25ms with 0 Gemini calls. ✔
- AC-6: Evaluation suite of >= 60 cases (`pnpm eval:chat`) passes >= 95% in-scope accuracy and 100% guardrail compliance. ✔

## Completion Report — TASK-038 — 2026-10-25
**Status:** DONE  
**Summary:** Implemented multilingual free-form Q&A with full verified knowledge context (capped at 40,000 chars), structured JSON output with strict citation enforcement under `R-031`, conversational history support (up to 6 turns, body <= 6 KB), and verified with a 66-case evaluation suite passing with 100% accuracy and 100% guardrail compliance. Fixed Field Documentation SVG image rendering with `unoptimized` prop (Item 55).

**Files:**
- `src/lib/chat-contract.ts` (modified: MAX_BODY_BYTES = 6144, TOTAL_KNOWLEDGE_MAX_CHARS = 40_000, history schema, structured output schema)
- `src/lib/server/knowledge.ts` (created: loadKnowledge(), buildFullKnowledgeContext(), 40,000 character limit enforcement)
- `src/lib/server/guard.ts` (modified: checkGuard() scans latest message and history turns for attacks/probes with 0 Gemini calls)
- `src/lib/server/gemini.ts` (modified: responseSchema structured JSON output, multilingual grounding system instruction, history prompt layout, strict citation validation under R-031)
- `src/app/api/chat/route.ts` (modified: wire to loadKnowledge(), pass history and language, map citations to sources)
- `src/components/chat/chat-widget.tsx` (modified: send history up to 6 turns, preserve line breaks with whitespace-pre-line)
- `src/components/sections/documentation.tsx` (modified: added unoptimized to gallery <Image> per Item 55)
- `prisma/seed.ts` (modified: assert serialized knowledge context <= 40,000 chars before transaction)
- `scripts/eval-chat.mjs` (created: comprehensive 66-case live evaluation script registered as pnpm eval:chat)
- `package.json` (modified: registered eval:chat script)
- `tests/chatbot-quality-eval.test.ts` (created: 10 unit tests for contract validation, history guard, R-031 citation enforcement, and 40k cap)
- `tests/chatbot-security-matrix.test.ts` (modified: updated mock expectations for structured citations)
- `PRD.md` (modified: updated CB-02/03/10, NFR-PERF-05, and decision log)
- `ARCHITECTURE.md` (modified: updated §7, §10, §11, ADR-010, marked ADR-011 superseded, added ADR-013)
- `SCHEMA.md` (modified: updated §10 for full verified knowledge context without keyword retrieval)
- `TODO.md` (modified: added §5.5 owner facts, updated §1 and §3)

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm typecheck` | PASS | `tsc --noEmit` exited with code 0 (0 errors) |
| `pnpm lint` | PASS | ESLint exited with code 0 (0 errors, 0 warnings) |
| `pnpm test` | PASS | 25 test files passed, 331 tests passed (100% green) |
| `pnpm build` | PASS | Production build compiled successfully in 608ms |
| `node scripts/eval-chat.mjs` (66 cases) | PASS | 66/66 passed (100% accuracy, 100% guardrail compliance, p50 = 1505ms, p95 = 3448ms) |
| `tests/db-readonly.test.ts` (negative write test) | PASS | Least-privilege runtime role `portfolio_runtime` passed (INSERT/UPDATE/DELETE/TRUNCATE/CREATE/DROP denied) |
| `.next/static/**` secret audit | PASS | 0 secrets or sensitive tokens detected |

**Rule & scope check:**
- R-031: Mandates full verified knowledge set and valid citation; replies lacking citation are replaced with fixed `no_data`.
- R-034: Bounded single retry for transient failures only.
- R-035: Evaluation executed within approved live call budget with rate-limit pacing.
- R-036: Strict body cap of 6 KB (`6144` bytes) and rejection of unknown fields.
- R-095: All background dev/production servers terminated.

**Conflicts / open decisions encountered:** None.  
**Known gaps:** None.  
**Next task:** Final acceptance and project wrap-up.

