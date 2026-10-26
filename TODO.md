# TODO.md — Project-level overview

**Purpose:** what remains, in what order, with status, priority, dependencies and links. **Not** where implementation instructions live (those are in `tasks/`).
**Updated by:** the agent at the end of every task (`AGENTS.md` §8). Owner-only gate approvals are recorded in `PRD.md` §15.
**Status values:** `TODO` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `REWORK` · **Priority:** P0 (must for V1.0) · P1 (must, lower urgency).

---

## 1. Current State  *(overwrite this block at the end of every task)*

| Field | Value |
|---|---|
| Date | 2026-10-26 |
| Current phase | **7 — Quality and security review (Revision 4: CR-014 Zero-Unavailable Chatbot)** |
| Waiting for | Fault-injection and soak verification (`TASK-044`) |
| Last completed task | TASK-043 — Resilience architecture: never-unavailable design (CR-014 / Revision 4) |
| Next task | TASK-044 — Fault-injection and soak verification (CR-014 / Revision 4) |
| Blockers | None |
| Last verified commit | `f905719` |

## 2. Phases and gates

| Phase | Name | Tasks | Gate | Gate type | Status |
|---|---|---|---|---|---|
| 0 | Documentation and design lock | 001 | G0 | **OWNER** | `DONE` |
| 1 | Project foundation | 002–003 | G1 | AUTO | `DONE` |
| 2 | Design system and shared UI | 004–007 | G2 | AUTO | `DONE` |
| 3 | Static portfolio sections | 008–016 | G3 | **OWNER** | `DONE` |
| 4 | Data preparation and PostgreSQL | 017–018 | G4 | AUTO | `DONE` |
| 5 | Chatbot backend | 019–022 | G5 | AUTO | `DONE` |
| 6 | Chatbot UI and integration | 023 | G6 | **OWNER** | `DONE` |
| 7 | Quality and security review | 024, 025, 028–044 | G7 | AUTO | `IN_PROGRESS` |
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
| [022](tasks/TASK-022-chatbot-security-tests.md) | Chatbot security and abuse tests | 5 | P0 | `DONE` | TASK-021 |
| [023](tasks/TASK-023-chatbot-ui.md) | Chatbot UI: launcher, panel and states | 6 | P0 | `DONE` | TASK-022 and Gate G3 passed; decision C-09 |
| [024](tasks/TASK-024-accessibility-responsive-audit.md) | Accessibility and responsive audit | 7 | P0 | `DONE` | TASK-023 |
| [025](tasks/TASK-025-security-dependency-review.md) | Security and dependency review | 7 | P0 | `DONE` | TASK-023 |
| [029](tasks/TASK-029-permanent-full-color-hero-portrait.md) | Permanent full-color Hero portrait (CR-001) | 7 | P0 | `DONE` | TASK-024 |
| [030](tasks/TASK-030-overview-navigation-link.md) | "Overview" navigation link to top (CR-002) | 7 | P0 | `DONE` | TASK-029 |
| [031](tasks/TASK-031-credly-contact-channel-and-typography.md) | Credly profile contact card & typography refinement (CR-003) | 7 | P0 | `DONE` | TASK-030 |
| [028](tasks/TASK-028-gemini-chatbot-reliability.md) | Gemini chatbot reliability & production stabilization (CR-004) | 7 | P0 | `DONE` | TASK-031 |
| [032](tasks/TASK-032-bilingual-ui-localization.md) | Bilingual ID/EN foundation & static UI localization (CR-005a) | 7 | P0 | `DONE` | TASK-028 |
| [033](tasks/TASK-033-bilingual-chatbot-pipeline.md) | Bilingual chatbot pipeline & localized UI (CR-005b) | 7 | P0 | `DONE` | TASK-032 |
| [034](tasks/TASK-034-favicon-brand-asset.md) | Favicon from LOGO FB.png (CR-006) | 7 | P0 | `DONE` | TASK-033 |
| [035](tasks/TASK-035-email-gmail-contact-text-truncation.md) | Email to Gmail & zero contact text truncation (CR-007) | 7 | P0 | `DONE` | TASK-034 |
| [036](tasks/TASK-036-nextjs-logo-skill-tiles-visibility.md) | Next.js logo in Technical Stack & tile contrast (CR-008) | 7 | P0 | `DONE` | TASK-035 |
| [037](tasks/TASK-037-chatbot-reliability-cache-speed.md) | Chatbot reliability, in-memory cache & speed (CR-009) | 7 | P0 | `DONE` | TASK-036 |
| [038](tasks/TASK-038-multilingual-qa-full-knowledge-citations.md) | Answer quality, multilingual free-form Q&A & structured citations (CR-010) | 7 | P0 | `DONE` | TASK-037 |
| [041](tasks/TASK-041-hero-chips-removal.md) | Remove two bottom chips from Hero portrait (CR-013) | 7 | P0 | `DONE` | TASK-038 |
| [042-archive](tasks/TASK-042-archive-projects-photos-lightbox.md) | Selected Projects display photos & interactive Lightbox preview (CR-014 archive) | 7 | P0 | `DONE` | TASK-041 |
| [043-archive](tasks/TASK-043-archive-documentation-photos-lightbox.md) | Field Documentation photos, titles & interactive Lightbox preview (CR-015 archive) | 7 | P0 | `DONE` | TASK-042-archive |
| [039](tasks/TASK-039-idle-failure-hedged-requests-snapshot.md) | Chatbot tail-latency & 30-min idle-failure elimination (CR-011) | 7 | P0 | `DONE` | TASK-043-archive |
| [040](tasks/TASK-040-knowledge-expansion-helpful-fallback.md) | Comprehensive knowledge expansion & helpful bilingual fallback (CR-012) | 7 | P0 | `DONE` | TASK-039 |
| [042](tasks/TASK-042-root-cause-experiment.md) | Root-cause proof by experiment (CR-014 / Revision 4) | 7 | P0 | `DONE` | TASK-040 |
| [043](tasks/TASK-043-never-unavailable-architecture.md) | Resilience architecture: never-unavailable design (CR-014 / Revision 4) | 7 | P0 | `DONE` | TASK-042 |
| [044](tasks/TASK-044-fault-injection-soak.md) | Fault-injection and soak verification (CR-014 / Revision 4) | 7 | P0 | `IN_PROGRESS` | TASK-043 |
| [026](tasks/TASK-026-service-eligibility-and-deployment.md) | Service eligibility check and deployment | 8 | P0 | `TODO` | Gate G7 passed (all Phase 7 tasks) |
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
| Logo monogram / Favicon | `public/assets/brand/LOGO FB.png`, `src/app/icon.png` | TASK-006, 034 | `VERIFIED` (owner-supplied) |
| Chatbot icon (SVG) | `public/assets/brand/chatbot-icon.svg` | TASK-023 | `VERIFIED` |
| Portrait (WebP) | `public/assets/profile/profile-portrait.webp` | TASK-009, 029 | `VERIFIED` (owner-supplied) |
| Project covers (×6) | `public/assets/projects/*` | TASK-012, 042 | `VERIFIED` (owner-supplied, CR-014) |
| Certificate full images (×4 as in the design) | `public/assets/certificates/[slug].webp` | TASK-013 | `VERIFIED` (owner-supplied) |
| Gallery photos (authentic ×6) | `public/assets/gallery/*` | TASK-014, 043 | `VERIFIED` (owner-supplied, CR-015) |
| Skill logos (custom SVGs) | `public/assets/skills/[tech].svg` | TASK-011, 036 | `VERIFIED` |
| Final CV PDF | `public/assets/documents/Fauzi-Budikusuma-CV.pdf` | TASK-009 | `VERIFIED` (owner-supplied) |

