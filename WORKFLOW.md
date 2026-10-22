# WORKFLOW.md — Order of work, gates, and verification

Defines **the order of phases, the rules for moving between them, change control, and how work is verified**. It does not list individual small jobs (→ `tasks/`) or their status (→ `TODO.md`).
**Strictness:** every rule here is binding. "Should" does not appear in the normative sections.
**Autonomy:** inside a phase the agent works without asking permission for file/terminal actions (`AGENTS.md` §3). The only waits are the **owner gates** below and the **stop events** in `RULES.md` §12.

---

## 1. Core loop (every task)

```text
1 PREFLIGHT  re-read state, task, required docs, references          (AGENTS §4)
2 CLARIFY    list conflicts/blockers; stop events only if real
3 PLAN       ≤ 10 lines: files, behaviors, acceptance checks
4 IMPLEMENT  smallest coherent change, inside the allow-list
5 VERIFY     run the task's Verification section completely (§7)
6 REVIEW     reviewer pass: diff vs acceptance, RULES, design, scope
7 REPORT     completion report in the task file (AGENTS §9)
8 RECORD     update TODO.md §1 + task status; local commit
9 NEXT       take the next unblocked task (never skip ahead of the phase)
```
Phase-level rhythm: **understand docs → plan → implement one task → test → review → continue**.

## 2. Phase map

| Phase | Goal | Tasks | Exit gate |
|---|---|---|---|
| **0** | Documentation and design lock | 001 | **G0 — OWNER** (authorize implementation) |
| **1** | Project foundation | 002–003 | G1 — AUTO |
| **2** | Design system and shared UI | 004–007 | G2 — AUTO (evidence required) |
| **3** | Static portfolio sections | 008–016 | **G3 — OWNER** (visual/content acceptance) |
| **4** | Data preparation and PostgreSQL | 017–018 | G4 — AUTO |
| **5** | Chatbot backend | 019–022 | G5 — AUTO |
| **6** | Chatbot UI and integration | 023 | G6 — AUTO |
| **7** | Quality and security review | 024–025 | G7 — AUTO |
| **8** | Deployment and final acceptance | 026–027 | **G8 — OWNER** (V1.0 complete) |

## 3. Gate rules

### 3.1 Gate types
- **AUTO gate:** the agent itself checks the exit criteria with evidence. If every criterion has recorded evidence → advance **immediately, without asking**. Otherwise stay in the phase.
- **OWNER gate:** the agent produces a **gate package** (§9) and then **works only on non-dependent items** (see 3.3) until the owner replies. Owner silence is **not** approval.

### 3.2 Universal phase rules (all binding)
1. **No phase skipping, no reordering** of phases. Within a phase, follow task dependencies in `TODO.md`.
2. **Entry criteria must be true before the first task of a phase starts**; the agent records the check in that task's report.
3. **Exit requires**: all phase tasks `DONE`; `pnpm verify` green (from Phase 1 on); every acceptance criterion of every task evidenced; `TODO.md` current; local commit made; zero known regressions in earlier phases.
4. **No scope or stack change inside any phase.** Needs → change control (§6).
5. **A regression in an earlier phase's acceptance** (e.g. a Phase 5 change breaks the Phase 3 layout) **stops forward work**: fix it first, re-verify the earlier criteria, then continue.
6. **Do not build ahead.** Code for a later phase's task MUST NOT be written early (placeholders needed for structure are allowed only if the current task says so).
7. **Evidence or it didn't happen** (R-080).
8. **BLOCKED handling:** a blocked task never halts the project: mark it, record the diagnosis and the unblocking input in `TODO.md`, and continue with another unblocked task *of the same or an already-open phase*. If none exists, stop and report (stop event 6).

### 3.3 What may proceed while an OWNER gate is pending
| Pending gate | Allowed meanwhile | Not allowed |
|---|---|---|
| G0 | TASK-001 only (docs/folder intake). **No code, no installs, no scaffolding** | Anything in Phase 1+ |
| G3 | Phase 4 and Phase 5 tasks (backend/data work touches disjoint files) **if their entry criteria are met**; rework requested at the gate has priority | Phase 6, 7, 8 |
| G8 | Nothing new; fixes the owner requests | Marking V1.0 complete |

## 4. Phase specifications

### Phase 0 — Documentation and design lock (owner gate G0)
- **Goal:** the owner has reviewed the package, decided the open items, and design references and environment are in place.
- **Entry:** documentation package delivered.
- **Work:** TASK-001 (place `design/approved/` + README, init repo hygiene files that are *documentation-only*, confirm environment settings, confirm `AGENTS.md` is discovered).
- **Allowed:** Markdown, folder creation for docs/design, copying the 7 PNGs, `git init`.
- **Forbidden:** application code, `package.json`, installs, scaffolding, config, `.env*`, DB, deployment.
- **Exit / G0 package:** (a) PNGs present and listed; (b) owner answers to PRD §13 (C-01…C-11) and §14 (OD-xx) recorded in §15 — or the owner's "Approve all RECOMMENDED"; (c) owner confirms IDE settings (AGENTS §3.3); (d) owner writes **"Start Phase 1"** (or equivalent explicit authorization).

