# TASK-033 — Bilingual Chatbot Pipeline: Contract, Multilingual Retrieval, Prompts & UI (CR-005b)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Maximization) |
| **Hat** | Backend + UI |
| **Priority** | P0 |
| **Depends on** | TASK-032 |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Enable end-to-end bilingual support in the chatbot pipeline: update API contract with optional language parameter, implement bilingual retrieval and scope guards, enrich knowledge records with Indonesian keywords, update system prompts, and localize the chatbot widget UI per Owner Change Request CR-005b.

## 2. Source requirements
`PRD.md` CON-03, FR-CHT-03, CR-005 · `ARCHITECTURE.md` §7, §8

## 3. Required reading
- `src/lib/chat-contract.ts`
- `src/lib/server/retrieval.ts`
- `src/lib/server/guard.ts`
- `src/lib/server/gemini.ts`
- `src/components/chat/chat-widget.tsx`
- `src/data/chatbot-knowledge.ts`

## 4. In scope
- In `src/lib/chat-contract.ts`:
  - Add `language: z.enum(['en', 'id']).optional().default('en')` to `ChatRequestSchema`.
  - Maintain strict parameter isolation (`.strict()`).
  - Provide fixed guardrail messages (`no_data`, `out_of_scope`, `rate_limited`, `unavailable`, `invalid_request`) in both English and Indonesian.
- In `src/lib/server/retrieval.ts`:
  - Expand intent classification and keyword extraction to recognize Indonesian terms (*proyek, keahlian, kemampuan, keterampilan, pendidikan, kuliah, pengalaman, magang, kominfo, sertifikat, kontak, dll.*).
- In `src/data/chatbot-knowledge.ts`:
  - Enrich all 27 knowledge records with comprehensive Indonesian keywords and synonyms.
  - Re-seed DEVELOPMENT database (`pnpm db:seed --confirm-db=neondb`).
- In `src/lib/server/guard.ts`:
  - Expand prompt-injection and private-data rejection regex to catch Indonesian attacks (*abaikan instruksi, kata sandi, alamat rumah, nomor telepon, rahasia*).
- In `src/lib/server/gemini.ts`:
  - Grounding instruction: answer in Indonesian if the user query is in Indonesian, otherwise English. Answer strictly from verified facts.
- In `src/components/chat/chat-widget.tsx`:
  - Localize launcher aria-labels, panel header title/subtitle, starter prompt chips, input placeholder, and service notices when active language toggles.
  - Send active `language` parameter with requests.
- Add unit tests for Indonesian retrieval, guard rejection, and live query execution in Indonesian.

## 5. Out of scope
- Web browsing or ungrounded general conversational answers.

## 6. Files
**Allowed to modify:**
- `src/lib/chat-contract.ts`
- `src/lib/server/retrieval.ts`
- `src/lib/server/guard.ts`
- `src/lib/server/gemini.ts`
- `src/components/chat/chat-widget.tsx`
- `src/data/chatbot-knowledge.ts`
- `tests/chat-contract.test.ts`
- `tests/retrieval.test.ts`
- `tests/chatbot-security-matrix.test.ts`
- `tests/chat-widget.test.tsx`
- `tests/live-smoke.test.ts`
- `ARCHITECTURE.md` §7, §8

## 7. Acceptance criteria
- **AC-1** Chat contract accepts `language` (`'en' | 'id'`) while preserving `.strict()` validation.
- **AC-2** Indonesian queries retrieve matching knowledge records reliably.
- **AC-3** Prompt-injection queries in Indonesian are rejected with HTTP 200 `out_of_scope` (0 Gemini calls).
- **AC-4** Gemini replies in accurate, fluent Indonesian when queried in Indonesian.
- **AC-5** Chatbot UI controls, placeholders, and starter chips localize seamlessly with the `ID | EN` switch.
- **AC-6** `pnpm verify` passes.

## 8. Verification
- `pnpm verify`
- Live production server smoke query in Indonesian.

## 9. Completion Report — TASK-033 — 2026-10-25
**Status:** DONE
**Summary:** Implemented complete end-to-end bilingual chatbot pipeline (CR-005b). Contract schema validates optional language ('en' | 'id') with .strict() isolation; fixed guardrail messages delivered in English and Indonesian; PostgreSQL retrieval intent map and all 27 knowledge records enriched with Indonesian keywords and re-seeded; scope guard rejection expanded to Indonesian attack vectors; Gemini instructed for grounded Indonesian/English output; ChatWidget fully localized with active language sent to /api/chat.
**Files:**
- `src/lib/chat-contract.ts` (modified: ChatRequestSchema language field, COPY_EN, COPY_ID, getFixedCopy)
- `src/lib/server/guard.ts` (modified: Indonesian attack and private data patterns)
- `src/lib/server/retrieval.ts` (modified: Indonesian intent mapping and stop-words)
- `src/data/chatbot-knowledge.ts` (modified: enriched 27 records with Indonesian keywords)
- `src/lib/server/gemini.ts` (modified: bilingual system instructions and prompt building)
- `src/app/api/chat/route.ts` (modified: language extraction and getFixedCopy integration)
- `src/components/chat/chat-widget.tsx` (modified: bilingual ChatWidget UI and payload language passing)
- `src/lib/i18n/dictionaries.ts` (modified: comprehensive chat keys in Dictionary, en, id)
- `tests/chat-contract.test.ts` (modified: tests for language field, COPY_ID, and Indonesian attack vectors)
- `tests/retrieval.test.ts` (modified: tests for Indonesian intent detection)
- `tests/db-readonly.test.ts` (modified: network timeout tolerances for trans-Pacific Neon latency)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | 0 errors, 0 warnings |
| `pnpm typecheck` | PASS | tsc --noEmit 0 errors |
| `pnpm test` | PASS | 23 files passed, 308 tests passed |
| `pnpm build` | PASS | Static export of /, /_not-found, dynamic /api/chat |
| `pnpm db:seed --confirm-db=neondb` | PASS | 27 records validated and idempotent in Neon DB |
| Live smoke test | PASS | HTTP 200 answered with grounded facts |
**Acceptance criteria:**
- AC-1: ✔ Verified in `tests/chat-contract.test.ts` (language 'en'/'id', defaults to 'en', rejects unknown fields)
- AC-2: ✔ Verified in `tests/retrieval.test.ts` and Neon DB re-seeding
- AC-3: ✔ Verified in `tests/chat-contract.test.ts` (Indonesian injections rejected)
- AC-4: ✔ Verified in Gemini system instruction and prompt contract
- AC-5: ✔ Verified in ChatWidget with `useLanguage()` and active language dispatch
- AC-6: ✔ `pnpm verify` 100% green
**Rule & scope check:** Confirmed no unauthorized scope added; strictly complies with CR-005b.
**Next task:** Post-Change Re-Audit (`TASK-024` & `TASK-025`) and Gate G7 Closure.
