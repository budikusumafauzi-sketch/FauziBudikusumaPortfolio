# MASTER PROJECT BLUEPRINT
## Personal Portfolio Website & Interactive AI Dashboard

**Project owner:** Fauzi Budikusuma  
**Document purpose:** Master plan / single planning baseline for preparing the project documentation before implementation  
**Product version:** V1.0  
**Project phase:** Documentation generation only — design and requirements lock  
**Primary UI language:** English  
**Target build and operating cost:** Rp0, using eligible free tiers only  
**Database policy:** PostgreSQL is the only database permitted  
**Current Claude assignment:** Create the requested preparation documents only. Application coding, dependency installation, configuration changes, database provisioning/migrations, and deployment are OUT OF SCOPE.

---

# 0. How to Use This Blueprint

This file is the single high-level planning reference from which the project-specific documents will be prepared. It is not a replacement for those documents. It establishes shared context, constraints, design expectations, technology decisions, data flows, security requirements, future delivery phases, and acceptance standards so that the documentation does not contradict itself. **For the current assignment, Claude must create the documentation package only.** The future implementation roadmap in this file is reference material to describe in TODO/task documents, not permission to execute it.

Claude must read this file before drafting or modifying the project documents. For the current documentation-only assignment, file operations are restricted to inspecting references and creating/editing the requested Markdown documents and their document directories. Application source, package manifests/lockfiles, runtime configuration, secrets, database resources, and deployments must not be created or modified. If information conflicts, resolve it in this order:

1. Explicit, latest approval from the project owner.
2. Approved visual assets in `design/approved/` for visual appearance and interaction states represented by the designs.
3. `PRD.md` for product requirements and scope.
4. `RULES.md` for mandatory constraints and prohibited actions.
5. `ARCHITECTURE.md` for technical decisions and system boundaries.
6. `DESIGN.md` for implementation-specific design rules.
7. `SCHEMA.md` and the executable Prisma schema/migrations for data design.
8. `WORKFLOW.md`, `AGENTS.md`, task files, skills, and `TODO.md` for execution process.

If two approved sources conflict, Claude must not silently pick one. It must report the exact conflict, explain the impact, recommend the smallest change, and wait for the owner's decision when the conflict changes a requirement, design, cost, or technology.

## 0.1 Status labels

Use these labels in documentation and task files:

- **CONFIRMED** — directly specified or approved by the owner.
- **RECOMMENDED** — implementation recommendation that still needs approval if it changes the approved baseline.
- **ASSUMPTION** — temporary inference that must be validated.
- **OPEN DECISION** — information only the owner can decide or that requires a current service-policy check.
- **BLOCKED** — must not proceed until a stated dependency or decision is resolved.

Do not represent recommendations, assumptions, or placeholders as confirmed facts.

---

# 1. Product Summary

Build a polished, responsive personal portfolio website that acts as a professional introduction and interactive showcase for Fauzi Budikusuma. The site presents verified profile information, education, learning and career journey, technical skills, software and IT/networking projects, certifications and awards, activity documentation, and professional contact channels.

The design direction is premium, editorial-minimalist, cinematic at entry, and restrained rather than visually noisy. It uses a custom dark/light theme system with crimson-red accents, strong typography, carefully sized cards, consistent image treatment, and restrained motion. The visual design must come from the approved Google Stitch exports rather than a new concept invented by a coding agent.

A floating profile-scoped AI chatbot is available throughout the website. It answers visitor questions only from approved, verified portfolio facts that are retrieved from PostgreSQL. The chatbot is not a general-purpose assistant, not a personal-data oracle, and not a mechanism for editing the website.

The site must remain useful if the AI service or database is unavailable. The rest of the portfolio must not depend on the chatbot being healthy.

## 1.1 Primary goals

1. Present the owner's identity and professional direction clearly.
2. Make projects, skills, education, experience, credentials, and activities easy to explore.
3. Give visitors direct access to verified professional links and project repositories.
4. Provide an AI-powered way to ask questions about the owner's public portfolio data.
5. Be responsive and accessible across desktop, tablet, and mobile.
6. Keep the implementation maintainable using files/Git as the content-maintenance workflow; no admin dashboard is required.
7. Target Rp0 by avoiding paid services, paid upgrades, unnecessary infrastructure, and paid domains.
8. Ensure design fidelity, facts, security, and scope are verifiable before the project is considered complete.

## 1.2 Intended audience

- Recruiters and hiring managers.
- Software-development and IT/networking professionals.
- Potential collaborators.
- Academic or professional contacts.
- General visitors who want to learn about the owner's profile and work.

## 1.3 Product principles

- Design fidelity before embellishment.
- Truthful profile data before marketing claims.
- Simple architecture before unnecessary infrastructure.
- Free-tier compatibility before convenience.
- Read-only public data access by default.
- Accessibility and responsive behavior are requirements, not polish items.
- Work in small, verifiable phases; do not attempt a large unreviewed implementation dump.

---

# 2. Scope and Non-Goals

## 2.1 Included in V1.0

- Cinematic loading/intro overlay with owner-approved monogram asset.
- Sticky top navigation and responsive mobile navigation.
- Hero section with verified identity, professional headline, short bio, portrait, and calls to action.
- About/Profile section and education, learning, career, and organizational timeline.
- Continuous horizontal skills marquee with a reduced-motion fallback.
- Project-card grid linked to verified GitHub repositories and optionally approved live demos.
- Certification/award carousel and image-only certificate lightbox.
- Horizontal activity/documentation gallery.
- Contact cards for Email, LinkedIn, GitHub, and Instagram.
- Footer with identity, quick links, social links, copyright, and Back to Top.
- Dark and light themes with no wrong-theme flash at initial render.
- Download CV as a PDF.
- Floating chatbot available across page scroll positions.
- Next.js Route Handler for the chatbot.
- PostgreSQL portfolio knowledge records accessed through Prisma.
- Developer-run data seed process from project files into PostgreSQL.
- Validation, basic best-effort rate limiting, safe error handling, accessibility checks, responsive checks, and deployment preparation.

## 2.2 Explicitly excluded from V1.0

Do not add these without explicit owner approval:

- Admin dashboard or content-management dashboard.
- Authentication, visitor accounts, or role-management UI.
- Contact message form or custom email-sending backend.
- Project categories/filters, project search, or project detail modals.
- AI features unrelated to verified portfolio information.
- General web search, browsing, external retrieval, or unrestricted knowledge answers in the chatbot.
- pgvector, vector database, complex RAG, or embeddings.
- Redis or another database/cache service.
- MongoDB, MySQL, SQLite, or any second database.
- Docker or Docker Compose as a project requirement.
- Paid domain, paid API, paid hosting, paid add-on, or billing activation.
- Analytics/tracking or third-party services that are not approved and justified.
- Arbitrary skill percentages, fake statistics, fake testimonials, fake project URLs, or invented credentials.
- Extra pages or sections not listed in this blueprint.

A coding agent must not interpret a visual opportunity as permission to add functionality. If a potentially useful improvement is outside scope, document it as a future idea and do not implement it.

---

# 3. Design Source of Truth and Asset Folder

## 3.1 Canonical design folder name

**Use `design/approved/` as the canonical folder for approved visual references.**

The owner should extract/copy the approved image exports into this folder in the repository, preserving each original filename. All project documents must explicitly point to this folder. `DESIGN.md` must say that `design/approved/` is the source of truth for visual design and approved visual states.

Do not refer vaguely to “the design folder,” “the images above,” or the original ZIP as the only reference. Use the exact path `design/approved/` in instructions.

## 3.2 Expected assets

The supplied archive has these seven PNG files:

```text
design/approved/
├── 1 OPENING.png
├── 2 MASTER DESIGN + CHATBOT AI.png
├── 3 MASTER DESIGN.png
├── 4 PREVIEW CERTIFICATION.png
├── 5 PREVIEW MOBILE DARK MODE.png
├── 6 LIGHT MODE.png
└── 7 PREVIEW MOBILE LIGHT MODE.png
```

Preserve these names so they can be matched to the design exports. If the owner later supplies revised exports, do not overwrite the approved files silently. Keep a clear latest-approved set and ask the owner to approve which files supersede earlier versions.

Recommended `design/approved/README.md` contents:

- This folder contains owner-approved visual references for V1.0.
- Every UI implementation task must review the relevant reference before editing components.
- The numbered exports map to opening, chatbot-open desktop, full desktop, certificate lightbox, mobile dark mode, light mode, and mobile light mode.
- The exported images are visual references, not production assets to display as the website itself.
- Extract individual production assets (logo, portrait, certificate images, gallery photos, project thumbnails) to suitable `public/` paths only after checking that the actual source files are available and approved.
- Do not fabricate or crop a reference screenshot into a replacement logo/photo.

## 3.3 Reference priority

- `1 OPENING.png`: opening/loading screen and monogram placement.
- `2 MASTER DESIGN + CHATBOT AI.png`: desktop page composition with the chatbot opened.
- `3 MASTER DESIGN.png`: primary desktop page layout with chatbot closed.
- `4 PREVIEW CERTIFICATION.png`: certificate-preview/lightbox appearance.
- `5 PREVIEW MOBILE DARK MODE.png`: mobile dark-mode responsive reference.
- `6 LIGHT MODE.png`: approved light-mode layout.
- `7 PREVIEW MOBILE LIGHT MODE.png`: mobile light-mode responsive reference.

