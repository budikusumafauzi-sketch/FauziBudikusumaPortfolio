# PRD.md — Product Requirements Document

**Product:** Personal Portfolio Website & Interactive AI Dashboard — **V1.0**
**Owner:** Fauzi Budikusuma
**Document role:** Canonical answer to *"What is built, and why?"* A feature that is not traceable to this document is **not in V1.0**.
**Companion documents:** `AGENTS.md` (how agents work) · `ARCHITECTURE.md` (how it is built) · `DESIGN.md` (how it looks) · `SCHEMA.md` (data) · `RULES.md` (prohibitions) · `WORKFLOW.md` (phase order) · `TODO.md` (status) · `tasks/` (work units)
**Source baseline:** `MASTER_PROJECT_BLUEPRINT.md` and the approved visual references in `design/approved/`.

> **Status labels used everywhere:** **CONFIRMED** (owner-specified/approved) · **RECOMMENDED** (needs approval if it changes the baseline) · **ASSUMPTION** (must be validated) · **OPEN DECISION** (only the owner, or a current policy check, can settle it) · **BLOCKED** (must not proceed until a stated dependency is resolved). Never present a RECOMMENDED / ASSUMPTION / placeholder as CONFIRMED.

---

## 1. Vision and product summary

Build a polished, responsive personal portfolio that acts as a professional introduction and interactive showcase for Fauzi Budikusuma: verified identity, education and career journey, technical skills, software and IT/networking projects, certifications, activity documentation, and professional contact channels.

The look is **premium, editorial-minimalist, cinematic at entry, restrained**: dark charcoal surfaces, crimson accent, strong typography, consistent cards and image treatment, restrained motion. The visual design comes from the **approved Google Stitch exports in `design/approved/`**, not from a new concept invented by a coding agent.

A **floating, profile-scoped AI chatbot** is available across the whole site. It answers visitor questions **only** from owner-approved, verified portfolio facts retrieved from PostgreSQL. It is not a general assistant, not a personal-data oracle, and cannot edit anything.

**Resilience principle (CONFIRMED):** the portfolio must remain fully useful if the AI service or the database is unavailable. No section other than the chatbot may depend on either.

## 2. Users and user value

| User | What they need | Where V1.0 serves it |
|---|---|---|
| Recruiters / hiring managers | Quick, trustworthy picture of skills, projects, credentials | Hero, Profile & Journey, Projects, Credentials, CV download |
| Software & IT/networking professionals | Evidence of technical depth; links to code | Projects grid, Skills, GitHub links |
| Potential collaborators | Ways to get in touch | Contact cards, footer |
| Academic / professional contacts | Background and credentials | Journey timeline, Credentials, Field Documentation |
| General visitors | Fast answers without reading everything | Chatbot |

## 3. Goals and success measures

| ID | Goal | Measured by |
|---|---|---|
| G-01 | Present identity and professional direction clearly | ACC-01, ACC-02 |
| G-02 | Make projects, skills, education, credentials, activities easy to explore | ACC-02 … ACC-06 |
| G-03 | Direct access to verified links and repositories | ACC-10 |
| G-04 | Grounded AI Q&A about public portfolio data | ACC-07, ACC-08 |
| G-05 | Responsive and accessible on desktop, tablet, mobile | ACC-11, ACC-12 |
| G-06 | Maintainable via files + Git; no admin dashboard | ACC-09 |
| G-07 | Total cost **Rp0** using eligible free tiers only | ACC-13 |
| G-08 | Design fidelity, facts, security, scope verifiable before "done" | ACC-01, ACC-14 |

## 4. Scope

### 4.1 In V1.0 (CONFIRMED)
Opening overlay · sticky navigation + mobile menu · Hero · Profile & Journey · Skills marquee (+ reduced-motion fallback) · Projects grid · Certifications carousel + image-only lightbox · Field Documentation gallery · Contact cards · Footer + Back to Top · dark/light themes with no wrong-theme flash · CV PDF download · floating chatbot (UI + `POST /api/chat`) · PostgreSQL knowledge records via Prisma · developer-run seed from project files · validation, best-effort rate limiting, safe errors · accessibility/responsive checks · deployment preparation.

### 4.2 Explicitly excluded from V1.0 (CONFIRMED — do not add without explicit owner approval)
Admin/CMS dashboard · authentication, accounts, role UI · contact form or email-sending backend · project categories/filters/search/detail modals · AI features unrelated to verified portfolio facts · web search/browsing/unrestricted answers in the chatbot · pgvector / vector DB / embeddings / complex RAG · Redis or any cache service · MongoDB, MySQL, SQLite or any second database · Docker / Docker Compose as a requirement · paid domain/API/hosting/add-on or billing activation · analytics/tracking/third-party services not approved · skill percentages, fake stats, fake testimonials, fake URLs, invented credentials · extra pages or sections not listed here.

A visual opportunity is **never** permission to add functionality. Useful ideas outside scope go to §14.3 (Future ideas), not into code.

## 5. Constraints

