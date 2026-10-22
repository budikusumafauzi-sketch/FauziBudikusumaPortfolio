# tasks/ — Task files

One file per task: `TASK-0xx-<slug>.md`. Each task is small enough to be reviewed before the next one starts. **This folder holds the work instructions; `TODO.md` holds the overview and status.**

## Rules
1. **One task at a time**, in phase/dependency order (`WORKFLOW.md`). Start only after the preconditions are true.
2. A task contains: objective, source requirements, required reading, preconditions, in/out of scope, allowed files, files that must not change, implementation guidance, acceptance criteria (`AC-n`), verification, stop conditions, and a completion report.
3. **Allowed files are a hard boundary** (R-004). If a needed file is missing from the list, the agent adds it to *its own task's* list with a one-line justification (in scope only) — never silently edits outside it.
4. The agent may **split** a task that proves too large, or **amend steps**, but may not weaken acceptance criteria.
5. A task is `DONE` only when **every** `AC` has recorded evidence (R-084). Statuses: `TODO` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `REWORK`.
6. When finished: append the Completion Report (template in `AGENTS.md` §9), set `Status`, update `TODO.md` §1 and §3, commit `TASK-0xx: <summary>`.
7. No permission requests for in-scope file edits or permitted terminal commands (`AGENTS.md` §3).
8. Task numbering is fixed; new tasks get the next free number and are added to `TODO.md`.

## Template for a new task
```markdown
# TASK-0xx — Title
| Field | Value |  (Status · Phase · Hat · Priority · Depends on · Owner input needed · Skills)
## 1. Objective
## 2. Source requirements        (PRD IDs, doc sections, rules)
## 3. Required reading
## 4. Preconditions
## 5. In scope
## 6. Out of scope — do NOT do
## 7. Files                       (Allowed / Must NOT change)
## 8. Implementation guidance
## 9. Acceptance criteria         (AC-1 … each verifiable)
## 10. Verification               (V-STATIC / V-VISUAL / V-A11Y / V-SCOPE / V-SEC / V-DB / V-CHAT / V-LINKS + specifics)
## 11. Blocked / stop conditions
## 12. Completion Report
```

## Index
See `TODO.md` §3 for the ordered list with status, priority and dependencies.