If the PRD text and a reference image appear to differ, use the image for the appearance and use the PRD for behavior unless a genuine conflict exists. Record genuine conflicts for owner review.

## 3.4 What Claude must do with the design references

Before drafting `DESIGN.md` or implementing UI:

1. Confirm all expected filenames exist under `design/approved/`.
2. Open/inspect each relevant image at sufficient scale; do not rely only on filename or thumbnail.
3. Inventory section order, alignment, spacing rhythm, color relationships, typography hierarchy, card composition, image ratio, navigation states, chatbot-open state, mobile rearrangement, and light-mode differences.
4. Extract exact color values only where they can be confidently identified. Do not invent exact hex codes from visual impression. If uncertain, mark as a value to sample/confirm.
5. Separate confirmed observations from implementation interpretations.
6. Create a design-component matrix mapping each reference to the component(s) it governs.
7. Do not replace the visual references with generic portfolio patterns.

---

# 4. Visual System and UI/UX Specifications

## 4.1 Overall visual direction

- Premium, editorial-minimalist, professional, modern.
- Mostly dark charcoal/near-black surfaces in dark mode, crisp typography, and restrained crimson accents.
- Light mode must retain the same design identity, using light surfaces and suitable text contrast rather than simply inverting colors indiscriminately.
- Avoid excessive neon, random gradients, decorative dashboards, arbitrary charts, oversized animated elements, or effects that make the site look like a generic AI-generated template.
- Maintain consistent content width, section spacing, border radius, card dimensions, and image aspect ratios.
- Use subtle separators and carefully controlled borders/shadows, guided by the approved exports.

## 4.2 Theme and design tokens

`DESIGN.md` should define semantic design tokens for:

- Page background and alternate section background.
- Main surface/card background.
- Main text, secondary text, muted text.
- Primary crimson/accent color and its hover/active variants.
- Border/separator colors.
- Focus ring color.
- Success, warning, and error states when applicable.
- Typography families, scale, line heights, and weights.
- Content max-widths, page gutters, section spacing, card gaps, radii, and elevation.
- Motion duration/easing and reduced-motion alternatives.
- Responsive breakpoints consistent with the actual layout behavior.

Do not invent final token values from memory. Derive and validate them against the approved design exports, then centralize them in the styling system instead of scattering raw values across components.

## 4.3 Typography

Use `next/font` for the approved font families:

- Plus Jakarta Sans.
- Inter.
- JetBrains Mono.

`DESIGN.md` must assign roles based on the reference: for example, primary heading/body/UI/technical labels. Do not load unused font weights or duplicate remote font requests. Final font weights and specific roles should follow the exports and accessibility/legibility testing.

## 4.4 Shared interaction states

For interactive controls and components, document and implement:

- Default.
- Hover (for pointer devices).
- Focus-visible (keyboard).
- Active/pressed.
- Disabled or unavailable, where relevant.
- Loading.
- Error/fallback, where relevant.
- Open/closed for menus, chatbot, and modal.

Hover must never be the only way to access an essential action or information.

---

# 5. Detailed Page and Component Requirements

## 5.1 Persistent top navigation

Elements:

- Owner monogram/logo.
- Section anchor links: Home, About, Skills, Projects, Certifications, Gallery, Contact.
- Download CV (PDF) control.
- Dark/light mode toggle.
- Responsive mobile menu/drawer.

Behavior:

- Sticky navigation stays available while scrolling, without obscuring anchor targets.
- Anchor navigation scrolls to the intended section with suitable scroll offset.
- Active-section highlighting may be implemented only if reflected in the approved design or needed to match it; do not introduce elaborate tracking UI.
- Mobile menu supports keyboard, Escape where appropriate, close-on-selection, and accessible labels.
- Theme toggle uses a clear accessible name and communicates the current state.
- Links and controls maintain adequate hit targets on mobile.

## 5.2 Opening/loading overlay

- Use the owner-approved monogram/logo asset and composition from `1 OPENING.png`.
- Use a subtle crimson progress indicator consistent with the reference.
- The overlay may show while necessary critical assets or initial rendering are prepared; it must not invent a long delay.
- It must auto-dismiss/fail-safe if a nonessential asset stalls.
- Respect `prefers-reduced-motion`; reduce/disable nonessential movement.
- Avoid blocking browser navigation, causing layout locks, or delaying essential content unnecessarily.
- Ensure there is no blank screen on runtime error.
- The logo used in production must be an actual approved asset, not an extracted screenshot of the full opening design.

## 5.3 Home/Hero

Composition:

- Split editorial layout.
- A section index or small editorial label if present in the reference.
- Full name: Fauzi Budikusuma.
- Verified professional headline focused on Software Development and IT/Networking.
- Concise verified profile summary.
- Primary CTA: View Projects, styled with the approved crimson accent.
- Secondary CTA: Contact Me and/or Download CV, following the approved design.
- Owner-approved portrait in the framed image area.

Rules:

- Do not invent job titles, employment status, years of experience, numerical achievements, or statistics.
- Any headline or summary must be sourced from owner-approved profile data.
- Entrance animation should be restrained, staggered if the design depicts it, and disabled/reduced when reduced motion is requested.
- Ensure portrait layout adapts to mobile without awkward cropping or text overlap.

## 5.4 About Me / Profile & Journey

Layout: structured two-column design on desktop, responsive stacking on smaller screens.

Content:

- Professional summary.
- Software development and IT/computer networking focus.
- Work values and professional goals.
- Education.
- Learning and career journey.
- Organizational experience.

Rules:

- All biographical facts must be verified by the owner.
- Missing data must remain a clearly documented content placeholder during preparation, not appear as fabricated final content.
- Dates and role names must be consistent wherever repeated.
- Timeline/cards should follow the design reference and not add unapproved statistics.

## 5.5 Technical skills — continuous horizontal marquee

- Continuous, seamless horizontal movement of technology icons and labels.
- Uniform card dimensions and spacing.
- Skill set may include Python, JavaScript, SQL, Node.js, React, and Computer Networking only where the owner confirms these are appropriate to list.
- Custom SVG/PNG icons may be imported from approved project assets.
- Animation slows/pauses smoothly on hover where practical.
- When `prefers-reduced-motion: reduce` is active, use a static wrapping/grid presentation or another non-moving equivalent.
- Do not use arbitrary percentages, proficiency bars, or stars without an explicit owner-approved evidence model.
- Decorative marquee duplication for seamless looping must not create confusing duplicate screen-reader announcements. Use an accessible implementation with a meaningful content list.

## 5.6 Projects — interactive card grid

Desktop:

- Exactly three columns at desktop breakpoints matching the approved layout.
- Uniform card heights, consistent padding, and thumbnails with 16:10 aspect ratio.
- If project count is not divisible by three, final-row cards retain their 1/3 grid-column width and remain left-aligned. They must never stretch to fill the final row.

Responsive:

- Two columns on tablet.
- One column on mobile.

Each card:

- Owner-approved project thumbnail or a clearly designed placeholder when an image is not yet supplied.
- Project title.
- Concise summary.
- Technology badges.
- Verified GitHub repository URL.
- Optional live-demo URL only if supplied and approved.

Rules:

- No project categories/filters.
- No search bar.
- No project detail modal.
- No invented/fake repository or demo URL.
- Unfinished links show an explicit development/unavailable placeholder and must not masquerade as working links.
- External links opening a new tab must use safe attributes such as `rel="noopener noreferrer"`.
- Project image loading must not cause large layout shifts.

## 5.7 Certifications & awards carousel

- Use Embla Carousel for horizontal draggable/swipeable behavior.
- Support mouse dragging, touch swipe, keyboard focus, and accessible previous/next navigation controls.
- Maintain consistent card sizing in accordance with the design reference.
- Hover overlay contains only a concise certificate name and issuing organization, as approved.
- Essential information must remain accessible on touch devices that do not have hover.

Certificate lightbox:

- Clicking a certificate opens a centered modal.
- Modal contains only the full certificate image and a clear close control (`X`); no side metadata panel or long description.
- Image uses `object-fit: contain` and must not be cropped.
- Support Escape to close.
- Support focus management, focus return to the triggering card, and accessible dialog semantics.
- Prevent background scrolling while open without breaking page position.
- Clicking outside may close only if it matches the approved interaction decision; do not make this behavior an assumption if the reference/owner has not settled it.
- On missing certificate image, show a respectful, non-fabricated unavailable placeholder in the card and do not open a broken-image modal.

## 5.8 Gallery / field documentation

- Horizontal drag/swipe gallery for authentic activity images: academic, organizational, training, and project documentation.
- Consistent card dimensions and `object-fit` cropping according to the reference.
- Mobile behavior must use a suitable touch-action setting (e.g. `pan-y` for a horizontal-dragging region) so horizontal interaction does not block normal vertical page scrolling.
- Support keyboard accessibility where applicable.
- Provide meaningful alt text for informative photos; decorative images use an appropriate empty alt attribute.
- Do not invent events, captions, dates, or individuals in photos.

## 5.9 Contact and footer