| ID | Constraint | Status |
|---|---|---|
| CON-01 | Target build and operating cost **Rp0**, eligible free tiers only. A free-tier limit must produce a documented fallback or OPEN DECISION, never a hidden paid dependency. | CONFIRMED |
| CON-02 | PostgreSQL is the **only** database. | CONFIRMED |
| CON-03 | Bilingual UI: **English** default with instantaneous **Indonesian** toggle via ID/EN switcher in navbar/mobile header (CR-005a/b, authorized by Owner). | CONFIRMED (CR-005) |
| CON-04 | No assumption that a Google AI Pro/Antigravity subscription grants Gemini **API** quota. | CONFIRMED |
| CON-05 | Public/runtime database access is **read-only**. | CONFIRMED |
| CON-06 | All personal facts, URLs, certificates, statistics, links, achievements are owner-provided/verified. | CONFIRMED |
| CON-07 | Coding environment: **Google Antigravity** with Gemini (owner-stated: "Gemini 3.8 Flash, high"). The blueprint's Claude-specific layout (`.claude/`, `CLAUDE.md`) is replaced by Antigravity conventions. | CONFIRMED (owner statement; model name not independently verified) |
| CON-08 | Documentation-only until the owner authorizes implementation (Gate G0, see `WORKFLOW.md`). | CONFIRMED |

## 6. Functional requirements

Visual details live in `DESIGN.md` (reference: `design/approved/`). Behavior lives here. IDs are stable; tasks cite them.

### 6.1 Global
| ID | Requirement |
|---|---|
| FR-GLB-01 | Section order follows the approved design: Opening → Nav → Hero → Profile & Journey → Skills → Projects → Credentials → Field Documentation → Direct Channels (Contact) → Footer; chatbot launcher persists. |
| FR-GLB-02 | One page (App Router single route). No extra routes except `POST /api/chat` (proposed) and framework-required files. |
| FR-GLB-03 | Static sections render from typed local data files (`src/data/`), **not** from the database (see `ARCHITECTURE.md` ADR-007). |
| FR-GLB-04 | Bilingual UI: English default with instantaneous Indonesian toggle via ID/EN switcher in navbar/mobile header; chatbot supports both languages (CR-005a/b). |

### 6.2 Navigation (see C-02)
| ID | Requirement |
|---|---|
| FR-NAV-01 | Sticky top bar with monogram + wordmark ("FAUZI BUDIKUSUMA / PORTFOLIO"), section anchor links starting with "Overview" (targeting `#home`), ID/EN language toggle, dark/light toggle; mobile hamburger menu/drawer. |
| FR-NAV-02 | Anchor links scroll to the target with an offset so the sticky bar never covers the heading. |
| FR-NAV-03 | Mobile menu: keyboard operable, closes on Escape and on selection, has accessible labels, focus returns to the trigger on close. |
| FR-NAV-04 | Theme toggle has an accessible name and exposes the current state. |
| FR-NAV-05 | Tap targets on mobile are adequate (≥ 44×44 CSS px, **RECOMMENDED**). |
| FR-NAV-06 | Active-section highlighting only if the approved design shows it; no elaborate tracking UI. |

### 6.3 Opening overlay
| ID | Requirement |
|---|---|
| FR-OPN-01 | Shows the owner-approved monogram, name, subtitle, thin crimson progress indicator and status line, per `1 OPENING.png`. |
| FR-OPN-02 | Must not invent a delay; auto-dismisses; **fail-safe**: a stalled non-essential asset or a runtime error must never leave a blank/locked screen. |
| FR-OPN-03 | Honors `prefers-reduced-motion` (no nonessential movement). |
| FR-OPN-04 | Does not block browser navigation, lock scroll after dismissal, or delay essential content unnecessarily. |
| FR-OPN-05 | Production logo is a real approved asset, never a crop of the screenshot. |

### 6.4 Hero
| ID | Requirement |
|---|---|
| FR-HRO-01 | Split editorial layout: name, highlighted professional headline, concise verified summary, CTAs, framed portrait. |
| FR-HRO-02 | CTAs: **View Projects** (primary, crimson), **Contact Me**, **Download CV** (secondary), per design. |
| FR-HRO-03 | Headline, summary, titles come only from owner-approved profile data. No invented job titles, employment status, years of experience, metrics (see C-05). |
| FR-HRO-04 | Staggered entrance animation only as depicted; reduced when reduced motion is requested. |
| FR-HRO-05 | Mobile: portrait first, then name/summary/CTAs (as in `5`/`7` references); no awkward crop or text overlap. |

### 6.5 Profile & Journey
| ID | Requirement |
|---|---|
| FR-ABT-01 | Two columns on desktop (Profile Summary card + Education & Experience Timeline card), stacked on small screens. |
| FR-ABT-02 | Profile Summary: specialization chips, professional summary, operational principles list. |
| FR-ABT-03 | Timeline: education, work/internship, school, organizations; dates and role names consistent everywhere they repeat (design currently shows inconsistent variants — see C-10). |
| FR-ABT-04 | Missing facts stay as documented placeholders during preparation and are never shipped as fabricated final content. |

### 6.6 Skills marquee (see C-04)
| ID | Requirement |
|---|---|
| FR-SKL-01 | Continuous, seamless horizontal marquee of uniform skill tiles. |
| FR-SKL-02 | Slows/pauses smoothly on hover where practical; pause must also be possible without hover (focus/touch, **RECOMMENDED**). |
| FR-SKL-03 | `prefers-reduced-motion: reduce` → static wrapping grid (no movement). |
| FR-SKL-04 | Seamless-loop duplicates must not create duplicate screen-reader announcements; provide one meaningful accessible list of skills. |
| FR-SKL-05 | Only owner-confirmed skills; no percentages, bars or stars. |

