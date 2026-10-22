# TASK-003 — Verification tooling and the `pnpm verify` gate

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 1 — Project foundation |
| **Hat** | Architect (+ QA) |
| **Priority** | P0 |
| **Depends on** | TASK-002 |
| **Owner input needed** | Decision OD-01 (test tooling) — default RECOMMENDED: Vitest |
| **Skills** | `release-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Define the standard quality commands so every later task has an executable definition of "green": `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and the aggregate `pnpm verify`.

## 2. Source requirements
`ARCHITECTURE.md` §13 · `WORKFLOW.md` §7 · `PRD.md` ACC-14 · OD-01

## 3. Required reading (only these, only the relevant sections)
- `ARCHITECTURE.md` §3, §13
- `WORKFLOW.md` §7
- `RULES.md` R-082, R-094

## 4. Preconditions
- TASK-002 done and green.
- OD-01 recorded (or "Approve all RECOMMENDED"). If the owner chose differently, follow the decision.

## 5. In scope
- Add scripts: `lint`, `typecheck` (`tsc --noEmit`), `test`, `build`, and `verify` (runs them in order and fails on the first failure).
- Install and configure Vitest (dev dependency) with a minimal config and one smoke test proving the runner works.
- Make scripts cross-platform (no bash-only syntax).
- Record the final command list in `ARCHITECTURE.md` §13 (record only).

## 6. Out of scope — do NOT do
- Playwright or any second test framework (only if OD-01 approves it — then it gets its own task note).
- Husky/lint-staged or other git hooks.
- Writing feature tests (later tasks).

## 7. Files
**Allowed to create / modify**
- `package.json`, `pnpm-lock.yaml`
- `vitest.config.ts`, `tests/smoke.test.ts`
- ESLint/TS config tweaks needed for the scripts
- `ARCHITECTURE.md` §13 (record the commands)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Add `typecheck` and `verify`; add Vitest and `test`.
2. Write one smoke test (e.g. asserts a trivial pure function).
3. Run each script individually, then `pnpm verify`.
4. Prove the gate works: temporarily break a test or type, confirm `verify` fails with a non-zero exit, then revert.
5. Record commands in `ARCHITECTURE.md` §13.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` each exit 0.
- **AC-2** `pnpm verify` runs all four in order and exits 0.
- **AC-3** A deliberate failure makes `pnpm verify` exit non-zero (evidence shown), and was reverted.
- **AC-4** Scripts contain no OS-specific shell syntax.
- **AC-5** `ARCHITECTURE.md` §13 lists the final commands.

## 10. Verification
- V-STATIC (full `pnpm verify`).
- V-SCOPE (dependencies added = Vitest + its direct peers only).

## 11. Blocked / stop conditions
- A required tool cannot be installed → `BLOCKED` with the error.
- Temptation to add hooks/extra tooling → not allowed without owner approval.

## 12. Completion Report

## Completion Report — TASK-003 — 2026-10-22
**Status:** DONE
**Summary:** Configured standard verification tooling (`lint`, `typecheck`, `test`, `build`, `verify`) using ESLint, strict TypeScript compiler check, Vitest v5.0.5 with smoke testing in `tests/smoke.test.ts`, and Next.js Turbopack build. Confirmed individual execution and aggregate `pnpm verify` gate, proven gate failure on broken assertions, and recorded final commands in `ARCHITECTURE.md` §13.
**Files:**
- created: `vitest.config.ts`, `tests/smoke.test.ts`
- modified: `package.json`, `pnpm-lock.yaml`, `ARCHITECTURE.md`, `tasks/TASK-003-verification-tooling.md`
**Dependencies added:** `vitest@5.0.5` (devDependency)
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | ESLint exited with 0 warnings/errors |
| `pnpm typecheck` | PASS | `tsc --noEmit` exited 0 with strict compiler validation |
| `pnpm test` | PASS | Vitest run passed `tests/smoke.test.ts` (1 test passed in 148ms) |
| `pnpm build` | PASS | `next build` compiled static routes in 190ms with 0 errors |
| `pnpm verify` (clean) | PASS | Runs all 4 sequentially, exits 0 |
| `pnpm verify` (deliberate fail) | PASS | Failed on broken smoke test (`AssertionError: expected 2 to be 3`) with exit code 1; stopped before `next build`. Reverted cleanly. |
**Acceptance criteria:**
- AC-1 ✔ — `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` each exit 0.
- AC-2 ✔ — `pnpm verify` runs all four in order and exits 0.
- AC-3 ✔ — Deliberate failure made `pnpm verify` exit 1 with explicit assertion error; reverted and verified green.
- AC-4 ✔ — Scripts contain only cross-platform npm/pnpm commands (`pnpm lint && pnpm typecheck && pnpm test && pnpm build`).
- AC-5 ✔ — `ARCHITECTURE.md` §13 documents the final commands, targets, and exit behaviors.
**Rule & scope check:** Followed R-082, R-094. No git hooks or extraneous test frameworks added.
**Conflicts / open decisions encountered:** None (OD-01 resolved: Vitest adopted).
**Known gaps:** None.
**Next task:** Gate G1 (AUTO GATE) passed -> Phase 1 complete. Stop before Phase 2.