### Phase 1 — Project foundation (AUTO G1)
- **Entry:** G0 passed.
- **Work:** TASK-002 scaffold + conventions, TASK-003 verification tooling.
- **Forbidden:** any feature UI beyond a neutral placeholder page, content data, DB, AI.
- **Exit:** dev server runs; production build succeeds with **no** DB/Gemini credentials; `pnpm lint`, `typecheck`, `test` (even if trivial), `build` and aggregate `pnpm verify` documented and green; `.gitignore`/`.env.example` correct; versions recorded.

### Phase 2 — Design system and shared UI (AUTO G2, evidence required)
- **Entry:** G1 passed; C-01, C-02, C-05, C-11, DS-xx relevant decisions recorded (else the affected component is `BLOCKED`, others proceed).
- **Work:** TASK-004 tokens/fonts/theme, 005 primitives, 006 navigation, 007 opening overlay.
- **Forbidden:** section content, data/DB/chat code, new visual ideas.
- **Exit:** screenshots vs `1`, `3`, `5`, `6`, `7` (shared UI portions) in **both themes** and required viewports with every difference classified (DESIGN §14); no theme flash on reload; overlay fail-safe test; reduced-motion test; contrast table (DESIGN §3.3) completed for the tokens used.

### Phase 3 — Static portfolio sections (OWNER gate G3)
- **Entry:** G2 passed; TASK-008 data modules exist; owner-supplied assets/content are used **only if `VERIFIED`** — otherwise the section is built against clearly marked development placeholders and the task notes the dependency.
- **Work:** TASK-008 … 016.
- **Forbidden:** DB/chat code, extra sections, invented content, unverified data labelled VERIFIED.
- **Exit (agent):** all sections built; TASK-016 sweep complete (responsive × theme × states); no horizontal overflow; project grid verified with 4/5/6 cards; lightbox keyboard test; screenshots complete.
- **G3 package → owner reviews** look, content and the list of remaining content dependencies. Owner replies "approve" or a change list.

### Phase 4 — Data preparation and PostgreSQL (AUTO G4)
- **Entry:** (a) **OWNER ACTION done:** a Neon (or approved) database exists and the owner has put the privileged and, later, runtime connection strings into the **local** `.env` (the agent never creates accounts or requests secrets in chat); (b) OD-07 verified from official docs and recorded; (c) OD-03 settled; (d) relevant content records are `VERIFIED` (else seed only the verified subset and list the rest).
- **Work:** TASK-017 schema + migration, 018 seed + read-only role + negative write test.
- **Forbidden:** admin UI, public write paths, any second DB, running against a non-disposable database without the task's explicit authorization, printing secrets.
- **Exit:** migrations applied on the dev target; seed idempotent (double-run evidence); invalid-record seed writes nothing; **negative write test passes with the runtime role**; `SCHEMA.md` equals `schema.prisma`.

### Phase 5 — Chatbot backend (AUTO G5)
- **Entry:** G4 passed (or an explicitly mocked data layer for TASK-019, noted in the report); OD-05 checked for model/free-tier; `GEMINI_API_KEY` present in local `.env` for manual smoke tests (tests themselves mock Gemini).
- **Work:** TASK-019 contract/validation/rate limit, 020 retrieval + fallback, 021 Gemini integration + failures, 022 chatbot security tests.
- **Forbidden:** vector search/embeddings, tools for the model, retries, client-controlled query parameters, UI work.
- **Exit:** every row of `ARCHITECTURE.md` §10 has a passing test (success, no data, invalid, oversize, rate limit, DB failure, quota, missing key, timeout, bad output, unexpected); injection suite passes; no secret appears in responses/logs; no Gemini call on no-match.

### Phase 6 — Chatbot UI and integration (AUTO G6)
- **Entry:** G5 passed **and G3 passed** (the shell is owner-approved).
- **Work:** TASK-023.
- **Exit:** panel matches `2 MASTER DESIGN + CHATBOT AI.png` (after C-09); all states reachable (empty, loading, answer, no_data/out_of_scope, rate_limited, unavailable, error); mobile fit + safe area + keyboard; the **site stays fully usable with the API failing** (tested by forcing 503); focus and keyboard behavior verified.

### Phase 7 — Quality and security review (AUTO G7)
- **Entry:** G6 passed.
- **Work:** TASK-024 accessibility + responsive audit, 025 security + dependency review.
- **Exit:** audit findings all fixed or recorded as owner-approved exceptions; secret scan of files **and history** clean; runtime negative write test re-run; unused dependencies removed; headers/CSP decision recorded.

