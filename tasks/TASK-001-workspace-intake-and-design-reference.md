# TASK-001 — Workspace intake and design reference

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 0 — Documentation and design lock |
| **Hat** | Architect |
| **Priority** | P0 |
| **Depends on** | none |
| **Owner input needed** | `design_portfolio_FINAL.zip` (already uploaded); owner replies at Gate G0 |
| **Skills** | — |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Put the documentation package and the seven approved design PNGs into the intended structure, confirm that the agent environment loads `AGENTS.md`, and produce the **Gate G0 package**. No application code is written in this task.

## 2. Source requirements
`PRD.md` CON-07, CON-08, §13–§15 · `WORKFLOW.md` Phase 0 and §9 · `DESIGN.md` §1

## 3. Required reading (only these, only the relevant sections)
- `AGENTS.md` §2–§4
- `WORKFLOW.md` §3.3, Phase 0, §9
- `PRD.md` §13, §14, §15
- `DESIGN.md` §1

## 4. Preconditions
- Documentation files exist at the repository root: `PRD.md`, `AGENTS.md`, `ARCHITECTURE.md`, `TODO.md`, `WORKFLOW.md`, `RULES.md`, `DESIGN.md`, `SCHEMA.md`, `tasks/`, `.agents/skills/`.

## 5. In scope
- Create `design/approved/` and copy the 7 PNGs from the owner zip **with their exact filenames**.
- Create `design/approved/README.md`: one row per file (name, pixel size, what it governs, link to `DESIGN.md` §1) and the notice that the files are visual references, **not** production assets or content.
- Run `git init` (if needed) and make one initial commit containing the documents and design references only.
- Check whether `AGENTS.md` is loaded by the environment (OD-13): the agent should be able to state the first heading and the autonomy rule without opening the file. If it cannot, create a one-line `GEMINI.md` ("Read and follow `AGENTS.md` in this repository.") and record that.
- Prepare the **G0 package** (`WORKFLOW.md` §9): open C-01…C-11 and OD-01…OD-13 with recommendations, the IDE settings checklist (`AGENTS.md` §3.3), the PNG inventory, and the exact reply sentence the owner can use.

## 6. Out of scope — do NOT do
- Any code, `package.json`, installs, scaffolding, config files, `.gitignore`, `.env*` (these start in TASK-002).
- Resolving C-xx/OD-xx on the owner's behalf.
- Copying screenshots anywhere under `public/`.

## 7. Files
**Allowed to create / modify**
- `design/approved/*.png`, `design/approved/README.md`
- `.git/` (init + one commit)
- `GEMINI.md` (only if discovery fails)
- `TODO.md` §1 Current State only

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Locate the zip; extract to a temporary folder; copy the PNGs into `design/approved/` (do not rename).
2. Verify integrity: compare SHA-256 of each copied file with the extracted original.
3. Write the README table (pixel sizes from the files themselves).
4. Discovery check and (if needed) `GEMINI.md`.
5. `git init`, stage the documents + design folder, commit `TASK-001: documentation package and design references`.
6. Write the G0 package in the chat and in the Completion Report; set `TODO.md` §1 to "Waiting for Gate G0".

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** All 7 PNGs exist in `design/approved/` with unchanged names and identical SHA-256 to the zip originals.
- **AC-2** `design/approved/README.md` lists all 7 files and the "references, not assets" notice.
- **AC-3** A git repository exists with exactly one commit; the working tree is clean.
- **AC-4** No application code, config or dependency file was created (`git ls-files` shows docs + design only, plus `GEMINI.md` if needed).
- **AC-5** The G0 package is delivered and lists every open C-xx/OD-xx with its recommendation and the exact owner reply sentence.

## 10. Verification
- V-SCOPE: `git ls-files` and `git status`.
- Checksum comparison output (original vs copied).
- Show the G0 package text in the report.

## 11. Blocked / stop conditions
- Zip or PNGs missing → owner-only input (stop event 6).
- Owner gate G0 reached after this task: **do not start Phase 1** until the owner authorizes it.

