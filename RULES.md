# RULES.md — Rules that must never be broken

These rules protect **scope, truth, security, cost, data and design**. They override tasks, skills, and agent judgment. Each rule is written to be **testable**: it names how a violation is detected. If a task seems to require breaking a rule, the task is wrong — stop that task and report (see §13).

**Keywords:** MUST / MUST NOT are absolute. Rule IDs are stable and cited by other documents.
**What these rules do *not* restrict:** creating/editing files and running terminal commands inside the project to do the current task — that is pre-approved (`AGENTS.md` §3). Rules restrict *what* may be built or touched, not *whether the agent may act*.

---

## 1. Scope and change control

| ID | Rule | Violation is detected by |
|---|---|---|
| R-001 | MUST NOT add any feature, section, page, route, control or integration not in `PRD.md` V1.0 scope. The exclusion list (PRD §4.2) is binding. | Diff vs PRD requirement IDs; reviewer checklist |
| R-002 | MUST NOT change the stack, a library, a provider, or the architecture without an owner decision recorded in `PRD.md` §15. | `package.json` diff vs `ARCHITECTURE.md` §3 |
| R-003 | A true conflict between two approved sources MUST be reported (exact conflict, impact, smallest change) — never silently resolved. | Completion report has a "Conflicts" section when relevant |
| R-004 | MUST edit only files in the current task's "Allowed files". Anything else needs the task file to be amended first (agent may amend its own task's file list with a one-line justification if the change is required and in scope). | `git diff --name-only` vs task allow-list |
| R-005 | MUST work one task at a time, in dependency/phase order (`WORKFLOW.md`). | `TODO.md` shows at most one `IN_PROGRESS` task per agent |
| R-006 | MUST NOT start a phase whose entry criteria or owner gate are unmet. | `WORKFLOW.md` §3 checklist in the report |
| R-007 | MUST NOT perform unrequested refactors, renames, reformatting of untouched files, or "while I'm here" improvements. | Diff review |
| R-008 | Ideas outside scope MUST be written to `PRD.md` §14.3 (Future ideas), not implemented. | Repo contains no unlisted feature |
| R-009 | Owner decisions are recorded only when the owner states them (chat or direct edit). An agent MUST NOT record a decision on the owner's behalf or assume "approved". | `PRD.md` §15 entries quote/date the owner |

## 2. Truth and content

| ID | Rule | Detected by |
|---|---|---|
| R-010 | MUST NOT invent or "improve" any fact: names, titles, dates, employers, schools, projects, repo URLs, demo URLs, certificates, IDs, scores, statistics, testimonials, social links, achievements. | Data audit against owner-verified sources |
| R-011 | Design-mock imagery, captions, certificate art, IDs and hash/validity text in `design/approved/` are **not content** and MUST NOT ship (PRD C-10, DESIGN Rule 0). | Asset audit; grep for mock strings |
| R-012 | MUST NOT infer a URL from a handle/username. Missing → `[OWNER TO PROVIDE]`. | Grep data files |
| R-013 | MUST NOT add skill percentages, proficiency bars, stars, counters or "stats" without an owner-approved evidence model. | UI/data review |
| R-014 | `verification` may be set to `VERIFIED` only after an explicit owner statement; the date is recorded in a comment. | Data diff + report |
| R-015 | Repeated facts (dates, role names) MUST come from one data source and be identical everywhere. | Grep + UI check |
| R-016 | A **release build MUST NOT contain** `DRAFT`, `NOT_PROVIDED`, `[OWNER TO PROVIDE]`, placeholder images, lorem ipsum, fake links or mock design content. | Release-gate script/grep (TASK-027) |
| R-017 | UI language is English only; no language selector (pending C-01). | UI review |
| R-018 | MUST NOT publish any contact detail or personal data the owner has not approved (OD-11). No private address, phone, ID/account numbers. | Contacts data `approvedForPublic` audit |
| R-019 | No analytics, tracking pixels, or third-party embeds. | Network panel + dependency audit |

