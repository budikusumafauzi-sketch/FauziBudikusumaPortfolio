# TASK-027 — Final acceptance audit, release gate and runbook

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 8 — Deployment and final acceptance |
| **Hat** | QA / Reviewer |
| **Priority** | P0 |
| **Depends on** | TASK-026 |
| **Owner input needed** | Owner approval at Gate G8 |
| **Skills** | `release-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Prove V1.0 is complete: automated release-content gate, acceptance table ACC-01…ACC-14 with evidence, a runbook README, and the **Gate G8 package**.

## 2. Source requirements
`PRD.md` §10, §14.2 · `WORKFLOW.md` Phase 8, §9 · `RULES.md` R-016, R-080…R-084

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §10
- `WORKFLOW.md` Phase 8, §7, §9
- `release-verification` skill

## 4. Preconditions
- TASK-026 done (or its deployment evidence exists).

## 5. In scope
- Add a small release-gate check (e.g. `pnpm check:release`) that fails if shipped data/UI contain `DRAFT`, `NOT_PROVIDED`, `[OWNER TO PROVIDE]`, placeholder images, mock strings from the design exports, or unresolved asset paths. Run it.
- Walk ACC-01…ACC-14 and attach evidence to each (commands, screenshots, tables). Anything unmet is listed honestly.
- Write `README.md` (runbook): purpose, stack, setup, env var names, scripts, seed/migrations, test, deploy, known limitations (in-memory rate limit, free-tier quotas), recovery steps, how to update content.
- Final secret scan and `pnpm verify` on the release commit; record the commit hash.
- Prepare the **G8 package** (`WORKFLOW.md` §9): acceptance table, release-gate output, cost/quota/billing record, limitations, runbook link, live URL.

## 6. Out of scope — do NOT do
- New features, scope changes, declaring V1.0 complete without owner approval.

## 7. Files
**Allowed to create / modify**
- `README.md`
- `scripts/check-release.*` (one small file; justify in the report) and its `package.json` script
- `tests/**`
- `TODO.md`

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Create and run the release gate.
2. Collect evidence per ACC item; fix or report gaps.
3. Write the runbook; run the final checks; post the G8 package.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** The release-content gate passes on the release commit (output attached).
- **AC-2** Every ACC-01…ACC-14 has evidence, or is listed as unmet with the reason (no silent gaps).
- **AC-3** `README.md` lets a new person install, run, seed, test and deploy.
- **AC-4** `pnpm verify` is green and the secret scan is clean on the release commit.
- **AC-5** Cost/quota/billing record is current and billing is off.
- **AC-6** The G8 package is delivered; V1.0 is **not** declared complete until the owner approves.

## 10. Verification
- V-STATIC
- V-SEC
- V-LINKS
- V-SCOPE
- Release gate output

## 11. Blocked / stop conditions
- Owner gate G8 reached.
- Any unmet ACC without an owner-approved exception → V1.0 not complete; report.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-027: <summary>`.)*
