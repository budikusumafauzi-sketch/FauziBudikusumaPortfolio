---
name: grounded-chatbot
description: Use when implementing or changing the /api/chat Route Handler, retrieval, rate limiting, Gemini integration, prompt contract, fallbacks, or chatbot security tests for the portfolio assistant. Ensures answers are grounded, bounded, and fail safely. Not for visual styling.
---

# Grounded chatbot procedure

## When to use
TASK-019 … TASK-022, TASK-023 (API usage from the UI), TASK-025.

## Required inputs
`ARCHITECTURE.md` §7–§10, `PRD.md` CB-xx and FR-CHT-xx, `SCHEMA.md` §10, `RULES.md` §3–§4, and the current official Gemini SDK docs (package/model names change; verify, OD-05).

## Invariants (never violate)
- No Gemini call without retrieved relevant records; none when the scope guard matched (R-031).
- The model has **no tools** (R-032); output is validated (R-033); **no retries** (R-034).
- The client sends only `{ message }` (strict schema); it never controls query, model or settings (R-036).
- Visitor text and model output are untrusted; render as plain text (R-026).
- Secrets only via server env; never logged (R-020/022).
- Tests mock Gemini; live calls ≤ 10 per task (R-035).

## Procedure
1. **Contract (019):** Zod request/response, method/content-type/size checks, limits from `ARCHITECTURE.md` §7 (record final values there), fixed copy constants, in-memory sliding-window limiter with a bounded map, safe client-IP rule (trust forwarding headers only in the documented host).
2. **Retrieval (020):** normalize → intent categories → tokens → bounded query → score floor → top K → context cap. Provide the test set (in-scope questions per category; nonsense; injection; private-data requests).
3. **Gemini (021):** server-only SDK, `GEMINI_MODEL` from env, system instruction constant, FACTS/QUESTION layout, low temperature, output cap, abort timeout, output validation, error classification (missing key / quota / timeout / 5xx / bad output) → fixed responses.
4. **Security tests (022):** injection phrases, secret requests, private-data requests, oversized/odd Unicode input, malformed JSON, header abuse; assert no secrets or internals appear in any response or log.
5. **Failure injection:** exercise every row of `ARCHITECTURE.md` §10 (mock the SDK and Prisma to fail).
6. **Smoke (optional):** ≤ 10 live questions after tests pass; sanitized outcomes only.
7. Confirm the page makes **no** chat/AI request on load.

## Outputs
Route Handler, server modules, tests, final limit values recorded in `ARCHITECTURE.md` §7.

## Checks
All §10 rows pass · the no-match path never calls the SDK (spy assertion) · responses use the fixed status shape · no stack traces/SQL/keys in responses · logs contain codes only.

## Stop conditions
Quota/eligibility unclear or billing would be required (stop event) · temptation to add embeddings/tools/search (forbidden) · retrieval repeatedly misses in-scope questions: tune keywords/intent map, **not** infrastructure.