### 6.7 Projects grid (see C-06, C-07)
| ID | Requirement |
|---|---|
| FR-PRJ-01 | Exactly **3 columns** at desktop, **2** at tablet, **1** at mobile; equal card height; uniform padding. |
| FR-PRJ-02 | Thumbnails use **16:10** aspect ratio with reserved dimensions (no layout shift). |
| FR-PRJ-03 | If project count is not divisible by 3, last-row cards keep 1/3 width, left-aligned, **never stretched**. |
| FR-PRJ-04 | Card content: thumbnail (or explicitly approved fallback), title, concise summary, technology badges, verified GitHub URL, optional approved live-demo URL. Extra labels (status, license) only per C-06 decision. |
| FR-PRJ-05 | No filters, search, categories, or detail modal. |
| FR-PRJ-06 | No invented repository/demo URLs. A project without a verified public URL shows an explicit non-link state and never masquerades as a working link. |
| FR-PRJ-07 | External links open safely (`rel="noopener noreferrer"` on new-tab links). |

### 6.8 Certifications carousel + lightbox (see C-03, C-08)
| ID | Requirement |
|---|---|
| FR-CRT-01 | Embla Carousel: mouse drag, touch swipe, keyboard focus, accessible previous/next buttons. |
| FR-CRT-02 | Consistent card size per design; essential information is visible without hover (touch-safe). |
| FR-CRT-03 | Clicking a card opens a **centered modal containing only the full certificate image and a clear close (X) control**. No side panel, long description, or unverifiable claims. |
| FR-CRT-04 | Image uses `object-fit: contain`, never cropped. |
| FR-CRT-05 | Escape closes; focus moves into the dialog on open and returns to the triggering card on close; correct dialog semantics. |
| FR-CRT-06 | Background scroll is locked while open without losing page position. |
| FR-CRT-07 | Backdrop-click-to-close is **not assumed** (OD-12). |
| FR-CRT-08 | Missing certificate image → respectful, non-fabricated "unavailable" state on the card; no modal with a broken image. |

### 6.9 Field Documentation gallery
| ID | Requirement |
|---|---|
| FR-GAL-01 | Horizontal drag/swipe gallery of **authentic** activity images (academic, organizational, training, project documentation). |
| FR-GAL-02 | Consistent card size and cropping per design; mobile uses a touch-action that keeps vertical page scroll working (e.g. `pan-y`). |
| FR-GAL-03 | Keyboard accessible where applicable; informative images have meaningful alt text, decorative ones empty alt. |
| FR-GAL-04 | No invented events, captions, dates or people. |

### 6.10 Contact and footer
| ID | Requirement |
|---|---|
| FR-CNT-01 | Five cards: Email, LinkedIn, GitHub, Instagram, Credly Profile — values verified by the owner and approved for publication (OD-11, CR-003). Email card opens Gmail compose in a new tab (`https://mail.google.com/mail/?view=cm&fs=1&to=...`) rather than `mailto:` (CR-007). |
| FR-CNT-02 | Visible text must never truncate/clip across viewports and themes (zero ellipsis `...`; natural delimiter wrapping at `@`, `/`, `.`, `-` via `<wbr>` and spacious grid layout; CR-007). |
| FR-CNT-03 | No contact form, no email backend. |
| FR-FTR-01 | Footer: identity, short tagline, copyright, social links as approved, **Back to Top**. |

### 6.11 CV download
| ID | Requirement |
|---|---|
| FR-CV-01 | Button resolves to a **real owner-provided PDF** under `public/assets/documents/` and works on desktop and mobile. |
| FR-CV-02 | If the final PDF has not been supplied the task is **BLOCKED**; never link a fake file. |

### 6.12 Theme
| ID | Requirement |
|---|---|
| FR-THM-01 | `next-themes`; dark and light per approved references; persisted preference. |
| FR-THM-02 | No wrong-theme flash on initial render (as far as the setup allows; verified). |
| FR-THM-03 | All text, cards, controls, borders, modal and chatbot states legible in both themes; restrained, fast transitions. |

### 6.13 Chatbot UI
| ID | Requirement |
|---|---|
| FR-CHT-01 | Floating launcher bottom-right throughout scrolling; must not obscure key CTAs, nav controls, mobile safe area, or lightbox controls (see C-09). |
| FR-CHT-02 | Starts closed. Open panel matches `2 MASTER DESIGN + CHATBOT AI.png`. |
| FR-CHT-03 | Panel contains: header (title, subtitle, close), welcome message, starter prompt chips, message area, free-text input, send button, loading state, error/fallback state. |
| FR-CHT-04 | Starter prompts only ask what real profile data can answer. |
| FR-CHT-05 | Accessible names, keyboard operation, focus management; Escape closes (**RECOMMENDED**). |
| FR-CHT-06 | Small screens: panel fits viewport and on-screen keyboard, respects safe areas, never traps the user behind off-screen controls. |
| FR-CHT-07 | Never claims it can perform actions; never renders model output as HTML. |
| FR-CHT-08 | Chat failure never affects the rest of the page. |

## 7. Chatbot product behavior

