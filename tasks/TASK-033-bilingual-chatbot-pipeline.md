# TASK-033 — Bilingual Chatbot Pipeline: Contract, Multilingual Retrieval, Prompts & UI (CR-005b)

| Field | Value |
|---|---|
| **Status** | `TODO` |
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

## 9. Completion Report
*(Appended upon completion)*