Contact channels:

- Email.
- LinkedIn.
- GitHub.
- Instagram.

Rules:

- URLs and email must be verified by the owner.
- External links must be safe and accessible.
- Do not add a contact form or email backend in V1.0.
- Do not expose a private email or personal contact detail unless specifically approved for public use.

Footer:

- Owner identity.
- Quick navigation links.
- Approved social links.
- Copyright notice.
- Back to Top control.

## 5.10 CV download

- A genuine owner-provided PDF should be stored as an approved public asset under a suitable `public/` path.
- The Download CV button must resolve to the real asset and work on desktop and mobile.
- Do not create fabricated experience or qualifications in the CV.
- If the final PDF has not been supplied, use an internal content placeholder and flag the task as blocked; do not link to a fake file.

## 5.11 Dark/light mode

- Implement with `next-themes` as specified in the approved stack.
- Use the approved dark and light visual references.
- Prevent theme flash/mismatch on initial load as far as the chosen setup allows.
- Persist the visitor's theme preference where supported by the library.
- All text, cards, controls, borders, modal states, and chatbot states must be legible in both themes.
- Transitions should be smooth and restrained; avoid a slow full-page transition that interferes with use.

## 5.12 Floating AI chatbot UI

- Floating launcher fixed at bottom-right throughout scrolling.
- Must not obscure important CTAs, navigation controls, the mobile safe area, or certificate modal controls.
- Starts closed.
- When opened, show a themed chat panel matching the approved desktop-open reference.
- Include a welcome message, starter prompt chips, free-text input, send button, loading state, conversation response area, error/fallback state, and close/minimize affordance consistent with the design.
- Starter prompts must ask questions answerable from actual profile data.
- Provide accessible button names, keyboard behavior, focus behavior, and sensible panel dimensions.
- On small screens, panel must fit the viewport and keyboard, account for safe areas, and not trap the user behind off-screen controls.
- Do not add unrelated chatbot capabilities or claim the chatbot can perform actions.

---

# 6. Content and Personal Data Management

## 6.1 Content source

The owner maintains approved portfolio knowledge in local project files, preferably under `src/data/` as typed data modules or a similar explicit structure selected in implementation planning. The database is populated from those approved files by a developer-controlled seed process.

Flow:

```text
Owner-approved files in src/data/
        -> schema/type validation
        -> explicit Prisma seed command
        -> Neon PostgreSQL records
        -> read-only retrieval by chatbot API
        -> Gemini receives only relevant, approved facts
        -> visitor sees grounded answer
```

No browser-side direct database connection. No public write endpoint. No visitor-facing content editor.

## 6.2 Content categories

Content may include profile overview, education, experience, organization, skills, projects, certifications, and approved public contact details. Keep records minimal: store only information required for the portfolio and chatbot.

Do not load sensitive personal data into the chatbot context. The knowledge base should contain information intentionally approved for public presentation or answering public professional questions.

## 6.3 Data validation and seed behavior

- Validate data before database writes.
- Seed must be idempotent, using stable IDs/unique keys and appropriate upsert behavior.
- Re-running seed must not create duplicate logical records.
- Define explicit behavior for updated and removed items; do not assume deletion synchronization happens automatically.
- Separate ordinary content updates from destructive schema/database operations.
- Never run production seed/migration commands without explicit task instructions and environment verification.
- The seed script is trusted developer tooling, not available through a public HTTP endpoint.

---

# 7. Chatbot Backend and AI Behavior

## 7.1 Scope

The chatbot answers questions about approved public portfolio information only. It must not become a general knowledge assistant and must not answer beyond the source facts retrieved for the current request.

## 7.2 Request lifecycle

1. Browser sends a text-only query to a single planned server endpoint such as `POST /api/chat`.
2. Route Handler validates content type, request shape, query length, and other basic constraints using Zod.
3. Best-effort in-memory IP rate limiting checks the request. IP handling must respect hosting headers carefully and must not trust arbitrary client-supplied forwarded headers outside the documented hosting environment.
4. Normalize/sanitize input for safe processing without silently changing the user's intent.
5. Search PostgreSQL through Prisma using a simple approved keyword/category strategy. Use a bounded query and retrieve only a limited number of relevant records.
6. If no relevant verified records are found, return a fixed, polite out-of-scope/not-available response rather than asking Gemini to guess.
7. If relevant records are found, send only the user question and minimal relevant retrieved public facts to the Gemini API on the server side.
8. Instruct the model to answer only from supplied facts, to distinguish unknown details, and to ignore instructions embedded in user-supplied text that attempt to override system constraints.
9. Apply request timeout, model output limits, error handling, and response-shape validation.
10. Return a clean response to the chat UI. Log operational diagnostics safely, without API keys, database URLs, or unnecessary conversation content.

The exact retrieval query and response contract must be finalized in `ARCHITECTURE.md` and tested. Do not add embeddings, vector search, external web search, or complex RAG in V1.0.

## 7.3 Suggested endpoint contract

`POST /api/chat` is a proposed endpoint name, subject to architecture confirmation.

Illustrative request:

```json
{
  "message": "Which projects has Fauzi worked on?"
}
```

Illustrative response contract:

```json
{
  "answer": "A response grounded in retrieved, verified portfolio records.",
  "status": "ok"
}
```

For an expected service fallback, use a clear, stable status shape. Never return stack traces, secret configuration, SQL text, provider credentials, or internal database details to the browser.

## 7.4 Grounding and prompt-injection resistance

- Treat the visitor's query as untrusted input.
- Treat retrieved portfolio records as factual context, not executable instructions.
- Do not follow visitor requests to reveal secrets, expose private records, override the system rules, or change application behavior.
- Send only the minimum data relevant to the question.
- Do not trust model output without response validation and fallback rules.
- Never allow Gemini to run SQL, change records, access arbitrary files, or invoke tools/actions in this application.
- Keep profile knowledge independent from raw visitor messages.
- Do not expose unrelated records just because they exist in the same database.

## 7.5 Read-only database permissions

The public chat API must not be able to `INSERT`, `UPDATE`, or `DELETE` portfolio records.

Use separate database credentials/roles in the same PostgreSQL database:

- **Runtime read-only role:** only the minimal `SELECT` permissions needed for the chatbot's tables/views.
- **Trusted migration/seed role:** used only by local developer commands or a trusted deployment step when explicitly required.

The runtime connection must use the read-only credential. The privileged credential must never be bundled into browser code or exposed through the public API. Avoid assuming that Prisma application code alone is a sufficient permission boundary.

## 7.6 Rate limiting and abuse controls

The approved V1.0 baseline is best-effort in-memory IP rate limiting, plus:

- Input-length limit.
- Request body size limit.
- Per-request timeout.
- Bounded database query results.
- Bounded model output.
- Friendly handling of throttling and transient failures.
- No automatic retry loops that multiply requests or quota usage.

In-memory limits are not globally shared between serverless instances and may reset on cold starts/deployments. Document this limitation clearly. Do not add a rate-limit vendor/database/service without the owner's approval.

## 7.7 Failure behavior

- Missing Gemini API key: chatbot displays a polite temporary-unavailable message; server emits safe diagnostic information.
- Gemini quota/rate limit: return a controlled fallback; do not repeatedly retry or request paid billing.
- Database timeout/unavailable: return controlled fallback; do not crash the page.
- Invalid/empty/oversized input: reject with clear validation feedback.
- No matching records: respond that the portfolio does not contain the requested information.
- Unexpected exception: generic visitor-safe message; diagnostic details only in safe server logs.
- All other site sections must remain usable even while chat is broken.

## 7.8 Gemini free-tier and privacy policy

The API must be configured on an eligible free-tier/unbilled project. Do not assume a Google AI Pro subscription automatically includes Gemini API quota. Do not connect billing or switch to a paid project without explicit owner authorization.

Before deployment, verify the current Gemini API model availability, regional eligibility, terms, rate limits, data handling, and free-tier conditions using official documentation. Free-tier terms can change. The free tier may have data-use conditions different from paid service, so only send public, owner-approved portfolio facts and the visitor question; never send secrets or private source files.

When quotas are exhausted, the product remains a normal portfolio without AI responses until the quota becomes available again or the owner approves a free alternative.

---

# 8. Technology Baseline

## 8.1 Approved runtime and application stack

| Concern | Technology | Responsibility |
|---|---|---|
| Web framework | Next.js App Router | Page routing, rendering, application structure, API Route Handlers |
| UI library | React | Reusable components and client-side interactions |
| Language | TypeScript | Typed application code and data contracts |
| Styling | Tailwind CSS | Layout, responsive styling, visual tokens |
| Theme | `next-themes` | Dark/light theme state and persistence |
| Motion | Motion for React (`motion`) | Approved entrance/transitions and interactive motion |
| Carousel | `embla-carousel-react` | Certificate/gallery horizontal interaction |
| Icons | Lucide React | UI icon set |
| Fonts | `next/font` | Plus Jakarta Sans, Inter, JetBrains Mono as used by the design system |
| Images | `next/image` | Optimized local/remote image rendering where suitable |
| Backend APIs | Next.js Route Handlers on Node.js runtime | Chatbot server endpoint and controlled server logic |
| Validation | Zod | Request and data validation |
| ORM | Prisma | PostgreSQL access, schema, seed and migration workflow |
| Database | PostgreSQL only, hosted on Neon Free Tier if suitable | Portfolio chatbot records |
| AI | Official Google Gemini API SDK | Grounded answer generation from retrieved portfolio records |
| Version control | Git + GitHub | History, code review, backup, deployment trigger if used |
| Package manager | pnpm is recommended, with a committed lockfile | Reproducible dependency install |