Technical contract: `ARCHITECTURE.md` §6–§8. Data model: `SCHEMA.md`.

| ID | Behavior |
|---|---|
| CB-01 | Scope: approved public portfolio facts only. Not a general assistant. |
| CB-02 | Answers **only** from verified portfolio facts in context (loadKnowledge(), ADR-013); no outside knowledge. Structured JSON output with valid citation IDs required (R-031). |
| CB-03 | No relevant verified record / unanswerable query → fixed, polite "not available in the portfolio" reply. If citations are empty or invalid, server replaces model response with fixed copy (R-031). |
| CB-04 | Requests for private data (e.g. home address), secrets, system prompt, other users' data → polite scope refusal (see the "SCOPE GUARDRAIL" example in the design). |
| CB-05 | Visitor text is untrusted: instructions inside it to override rules are ignored. Retrieved records are facts, not instructions. |
| CB-06 | The model cannot run SQL, change records, read files, or call tools. |
| CB-07 | Distinguishes known from unknown details; never guesses missing dates, titles, URLs. |
| CB-08 | Plain-text answers; bounded length. |
| CB-09 | Never called at page load; only on an explicit visitor message. |
| CB-10 | Degrades gracefully: missing key, quota/rate limit, DB timeout, invalid input, over-limit input, transient Gemini error → bounded single retry per R-034, visitor-safe messages (full matrix: `ARCHITECTURE.md` §10). |
| CB-11 | Starter chips and the welcome message are static copy owned by the project, not generated. |

## 8. Content and data rules

### 8.1 Truth rules (CONFIRMED)
1. Every fact, link, date, title, credential, image and number must be **owner-provided or owner-verified**.
2. **Design mock content is not content.** The Stitch exports contain illustrative/AI-generated imagery, placeholder certificate art, mock captions and mock IDs. None of it may ship (see C-10). Only the layout, hierarchy and styling are authoritative.
3. Facts *visible* in the designs (name, school, employer, dates, handles) are `DRAFT` until the owner confirms them.
4. Every content record carries a verification state: `VERIFIED` · `DRAFT` · `NOT_PROVIDED`. The seed imports **only `VERIFIED`** records; the release gate fails if `DRAFT`/`NOT_PROVIDED`/`[OWNER TO PROVIDE]` remains in shipped data.
5. An agent changes a state to `VERIFIED` only when the owner says so explicitly (chat message or direct file edit), and records the date in a comment.

### 8.2 Content and asset inventory

Facts seen in the approved designs are listed as **DESIGN-OBSERVED / DRAFT** to speed up owner verification — they are **not** confirmed. Handles were read from the PNGs and could contain reading errors; the owner must confirm each.

| Item | Location (future) | Design-observed value | State |
|---|---|---|---|
| Site monogram/logo | `public/assets/brand/logo-fb.png` | "FB" monogram / emblem (from `LOGO FB.png`; used in Navbar, Opening Overlay, and site icons: `icon.png`, `apple-icon.png`, `favicon.ico`) | VERIFIED (CR-006, 2026-10-25) |
| Chatbot icon | `public/assets/brand/chatbot-icon.svg` | Headset-bot icon | `[OWNER TO PROVIDE]` file |
| Portrait | `public/assets/profile/profile-portrait.webp` | Formal portrait, dark suit, red tie | `[OWNER TO PROVIDE]` file |
| Full name | `src/data/profile.ts` | Fauzi Budikusuma | DRAFT |
| Headline | `src/data/profile.ts` | "Software Development & Network Engineer" (dark desktop/opening); "Software Development" (mobile + light) | OPEN (C-05) |
| Summary / bio | `src/data/profile.ts` | Informatics student at Universitas AMIKOM Yogyakarta; TKJ (Computer & Network Engineering) graduate of SMK Negeri 1 Seyegan; Dinas Kominfo DIY experience | DRAFT |
| Education / experience | `src/data/journey.ts` | AMIKOM (S.Kom, Informatics, 2026–2029 expected Apr 2029); Help Desk Supervisor (Internship), Dinas Kominfo DIY (2025); SMK Negeri 1 Seyegan, TKJ (2023–2026) incl. internship scores and competency result | DRAFT — wording differs between desktop/mobile (C-10) |
| Skills (35) | `src/data/skills.ts` | 35 verified skills across 5 categories, including Next.js (local asset `public/assets/skills/nextjs.svg`) | VERIFIED (CR-008, 2026-10-25) |
| Projects (6) | `src/data/projects.ts` | Sentinel; StackLab; Network Monitoring Dashboard; RNIC; Enterprise Data Center Network Simulation; Enterprise Network Lab (MikroTik CHR) | DRAFT; thumbnails `[OWNER TO PROVIDE]`; repo URLs `[OWNER TO PROVIDE]` |
| Certifications (4) | `src/data/certifications.ts` | MikroTik MTCNA; Google Cybersecurity Professional Certificate; Google AI Essentials; Sertifikat Kompetensi (LAN implementation, BNSP/LSP) | DRAFT; full images `[OWNER TO PROVIDE]`; dates/IDs unverified |
| Gallery (4) | `src/data/gallery.ts` | Academic symposium; hackathon build; tech workshop; lab infrastructure demo (**mock imagery/captions**) | `[OWNER TO PROVIDE]` real photos + captions |
| Email | `src/data/contacts.ts` | `budikusumafauzi@gmail.com` | DRAFT; publication not yet approved (OD-11) |
| LinkedIn | same | handle `in/fauzibudikusuma` | full URL `[OWNER TO PROVIDE]` |
| GitHub | same | handle `budikusumafauzi-sketch` | full URL `[OWNER TO PROVIDE]` |
| Instagram | same | handle `budikusuma._fauzi` | full URL `[OWNER TO PROVIDE]` |
| CV | `public/assets/documents/Fauzi-Budikusuma-CV.pdf` | — | `[OWNER TO PROVIDE]` final PDF |
| Credential verification URLs | `certifications.ts` | none | optional, `[OWNER TO PROVIDE]` |
| Location label | footer | "Yogyakarta, ID" | DRAFT |

