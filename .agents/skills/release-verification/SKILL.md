---
name: release-verification
description: Use at phase exits, security/dependency review, deployment preparation and the final V1.0 acceptance audit. Defines the evidence-based checks for lint/type/test/build, secret scan, release content gate, links/assets, cost record and runbook. Not for building features.
---

# Release and final verification

## When to use
G1/G2 evidence, TASK-003 (define the commands), TASK-025, TASK-026, TASK-027, and any "is this done?" question.

## Procedure
1. **Static gate:** run `pnpm verify` (lint → typecheck → test → build). Record exit codes and summary lines. A failing check is fixed, never weakened (R-082).
2. **Scope audit:** `git diff` names vs the allow-list; `package.json` vs `ARCHITECTURE.md` §3; list routes (only `/`, `/api/chat` and framework files); confirm no admin/auth/form/filter/search/detail-modal/analytics.
3. **Secret audit:** scan the working tree **and git history** for key/URL patterns (Google API key prefix, `postgres://`, `postgresql://`, tracked `.env` files); confirm `.gitignore`; confirm no server env name is in the client bundle; confirm no `NEXT_PUBLIC_` secret. Never print matched secret values.
4. **Release content gate (R-016):** grep shipped data/UI for `DRAFT`, `NOT_PROVIDED`, `[OWNER TO PROVIDE]`, lorem ipsum, mock strings from the design exports (e.g. the mock certificate names, hash/validity text), placeholder images; every project link status is `VERIFIED` or a non-link by design.
5. **Links and assets (V-LINKS):** every external URL and every `public/assets/**` path referenced exists; the CV downloads on desktop and mobile; build the table `URL/path → status`.
6. **Dependency review:** list runtime deps; remove unused ones; confirm only the approved stack.
7. **Cost and eligibility record (R-052):** from official pages and provider dashboards, record the dated plan/quota/billing state of hosting, Neon and Gemini; confirm billing is off and no payment method was added. If a service is ineligible: stop event with a free alternative proposal.
8. **Database re-check:** negative write test with the runtime role; the runtime env contains no privileged URL.
9. **UI/a11y:** run the `ui-verification` skill on the production build.
10. **Acceptance table:** map PRD ACC-01…ACC-14 → evidence; anything unmet is listed, not hidden.
11. **Runbook (README):** install, run, seed, test, env var names, deploy, known limits (in-memory rate limit, free-tier quota), recovery steps.

## Outputs
Acceptance table, scan summaries, cost record, runbook, gate package (`WORKFLOW.md` §9).

## Stop conditions
Any unmet acceptance criterion with no owner-approved exception means V1.0 is **not** complete; report precisely what is missing.
