# TODO.md — Project-level overview

**Purpose:** what remains, in what order, with status, priority, dependencies and links. **Not** where implementation instructions live (those are in `tasks/`).
**Updated by:** the agent at the end of every task (`AGENTS.md` §8). Owner-only gate approvals are recorded in `PRD.md` §15.
**Status values:** `TODO` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `REWORK` · **Priority:** P0 (must for V1.0) · P1 (must, lower urgency).

---

## 1. Current State  *(overwrite this block at the end of every task)*

| Field | Value |
|---|---|
| Date | 2026-10-23 |
| Current phase | **5 — Chatbot backend** |
| Waiting for | Execution of Phase 5 tasks |
| Last completed task | TASK-021 — Gemini integration and failure handling |
| Next task | TASK-022 — Chatbot security and abuse tests |
| Blockers | None |
| Last verified commit | pending commit for TASK-021 |

## 2. Phases and gates

| Phase | Name | Tasks | Gate | Gate type | Status |
|---|---|---|---|---|---|
| 0 | Documentation and design lock | 001 | G0 | **OWNER** | `DONE` |
| 1 | Project foundation | 002–003 | G1 | AUTO | `DONE` |
| 2 | Design system and shared UI | 004–007 | G2 | AUTO | `DONE` |
| 3 | Static portfolio sections | 008–016 | G3 | **OWNER** | `DONE` |
| 4 | Data preparation and PostgreSQL | 017–018 | G4 | AUTO | `DONE` |
| 5 | Chatbot backend | 019–022 | G5 | AUTO | `TODO` |
| 6 | Chatbot UI and integration | 023 | G6 | AUTO | `TODO` |
| 7 | Quality and security review | 024–025 | G7 | AUTO | `TODO` |
| 8 | Deployment and final acceptance | 026–027 | G8 | **OWNER** | `TODO` |

Rules: `WORKFLOW.md` §3–§4. While an OWNER gate is pending, only the work listed in `WORKFLOW.md` §3.3 may proceed.

## 3. Tasks

| ID | Title | Phase | Priority | Status | Depends on |
|---|---|---|---|---|---|
| [001](tasks/TASK-001-workspace-intake-and-design-reference.md) | Workspace intake and design reference | 0 | P0 | `DONE` | none |
| [002](tasks/TASK-002-nextjs-foundation.md) | Next.js foundation | 1 | P0 | `DONE` | TASK-001, Gate G0 passed |
| [003](tasks/TASK-003-verification-tooling.md) | Verification tooling and the `pnpm verify` gate | 1 | P0 | `DONE` | TASK-002 |
| [004](tasks/TASK-004-tokens-fonts-theme.md) | Design tokens, fonts and theme provider | 2 | P0 | `DONE` | TASK-003; decisions DS-01/04/05/09, OD-10 |
| [005](tasks/TASK-005-shared-ui-primitives.md) | Shared UI primitives | 2 | P0 | `DONE` | TASK-004 |
| [006](tasks/TASK-006-navigation.md) | Navigation: sticky bar, mobile menu, theme toggle | 2 | P0 | `DONE` | TASK-005; decisions C-01, C-02, DS-02, DS-06 |
| [007](tasks/TASK-007-opening-overlay.md) | Opening overlay | 2 | P1 | `DONE` | TASK-004, TASK-005; decisions C-05, C-11, DS-07 |
| [008](tasks/TASK-008-content-data-modules.md) | Typed content data modules | 3 | P0 | `DONE` | TASK-003 |
| [009](tasks/TASK-009-hero-and-cv.md) | Hero section and CV download | 3 | P0 | `DONE` | TASK-006, TASK-008; decision C-05 |
| [010](tasks/TASK-010-profile-journey.md) | Profile & Journey section | 3 | P0 | `DONE` | TASK-008, TASK-005 |
| [011](tasks/TASK-011-skills-marquee.md) | Skills marquee | 3 | P1 | `DONE` | TASK-008; decision C-04 |
| [012](tasks/TASK-012-projects-grid.md) | Projects grid | 3 | P0 | `DONE` | TASK-008; decisions C-06, C-07, C-10 |
| [013](tasks/TASK-013-certifications-lightbox.md) | Credentials carousel and certificate lightbox | 3 | P0 | `DONE` | TASK-008, TASK-005; decisions C-03, C-08, OD-12 |
| [014](tasks/TASK-014-gallery.md) | Field Documentation gallery | 3 | P1 | `DONE` | TASK-008 |
| [015](tasks/TASK-015-contact-footer.md) | Direct Channels, footer and Back to Top | 3 | P0 | `DONE` | TASK-008; decisions OD-11, DS-03 |
| [016](tasks/TASK-016-static-site-qa-and-gate.md) | Static site sweep and Gate G3 package | 3 | P0 | `DONE` | TASK-009 … TASK-015 |
| [017](tasks/TASK-017-prisma-schema-migration.md) | Prisma schema and first migration | 4 | P0 | `DONE` | TASK-008; Phase 4 entry criteria |
| [018](tasks/TASK-018-seed-and-readonly-role.md) | Seed, read-only runtime role and negative write test | 4 | P0 | `DONE` | TASK-017 |
| [019](tasks/TASK-019-chat-contract-validation-ratelimit.md) | Chat API contract, validation, scope guard and rate limit | 5 | P0 | `DONE` | TASK-003 (G4 recommended; may use a mocked data layer) |
| [020](tasks/TASK-020-retrieval-and-fallback.md) | Retrieval and no-data fallback | 5 | P0 | `DONE` | TASK-018, TASK-019 |
| [021](tasks/TASK-021-gemini-integration-and-failures.md) | Gemini integration and failure handling | 5 | P0 | `DONE` | TASK-020 |
| [022](tasks/TASK-022-chatbot-security-tests.md) | Chatbot security and abuse tests | 5 | P0 | `TODO` | TASK-021 |
| [023](tasks/TASK-023-chatbot-ui.md) | Chatbot UI: launcher, panel and states | 6 | P0 | `TODO` | TASK-022 and Gate G3 passed; decision C-09 |
| [024](tasks/TASK-024-accessibility-responsive-audit.md) | Accessibility and responsive audit | 7 | P0 | `TODO` | TASK-023 |
| [025](tasks/TASK-025-security-dependency-review.md) | Security and dependency review | 7 | P0 | `TODO` | TASK-023 |
| [026](tasks/TASK-026-service-eligibility-and-deployment.md) | Service eligibility check and deployment | 8 | P0 | `TODO` | TASK-024, TASK-025; Gate G7 |
| [027](tasks/TASK-027-final-acceptance-and-runbook.md) | Final acceptance audit, release gate and runbook | 8 | P0 | `TODO` | TASK-026 |