Never infer a URL from a handle. Each project carries a link status: `VERIFIED` · `NOT_PROVIDED` · `UNDER_REVIEW` (planning metadata; not shown to visitors).

### 8.3 Owner-supplied input checklist
The authoritative tracked version lives in `TODO.md` §5; summary: logo, chatbot icon, portrait, project thumbnails, certificate full images, gallery photos, final CV, verified URLs/email, confirmed profile/journey/skills/project/credential text, Neon + Gemini account actions (credentials into local `.env` only).

## 9. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-PERF-01 | Optimized image formats/sizes via `next/image`; reserved dimensions/aspect ratios so there is no significant layout shift. |
| NFR-PERF-02 | Only approved fonts/weights actually used (Plus Jakarta Sans, Inter, JetBrains Mono via `next/font`); no duplicate remote font requests. |
| NFR-PERF-03 | Keep static sections server-rendered; client components only where interaction requires. |
| NFR-PERF-04 | No animation/UI library beyond the approved stack; no redundant dependencies. |
| NFR-PERF-05 | Gemini is called on demand only. Send the complete verified knowledge set bounded by the 40,000-char size cap (CR-010 / ADR-013). |
| NFR-PERF-06 | Opening overlay lightweight; noncritical images lazy-loaded. |
| NFR-A11Y-01 | Semantic landmarks, logical heading order, visible `:focus-visible`, accessible names for icon-only buttons, alt text, sufficient contrast in **both** themes. |
| NFR-A11Y-02 | Keyboard access for nav, chat, carousels, modal; reduced-motion fallbacks for entrance, marquee, carousel effects; hover is never the only path to content/controls. |
| NFR-RSP-01 | Verified at wide desktop, laptop, tablet, narrow mobile; dark + light; chatbot open/closed; lightbox open. No accidental horizontal overflow, clipped text, unreachable controls, or off-viewport panels. |
| NFR-SEC-01 | Secrets server-side only; read-only runtime DB role; validated and bounded input; generic visitor errors; no model-triggered actions; no untrusted HTML rendering. Detailed rules: `RULES.md`, `ARCHITECTURE.md` §9. |
| NFR-PRV-01 | Publish only owner-approved information; no private address/ID/account numbers/keys in data or model context; no analytics by default. |
| NFR-COST-01 | Rp0; billing never activated (CON-01). |
| NFR-MNT-01 | Content changes = edit files in `src/data/` + run seed; no admin UI. Small, cohesive file structure (File Economy rules in `RULES.md`). |

## 10. Acceptance criteria (V1.0 is complete only when all are verified)

| ID | Criterion | Verified by |
|---|---|---|
| ACC-01 | All sections exist in approved order/composition and match `design/approved/` (after C-xx decisions). | Side-by-side screenshots (`WORKFLOW.md` §7) |
| ACC-02 | Hero, Profile & Journey show only verified content. | Data audit (no `DRAFT`/placeholder) |
| ACC-03 | Projects: 3 equal columns desktop; last row never stretches; 2 / 1 columns tablet / mobile. | Browser check with 4, 5, 6 cards |
| ACC-04 | Theme toggle works in both themes; no flash on load. | Manual + reload test |
| ACC-05 | Opening overlay is lightweight, fail-safe, honors reduced motion. | Throttled-asset test + reduced-motion test |
| ACC-06 | Lightbox shows only the uncropped image + close; Escape works; focus returns. | Keyboard test |
| ACC-07 | Chatbot answers are grounded; absent facts trigger the fixed fallback; no Gemini call on no-match. | Automated tests + manual |
| ACC-08 | Key/credentials server-side; runtime role **cannot write**; failures/quota/timeouts handled cleanly. | Negative write test; failure-injection tests |
| ACC-09 | Data managed via files + trusted idempotent seed; no admin UI/public write path/extra infra. | Seed re-run test; repo audit |
| ACC-10 | CV downloads; all external URLs and asset paths resolve. | Link/asset check |
| ACC-11 | Carousel/gallery support intended pointer, touch, keyboard interactions. | Manual |
| ACC-12 | No unexpected horizontal overflow at required widths. | Browser check |
| ACC-13 | Rp0 verified; current plans/quotas documented; no billing enabled. | Provider dashboards + `ARCHITECTURE.md` §11 record |
| ACC-14 | Lint, typecheck, build, selected tests pass; no secrets in files/history; README/runbook exists; **owner approves**. | `pnpm verify` evidence; secret scan |