### Phase 8 — Deployment and final acceptance (OWNER gate G8)
- **Entry:** G7 passed; all content `VERIFIED`; release gate (R-016) script passes.
- **Work:** TASK-026 eligibility verification + deployment, 027 final audit + runbook.
- **Allowed (only here):** production deployment, environment variables in the host dashboard, production migrations/seed per task text with target verification, push to the repository default branch if the task says so.
- **Forbidden:** billing, plan upgrades, paid domain, silent provider switch.
- **Exit / G8 package:** acceptance table (PRD ACC-01…ACC-14) with evidence; cost/quota record with dates; known limitations; runbook; deployed URL. **V1.0 is complete only after the owner approves.**

## 5. Task lifecycle

`TODO` → `IN_PROGRESS` → `DONE`
`IN_PROGRESS` → `BLOCKED` (diagnosis + unblocking input recorded) → `IN_PROGRESS`
`DONE` → `REWORK` (owner/gate finding) → `IN_PROGRESS`
Rules: at most one `IN_PROGRESS` per agent; a task is `DONE` only with all acceptance criteria evidenced (R-084); status lives in both the task file and `TODO.md`.

## 6. Change control

| Change | Procedure |
|---|---|
| New feature / scope | **Not allowed.** Log in `PRD.md` §14.3 as a future idea and continue |
| Requirement, stack, provider, design or cost change needed | Stop event: write a **Change Request** (what, why, impact on scope/cost/security/design, smallest option) in the task report and as a new OD in `PRD.md` §14.1; wait for the owner; the owner updates the governing document |
| Conflict between approved sources | Report exact conflict (R-003) |
| Task file wrong/too big | Agent may split or amend **its own** task's allow-list/steps with a one-line justification and a note in `TODO.md`; may not change acceptance criteria to make them easier |
| Document edits | Per `AGENTS.md` §11 |
| Hotfix on a finished phase | Re-open the task as `REWORK`, fix, re-run that phase's exit checks |

## 7. Verification process

A task's *Verification* section lists which checks apply. Definitions:

| Check | Procedure | Evidence |
|---|---|---|
| **V-STATIC** | `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; or `pnpm verify` (commands finalized in TASK-003) | Command, exit code, summary lines |
| **V-VISUAL** | `design-implementation` + `ui-verification` skills: render at representative widths — wide desktop (≥ 1440), laptop (≈ 1280), tablet (≈ 768), mobile (≈ 360–390) — in **dark and light**; compare to the cited PNGs (DESIGN §14); chat open/closed and lightbox open where relevant | Screenshot list + difference table (fixed / intentional C-xx / open) |
| **V-A11Y** | Keyboard-only walkthrough; visible focus; accessible names; dialog focus return; reduced-motion emulation; contrast of new color pairs; alt text | Checklist with ✔/✘ |
| **V-SCOPE** | `git diff --name-only` ⊆ task allow-list; `package.json` diff vs approved stack; no new routes/sections | Diff summary |
| **V-SEC** | Secret scan of working tree (patterns for API keys / `postgres://` URLs), `.gitignore` check, client bundle contains no server env names, no `NEXT_PUBLIC_` secrets | Scan summary (no secret values) |
| **V-DB** | `prisma validate`, migration status, double seed run, invalid-record seed, negative write test with runtime role | Sanitized outputs |
| **V-CHAT** | Unit tests with mocked Gemini; failure-injection per ARCHITECTURE §10; optional ≤ 10 live smoke calls | Test names + pass counts |
| **V-LINKS** | Every external URL and asset path resolves; CV downloads | Table of URL → status |
Rules: run the **whole** listed set; "not run" must be stated with the reason; if a check cannot run in the environment, the task is `PARTIAL`, not `DONE`.

## 8. Failure handling and rollback

1. A failing check → diagnose the cause, fix it, re-run the **same** check (never weaken it).
2. Up to **3 distinct attempts**; then `BLOCKED` with: what failed, what was tried, hypotheses, the input needed.
3. A broken working tree you cannot repair: `git stash`/restore **only your own task's changes** (R-086); never discard unrelated work; never `git clean -x`.
4. A bad migration on the dev database: fix forward with a new migration or recreate the **disposable dev** database; never edit applied migrations; never touch non-dev.
5. A leaked secret: stop event → owner rotates (R-024).
6. Failed deployment: do not "fix" by enabling billing or switching providers; record and report.

## 9. Owner-gate packages (what the agent hands over)

| Gate | Package |
|---|---|
| **G0** | List of delivered docs; open C-xx/OD-xx with recommendations; checklist of IDE settings; PNG inventory; the exact sentence the owner can reply with ("Approve all RECOMMENDED. Start Phase 1.") |
| **G3** | Screenshots (desktop/tablet/mobile × dark/light, chat closed; lightbox open), difference table, content-dependency list (what is still placeholder/`DRAFT`), questions that need owner decisions |
| **G8** | ACC-01…ACC-14 table with evidence, release-gate output, cost/quota/billing record, known limitations, runbook link, deployed URL, V-LINKS table |
Approval phrasing is the owner's; record the quote and date in `PRD.md` §15 (R-009).

## 10. Standing prohibitions during work (pointer)
All prohibitions live in `RULES.md`; this file never relaxes them. When `WORKFLOW.md` and `RULES.md` appear to disagree, `RULES.md` wins.
