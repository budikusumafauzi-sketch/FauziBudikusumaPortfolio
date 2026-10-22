# TASK-008 — Typed content data modules

| Field | Value |
|---|---|
| **Status** | `TODO` |
| **Phase** | 3 — Static portfolio sections |
| **Hat** | Architect |
| **Priority** | P0 |
| **Depends on** | TASK-003 |
| **Owner input needed** | Owner verification of facts/assets over time (items stay DRAFT/NOT_PROVIDED until then) |
| **Skills** | `prisma-postgres` (field reference only) |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Create the typed, validated content modules in `src/data/` that every static section reads, with the verification-state model, so that no section ever contains hard-coded content and nothing unverified can be mistaken for final.

## 2. Source requirements
`PRD.md` FR-GLB-03, §8 (truth rules, inventory), OD-02, OD-09 · `SCHEMA.md` §2, §5 · `RULES.md` R-010…R-016

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §8
- `SCHEMA.md` §2, §4, §5
- `ARCHITECTURE.md` §4, §6
- `DESIGN.md` §12 (copy defects to resolve)

## 4. Preconditions
- TASK-003 done.
- OD-02 recorded (RECOMMENDED: TypeScript modules validated by Zod).

## 5. In scope
- Install `zod`.
- Create modules: `profile`, `journey`, `skills`, `projects`, `certifications`, `gallery`, `contacts`, and extend `site-config` (CV path/download name, metadata) following the field reference in `SCHEMA.md` §5. Every item has `id`, `verification`, `position`.
- Populate from `PRD.md` §8.2 as **DRAFT** (design-observed) or `NOT_PROVIDED` + `[OWNER TO PROVIDE]`. Do **not** carry over mock content (mock gallery captions, certificate art names/IDs, hash/validity text, mock thumbnails). Gallery: four neutral `NOT_PROVIDED` fixture items so layout can be built.
- Resolve copy inconsistencies to **one** wording and list them for the owner: timeline dates/roles (desktop vs mobile), stray line break, the Enterprise Network Lab description/tag mismatch (leave the description `NOT_PROVIDED` rather than guess).
- Zod schemas: lengths, URL schemes (`https`; `mailto` only for the approved email), unique ids, `VERIFIED` items must not contain `[OWNER TO PROVIDE]`, `VERIFIED` asset paths must exist on disk.
- `contacts`: `approvedForPublic: false` until OD-11; URLs are **never** inferred from handles.
- Tests (`tests/content.test.ts`) enforcing the above.

## 6. Out of scope — do NOT do
- Prisma, seed, `buildKnowledgeRecords()` (TASK-018).
- UI components.
- Marking anything `VERIFIED` without an explicit owner statement.

## 7. Files
**Allowed to create / modify**
- `src/data/*.ts`
- `tests/content.test.ts`
- `package.json` (+ `zod`)
- `PRD.md` §8.2 (state column, only on owner statement)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Define the shared `Verification` type and a helper that validates a module.
2. Write each module with the design-observed facts as DRAFT.
3. Write validation tests including negative cases (invalid URL, duplicate id, VERIFIED with placeholder).
4. Produce the "owner verification list": every DRAFT/NOT_PROVIDED item grouped by module.

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** All modules exist, are typed, and pass Zod validation in `pnpm test`.
- **AC-2** No item is `VERIFIED` unless the owner said so (recorded with a date).
- **AC-3** No mock design content exists in any module.
- **AC-4** Inconsistencies are resolved to single wording and listed for the owner; nothing is guessed.
- **AC-5** No URL is derived from a handle; contacts are not approved for public yet.
- **AC-6** The owner verification list is part of the report.

## 10. Verification
- V-STATIC (tests include the negative cases)
- V-SCOPE
- Grep for `lorem`, mock strings from `DESIGN.md` §12

## 11. Blocked / stop conditions
- Owner states a fact differently from the design → follow the owner and record it.

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-008: <summary>`.)*