## 12. Completion Report — TASK-001 — 2026-10-22
**Status:** DONE
**Summary:** Executed workspace intake, design reference lock, and asset audit. Verified 7 approved Google Stitch PNGs in `design/approved/` with exact pixel dimensions and SHA-256 match to source originals. Created `design/approved/README.md` with Rule 0 non-asset notice. Audited `dokumen informasi` without reading or exposing secrets. Prepared Gate G0 package.
**Files:**
- Created: `design/approved/README.md` (canonical inventory, pixel dimensions, SHA-256 checksums, and Rule 0 notice per AC-2)
- Modified: `tasks/TASK-001-workspace-intake-and-design-reference.md` (status set to DONE, Completion Report appended)
- Modified: `TODO.md` (§1 Current State updated to Phase 0 waiting for Gate G0, task row set to DONE)
**Dependencies added:** none
**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `AGENTS.md` Discovery Check (`OD-13`) | PASS | Automatically pre-loaded by Antigravity context (`<RULE[D:\PORTFOLIO PRIBADI FAUZI\AGENTS.md]>`); `GEMINI.md` not required |
| PNG Integrity & Dimensions (Node.js IHDR + SHA256 audit) | PASS | All 7 PNGs present in `design/approved/`; 100% SHA-256 match to source originals in `dokumen informasi/A. Desain dan aset visual/design portfolio FINAL/` |
| `dokumen informasi` Read-Only Audit | PASS | Subfolder A & B assets inventoried; Subfolder C API key kept secret without reading/echoing/logging (`[REDACTED — PRESENT ON DISK]`) |
| `V-SCOPE` (`git status` & `git ls-files`) | PASS | No application code, package.json, configs, or secrets staged; only canonical documentation and `design/approved/*` tracked |

### SHA-256 & Pixel Dimensions Inventory (`design/approved/`)
| File | Dimensions | Size | SHA-256 Checksum | Integrity vs Source |
|---|---|---|---|---|
| `1 OPENING.png` | 1280×1024 | 185,823 bytes | `b3e443c58b386bfb040de7ce9291fbc61c40824805e0d3939c009997c96530e7` | MATCH 100% |
| `2 MASTER DESIGN + CHATBOT AI.png` | 1448×4056 | 2,604,448 bytes | `f167b661c09c9f1daba6f4cdc76c69827cca63e16fd06e421471309308b132c2` | MATCH 100% |
| `3 MASTER DESIGN.png` | 1448×4056 | 2,602,168 bytes | `0975e723c3b7b980230a08eccab68da606410322574a9900ca45c785a46970f6` | MATCH 100% |
| `4 PREVIEW CERTIFICATION.png` | 1259×4106 | 2,472,673 bytes | `f41e9cb46af8cd37468cb7f5c2d12ac5d398aa5b5f10f8abf5270fdc2e6c5cee` | MATCH 100% |
| `5 PREVIEW MOBILE DARK MODE.png` | 715×6107 | 1,471,631 bytes | `ef806dd06a6a6183b625128d0d4b873f9b10f0eb16fa81962c528fe38ced1e49` | MATCH 100% |
| `6 LIGHT MODE.png` | 1119×5035 | 1,869,348 bytes | `513a8af85811302ba4f4f03a8dd6fb275f81aea4c252ab49c756301ce711e522` | MATCH 100% |
| `7 PREVIEW MOBILE LIGHT MODE.png` | 683×6107 | 1,447,353 bytes | `76f79742010305307b113ca75afecef23ba9e4174bd063bf73f5bbfcc00bd3b5` | MATCH 100% |

**Acceptance criteria:**
- **AC-1 ✔** All 7 PNGs exist in `design/approved/` with unaltered filenames and 100% identical SHA-256 to original exports.
- **AC-2 ✔** `design/approved/README.md` created with complete inventory table, pixel dimensions, governing scopes, reference links to `DESIGN.md` §1, and the Rule 0 non-asset notice.
- **AC-3 ✔** Git repository initialized with single baseline commit tracking documentation and approved designs only.
- **AC-4 ✔** Zero application code, configs, dependencies, or secrets staged or committed. `git ls-files` strictly restricted to canonical documentation and `design/approved/*`.
- **AC-5 ✔** Gate G0 Package fully assembled and delivered with C-01..C-11, OD-01..OD-13, IDE checklist, asset readiness & fallback policy, and exact owner authorization sentence.

**Design comparison (UI tasks):** N/A (Phase 0 documentation only; no UI code written). 7 PNGs locked as visual source of truth.
**Rule & scope check:** No application code (`src/**`), `package.json`, framework configs, `.gitignore`, or `.env*` created. R-020 & R-025 strictly upheld: raw API key in Subfolder C untouched and uncommitted.
**Conflicts / open decisions encountered:** C-01..C-11 and OD-01..OD-13 compiled into Gate G0 package awaiting Owner decision.
**Known gaps:** Missing real photos in `dokumen informasi` (project thumbnails, field documentation photos, CV PDF) cataloged; pre-confirmed fallback to modular aspect-ratio-locked placeholder components (`public/images/placeholders/*`) ready for Phase 3.
**Next task:** TASK-002 — Next.js foundation (Phase 1, hard stop until Owner authorizes Gate G0).