## 11. Dependencies and owner-supplied inputs
Owner assets and verified content (§8.2); owner account actions for Neon and Gemini (agents cannot create accounts or supply credentials); current-policy checks for Vercel/Neon/Gemini before deployment (OD-05…OD-07).

## 12. Risks

| ID | Risk | Mitigation |
|---|---|---|
| RSK-01 | Mock design imagery/captions mistaken for real content | §8.1 rule 2; release gate |
| RSK-02 | Free-tier terms change (Gemini, Neon, hosting) | Verify at TASK-026; documented fallbacks; never auto-upgrade |
| RSK-03 | Gemini quota exhausted → chatbot down | CB-10 fallback; site unaffected |
| RSK-04 | In-memory rate limit resets on cold start/not shared across instances | Documented limitation; bounded everything else |
| RSK-05 | Agent scope creep / redesign | `RULES.md`, task allow-lists, review gates |
| RSK-06 | Fast "flash" model skipping verification | Evidence-based reporting (`AGENTS.md` §9, `WORKFLOW.md` §7) |
| RSK-07 | Hosting plan (e.g. Vercel Hobby) may not permit this use | OD-06; compliant free alternative presented, never silent switch |

## 13. Conflict register — approved design vs. blueprint (owner decision required)

The blueprint says: the image governs **appearance**, the PRD governs **behavior**; genuine conflicts are reported, not silently resolved. Each item below has a **RECOMMENDED resolution** (smallest change). They are **OPEN DECISION** until the owner answers in §15. Implementation of an affected component must not start until its decision is recorded.

| ID | Observation in `design/approved/` | Blueprint / PRD position | RECOMMENDED resolution | Blocks |
|---|---|---|---|---|
| **C-01** | **ID / EN language switch** in nav (all desktop and mobile exports); Indonesian strings appear ("Sertifikat Kompetensi", "KOMPETENSI"). | English-only UI; no internal language selector. | **RESOLVED (CR-005):** Bilingual UI implemented via segmented ID/EN switcher in navbar/mobile header. English default, Indonesian toggle, type-safe dictionary, 0 FOUC. | TASK-032, TASK-033 |
| **C-02** | Nav links: *Profile & Journey, Projects, Credentials, Documentation, Contact* (+ theme + ID/EN). No Skills/Home link; Download CV is in the Hero, not the nav. Section headings: PROFILE & JOURNEY, SKILLS, PROJECTS, VERIFIED CREDENTIALS, FIELD DOCUMENTATION, DIRECT CHANNELS. | Blueprint nav: Home, About, Skills, Projects, Certifications, Gallery, Contact + Download CV control. | **RESOLVED (CR-002):** Added "Overview" link to `#home` as the first navigation item in desktop navbar, mobile menu, and footer. Anchor IDs: `home`, `profile`, `skills`, `projects`, `credentials`, `documentation`, `contact`. | TASK-030 |
| **C-03** | Lightbox has a caption bar ("[MIKROTIK … MTCNA-2026] — VERIFIED CREDENTIAL PREVIEW", "CLOSE (ESC)") and footer text ("SHA-256 HASH VERIFIED // DIGITAL REPOSITORY SIGNED", "ACTIVE STATUS: VALID THROUGH 2026"). | Image + close control only; no metadata panel; no unverifiable claims. | Image-only + X close button (accessible name "Close certificate preview"). **Never** render hash/validity claims. | TASK-013 |
| **C-04** | Skills tiles are **icon-only** generic glyphs (terminal, code, database, chip, network, hierarchy, laptop, cube, git-commit, shield, cloud, router…). Section label reads "TECHNOLOGY STACK // HOVER TO PAUSE", "STATUS: ACTIVE". | Icons **and labels**; only owner-confirmed skills; hover not the only path. | Keep icon-only tiles visually; expose names via visually-hidden list + `aria-label`; owner supplies icon→skill mapping. Owner may instead request visible labels. Decorative "STATUS: ACTIVE" omitted. | TASK-011 |
| **C-05** | Headline: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER" (dark desktop, opening) vs "SOFTWARE DEVELOPMENT" (mobile dark/light, light desktop). | Headline must be owner-approved; do not invent titles. | Use one owner-approved string everywhere. Owner must confirm that the "Network Engineer" wording is accurate. | TASK-007, 009 |
| **C-06** | Project cards add: status label (IN DEVELOPMENT / V1.0 COMPLETED / ACTIVE / COMPLETED / IN PROGRESS), license text (MIT / Private), a "[PREVIEW 16:10]" chip and a "THREAT_INTEL" tag on card 1, and a header counter "INDEXED: 06 OF 06 ACTIVE". | Blueprint card fields exclude these; no categories. | Show status + license **only if owner supplies verified values**. Treat "[PREVIEW 16:10]" as a design annotation (not shipped). Omit "THREAT_INTEL" and the counter unless the owner approves them. | TASK-012 |
| **C-07** | Card 1 ("Sentinel") shows **"Private"** next to a "GitHub Repository" link. | Each card has a *verified* repo URL; no fake or non-working link. | A private repository has no public URL → render non-link "Private repository" state. | TASK-012 |
| **C-08** | Credential cards show a persistent description, issuer chip, "VERIFIED"/"CREDENTIAL"/"KOMPETENSI" badge, ID codes (e.g. "#G-CYBER-8809"), "ISSUED/AWARDED: 2026". In light mode the red issuer chip sits on the image with poor contrast. | Hover overlay: name + issuer only; no invented credentials. | Keep the design's card composition using **only verified fields**. "VERIFIED" badge and ID codes only with owner-provided evidence. Give issuer chips a solid background. | TASK-013 |
| **C-09** | Chatbot launcher has a red notification dot; header shows a "LIVE" badge and "Answers strictly from verified profile data". | No fake status; failures handled gracefully. | Launcher dot only until first open (or omitted). "LIVE" must reflect truth: show "Unavailable" after an error, never claim live without evidence. Welcome message + chips as designed. | TASK-023 |
| **C-10** | Mock content: AI-generated project thumbnails, placeholder certificate ("Royal Institute of Architects / Alexander J. Vance"), mock gallery captions, mock IDs. Copy defects: Enterprise Network Lab description (eBPF anomaly detector) does not match its tags (MikroTik CHR, RouterOS, VirtualBox, Winbox); desktop vs mobile timeline wording differs; stray line break in the profile text; truncated email/GitHub text in light mode. | Truth rules; no fabricated assets; consistent dates/roles. | Treat all as non-content; owner supplies real assets and corrected, consistent copy. | TASK-008…015 |
| **C-11** | Section index labels (e.g. "03 // TECHNICAL STACK", "04 // SELECTED PROJECTS", "05 // CERTIFICATIONS & AWARDS", "07 // CONTACT") appear in `4` and `6` but **not** in the primary layout `3` or the mobile exports `5`/`7`. The opening overlay also contains faint, unreadable corner text. | Blueprint: show a section index/label "if present in the reference"; `3 MASTER DESIGN.png` is the primary desktop layout. | Follow the primary layout `3`: **omit** index labels and unreadable corner text unless the owner supplies exact wording. | TASK-005, 007, 009–015 |