Use mutually compatible stable versions at the time implementation starts. Do not pin outdated versions merely because they appear in an older prompt. Record exact installed versions and check current official docs before implementing integrations, especially Next.js, Prisma, Neon, and the Gemini SDK.

## 8.2 Testing and quality tools

Minimum required checks:

- ESLint or the official linting approach compatible with the selected Next.js version.
- TypeScript type checking.
- Production build.
- Tests for Zod request validation, retrieval/fallback logic, and chatbot error cases where applicable.
- Manual responsive verification against every approved design state.
- Accessibility checks for keyboard, focus, reduced motion, modal, chat panel, and theme contrast.
- Verification of all external links and asset paths.

A free/open-source automated browser-testing tool such as Playwright may be considered if approved as a supporting development dependency. Do not add multiple overlapping testing frameworks without a need. Document the chosen test tools and commands in `WORKFLOW.md` and the task files.

## 8.3 Not required in V1.0

- Docker / Docker Compose.
- Redis.
- Separate backend framework/server.
- Separate auth service.
- Another database.
- pgvector, embeddings, or vector database.
- Paid monitoring/analytics.
- Paid UI component system.
- CMS/admin dashboard.
- Separate AI orchestration framework.

## 8.4 Runtime architecture summary

```text
Visitor Browser
  ├── Next.js-rendered portfolio UI
  ├── approved local/public assets
  └── Chat widget
        │ POST /api/chat
        v
Next.js Route Handler (Node.js runtime)
  ├── Zod validation
  ├── best-effort in-memory rate limiting
  ├── bounded keyword/category retrieval through Prisma
  │       v
  │   Neon PostgreSQL (runtime SELECT-only credentials)
  ├── safe no-data/DB-error fallback
  └── Gemini API call only when relevant verified facts exist
          │
          v
     grounded, validated answer or controlled fallback
```

The browser never receives database credentials or the Gemini API key. The API must not accept SQL, table names, arbitrary query parameters that control Prisma queries, or instructions to modify data.

## 8.5 Hosting and deployment candidate

- Frontend and Next.js Route Handlers: Vercel Hobby is a candidate only if the site's use qualifies under the current plan terms.
- PostgreSQL: Neon Free Tier is the candidate database provider.
- AI: Gemini API free tier on an unbilled project, if available for the selected model and region.
- Domain: use a provider-supplied subdomain; do not purchase a custom domain under the Rp0 policy.

Before selecting providers, verify current quotas, usage limits, allowed use, deployment restrictions, connection pooling recommendations, runtime compatibility, and inactivity/sleep behavior from official sources. Vercel Hobby has historically restricted use to personal, non-commercial use; confirm the current policy before treating it as approved for a publicly deployed professional portfolio. If a service is not eligible, do not quietly switch plans or enable billing. Present a compliant free alternative and ask for approval.

## 8.6 Deployment is not the same as local development

Local development may use environment variables and a local Node.js process while the database lives on Neon. Docker is not required for that setup. Deployment must have the same required environment variable names, compatible runtime, correct build command, and a safe database connection setup. Never commit a real `.env` file.

---

# 9. PostgreSQL and Prisma Schema Planning

`SCHEMA.md` documents the data model. The executable database definition lives in `prisma/schema.prisma`, with committed migrations and a trusted seed script.

## 9.1 Conceptual entity candidates

These are candidates to be reviewed, not an automatic instruction to create a table for every bullet:

- Profile: name, headline, public summary, approved career focus.
- Education: institution, program, dates, verified description.
- Experience: work/organization experience, role, organization, period, description.
- Skill: technology name, category, approved icon reference, optional display ordering.
- Project: title, summary, technologies, verified repository URL, optional approved demo URL, thumbnail reference, display ordering.
- Certification: certificate name, issuing organization, date/status if verified, image reference, display ordering.
- Gallery item: approved image reference, category, caption/date only if confirmed.
- Contact channel: type and approved public URL/address.

## 9.2 Schema design requirements

- Use stable identifiers and explicit relations where needed.
- Model fields with appropriate nullability and database types.
- Enforce unique URLs/keys only where a uniqueness rule is real.
- Validate allowed URL schemes and field lengths in application/data validation.
- Add indexes only where supported by actual retrieval and ordering queries.
- Support a verified/public flag only if it serves a defined rule; do not add unused abstractions.
- Avoid duplicating the same biography facts across unrelated rows when a shared source makes sense.
- Use timestamps only where operationally useful; do not make schema unnecessarily complex.
- Store image references/paths, not large image binaries, unless there is a separately approved reason.
- Keep schema/migrations aligned with the deployed Prisma version.

## 9.3 Retrieval strategy

The initial strategy is simple PostgreSQL keyword/category search through Prisma. No vector search and no pgvector. Retrieval should be bounded, predictable, and testable. Decide how keywords are extracted/normalized and how results are ranked in `ARCHITECTURE.md`; test common questions and out-of-scope queries. If no sufficient evidence exists, use a fixed fallback rather than letting the model invent a response.

## 9.4 Seed and migration rules

- Portfolio files in `src/data/` are the human-maintained source of truth.
- `prisma/seed.ts` reads and validates approved data, then writes only through trusted developer action.
- Seed must be repeatable/idempotent.
- Schema migrations are deliberate, versioned, and reviewable.
- Production writes require a distinct privileged credential, not the public API's runtime credential.
- Do not run destructive reset commands against production.
- `SCHEMA.md` must include a diagram or clear relation description and a field-level data dictionary once the schema is settled.

---

# 10. Security, Privacy, Accessibility, and Performance

## 10.1 Security

- Keep `GEMINI_API_KEY`, database connection strings, and privileged seed/migration credentials server-side.
- Commit `.env.example` without real values; add real `.env` variants to `.gitignore`.
- Use a PostgreSQL read-only runtime role.
- Validate and bound request input.
- Return generic visitor-facing errors.
- Never leak stack traces, SQL, provider response internals, keys, database URLs, or private profile information.
- Restrict chat endpoint to the intended method/content type and use safe response headers as appropriate.
- No public mutations, no arbitrary file access, and no model-triggered tools/actions.
- Treat visitor messages as untrusted, including prompt-injection attempts.
- Keep logs minimal and avoid unnecessary retention of user messages or IP addresses.
- Review external links and avoid rendering untrusted HTML from model output.

## 10.2 Privacy

- Publish only information the owner intentionally approves.
- Do not include private address, personal ID numbers, account numbers, private keys, or sensitive personal data in portfolio database records or model context.
- Use only approved photos and document assets.
- Do not add tracking/analytics by default.
- Review Gemini free-tier data handling and current terms before launch; only public profile facts may be sent to it.

## 10.3 Accessibility

- Semantic HTML landmarks and meaningful heading order.
- Keyboard-accessible navigation, chat widget, carousels, and modal.
- Visible `:focus-visible` states.
- Correct labels and accessible names for icon-only buttons.
- Appropriate image alt text.
- Sufficient color contrast in both themes.
- Reduced-motion fallbacks for entrance, marquee, and carousel-related effects.
- Modal focus management, Escape close, and return focus.
- Do not rely only on hover for content or controls.

## 10.4 Performance

- Use optimized image formats/sizes and avoid unnecessarily huge production assets.
- Use `next/image` appropriately for local/remote images.
- Avoid loading unused fonts/weights, large animation libraries beyond the approved stack, or redundant dependencies.
- Prevent cumulative layout shift by reserving image dimensions/aspect ratios.
- Keep the opening overlay lightweight and fail-safe.
- Lazy-load noncritical images where appropriate.
- Avoid unnecessary client components; keep static sections server-rendered where compatible with the chosen design and interactivity.
- Keep Gemini calls on demand only; never call AI at page load.
- Keep DB queries bounded and avoid sending all profile records to Gemini for every question.

## 10.5 Responsive acceptance

At minimum inspect:

- Wide desktop.
- Standard laptop desktop.
- Tablet widths.
- Narrow mobile viewport.
- Mobile dark mode.
- Mobile light mode.
- Chatbot closed and open.
- Certificate modal open.

Verify there is no accidental horizontal overflow, clipped text, unreachable controls, or modal/chat panel extending beyond the viewport.

---

# 11. Repository and Documentation Layout

Recommended initial repository layout:

```text
portfolio-pribadi/
├── MASTER_PROJECT_BLUEPRINT.md
├── PRD.md
├── AGENTS.md
├── CLAUDE.md
├── ARCHITECTURE.md
├── DESIGN.md
├── SCHEMA.md
├── RULES.md
├── WORKFLOW.md
├── TODO.md
├── tasks/
│   ├── TASK-001-project-foundation.md
│   ├── TASK-002-design-system-and-navigation.md
│   ├── TASK-003-page-sections.md
│   ├── TASK-004-content-assets-and-profile-data.md
│   ├── TASK-005-postgresql-and-prisma.md
│   ├── TASK-006-chatbot-api-and-UI.md
│   ├── TASK-007-quality-accessibility-security.md
│   └── TASK-008-deployment-and-final-audit.md
├── .claude/
│   ├── agents/
│   │   ├── design-reviewer.md
│   │   ├── database-reviewer.md
│   │   └── quality-reviewer.md
│   ├── skills/
│   │   ├── design-implementation/SKILL.md
│   │   ├── postgres-prisma/SKILL.md
│   │   ├── grounded-chatbot/SKILL.md
│   │   └── verification/SKILL.md
│   └── rules/
│       ├── design.md
│       ├── security.md
│       └── testing.md
├── design/
│   └── approved/
│       ├── README.md
│       └── [seven approved PNG exports]
├── public/
│   └── assets/
│       ├── brand/          # approved monogram/logo and chatbot icon
│       ├── profile/        # profile display portrait
│       ├── projects/       # project thumbnails/screenshots
│       ├── certificates/   # full certificate images
│       ├── gallery/        # authentic activity documentation photos
│       ├── skills/         # optional custom skill icons
│       └── documents/      # owner-approved public CV PDF
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── lib/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── pnpm-lock.yaml
```

This is a proposed destination structure. Do not create code folders/files before implementation approval. Use one canonical skill copy only. If using Claude Code, use its supported `.claude/skills/<skill-name>/SKILL.md` convention; if using another coding tool, adapt the location to that tool's supported format rather than maintaining duplicate skill files.


## 11.2 Approved design references vs. website content assets

Keep these two asset groups separate because they have different purposes:

- `design/approved/` contains the owner's approved Google Stitch screenshots and visual references. These are documentation/design references and are not automatically website content assets.
- `public/assets/` is the planned location for actual images, logos, certificate images, project thumbnails, activity photos, and the CV that the website will serve publicly. This is a future implementation directory; Claude must only DOCUMENT this structure during the current assignment and must not create or populate it yet.

### Planned public asset directory

```text
public/
├── assets/
│   ├── brand/
│   │   ├── logo-monogram.svg            # approved site monogram/logo
│   │   ├── logo-wordmark.svg            # optional, only if owner provides/approves it
│   │   └── chatbot-icon.svg              # approved custom chatbot icon
│   ├── profile/
│   │   └── profile-portrait.webp         # approved profile display photo
│   ├── projects/
│   │   ├── sentinel-cover.webp           # example filename; include only if asset exists
│   │   └── [project-slug]-cover.webp     # project thumbnails/screenshots
│   ├── certificates/
│   │   └── [certificate-slug].webp       # full certificate image for the lightbox
│   ├── gallery/
│   │   └── [activity-slug]-[number].webp # authentic activity/documentation photos
│   ├── skills/
│   │   └── [technology-slug].svg         # custom skill icons only when needed
│   └── documents/
│       └── Fauzi-Budikusuma-CV.pdf       # public downloadable CV
```

Directory and filename rules:

1. Use lowercase kebab-case for asset names except the approved CV filename if the owner prefers that exact form.
2. Use descriptive names and stable slugs; avoid names such as `image1.png`, `final-final2.png`, or random export names.
3. Keep originals in a separate owner-controlled archive if needed; optimize display copies for the website without damaging the original certificate/document.
4. Use SVG for simple logos/icons when a valid, approved SVG exists; use WebP/AVIF for photographic display assets when suitable. Keep a format that preserves legibility for certificates and documents.
5. The certificate lightbox must show the full certificate without cropping; do not use a cropped thumbnail as the full preview.
6. Project cover images must correspond to the actual project and must not imply features or results that do not exist.
7. Do not fabricate missing assets. Document them as `OPEN DECISION` or content tasks until the owner supplies them.
8. Do not commit confidential/private images, credentials, API keys, or personal documents that the owner has not approved for public access. The CV is public by design only after the owner approves its contents.
9. `public/` assets are publicly retrievable. Never put secrets or private source documents there.
10. The approved Stitch screenshots must remain in `design/approved/`; do not copy them into `public/assets/` and present them as the owner's actual profile/project/certificate photos.

### Planned content-data directory

Use structured, version-controlled files for public profile information and external links. The exact format (TypeScript modules or JSON) must be selected and documented consistently in `ARCHITECTURE.md`; do not maintain duplicate competing sources of truth.

```text
src/data/
├── profile.ts             # name, headline, bio, approved public summary
├── journey.ts             # education, experience, learning, organizations
├── skills.ts              # skill names, categories, icon asset paths
├── projects.ts            # project titles, descriptions, tech stacks, GitHub/demo URLs
├── certifications.ts      # certificate titles, issuer, dates/status, image paths
├── gallery.ts             # activity photo paths and short captions/categories
├── contacts.ts            # public email and approved social/professional URLs
├── chatbot-knowledge.ts   # verified, chatbot-safe facts or references to canonical data
└── site-config.ts         # navigation labels, CV path, site metadata
```

The above is a planned future source layout, not permission to create source files during documentation preparation. Avoid duplicating the same profile fact across several files. If chatbot data is derived from other canonical data files, document the transformation so it does not become a second manually maintained source of truth.

### External links and contact inventory

The documentation must define a content inventory for:

- GitHub profile URL.
- Verified GitHub repository URL for every displayed project.
- Optional live-demo URL for a project only when it exists and the owner approves showing it.
- LinkedIn profile URL.
- Instagram profile URL.
- Public professional email address.
- CV file path and download filename.
- Any approved external credential verification URL, if available and intended to be shown.

Use explicit placeholders such as `[OWNER TO PROVIDE]` for missing values. Never infer a URL from a username, invent a repository, or treat an unverified link as live. Each project record should specify its link status (for example `VERIFIED`, `NOT_PROVIDED`, or `UNDER_REVIEW`) in the content-planning documentation. These statuses are planning metadata; the final public UI should not expose internal verification notes unless specifically designed to do so.

### API and environment-variable inventory

`ARCHITECTURE.md`, `RULES.md`, and `WORKFLOW.md` must describe the future API and secret-handling requirements. `SCHEMA.md` must describe the database fields required by the chatbot. At minimum, document these categories without placing real secret values in Markdown:

- Gemini API key: server-only; exact environment-variable name to be confirmed against the selected official SDK and implementation.
- PostgreSQL runtime connection string: least-privilege, read-only runtime credentials where supported by the chosen deployment/Prisma setup.
- Separate migration/seed connection credentials if required by the chosen Prisma and hosting arrangement.
- Any non-secret public configuration, clearly distinguished from secrets.
- Local `.env` and production environment settings must be kept outside source control; `.env.example` may later list names and safe placeholders only.

Document the intended chatbot endpoint (for example, `POST /api/chat`) as a proposed route, not an implemented endpoint. Define request validation, maximum message length, response shape, timeout/error behavior, quota fallback, rate-limit limitations, and safe logging. Do not create API handlers, `.env` files, `.env.example`, cloud projects, keys, database connections, or API calls during the current documentation-only assignment.

### Asset/content readiness checklist for future implementation

The future TODO/task documents must include a content-readiness task that checks:

- [ ] Approved site logo/monogram exists.
- [ ] Approved chatbot icon exists.
- [ ] Approved profile portrait exists.
- [ ] Each displayed project has an authentic cover image or an explicitly approved fallback.
- [ ] Each displayed certificate has a readable full image and correct title/issuer.
- [ ] Gallery images are authentic and approved for publication.
- [ ] CV PDF is final, reviewed, and approved for public download.
- [ ] GitHub profile and repository URLs are verified.
- [ ] LinkedIn, Instagram, and professional email are verified and approved for publication.
- [ ] Every missing item is recorded as a content dependency rather than invented by the agent.

## 11.1 Claude-specific integration

Because the owner intends to use Claude, confirm whether the actual tool is Claude chat, Claude Desktop with Claude Code, Claude Code CLI, or another environment before depending on automatic discovery conventions.

For Claude Code:

- Create a concise root `CLAUDE.md` as the automatically discoverable entry point. To reuse general rules without maintaining duplicate content, begin it with `@AGENTS.md`, then add only Claude-specific workflow guidance. Confirm that the chosen Claude Code version supports this import behavior.
- Keep `AGENTS.md` as the general agent policy shared across tools; do not rely on implicit discovery in a runtime that does not support it.
- Put project-specific subagent definitions under `.claude/agents/` using the supported frontmatter and schema for the selected Claude Code version.
- Put reusable skills under `.claude/skills/<skill-name>/SKILL.md`.
- Put path-specific Claude Code rules under `.claude/rules/` only when they are useful and do not conflict with `RULES.md`.
- Verify current official Claude Code documentation before finalizing exact conventions. Tool behavior and version requirements can change.

Keep `CLAUDE.md` short and directive. Do not copy all ten documents into it. It should provide an entry point to the blueprint and detailed source documents.

---

# 12. Purpose and Contents of the Ten Planning Documents

## 12.1 `PRD.md` — Product requirements

Must document:

- Vision, objectives, primary users, and user value.
- Scope and non-goals.
- Requirements for every persistent element and page section.
- Chatbot behavior and data-grounding rules.
- Functional and nonfunctional requirements.
- Cost target and free-tier policy.
- Accessibility, responsive, security, and performance expectations.
- Content requirements and verified-data rules.
- Acceptance criteria and definition of V1.0 complete.
- Dependencies and owner-supplied assets.

Do not duplicate implementation details that belong in architecture/schema/design; reference them.

## 12.2 `AGENTS.md` — General agent policy

Must define:

- Required preflight document reading.
- Authority and precedence of project instructions.
- Behavior when requirements are ambiguous or conflicting.
- No-scope-creep rule.
- How to plan, edit, test, and report changes.
- File ownership or specialist responsibilities when useful.
- A rule to stop before paid services, destructive operations, database production changes, or scope changes.
- Completion report format: changed files, verification commands/results, known gaps, and unresolved decisions.

Do not invent a multi-agent system if the chosen tool only supports one primary agent. Specialist role files are optional and should be created only when they add real value.

## 12.3 `ARCHITECTURE.md` — Technical architecture

Must include:

- System context and a component diagram.
- Frontend/server boundaries and rendering strategy.
- API endpoint contract.
- Chatbot sequence diagram or step-by-step flow.
- Prisma/PostgreSQL connection and permission model.
- Retrieval strategy and fallback behavior.
- Gemini call boundary and secret handling.
- Deployment layout and environment variables.
- Failure modes, timeouts, and quota behavior.
- Technology versions/compatibility policy.
- Decision records explaining why Docker, extra databases, vector search, and admin dashboard are excluded.

## 12.4 `TODO.md` — Project-level backlog

Must list phase-based work, status, priority, blocked-by dependency, and the associated task file. It is the overview, not the detailed implementation instruction. Keep the list synchronized as tasks are accepted/completed.

## 12.5 Skills — reusable procedures

Potential skills, stored in `.claude/skills/<skill-name>/SKILL.md` when using Claude Code:

- Design implementation against approved screenshots.
- Accessible responsive UI verification.
- Prisma/PostgreSQL schema, seed, and read-only permission checks.
- Grounded chatbot changes and quota/fallback testing.
- Final verification and deployment readiness.

Each skill should state when to use it, required inputs, step-by-step procedure, expected outputs, checks, and stop conditions. Do not write a skill that merely repeats a general rule or claims to execute commands the agent cannot access.

## 12.6 `WORKFLOW.md` — Delivery process

Define a sequence such as:

1. Preflight: inspect blueprint, relevant document, task, and assets.
2. Clarify: list conflicts and blockers.
3. Plan: declare files/behaviors to change and acceptance checks.
4. Implement: make the smallest coherent change.
5. Verify: run relevant tests, lint/type check/build as applicable, and inspect the rendered UI.
6. Review: compare with references, scope, security, and cost rules.
7. Report: summarize changes, results, and known issues.
8. Gate: wait for owner approval before the next phase where required.

Include stop conditions and handling of failed checks. Do not say a check passed if it was not run.

## 12.7 Task files — detailed work units

Every task file should include:

- Task ID/title/status/priority.
- Objective and context.
- Required source documents and reference assets.
- In-scope and out-of-scope items.
- Dependencies/preconditions.
- Allowed files/areas to change.
- Implementation notes without overprescribing every line of code.
- Acceptance criteria.
- Verification commands/manual checks.
- Risks and stop conditions.
- Completion report expectation.

Tasks must be reasonably small. A task that includes UI, database, Gemini, and deployment simultaneously should normally be split.

## 12.8 `RULES.md` — hard constraints

Must explicitly prohibit:

- Unapproved feature, scope, stack, provider, or design changes.
- Fake profile facts, assets, projects, metrics, or URLs.
- Paid billing/upgrade without owner permission.
- Additional databases or unnecessary infrastructure.
- Public database writes and client-side secrets.
- Unvalidated model output or unrestricted chatbot scope.
- Destructive database commands without explicit approval and environment confirmation.
- Unreviewed mass rewrites or deleting known-good code.
- Claiming tests/deployments succeeded without actual evidence.

Rules must be testable and unambiguous, not merely aspirational.

## 12.9 `DESIGN.md` — implementation-ready UI specification

Must point to `design/approved/` and include:

- Asset inventory and reference-to-component map.
- Visual direction and design tokens.
- Fonts and text hierarchy.
- Layout/grid/spacing system.
- Responsive behavior.
- Navigation and menu states.
- Hero and profile structure.
- Skills marquee behavior.
- Project card rules, including last-row behavior.
- Carousel interactions.
- Certificate image-only lightbox rules.
- Gallery drag behavior and touch handling.
- Chatbot open/closed states.
- Dark/light modes.
- Loading/hover/focus/active/error states.
- Reduced-motion and accessibility rules.
- Rules for image ratio, cropping, and placeholders.

## 12.10 `SCHEMA.md` — data model specification

Must include:

- Data ownership and source-of-truth explanation.
- Entity-relationship diagram or readable relation mapping.
- Field-level table with type, required/optional status, meaning, and constraints.
- Stable identifier and uniqueness policy.
- Search/retrieval fields and query/index rationale.
- Zod/application validation responsibilities.
- Seed/idempotency/update/delete behavior.
- Runtime read-only permission model.
- Migration process and development/production separation.
- Mapping between data files, Prisma models, and chatbot-visible facts.

---

# 13. Task Breakdown and Implementation Roadmap

Do not execute these tasks until the owner approves the documentation package and explicitly authorizes implementation. The order is a planning baseline; tasks may be adjusted when dependencies are verified, without changing product scope.

## Phase 0 — Documentation and design lock

- Audit this blueprint and initial PRD.
- Inspect all seven assets under `design/approved/`.
- Build an asset/content inventory.
- Finalize `PRD.md`, `RULES.md`, `DESIGN.md`, `ARCHITECTURE.md`, and `SCHEMA.md`.
- Confirm the exact Claude tool/runtime, agent configuration, and skill format.
- Define acceptance checklist and task templates.
- Owner approval gate: no code before approval.

## Phase 1 — Project foundation

- Initialize Next.js App Router, React, TypeScript, Tailwind, and pnpm using compatible stable versions.
- Establish folder conventions and base layout.
- Configure theme support and fonts.
- Set up lint, typecheck, and build verification.
- Add only safe placeholder content needed for structure.
- Verify development server and production build.

## Phase 2 — Design system and shared UI

- Read design tokens from approved exports.
- Build typography, page container, section spacing, buttons, links, cards, and focus styles.
- Implement sticky navigation and responsive menu.
- Implement dark/light theme and verify no obvious theme flash.
- Implement opening overlay with fail-safe and reduced motion.
- Compare screenshots to reference and fix discrepancies before expanding sections.

## Phase 3 — Static portfolio sections

- Build Hero.
- Build About/Profile & Journey.
- Build Skills marquee plus reduced-motion fallback.
- Build Projects grid with exact final-row rule.
- Build Certifications carousel and image-only lightbox.
- Build Gallery.
- Build Contact/Footer and CV download.
- Populate only approved content and assets.
- Verify desktop/tablet/mobile in both themes.

## Phase 4 — Data preparation and PostgreSQL

- Finalize Prisma schema against actual chatbot retrieval needs.
- Provision eligible Neon PostgreSQL Free Tier only after current constraints are reviewed.
- Configure trusted migration/seed credentials and separate read-only runtime credential.
- Write typed local portfolio data.
- Build and test idempotent seed process.
- Verify runtime role cannot write to records.
- Do not create an admin dashboard or public write endpoint.

## Phase 5 — Chatbot backend

- Define Zod request/response contracts.
- Implement bounded PostgreSQL keyword/category retrieval.
- Implement no-match fallback before any AI call.
- Add server-only Gemini SDK integration.
- Configure API timeout/output bound and quota/error fallbacks.
- Add best-effort in-memory IP rate limit and its documented limitations.
- Verify prompt-injection resistance and no secret leakage.
- Test success, no data, invalid input, over-limit, database failure, API quota, missing key, and unexpected failure.

## Phase 6 — Chatbot UI and integration

- Implement floating button and open/closed panel matching `2 MASTER DESIGN + CHATBOT AI.png`.
- Add welcome text, starter chips, input, send, loading, error, and response states.
- Confirm mobile/safe-area behavior and focus/keyboard access.
- Verify website remains fully usable when the chatbot is unavailable.

## Phase 7 — Quality and security review

- Run lint, typecheck, production build, and automated tests selected in the project docs.
- Inspect every major page at desktop, tablet, and mobile widths.
- Verify dark and light themes.
- Verify keyboard, focus, reduced motion, color contrast, alt text, modal, carousel, and chat widget.
- Check safe external-link behavior and all supplied URLs.
- Review dependency footprint and remove unused dependencies.
- Verify secrets are absent from Git history/current files.
- Verify read-only database access with an actual negative write test in a safe environment.

## Phase 8 — Deployment and final acceptance

- Verify current hosting/database/AI free-tier terms and eligibility.
- Set environment variables securely in the chosen deployment platform.
- Deploy without enabling billing.
- Verify production build, page routes, image assets, CV, chat endpoint, and database connectivity.
- Test graceful failures in production-safe ways.
- Record quota limits, current service plans, known limitations, and recovery steps.
- Owner acceptance review against the PRD and reference assets.
- Mark V1.0 complete only when all acceptance criteria pass or explicitly approved exceptions are documented.