## 4. Open decisions that block work

Full text, recommendations and owner-answer log: `PRD.md` §13 (C-xx), §14.1 (OD-xx), §15.

| Decision | Blocks | Until |
|---|---|---|
| C-01 language switch · C-02 navigation labels | TASK-006 | Gate G0 |
| C-05 headline wording | TASK-007, 009 | Gate G0 |
| C-03 lightbox chrome · C-08 credential card claims · OD-12 backdrop click | TASK-013 | Gate G0 |
| C-04 skills icons/labels | TASK-011 | Gate G0 |
| C-06 project card extras · C-07 private repo · C-10 mock content | TASK-008, 012 | Gate G0 |
| C-09 chatbot launcher/status | TASK-023 | Gate G0 |
| C-11 section index labels | TASK-005, 007, 009–015 | Gate G0 |
| OD-01 test tooling | TASK-003 | Gate G0 |
| OD-03 schema shape · OD-07 Neon limits | TASK-017 | Phase 4 entry |
| OD-05 Gemini model/eligibility | TASK-021, 026 | Phase 5 / 8 |
| OD-06 hosting eligibility | TASK-026 | Phase 8 |
| OD-11 contact publication approval | TASK-015 | Phase 3 |

## 5. Owner-supplied inputs and content readiness

*Agents never fabricate any of these. Update the **State** column only on an explicit owner statement (R-014). Detailed inventory: `PRD.md` §8.2.*

### 5.1 Assets
| Item | Destination | Needed by | State |
|---|---|---|---|
| Logo monogram (SVG) | `public/assets/brand/logo-monogram.svg` | TASK-006, 007 | `[OWNER TO PROVIDE]` |
| Chatbot icon (SVG) | `public/assets/brand/chatbot-icon.svg` | TASK-023 | `[OWNER TO PROVIDE]` |
| Portrait (WebP) | `public/assets/profile/profile-portrait.webp` | TASK-009 | `[OWNER TO PROVIDE]` |
| Project covers 16:10 (×6 as in the design) | `public/assets/projects/[slug]-cover.webp` | TASK-012 | `[OWNER TO PROVIDE]` |
| Certificate full images (×4 as in the design) | `public/assets/certificates/[slug].webp` | TASK-013 | `[OWNER TO PROVIDE]` |
| Gallery photos (authentic) | `public/assets/gallery/[activity]-[n].webp` | TASK-014 | `[OWNER TO PROVIDE]` |
| Skill logos (only if custom icons are wanted) | `public/assets/skills/[tech].svg` | TASK-011 | optional |
| Final CV PDF | `public/assets/documents/Fauzi-Budikusuma-CV.pdf` | TASK-009 | `[OWNER TO PROVIDE]` |

### 5.2 Facts and links (all currently DRAFT or missing)
| Item | Needed by | State |
|---|---|---|
| Headline wording (C-05) and approved summary | 007, 009 | DRAFT (design-observed) |
| Education/experience entries, single consistent wording | 010 | DRAFT |
| Skill list + icon mapping | 011 | `[OWNER TO PROVIDE]` |
| Project titles/summaries/tech/status/license; corrected Enterprise Network Lab description | 012 | DRAFT |
| Verified repository/demo URLs; which repos are private | 012 | `[OWNER TO PROVIDE]` |
| Credential titles, issuers, dates/IDs, verification links (only if real) | 013 | DRAFT |
| Gallery captions/alt text (only confirmed) | 014 | `[OWNER TO PROVIDE]` |
| Contact values + full URLs + publication approval (OD-11) | 015 | DRAFT (handles read from images — confirm exactly) |
| Location label ("Yogyakarta, ID") | 015 | DRAFT |

### 5.3 Owner account actions (agents cannot do these)
| Action | Needed by |
|---|---|
| Set IDE autonomy settings and deny list (`AGENTS.md` §3.3) | Gate G0 |
| Create the PostgreSQL database (Neon candidate) and place `MIGRATION_DATABASE_URL` in the local `.env` | TASK-017 |
| Create an unbilled Gemini API key and place `GEMINI_API_KEY` in the local `.env` | TASK-021 |
| Create/connect the GitHub repository and hosting account; enter production env vars in the dashboard | TASK-026 |

## 6. Parking lot
Out-of-scope ideas are **not** tracked here; they go to `PRD.md` §14.3.

## 7. How to update this file
1. At the end of each task: set the task row status, rewrite §1, update §4/§5 if decisions or inputs changed.
2. Blocked task: set `BLOCKED` and write one line in §1 *Blockers* (what, and which owner input unblocks it).
3. Never copy implementation steps here; link to the task file instead.