### 5.2 Facts and links
| Item | Needed by | State |
|---|---|---|
| Headline wording and approved summary | 007, 009 | `VERIFIED` |
| Education/experience entries | 010 | `VERIFIED` |
| Skill list (35 skills) | 011, 040 | `VERIFIED` |
| Project titles/summaries/tech/status | 012, 040, 042 | `VERIFIED` |
| Verified repository URLs | 012, 040 | `VERIFIED` |
| Credential titles, issuers, dates, IDs | 013, 040 | `VERIFIED` |
| Gallery captions/alt text (authentic) | 014, 040, 043 | `VERIFIED` |
| Contact values + full URLs | 015, 031, 035, 040 | `VERIFIED` |
| Location label ("Surakarta / Yogyakarta, ID") | 015, 040 | `VERIFIED` |

### 5.3 Owner account actions (agents cannot do these)
| Action | Needed by |
|---|---|
| Set IDE autonomy settings and deny list (`AGENTS.md` §3.3) | Gate G0 |
| Create the PostgreSQL database (Neon candidate) and place `MIGRATION_DATABASE_URL` in the local `.env` | TASK-017 |
| Create an unbilled Gemini API key and place `GEMINI_API_KEY` in the local `.env` | TASK-021 |
| Create/connect the GitHub repository and hosting account; enter production env vars in the dashboard | TASK-026 |

