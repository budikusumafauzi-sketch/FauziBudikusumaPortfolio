# TASK-025 — Security and dependency review

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 7 — Quality and security review |
| **Hat** | Security |
| **Priority** | P0 |
| **Depends on** | TASK-023 |
| **Owner input needed** | none |
| **Skills** | `release-verification`, `prisma-postgres` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Audit secrets, environment, headers, dependencies, logs and database permissions before deployment.

## 2. Source requirements
`ARCHITECTURE.md` §9 · `PRD.md` NFR-SEC-01, NFR-PRV-01, ACC-08 · `RULES.md` §3, §5, §6

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §9, §11
- `RULES.md` §3, §5, §6
- `release-verification` skill

## 4. Preconditions
- Phase 6 exit met.

## 5. In scope
- Secret scan of the working tree **and full git history** (key patterns, DB URLs, tracked `.env*`); if anything is found → stop event (R-024).
- Environment audit: variable inventory vs `ARCHITECTURE.md` §11; privileged URL absent from anything deployable; no `NEXT_PUBLIC_` secrets; `.env.example` names only.
- Client bundle scan for server env names and secrets.
- Dependency review: `pnpm audit` triage (fix or document), remove unused packages, confirm only the approved stack; no analytics/tracking.
- Security headers: add safe defaults in `next.config` (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection); evaluate a CSP (inline theme script/nonces) and record the decision.
- Re-run the database negative write test with the runtime credential.
- Log review: only operational codes, no message text/keys/URLs.
- Route inventory: only `/` and `/api/chat` plus framework files.

## 6. Out of scope — do NOT do
- New features, third-party security services, paid scanners.

## 7. Files
**Allowed to create / modify**
- `next.config.*`
- `package.json`, lockfile (removals/updates needed for findings)
- `tests/**`
- `ARCHITECTURE.md` §9 (record decisions)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Run each audit; collect results; fix; re-run.
2. Document accepted risks explicitly (with owner mention if needed).

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** History and tree are free of secrets (scan summary, no values shown).
- **AC-2** Runtime environment list contains no privileged credential; no secret is exposed to the client.
- **AC-3** Negative write test passes again (sanitized evidence).
- **AC-4** Audit results triaged: high/critical issues fixed or documented with a justification.
- **AC-5** Headers are in place; the CSP decision is recorded.
- **AC-6** No unused dependencies; routes limited to the approved set.
- **AC-7** `pnpm verify` green.

## 10. Verification
- V-SEC
- V-DB
- V-STATIC
- V-SCOPE

## 11. Blocked / stop conditions
- Committed secret found → stop event; the owner rotates (R-024).
- A needed fix requires a stack change → stop event.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-025: <summary>`.)*
