# TASK-026 — Service eligibility check and deployment

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 8 — Deployment and final acceptance |
| **Hat** | Architect (+ Security) |
| **Priority** | P0 |
| **Depends on** | TASK-024, TASK-025; Gate G7 |
| **Owner input needed** | **OWNER ACTIONS:** a GitHub repository/remote and a hosting account (logged-in CLI or dashboard); entering production environment variables in the host dashboard (or logging in the CLI) — the agent never receives secrets in chat |
| **Skills** | `release-verification`, `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Verify from official sources that hosting, database and Gemini free tiers are eligible for this use, record the result, deploy without any billing, and verify the live site.

## 2. Source requirements
`ARCHITECTURE.md` §11 · `PRD.md` CON-01, ACC-13, OD-05…OD-07 · `RULES.md` R-043, R-050…R-053

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §9, §11
- `SCHEMA.md` §7–§9
- `RULES.md` §5, §6, §10
- Official pricing/terms/quota pages of the hosting provider, Neon and Gemini (current at implementation date)

## 4. Preconditions
- Gate G7 passed; all content `VERIFIED`; the release gate (TASK-027 script, or its manual equivalent) passes.

## 5. In scope
- Open the **official** terms/pricing/limits pages for hosting, Neon and Gemini; record plan, relevant quotas, any non-commercial/portfolio-use language, data-use terms for the Gemini free tier, and the date. Ineligible or unclear → stop event with a compliant free alternative (OD-06).
- Push to the repository (non-default branch or default branch as the owner configured; never force-push).
- Connect the project to the host; set environment variables **in the host dashboard** (`DATABASE_URL` read-only, `GEMINI_API_KEY`, `GEMINI_MODEL`); verify only that they are *set*. The privileged URL is **not** set there.
- Production database: verify the target (host + db), apply committed migrations with the non-interactive deploy command from the local machine, run the validated seed once (confirmation flag). No reset/force commands.
- Verify the deployed site: all routes/assets, CV download, links, theme, lightbox, chat success + a failure path, and the **client-IP/rate-limit header behavior** on the host (finalize the trusted-header rule); check the function time limit vs the chat time budget.
- Confirm billing is off and no payment method is attached; record dashboards' plan states.

## 6. Out of scope — do NOT do
- Paid plans, add-ons, purchased domains, switching providers silently, changing code beyond deployment fixes.

## 7. Files
**Allowed to create / modify**
- `ARCHITECTURE.md` §7, §11 (records)
- Deployment configuration files required by the host (only if truly needed)
- Local git operations; host CLI commands for deployment
- `TODO.md`

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Eligibility verification first; stop if unclear.
2. Deploy; verify; fix deployment-only issues in place.
3. Production migration + seed with target verification.
4. Run `ui-verification` smoke and `release-verification` checks against the live URL.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Dated eligibility record for hosting, Neon and Gemini exists in `ARCHITECTURE.md` §11 with source pages.
- **AC-2** The live site loads over HTTPS; all sections, assets and the CV work (V-LINKS table).
- **AC-3** Chat works end-to-end and degrades cleanly with a forced failure; no AI call on load.
- **AC-4** Production uses the read-only credential; the privileged URL is not in the host environment (list shown without values).
- **AC-5** The production negative write test passes.
- **AC-6** Billing is off and no payment method was added (dashboard evidence).
- **AC-7** Client-IP rule and function time limit verified and recorded.

## 10. Verification
- V-LINKS
- V-DB
- V-SEC
- V-VISUAL (smoke on live URL)
- V-CHAT (live smoke ≤ 10)

## 11. Blocked / stop conditions
- Any provider requires a card/billing → stop event (R-050).
- Eligibility unclear → stop event.
- Production migration/seed target cannot be verified → stop event.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-026: <summary>`.)*