## 3. Secrets and security

| ID | Rule | Detected by |
|---|---|---|
| R-020 | Secrets (`GEMINI_API_KEY`, DB URLs, tokens) MUST be server-side only; MUST NOT use a public/client env prefix; MUST NOT appear in client bundles, `public/`, logs, screenshots, docs, tests, or chat replies. | Bundle/grep scan; code review |
| R-021 | `.env`, `.env.*` MUST be git-ignored (except `.env.example` containing names + dummy values only). Real secrets MUST NOT be committed. | `git check-ignore`, secret scan |
| R-022 | MUST NOT print, echo, `cat`, or dump environment/secret values to the terminal, reports or logs. When verifying a variable, check only that it is **set** (length/boolean). | Terminal transcript review |
| R-023 | Server-only modules (DB, Gemini, env, rate limit) MUST be importable only from server code (`import 'server-only'`). | Build fails if imported client-side |
| R-024 | A committed secret is **compromised**: stop, tell the owner to rotate it at the provider, and clean history per provider guidance. Deleting the line is not enough. | Secret scan on history |
| R-025 | External links opened in a new tab MUST include `rel="noopener noreferrer"`. | Lint/grep |
| R-026 | MUST NOT render model or visitor text as HTML (`dangerouslySetInnerHTML`, markdown-to-HTML) in the chat. | Grep |
| R-027 | MUST NOT create any public mutation endpoint, upload endpoint, arbitrary file-access path, or admin/auth surface. | Route inventory |
| R-028 | Every external input (request body, headers used, env) MUST be validated at the boundary (Zod) and bounded in size. | Tests |
| R-029 | Visitor-facing errors MUST be generic. MUST NOT leak stack traces, SQL, provider messages, keys, DB URLs, or internal paths. | Failure-injection tests |

## 4. Chatbot and AI

| ID | Rule | Detected by |
|---|---|---|
| R-030 | The chatbot answers only about approved public portfolio facts. No general knowledge, web search, browsing, or actions. | Prompt contract + tests |
| R-031 | Gemini MUST NOT be called when no relevant verified record was retrieved, or when the scope guard matched. | Unit tests assert the SDK is not called |
| R-032 | The model gets **no tools**: no function calling, code execution, grounding/search, file access, or SQL. | SDK config review |
| R-033 | Model output MUST be validated (non-empty, length-capped, finish reason ok, sanitized) before use; otherwise fall back. | Tests |
| R-034 | No automatic retry loops against Gemini or the database. | Code review |
| R-035 | Automated tests MUST mock Gemini. Live Gemini calls are limited to manual smoke tests (≤ 10 per task) to protect free quota. | Test code review |
| R-036 | The client MUST NOT be able to control retrieval parameters, table/column names, model, or generation settings. | Strict schema test |
| R-037 | The AI is called only in response to an explicit visitor message — never at page load/build. | Network trace on load |
| R-038 | The chat UI MUST NOT claim capabilities it lacks (booking, sending email, editing the site). | UI copy review |
| R-039 | Fallback texts are fixed constants (`ARCHITECTURE.md` §7), not generated. | Code review |

## 5. Database

| ID | Rule | Detected by |
|---|---|---|
| R-040 | PostgreSQL is the **only** database. No second database, cache or vector store. | Dependency audit |
| R-041 | The running site MUST connect with the **read-only** credential. The privileged credential MUST NOT exist in the deployed environment or any client code. | Env inventory; negative write test |
| R-042 | MUST NOT run destructive commands (reset, force-reset, drop, truncate, mass delete) against any database that is not explicitly disposable. | Command log; deny list |
| R-043 | Migrations/seeds against a **non-development** database run only inside a task that authorizes it, after printing and verifying the target (host + db name). | Task text + report |
| R-044 | Seed MUST validate before writing, be idempotent, run only from the developer machine, and never be reachable over HTTP. | Seed tests |
| R-045 | No public write path, admin UI, or DB credentials in the browser. | Route/bundle audit |
| R-046 | "Read-only" MUST NOT be claimed without an executed negative write test showing `INSERT/UPDATE/DELETE/TRUNCATE/CREATE/DROP` all denied. | Evidence in report |
| R-047 | Applied migrations MUST NOT be edited; fix forward with a new migration. | Git history |
| R-048 | Schema changes MUST go through versioned migrations (no hand-edited production schema, no schema-push shortcuts). | Migration folder vs schema |
| R-049 | The DB stores asset **paths**, never binaries. | Schema review |