### 5.4 Review Indonesian Translations (CR-005a / CR-005b — DRAFT for Owner Inspection)
| Section | English Source (Default) | Indonesian Translation (Draft) | Status |
|---|---|---|---|
| **Common** | Download CV · Contact Me · Back to top | Unduh CV · Hubungi Saya · Kembali ke atas | DRAFT |
| **Nav** | Overview · Profile & Journey · Skills · Projects · Credentials · Documentation · Direct Channels | Ringkasan · Profil & Perjalanan · Keahlian · Proyek · Sertifikasi · Dokumentasi · Kontak | DRAFT |
| **Hero** | Formal Portrait · Software Development & Network Engineering Undergraduate | Potret Formal · Mahasiswa S1 Informatika & Rekayasa Jaringan Komputer | DRAFT |
| **Profile** | Background & Expertise · Operational Principles · Technical Philosophy · Academic & Field Journey | Latar Belakang & Keahlian · Prinsip Operasional · Filosofi Teknis · Perjalanan Akademik & Lapangan | DRAFT |
| **Skills** | Technical Stack · Languages · Frontend · Backend & API · Database & Caching · DevOps & Tools | Tumpukan Teknologi · Bahasa Pemrograman · Antarmuka · Backend & API · Basis Data & Caching · DevOps & Alat | DRAFT |
| **Projects** | Selected Projects · In Development · Completed · Private repository | Proyek Pilihan · Dalam Pengembangan · Selesai · Repositori privat | DRAFT |
| **Credentials** | Credentials & Certifications · Verified Accreditation · Issued by · View Credential | Sertifikasi & Kredensial · Akreditasi Terverifikasi · Diterbitkan oleh · Lihat Sertifikat | DRAFT |
| **Documentation** | Field Documentation · Swipe hint | Dokumentasi Lapangan · GESER ↔ | DRAFT |
| **Contact** | Direct Communication Channels · Direct Email · LinkedIn Profile · GitHub Repositories · Instagram Activity · Credly Profile | Saluran Komunikasi Langsung · Email Langsung · Profil LinkedIn · Repositori GitHub · Aktivitas Instagram · Profil Credly | DRAFT |
### 5.5 Optional Supporting Facts for Chatbot (CR-010 / TASK-038)
The following common visitor questions currently trigger the standard `no_data` fallback because they are not yet provided in `src/data/`:
1. Current GPA / IPK at Universitas AMIKOM Yogyakarta (e.g. 3.xx)
2. Professional salary expectations / rate card for full-time or freelance roles
3. Official WhatsApp / business phone channel (if desired beyond Email/LinkedIn)
4. Specific graduation month/year target
5. Specific technical hobbies or open-source community contributions

## 6. Parking lot
Out-of-scope ideas are **not** tracked here; they go to `PRD.md` §14.3.

## 7. How to update this file
1. At the end of each task: set the task row status, rewrite §1, update §4/§5 if decisions or inputs changed.
2. Blocked task: set `BLOCKED` and write one line in §1 *Blockers* (what, and which owner input unblocks it).
3. Never copy implementation steps here; link to the task file instead.