---

# 14. Environment Variables and Secrets Policy

Exact variable names must be finalized in `ARCHITECTURE.md`, but expected categories include:

- Runtime PostgreSQL connection string using least-privilege credentials.
- Separate privileged database connection for migrations/seed only, if required by the chosen Prisma setup.
- Gemini API key.
- Any framework-required public configuration that contains no secret values.

Rules:

- `.env.example` contains variable names and safe dummy examples only.
- Real environment files are ignored by Git.
- Never prefix a secret with a framework's public-client variable prefix.
- Never place API keys in client components, public JSON, repository documentation, logs, screenshots, or chatbot responses.
- If a secret is accidentally committed, treat it as compromised: rotate it and clean up according to the relevant provider's instructions; deleting the line alone may not remove it from Git history.
- Validate required server environment variables on startup/request in a controlled way.
- Missing configuration must lead to a safe failure, not a secret leak or broken entire page.

---

# 15. Acceptance Criteria / Definition of Done

V1.0 is complete only when all applicable criteria below are verified.

## Product and design

- All required sections exist and follow the approved order/composition.
- Visual decisions are cross-checked against `design/approved/`.
- Desktop grid has three equally sized project columns and the final row never stretches.
- Tablet and mobile layouts match the approved responsive references.
- Theme toggle works in dark and light modes.
- Opening overlay is lightweight, fail-safe, and respects reduced motion.
- Certificate modal displays only the uncropped certificate image and close control.
- Carousel/gallery support intended pointer/touch/keyboard interactions.
- CV and verified links work.
- No unapproved scope has been added.

## Data and chatbot

- Data is managed via approved files and a trusted seed process.
- Seed is repeatable without duplicate records.
- Chatbot query uses server-side validation and bounded retrieval.
- Chatbot responses are grounded in verified records; absent facts trigger a clear fallback.
- Gemini key and database credentials remain server-side.
- Runtime DB role is unable to write portfolio records.
- API failures, quota errors, and DB timeouts are handled cleanly.
- Chatbot service failure does not crash the rest of the site.
- No admin UI, public write path, or unapproved database/vector infrastructure exists.

## Quality and delivery

- Lint/typecheck/build commands documented and pass.
- Selected automated tests pass.
- Keyboard and reduced-motion behavior have been manually checked.
- All critical external URLs and asset paths have been checked.
- No unexpected horizontal overflow at required widths.
- No real secrets are present in repository files/history to the extent verified.
- Current service plans and quotas are documented; no paid billing has been enabled.
- README or equivalent runbook documents install, run, seed, tests, env vars, deployment, and known limits.
- The owner approves the final result.

---

# 16. Claude Assignment — Generate the Documentation Package Only

**This is the exact scope for Claude's current assignment.** Claude is being asked to create the project preparation documents, not to build the website. The implementation roadmap elsewhere in this blueprint is future planning context only and is not permission to execute implementation tasks.

## 16.1 Required deliverables

Claude must create the following documents in the project workspace, using the content of this blueprint and the approved design assets:

1. `PRD.md` — product requirements and acceptance criteria.
2. `AGENTS.md` — common instructions, boundaries, and responsibilities for coding agents.
3. `ARCHITECTURE.md` — system components, data flows, technology rationale, trust boundaries, failure behavior, and deployment proposal.
4. `TODO.md` — phased backlog that tracks the work still needed, linked to task specifications.
5. A skills directory with relevant `SKILL.md` files, compatible with the user's actual Claude environment when known. Do not create generic skills that merely duplicate rules.
6. `WORKFLOW.md` — the future workflow for completing and verifying implementation tasks.
7. A `tasks/` directory with small, ordered task-specification files. These files describe future work; they must not execute that work.
8. `RULES.md` — hard scope, design, cost, security, and change-control constraints.
9. `DESIGN.md` — detailed specification derived from the approved references at `design/approved/`.
10. `SCHEMA.md` — documented PostgreSQL/Prisma data model proposal and data-management rules.

Do not silently add more core deliverables. If the selected Claude environment requires an extra entry-point file such as `CLAUDE.md` for automatic discovery, first document why it is needed and keep it minimal; do not use it as a reason to duplicate the ten documents.

## 16.2 Exact execution prompt

Copy and give this prompt to Claude:

```text
ROLE
You are a project documentation architect. Your assignment is to BUILD THE DOCUMENTATION PACKAGE for Fauzi Budikusuma's Personal Portfolio Website & Interactive AI Dashboard. You are NOT being asked to code or implement the website.

CURRENT OBJECTIVE
Create complete, consistent, usable project-preparation documents from MASTER_PROJECT_BLUEPRINT.md, the approved PRD V1.0 supplied by the owner, and the actual visual references in design/approved/.

ABSOLUTE SCOPE BOUNDARY
You may inspect files and create or edit Markdown documentation files only, plus the directory structure needed to store those documentation files. Do NOT:
- write or modify application source code;
- scaffold a Next.js application;
- create components, pages, API handlers, Prisma executable schema/migrations/seed code, tests, or configuration files;
- install packages or run package managers;
- modify package.json, lockfiles, tsconfig, Tailwind, Next.js, or environment configuration;
- provision PostgreSQL, create cloud resources, call paid APIs, run migrations, seed a database, or deploy;
- activate billing, choose a paid upgrade, or perform destructive operations.
The task is documentation production only. Implementation steps may be DESCRIBED in TODO.md and task files, but must not be executed.

DESIGN SOURCE OF TRUTH
The canonical approved design-reference path is design/approved/. Inspect the files that actually exist there. Separately document the planned public website content assets under public/assets/ as specified in Section 11.2. Do not confuse approved Stitch screenshots with the actual portrait, logo, project thumbnails, certificate images, gallery photos, chatbot icon, or CV. The expected seven reference exports are:
- 1 OPENING.png
- 2 MASTER DESIGN + CHATBOT AI.png
- 3 MASTER DESIGN.png
- 4 PREVIEW CERTIFICATION.png
- 5 PREVIEW MOBILE DARK MODE.png
- 6 LIGHT MODE.png
- 7 PREVIEW MOBILE LIGHT MODE.png
If the folder or any files are missing, do not pretend to have inspected them. Record the limitation clearly and still draft what can be grounded in the blueprint. Do not create replacement designs, invent visual measurements, or treat screenshots as production image assets.
Every applicable document, especially PRD.md, DESIGN.md, AGENTS.md, RULES.md, WORKFLOW.md, and task files, must explicitly reference design/approved/ as the visual source of truth.

ASSET, LINKS, CONTACT, CV, AND API PLANNING
The owner also needs an explicit future folder plan for the actual profile photo, project display images, certificate images, activity documentation photos, site logo/monogram, chatbot icon, skill icons, and CV PDF. Include the planned `public/assets/` subfolders and naming rules in the relevant documentation, especially DESIGN.md, ARCHITECTURE.md, and TODO.md. Document the structured public content/link files under `src/data/` for the GitHub profile, verified project repositories, optional live demos, email, LinkedIn, Instagram, and CV path. Record missing values as `[OWNER TO PROVIDE]`; never invent URLs or contact details. Include the proposed Gemini API endpoint, environment-variable categories, server-only secret rules, PostgreSQL connection roles, quota/failure handling, and the fact that these are plans only. The future content folders and source/config files must NOT be created in this current documentation-only assignment.

REQUIRED DOCUMENTS
Create all these deliverables:
1. PRD.md
2. AGENTS.md
3. ARCHITECTURE.md
4. TODO.md
5. skills/<skill-name>/SKILL.md files in a format suitable for the actual Claude environment, or document a clearly labeled compatibility assumption if the environment is unknown
6. WORKFLOW.md
7. tasks/TASK-001-....md and subsequent focused task files covering the planned implementation phases
8. RULES.md
9. DESIGN.md
10. SCHEMA.md
Use the blueprint's Section 12 for the purpose and minimum contents of each document. Make each document complete enough to guide future work, but keep responsibilities distinct and avoid copy-pasting the same text into every file.

PROJECT BASELINE
- Owner: Fauzi Budikusuma.
- Product: premium editorial-minimalist personal portfolio with a profile-scoped AI chatbot.
- UI language: English only; no internal language selector.
- Design: custom dark/light themes with restrained crimson accents, cinematic opening, responsive desktop/tablet/mobile layouts, matching the approved Stitch exports.
- Main sections: sticky navigation, hero, profile/journey, skills marquee, project grid, certification carousel/lightbox, activity gallery, contact cards, footer, persistent floating chatbot.
- Project cards: three columns desktop, two tablet, one mobile; equal card dimensions; last row never stretches to fill unused columns; 16:10 thumbnails.
- Certificate click opens image-only lightbox with contain fit, close button, and Escape support; no metadata panel in the modal.
- Chatbot: questions about verified public portfolio facts only; local files are the content-maintenance source; one-way seed into PostgreSQL; PostgreSQL is the ONLY database; Prisma ORM; keyword/category retrieval; no pgvector or complex RAG in V1.0.
- Visitor/runtime database access must be read-only. Use separate trusted credentials for seed/migration in future implementation planning.
- AI: official Gemini API SDK server-side only; no assumption that a Google AI Pro subscription grants API quota.
- Stack baseline: Next.js App Router, React, TypeScript, Tailwind CSS, next-themes, Motion for React, Embla Carousel, Lucide React, next/font, next/image, Next.js Route Handlers (Node.js runtime), Zod, in-memory best-effort IP rate limiting, Neon PostgreSQL Free Tier candidate, Prisma, Gemini API eligible free tier, Git/GitHub.
- Target cost: Rp0. Never enable paid billing or upgrade automatically. Record current-service eligibility and quota checks as future pre-deployment tasks.
- No Docker requirement, no second database, no Redis, no vector DB, no admin dashboard, no authentication, no contact form, no project filters/search/detail modals, and no unapproved features.
- All personal facts, project URLs, certificates, statistics, social links, and achievements must be owner-provided or verified. Unconfirmed details must be clearly marked as OPEN DECISION or content placeholder.

DOCUMENT QUALITY REQUIREMENTS
- Read MASTER_PROJECT_BLUEPRINT.md fully before drafting.
- Inspect the existing PRD V1.0 if present and compare it against the blueprint; preserve approved scope and record true conflicts rather than silently choosing.
- Use these labels consistently: CONFIRMED, RECOMMENDED, ASSUMPTION, OPEN DECISION, BLOCKED.
- Each requirement should have a stable ID where useful (for example FR-001, NFR-001, SEC-001, DESIGN-001, TASK-001).
- Add measurable acceptance criteria, dependencies, verification method, and stop conditions to task files.
- Keep implementation tasks as written plans only; nothing may be executed in this assignment.
- Do not invent exact hex colors, breakpoints, service quotas, API model availability, or terms of service. Mark unknown values for verification from the actual design files or official sources.
- Keep Rp0 as a hard constraint. A free-tier limitation must result in a documented fallback or OPEN DECISION, never a hidden paid dependency.
- Ensure documents do not contradict one another. Cross-reference details instead of duplicating large blocks of policy. Include an explicit content/asset inventory, planned asset folder tree, public links/contact inventory, CV handling, API/environment-variable categories, and missing-owner-input checklist.
- Make all ten categories usable, not just empty templates or outlines. Where facts are not known, give the best evidence-based specification and flag the unresolved part.

WORK PLAN
1. Inspect the blueprint, existing PRD, current workspace, and design/approved/ files. Do not alter source code.
2. Create a concise audit note in your response (not as an extra file unless required): what was inspected, missing inputs, and conflicts that affect documentation.
3. Draft PRD.md first as the canonical product-scope document.
4. Draft ARCHITECTURE.md, DESIGN.md, SCHEMA.md, and RULES.md using PRD.md and the blueprint.
5. Draft AGENTS.md and WORKFLOW.md based on the approved requirements and the selected Claude environment if known.
6. Create focused skill files and task-specification files; connect them to TODO.md.
7. Create TODO.md last so it reflects the actual tasks and dependencies in the documentation package.
8. Perform a consistency audit across all deliverables: filenames, scope, technology, design references, data flow, cost rules, task dependencies, acceptance criteria, and contradictions.
9. Report exactly which documentation files were created or updated, which files were unavailable for inspection, unresolved decisions, and any consistency issues that remain.

STOP CONDITIONS
If a design asset is missing, a true conflict cannot be resolved without owner input, or current official terms cannot be verified, record the issue as OPEN DECISION/BLOCKED and continue drafting unaffected sections. Do not stop the entire documentation package for non-critical missing details. Do not invent facts to fill gaps.

FINAL OUTPUT
Deliver the actual Markdown documentation files in the workspace. Provide a compact summary of each document's purpose and confirm explicitly that no application code, dependencies, project configuration, cloud resources, database migrations, or deployments were created or changed.

FINAL REMINDER
Your assignment ends when the documentation package is created and checked for consistency. Do not begin implementation, even if a task file describes implementation steps. Wait for a separate, explicit owner instruction before any future coding phase.
```