## 14. Open decisions and future ideas

### 14.1 Open decisions (OD)
| ID | Decision | RECOMMENDED | Resolve by |
|---|---|---|---|
| OD-01 | Test tooling | Vitest (unit); Antigravity browser agent for visual checks; Playwright optional (devDependency) | TASK-003 |
| OD-02 | Content file format | Typed TypeScript modules in `src/data/` validated by Zod | TASK-008 |
| OD-03 | Schema shape | Single `KnowledgeRecord` table (see `SCHEMA.md`) | TASK-017 |
| OD-04 | Environment variable names | `DATABASE_URL` (read-only runtime), `MIGRATION_DATABASE_URL` (privileged, local only), `GEMINI_API_KEY`, `GEMINI_MODEL` | TASK-002 / 017 |
| OD-05 | Gemini model + free-tier eligibility/data terms | Verify from official docs | TASK-021, 026 |
| OD-06 | Hosting eligibility (e.g. Vercel Hobby terms) | Verify; if ineligible present a free alternative | TASK-026 |
| OD-07 | Neon Free Tier limits, region, pooling | Verify from official docs | TASK-017 |
| OD-08 | Numeric limits (rate limit, max message length, timeout, record count, output tokens, fallback copy) | Starting values in `ARCHITECTURE.md` §7 | TASK-019 |
| OD-09 | Public placeholder policy for missing assets/links | Prefer not shipping them; release gate blocks leftovers | TASK-008 |
| OD-10 | Breakpoints | Validate visually against references (do not trust export widths) | TASK-004 |
| OD-11 | Which contact details may be published | Owner approval per channel | TASK-015 |
| OD-12 | Backdrop click closes lightbox? | Not assumed; Escape + X only until decided | TASK-013 |
| OD-13 | Antigravity version reads `AGENTS.md`? (supported from IDE 1.20.5) | If older, add a minimal `GEMINI.md` pointing to `AGENTS.md` | TASK-001 |

### 14.2 Definition of V1.0 complete
Every ACC item verified with recorded evidence **or** an owner-approved written exception, and owner sign-off at Gate G8.

### 14.3 Future ideas (parking lot — not implemented)
- **One-click "Copy email address" clipboard button:** A companion button on the Direct Email card that copies `budikusumafauzi@gmail.com` to the visitor's clipboard with temporary visual feedback (e.g. checkmark icon), as an alternative for visitors who do not use Gmail (CR-007 recommendation; not implemented in V1.0 per strict scope rules).

## 15. Decision log
Owner answers are recorded here. **Shortcut:** the owner may reply *"Approve all RECOMMENDED"* to adopt every recommendation in §13–§14 at once.