## 6. Cost (Rp0)

| ID | Rule | Detected by |
|---|---|---|
| R-050 | MUST NOT enable billing, add a payment method, upgrade a plan, or accept a paid add-on — anywhere. | Provider dashboards (recorded) |
| R-051 | MUST NOT introduce a paid service, paid API, paid hosting, or purchased domain. Use provider-supplied subdomains. | Cost record |
| R-052 | Free-tier eligibility, quotas and data terms MUST be checked from official docs **before** provisioning/deploying (OD-05…07). | Dated record in `ARCHITECTURE.md` §11 |
| R-053 | When a quota is hit, degrade (fallback copy) and document — never upgrade. | Failure behavior tests |
| R-054 | MUST NOT add a third-party service/SDK not in the approved stack. | `package.json` diff |

## 7. Design fidelity and quality

| ID | Rule | Detected by |
|---|---|---|
| R-060 | `design/approved/` is the visual source of truth. MUST NOT redesign, restyle, or substitute a "better" layout. | Side-by-side comparison (DESIGN §14) |
| R-061 | MUST NOT invent exact colors/sizes/breakpoints. Measure from the PNGs; mark unknowns OPEN. | Token provenance |
| R-062 | MUST NOT paste screenshots (or crops) as production images, logos, or certificates. | Asset audit |
| R-063 | Design values MUST be centralized as tokens; no scattered raw hex/px values in components. | Grep for hex in components |
| R-064 | Every interactive element MUST implement default/hover/focus-visible/active (+ disabled/loading/error where relevant). | Manual checklist |
| R-065 | `prefers-reduced-motion` MUST be honored for entrance, marquee, overlay, carousel effects. | Emulated-media test |
| R-066 | Every UI MUST be correct in **both** themes. | Screenshots both themes |
| R-067 | Accessibility baseline (landmarks, headings, names, focus, contrast, alt text, modal focus management) is mandatory, not polish. | `ui-verification` skill checks |
| R-068 | Required viewports (wide desktop, laptop, tablet, narrow mobile) × both themes × chat open/closed × lightbox open MUST be inspected before a UI task is done. | Evidence in report |
| R-069 | Project grid MUST be 3/2/1 columns with the never-stretch last-row rule. | Test with 4, 5, 6 cards |

## 8. File economy (from the blueprint)

| ID | Rule |
|---|---|
| R-070 | Before creating a file: inspect the tree, check whether the code fits an existing module, and state a concrete reason in the report if a new file is needed. |
| R-071 | Do not create barrel files, one-line wrappers, redundant re-exports, duplicate config files, or files that hold a few lines that fit an existing module. |
| R-072 | Do not split a working module just to follow a folder convention; do not merge unrelated responsibilities into one oversized file. |
| R-073 | Keep separate files where separation has a concrete benefit: server-only/security-sensitive code, DB access, API handlers, reusable UI, independently testable logic, or framework requirements. |
| R-074 | Prefer framework defaults and existing conventions over extra configuration files. Structural changes are explained in the task summary. |

## 9. Evidence and honesty

