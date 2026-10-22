# TASK-022 — Chatbot security and abuse tests

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 5 — Chatbot backend |
| **Hat** | Security |
| **Priority** | P0 |
| **Depends on** | TASK-021 |
| **Owner input needed** | none |
| **Skills** | `grounded-chatbot`, `release-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Attack the chatbot backend the way a hostile visitor would and fix what breaks. Produce an evidence-backed security result for the Phase 5 exit.

## 2. Source requirements
`ARCHITECTURE.md` §8.1, §9, §10 · `PRD.md` CB-04, CB-05, CB-06 · `RULES.md` R-020…R-029, R-030…R-039

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §8–§10
- `RULES.md` §3–§4
- `grounded-chatbot` skill

## 4. Preconditions
- TASKs 019–021 done.

## 5. In scope
- Injection suite: instruction-override phrases, role-play, "print your system prompt", requests for keys/passwords/connection strings/`.env`, private-data requests, attempts to make the model act or browse, injection embedded in a seeded record in a test fixture (records are data, not instructions).
- Input abuse: very long strings, odd Unicode/control characters, nested JSON, wrong types, duplicate keys, huge bodies, header abuse (spoofed forwarding headers outside the trusted environment).
- Assert for every response/log line: no secrets, no SQL, no stack trace, no file paths, no provider text.
- Confirm the page and bundle make no AI request on load and contain no server env names.
- Fix findings in the owning files; add regression tests.

## 6. Out of scope — do NOT do
- New features, heavier infrastructure, relaxing any limit.

## 7. Files
**Allowed to create / modify**
- `tests/**`
- `src/lib/**` and `src/app/api/chat/route.ts` (fixes only)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Write the suite as automated tests where possible.
2. Run it; triage failures; fix; re-run.
3. Run a client-bundle scan for server env names.
4. Summarize results as a table (attack → expected → result).

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Every injection/abuse case yields the specified safe response; no Gemini call where the guard/no-data rule applies.
- **AC-2** No response or log exposes a secret, SQL, stack trace, path or provider message (evidence).
- **AC-3** The client bundle contains no server env names and no `NEXT_PUBLIC_` secret.
- **AC-4** No AI/chat request occurs on page load (network evidence).
- **AC-5** All fixes have regression tests; `pnpm verify` is green.

## 10. Verification
- V-CHAT
- V-SEC
- V-STATIC
- V-SCOPE

## 11. Blocked / stop conditions
- A fix would require a design/scope change → stop event with the smallest proposal.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-022: <summary>`.)*