| Item | Decision | Date | Recorded by |
|---|---|---|---|
| Gate G0 Package | **APPROVED:** "Approve all RECOMMENDED in C-01..C-11 and OD-01..OD-13. Start Phase 1." All RECOMMENDED resolutions in §13 (C-01..C-11) and §14 (OD-01..OD-13) adopted. Modular placeholder fallback policy confirmed for missing photos (`public/images/placeholders/*`). Recommended defaults in `DESIGN.md` §13 (DS-01..DS-09) adopted. Phase 1 authorized. | 2026-10-22 | Architect (Antigravity) |
| Gate G3 Package | **APPROVED:** "Approve Gate G3 static portfolio implementation. Start Phase 4." Static portfolio sections accepted, Phase 4 (PostgreSQL schema, deterministic builder, seed, and read-only runtime role) authorized. | 2026-10-23 | Builder (Antigravity) |
| CR-001 (TASK-029) | **APPROVED:** "Make hero portrait permanently full color without hover dependency." Portrait renders natural full color by default across all themes and viewports. | 2026-10-24 | Owner Directive |
| CR-002 (TASK-030) | **APPROVED:** "Add Overview navigation link to top across desktop navbar, mobile menu, and footer." Overview link targets `#home` as the first navigation item. | 2026-10-24 | Owner Directive |
| CR-003 (TASK-031) | **APPROVED:** "Add 5th contact card for Credly profile, fix typography wrapping, and update knowledge records." URL extracted from verified intake file, 5-card layout balanced, seed updated. | 2026-10-24 | Owner Directive |
| CR-004 (TASK-028) | **APPROVED:** "Resolve Gemini chatbot production timeouts, optimize latency, and stabilize live responses." Environment sanitized, fast Flash model prioritized, timeouts eliminated. | 2026-10-24 | Owner Directive |
| CR-005 (TASK-032 & TASK-033) | **APPROVED:** "Implement bilingual ID/EN foundation, static UI localization, and multilingual chatbot pipeline." Type-safe dictionary, segmented ID/EN switch, bilingual retrieval, and prompts. | 2026-10-24 | Owner Directive |
| CR-006 (TASK-034) | **APPROVED:** "Use LOGO FB.png as the browser tab favicon." High-resolution site icons (`icon.png`, `apple-icon.png`, `favicon.ico`) generated from `LOGO FB.png` and served via Next.js metadata. | 2026-10-25 | Owner Directive |
| CR-007 (TASK-035) | **APPROVED:** "Direct the email contact card to Gmail compose in a new tab (instead of mailto: opening Outlook) and eliminate all text truncation (...) across all contact cards." Direct Gmail compose web URL, natural delimiter wrapping, and zero ellipsis truncation across all 5 contact cards. | 2026-10-25 | Owner Directive |
| CR-008 (TASK-036) | **APPROVED:** "Add 1 logo (Next.js) to the Technical Stack marquee and ensure high-contrast visibility for all skill tiles in both dark and light themes." Next.js official local asset integrated, verified skills updated to 35, and contrast enhanced for dark/light themes. | 2026-10-25 | Owner Directive |
| CR-009 (TASK-037) | **APPROVED:** "Resolve chatbot slowness and first-attempt 'UNAVAILABLE' failures caused by chat.gemini_timeout (4x in terminal) and prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }." Fast Flash model, thinkingBudget: 0, 10-minute in-memory knowledge cache, stale-while-error resilience, connection error recovery, panel-open warm-up, and single transient retry. | 2026-10-25 | Owner Directive |
| CR-010 (TASK-038) | **APPROVED:** "Enable the chatbot to accurately answer free-form visitor questions (not limited to starter chips) in Indonesian, English, or any visitor language using full verified knowledge context and server-validated structured citations." Full 40k-char verified knowledge context, strict 6-turn history, structured output schema, server citation validation, and multilingual natural language grounding. | 2026-10-25 | Owner Directive |
| CR-011 (TASK-039) | **APPROVED:** "Eliminate 30-minute idle failures and tail latency in the chatbot via Hedged Requests (Attempt 2 starting at 2.8s soft deadline on fallback model family), Stale-While-Revalidate 12-hour cache, build-time knowledge snapshot fallback racing a 600ms DB timer, panel-open warm-up endpoint (GET /api/chat -> 204), and in-memory answer cache for 0-history questions." | 2026-10-26 | Owner Directive |
| CR-012 (TASK-040) | **APPROVED:** "Enrich assistant's knowledge from all workspace/public portfolio sources so questions outside starter chips are answered accurately within the 40k cap, replace blunt refusal with helpful bilingual fallback guidance, and tune prompt for broad/partial questions." | 2026-10-26 | Owner Directive |
| CR-013 (TASK-041) | **APPROVED:** "Remove the two small chips ('ID // FB-TKJ-ENG' and 'VERIFIED' / 'PORTRAIT VERIFIED') from the bottom of the Hero portrait frame while preserving the technical frame, crimson brackets, and full-color photo." | 2026-10-26 | Owner Directive |
| CR-014 (TASK-042) | **APPROVED:** "Integrate all 6 Selected Projects display photos from 'dokumen informasi/A. Desain dan aset visual/Foto Project' with verified status and an accessible interactive Lightbox modal preview on thumbnail click, matching the Credentials lightbox interaction pattern." | 2026-10-26 | Owner Directive |
| CR-015 (TASK-043) | **APPROVED:** "Integrate all 6 Field Documentation photos from 'dokumen informasi/A. Desain dan aset visual/Dokumentasi' with clean titles/captions derived from owner filenames, verified status, and interactive Lightbox modal preview with carousel drag-vs-click guard." | 2026-10-26 | Owner Directive |

## 16. Traceability (requirement group → tasks)
Hero/Nav/Opening/Theme → TASK-004…007, 009 · Profile, Skills, Projects, Credentials, Gallery, Contact → TASK-010…015 · Data → TASK-008, 017, 018 · Chatbot backend → TASK-019…022 · Chatbot UI → TASK-023 · Quality/Security → TASK-024, 025 · Deployment/Acceptance → TASK-026, 027. Full table: `TODO.md`.