## 16.3 Completion criteria for this assignment

The documentation-generation assignment is complete only when:

- All ten requested documentation categories have a substantive deliverable.
- `DESIGN.md` and all relevant agent/task documents reference `design/approved/`.
- Scope exclusions, Rp0 policy, PostgreSQL-only policy, chatbot grounding, and visitor read-only access agree across documents.
- `TODO.md` points to the created task files and respects dependencies.
- Skills are compatible with the actual environment or clearly labeled with an environment assumption.
- Missing input and open decisions are visible rather than fabricated.
- No application code or runnable project implementation has been created or modified.
- Claude provides a final inventory and consistency-audit report.
```

---

# 17. Current Open Decisions / Must Verify Later

These are implementation/deployment checks, not permission to silently change the approved scope:

1. Confirm the exact Claude environment: Claude chat, Claude Desktop/Claude Code, CLI, or another tool. This determines automatic instruction/agent/skill discovery formats.
2. Confirm whether all production assets are supplied individually, not only visible inside design screenshots: logo, portrait, CV PDF, individual certificate images, individual project thumbnails, gallery photos, and verified links.
3. Confirm final public content for profile, education, experience, organizations, skills, projects, certificates, and contact channels.
4. Verify current Neon Free Tier limits, region, connection approach, and terms when provisioning.
5. Verify Gemini model free-tier availability, usage limits, API privacy/data conditions, and billing state at implementation time.
6. Verify current deployment-provider terms and whether the site qualifies under those terms. Vercel Hobby may have restrictions on commercial use; do not assume it is suitable without checking.
7. Finalize rate-limit thresholds, query length, request timeout, number of retrieved records, model output limits, and fallback copy.
8. Finalize the conceptual schema into actual Prisma models based on verified content and retrieval needs.
9. Decide the exact test tools and commands without adding redundant dependencies.
10. Confirm the exact definition of any placeholder state that must appear on the public website if an asset or link is still missing. Prefer not to publish known broken or fake placeholders.

---

# 18. Final Governing Rule

The eventual website must be implemented as a faithful, secure, and maintainable realization of the owner's approved portfolio design — not as an opportunity for a coding agent to redesign the product or invent extra functionality. For the current assignment, Claude must only create and audit the documentation package.

When uncertain: inspect the approved source, state the uncertainty, explain the impact, and ask. Make the smallest justified change. Verify before reporting success. Do not proceed beyond the approved phase without the owner's authorization.


---

# 19. Official Documentation to Recheck Before Implementation

Service plans, SDKs, and Claude Code conventions can change. Claude must re-open the applicable official documentation at the time of implementation rather than rely on values copied into this blueprint. Current official references reviewed during planning include:

- Claude Code project instructions and `CLAUDE.md` / `AGENTS.md`: https://code.claude.com/docs/en/memory
- Claude Code skills and `SKILL.md`: https://code.claude.com/docs/en/skills
- Claude Code subagents: https://code.claude.com/docs/en/sub-agents
- Gemini API pricing and free-tier details: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API billing tiers and project billing: https://ai.google.dev/gemini-api/docs/billing
- Vercel Hobby plan and restrictions: https://vercel.com/docs/plans/hobby
- Neon current pricing/plans: https://neon.com/pricing

These references are for revalidation, not an assertion that every service is automatically approved. The owner’s Rp0 constraint and provider eligibility remain mandatory.


# FILE ECONOMY & CODE CONSOLIDATION RULES

## 1. Core Principle

Minimize unnecessary file creation. Prefer a compact, cohesive project structure over excessive fragmentation. Every file must have a clear purpose and provide meaningful value.

## 2. File Creation Rules

- Before creating a new file, inspect existing files and determine whether the functionality can be integrated into an appropriate existing file.
- Combine small, closely related components, utilities, types, constants, and configuration logic when doing so preserves clarity and maintainability.
- Do not create separate files solely to hold a few lines of code when the same logic can reasonably live in an existing module.
- Avoid unnecessary barrel files, one-line wrappers, redundant re-exports, duplicate configuration files, and trivial abstractions.
- Do not split a working module into multiple files merely to follow an arbitrary file-count or folder-structure convention.
- Prefer existing project conventions and framework defaults over additional configuration files.

## 3. Maintainability and Architecture

- Consolidation must not combine unrelated responsibilities into one oversized file.
- Keep clear boundaries for security-sensitive code, server-only code, database access, API handlers, reusable UI, and independently testable business logic when separation provides a concrete benefit.
- Preserve type safety, readability, accessibility, testability, security, and the required functionality.
- Follow framework, library, and tooling requirements even when they necessitate separate files.

## 4. Mandatory Check Before Adding Files

Before creating a new file, the agent must:

1. Inspect the existing project structure.
2. Check whether the functionality can be added to an existing file.
3. Identify the concrete reason a separate file is necessary.
4. Avoid creating the file if its separation provides no meaningful benefit.

For substantial structural changes, explain the reason in the task summary.

## 5. Definition of Done

- No unnecessary files or duplicate implementations.
- No files created merely for arbitrary architectural conventions.
- Related functionality is consolidated where reasonable.
- Every separate file has a clear responsibility.
- The final project remains understandable, secure, maintainable, and easy to extend.

The objective is not to minimize the file count at all costs, but to minimize unnecessary complexity and fragmentation.