| ID | Rule |
|---|---|
| R-080 | MUST NOT claim a check, test, build, deployment or visual match succeeded unless it was actually run in this task and the result observed. |
| R-081 | Every completion report MUST list the commands run, exit status, and the key output lines (secrets redacted). |
| R-082 | MUST NOT make a failing check pass by disabling, skipping, weakening or deleting it (no `--no-verify`, no blanket `ts-ignore`/`eslint-disable`, no removing tests, no loosening Zod to accept bad data). |
| R-083 | After **3 distinct fix attempts** on the same failure, stop attempting: mark the task `BLOCKED` with diagnosis, then continue with an independent task (or stop if none). |
| R-084 | A task is `DONE` only when every acceptance criterion has recorded evidence. Partial work is `IN_PROGRESS` or `BLOCKED`. |
| R-085 | Unknowns MUST be stated as unknown (OPEN DECISION/ASSUMPTION), never filled with plausible guesses. |
| R-086 | MUST NOT delete or overwrite known-good work, or perform unreviewed mass rewrites. Deletions are limited to files created in the current task; moves use `git mv`. |

## 10. Terminal, Git and destructive operations

| ID | Rule |
|---|---|
| R-090 | Commands run inside the project directory only. No `sudo`, no global installs, no system-wide configuration, no touching files outside the workspace. |
| R-091 | **Forbidden command patterns** (also add to the IDE deny list — `AGENTS.md` §3.3): `rm -rf` on `/`, `~`, `*`, `..`, or any path outside the project · `git push --force` / `-f` / `--force-with-lease` · `git clean -x…` (may delete `.env`) · `git reset --hard` on a branch with unpushed work you did not create · `prisma migrate reset` · `prisma db push --force-reset` · `prisma db execute`/raw SQL against a non-development target without task authorization · `DROP DATABASE/SCHEMA`, `TRUNCATE` on non-disposable data · `vercel --prod` / any production deploy outside TASK-026 · `curl … | sh` / `wget … | sh` · `chmod -R 777` · printing env (`printenv`, `env`, `echo $SECRET`, `cat .env*`). |
| R-092 | MUST NOT try to bypass a deny list or sandbox (obfuscated commands, alternate shells, scripts that wrap a denied command). A denied command means "stop and report". |
| R-093 | Git: commit locally at the end of each accepted task with a clear message (`TASK-0xx: summary`). MUST NOT commit secrets, `node_modules`, build output, or the `design/approved` working copies if the owner keeps them elsewhere. Pushing is allowed only to a non-default branch, or in TASK-026; never force-push. |
| R-094 | New dependencies: only the approved stack plus dev-only support directly required by the task (types, test runner approved in OD-01, `tsx` for the seed). List every added package and why in the report. Runtime dependencies outside the approved stack are forbidden. |
| R-095 | Long-running processes (dev server) MUST be stopped before reporting completion. |

## 11. Autonomy boundaries

| ID | Rule |
|---|---|
| R-100 | Creating/editing/deleting files **inside the project that the current task covers**, and running terminal commands **permitted by this document**, requires **no** owner permission. The agent MUST NOT ask "may I?" for these. |
| R-101 | The agent MUST stop and ask only for the events in §12. Asking permission for routine file or terminal work is itself a process violation (it wastes the owner's time). |
| R-102 | Autonomy never extends to: changing requirements, spending money, touching non-disposable databases, publishing/deploying (outside TASK-026), or handling secrets unsafely. |

## 12. The only stop events (hard stops)

The agent stops and reports (it does **not** guess) when:
1. A step would incur or enable **cost/billing** (R-050/051).
2. A **scope, stack, provider, architecture or design change** is needed (R-001/002/060).
3. Two approved sources **conflict** and the choice changes a requirement/design/cost/technology (R-003).
4. A **destructive operation on a non-disposable database** or a production write not authorized by the current task (R-042/043).
5. A **secret exposure** is suspected or happened (R-024).
6. **Owner-only input** is required (asset, verified fact, account action, credential, approval at a gate) — mark the task `BLOCKED`, then continue with any independent unblocked task.
7. A deny-listed command would be required (R-092).
8. An owner gate in `WORKFLOW.md` has been reached.

## 13. If a rule and a task disagree
The rule wins. Mark the task `BLOCKED`, write the exact conflict in the task's completion report and in `TODO.md`, propose the smallest fix, and continue with another task. Do not edit this file to make a task fit; only the owner changes rules.
