# Fauzi Budikusuma — Software Development & Network Engineer Portfolio

> A high-precision, bilingual (`EN | ID`), dual-theme (`Dark | Light`) engineering portfolio and grounded AI assistant built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **PostgreSQL (Neon + Prisma)**, and **Google Gemini GenAI SDK**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2d3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-GenAI_SDK-8e75ff?style=for-the-badge&logo=googlebard&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-401_Tests_Passing-6e9f18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[![Live Production Demo](https://img.shields.io/badge/Live_Demo-fauzi--budikusuma--portfolio.vercel.app-00c853?style=for-the-badge&logo=vercel&logoColor=white)](https://fauzi-budikusuma-portfolio.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub_Repo-FauziBudikusumaPortfolio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/budikusumafauzi-sketch/FauziBudikusumaPortfolio)

![Fauzi Budikusuma Portfolio Preview Banner](./docs/previews/hero-dark.png)

---

## Executive Overview

This repository serves dual purposes:
1. **Official Production Portfolio:** The verified, production portfolio of **Fauzi Budikusuma** — showcasing expertise across full-stack software development, distributed systems, enterprise network engineering (Mikrotik/Cisco), and applied artificial intelligence.
2. **Reusable Open-Source Portfolio Template:** An executive-grade, modular, and turnkey template engineered for software engineers, systems developers, and DevOps/network professionals who demand a blisteringly fast, verified, and zero-cost (`$0 / Rp0` hobby tier) portfolio equipped with a truthful, anti-hallucination conversational AI assistant.

Designed with an obsession for craftsmanship, accessibility (WCAG 2.1 AA), least-privilege security, and ultra-low latency, this codebase provides a production-tested foundation ready for immediate deployment or extensive customization.

---

## ✨ Visual Preview

| Dark Theme (Default) | Light Theme |
| :---: | :---: |
| ![Hero Dark Mode](./docs/previews/hero-dark.png) | ![Hero Light Mode](./docs/previews/hero-light.png) |

| Selected Projects & Lightbox | Credentials & Field Documentation |
| :---: | :---: |
| ![Selected Projects](./docs/previews/projects-showcase.png) | ![Credentials & Documentation](./docs/previews/credentials-documentation.png) |

| Grounded AI Assistant (`LIVE`) | Mobile Responsive (`375px`) |
| :---: | :---: |
| ![Grounded AI Assistant](./docs/previews/ai-assistant-live.png) | ![Mobile Responsive View](./docs/previews/mobile-responsive.png) |

---

## Table of Contents

- [Executive Overview](#executive-overview)
- [✨ Visual Preview](#-visual-preview)
- [Key Features & Engineering Highlights](#key-features--engineering-highlights)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Grounded AI Assistant Architecture](#grounded-ai-assistant-architecture)
- [Defense-in-Depth Security](#defense-in-depth-security)
- [Directory Structure](#directory-structure)
- [Quick Start & Local Setup](#quick-start--local-setup)
- [Customization Guide (Using as a Template)](#customization-guide-using-as-a-template)
  - [1. Profile & Identity](#1-profile--identity)
  - [2. Journey, Skills, Projects & Credentials](#2-journey-skills-projects--credentials)
  - [3. Grounded AI Knowledge Base](#3-grounded-ai-knowledge-base)
  - [4. Bilingual & Localization Configuration](#4-bilingual--localization-configuration)
  - [5. Media Assets & Documents](#5-media-assets--documents)
- [Available Scripts & Tooling](#available-scripts--tooling)
- [Automated Verification & Testing](#automated-verification--testing)
- [Deployment Guide (Vercel + Neon)](#deployment-guide-vercel--neon)
- [Contributing](#contributing)
- [License & Author](#license--author)

---

## Key Features & Engineering Highlights

### 1. Precision Bilingual UI (`EN | ID`) & Dual Theme (`Dark | Light`)
- **Zero-FOUC Instant Switching:** Flawless theme and language state restoration using `next-themes` and a localized storage contract that prevents Flash of Unstyled Content (FOUC) and hydration mismatches.
- **Lightweight Type-Safe i18n (`src/lib/i18n/`):** Pure TypeScript translation dictionaries with compiler-enforced keys. Zero heavy external runtime overhead, zero dynamic chunk waterfalls, and sub-millisecond dictionary lookups.

### 2. Grounded AI Portfolio Assistant (`/api/chat`)
- **Strict Anti-Hallucination & Citation Enforcement:** Built with official `@google/genai` structured JSON schema generation (`responseSchema`). The assistant is strictly constrained to verified database records. Factual answers require explicit record ID citations; queries lacking factual coverage gracefully trigger a deterministic no-data guide.
- **Ultra-Low Latency (`~2s` Median, `<150ms` Cached):**
  - **Hedged Requests (ADR-014):** Automatically dispatches speculative fallback calls across distinct Gemini Flash model families if the primary model overruns a soft latency threshold (`2.5s`), drastically curtailing p99 tail latency.
  - **12-Hour Stale-While-Revalidate (SWR) In-Memory Knowledge Cache:** Eliminates redundant database roundtrips during steady-state chat traffic.
  - **30-Minute In-Memory Validated Answer Cache:** Serves repeated or common visitor inquiries in `<150ms` with zero AI token consumption.
  - **Build-Time Static Knowledge Snapshot (`knowledge.snapshot.json`):** Cold database wake-ups on serverless platforms never block visitors. If the remote database is suspended or times out (`>600ms`), the system instantly serves the build-time snapshot.
  - **Panel-Open Warm-Up Endpoint:** Opening the chat drawer triggers a lightweight `GET /api/chat?action=warmup` (204 No Content) to prime serverless compute instances and database pooling before the visitor types a character.
- **Deterministic Pre-Call Scope Guard:** Evaluates every incoming prompt against deterministic regular expressions and safety heuristics to block prompt injections, secret probing, SQL injection patterns, mutation verbs, and private data harvesting in **0 Gemini API calls**.

### 3. Unified Accessible Lightbox System
- **Focus-Trapped Modal Previews:** Modal image zoom with full WCAG 2.1 AA accessibility compliance (`role="dialog"`, `aria-modal="true"`, focus trapping, `Escape` key dismissal, and trigger element focus restoration).
- **Universal Cross-Section Coverage:** Reusable across **Selected Projects**, **Credentials & Certifications**, and **Field Documentation**.
- **Touch & Gesture Protection:** Embla-powered horizontal carousels feature drag-versus-click gesture filtering to prevent accidental modal activation during mobile horizontal scrolling.

### 4. Defense-in-Depth Security & Least Privilege
- **Read-Only Database Runtime Role (`portfolio_runtime`):** Web application connections use a restricted PostgreSQL role with `SELECT` permissions restricted exclusively to `KnowledgeRecord`. Mutating queries (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `DROP`) are rejected at the database engine level.
- **Strict Zod Boundary Validation:** Every API request, environment variable, and structured data module is parsed and validated against strict Zod runtime schemas.
- **In-Memory Sliding-Window Rate Limiting:** Enforces per-IP request quotas (10 requests/minute, burst ceiling of 15) returning standard HTTP `429 Too Many Requests` with `Retry-After` headers.
- **Hardened HTTP Headers:** Preconfigured Content Security Policy (`CSP`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## System Architecture & Tech Stack

| Architectural Layer | Technology | Specification / Role |
|---|---|---|
| **Web Framework** | [Next.js 16.4.2](https://nextjs.org/) | App Router, Server Components, Route Handlers, Turbopack |
| **UI Library** | [React 19.3.0](https://react.dev/) | Concurrent React, Server Components, Hooks |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) | Strict type checking (`strict: true`, `noImplicitAny: true`) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) | CSS variables design tokens, responsive breakpoints, reduced motion |
| **Carousel & Sliders** | [Embla Carousel 8.6](https://www.embla-carousel.com/) | Accessible touch-friendly horizontal carousels |
| **Database Engine** | [PostgreSQL (Neon)](https://neon.tech/) | Serverless PostgreSQL with connection pooling & autoscaling |
| **ORM & Migrations** | [Prisma 6.19.3](https://www.prisma.io/) | Type-safe queries, declarative schema, and automated migrations |
| **AI Integration** | [@google/genai 2.30](https://ai.google.dev/) | Structured JSON output (`responseSchema`), system instructions |
| **Validation** | [Zod 4.6](https://zod.dev/) | Request payloads, data module integrity, and environment validation |
| **Testing Engine** | [Vitest 5.0](https://vitest.dev/) | 401 automated unit, component, API, and security regression tests |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, accessible SVG iconography |
| **Theme Management** | [next-themes](https://github.com/pacocoursey/next-themes) | System/dark/light theme toggle with zero hydration flicker |

### Zero-Cost ($0 / Rp0) Hobby-Tier Architecture

This entire architecture operates within the permanently free tiers of leading cloud providers:
- **Compute & CDN:** [Vercel](https://vercel.com/) Hobby Tier (Free edge network, serverless functions, automatic SSL).
- **Relational Database:** [Neon Serverless PostgreSQL](https://neon.tech/) Free Tier (0.5 GB storage, connection pooling, automated branch snapshots).
- **Generative AI:** [Google AI Studio](https://aistudio.google.com/) Free Tier (`gemini-3.5-flash-lite` and `gemini-3.1-flash-lite` within generous free RPM/RPD quotas).

---

## Grounded AI Assistant Architecture

```text
Visitor Query (POST /api/chat)
       │
       ▼
┌──────────────────────────────────────────────┐
│  1. Rate Limiter & Zod Request Validator     │ ──► [Over Quota] ──► HTTP 429 Too Many Requests
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  2. Deterministic Scope Guard (Regex/Rules)  │ ──► [Probed/Malicious] ──► HTTP 200 Refusal (0 AI Calls)
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  3. In-Memory Validated Answer Cache         │ ──► [Cache Hit] ──► HTTP 200 (<150ms, 0 AI Calls)
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  4. Knowledge Retrieval Orchestrator         │
│     ├── 12-Hour SWR Knowledge Cache          │
│     ├── PostgreSQL Read-Only Query (≤600ms)  │
│     └── Static Fallback (knowledge.snapshot) │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  5. Hedged Request Engine (ADR-014)          │
│     ├── Primary: gemini-3.5-flash-lite       │
│     └── Fallback: gemini-3.1-flash-lite      │
│         (Triggered if primary exceeds 2.5s)  │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  6. Structured Schema Validation & Citations │
│     ├── Enforce Verified Source Record IDs   │
│     └── Store in Answer Cache (30 min TTL)   │
└──────────────────────────────────────────────┘
       │
       ▼
HTTP 200 OK (Grounded Response + Verified Source Badges)
```

---

## Defense-in-Depth Security

### Dual Database Roles & Negative Write Tests
To prevent accidental data corruption or malicious SQL injection exploits, database access is bifurcated into two isolated roles:
1. **`neondb_owner` (Migration & Seed Only):** Privileged administrative connection string used exclusively by developers during local migrations (`pnpm prisma migrate deploy`) and database seeding (`pnpm db:seed`). **This credential is never deployed to production runtime environments.**
2. **`portfolio_runtime` (Production Runtime):** Least-privilege role granted only `SELECT` privileges on the `KnowledgeRecord` table. All write operations are physically denied by PostgreSQL permissions.

The test suite (`tests/db-readonly.test.ts`) actively executes **Negative Write Tests** confirming that `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `CREATE TABLE`, and `DROP TABLE` statements throw permission denied exceptions (`42501`) under the runtime user.

---

## Directory Structure

```text
├── docs/
│   └── previews/                # Live application preview screenshots for documentation
├── prisma/
│   ├── migrations/              # SQL schema migration history
│   ├── schema.prisma            # Declarative database model & connection settings
│   └── seed.ts                  # Idempotent database seeder with pre-flight checks
├── public/
│   └── assets/                  # Production static assets
│       ├── brand/               # Brand logos and vector graphics
│       ├── certificates/        # Credential badges and certificate scans
│       ├── documents/           # Curriculum Vitae (PDF)
│       ├── gallery/             # High-resolution field documentation photography
│       ├── profile/             # Author portrait photography
│       ├── projects/            # Full-resolution project screenshots and previews
│       └── skills/              # Technology and vendor iconography
├── scripts/
│   ├── check-gemini.mjs         # Gemini API diagnostic and latency benchmark utility
│   ├── eval-chat.mjs            # Grounding and evaluation test harness for assistant
│   └── generate-knowledge-snapshot.ts # Build-time knowledge snapshot generator
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/route.ts    # Grounded AI assistant Route Handler with SWR cache
│   │   ├── apple-icon.png       # Apple Touch icon
│   │   ├── favicon.ico          # Browser favicon
│   │   ├── globals.css          # Tailwind CSS v4 directives & design token variables
│   │   ├── icon.png             # Modern high-res app icon
│   │   ├── layout.tsx           # Root layout with ThemeProvider and I18nProvider
│   │   └── page.tsx             # Single-page portfolio composition
│   ├── components/
│   │   ├── chat/                # Interactive grounded AI assistant drawer & state
│   │   ├── layout/              # Sticky header, navigation menu, and footer
│   │   ├── lightbox/            # Accessible modal lightbox with focus trap
│   │   ├── sections/            # Hero, Profile, Skills, Projects, Credentials, Gallery, Contact
│   │   └── ui/                  # Primitives (buttons, badges, section headers, toggles)
│   ├── data/
│   │   ├── certifications.ts    # Verified credentials, licenses, and validation URLs
│   │   ├── chatbot-knowledge.ts # Single source of truth AI knowledge items
│   │   ├── contacts.ts          # Verified public communication channels
│   │   ├── gallery.ts           # Field engineering photo documentation
│   │   ├── journey.ts           # Educational and professional career milestones
│   │   ├── profile.ts           # Bio, summary, headline, and focus areas
│   │   ├── projects.ts          # Featured engineering projects and metadata
│   │   ├── schemas.ts           # Zod validation schemas for all data models
│   │   ├── site-config.ts       # Global navigation items and metadata
│   │   └── skills.ts            # Categorized skills matrix with proficiency levels
│   └── lib/
│       ├── chat-contract.ts     # Request/response TypeScript types and Zod schemas
│       ├── env.ts               # Strict server/client environment variable validation
│       ├── i18n/
│       │   ├── context.tsx      # React language provider and translation hooks
│       │   └── dictionaries.ts  # Bilingual dictionaries (EN & ID)
│       └── server/
│           ├── answer-cache.ts  # In-memory validated answer cache
│           ├── db.ts            # Prisma client instance for runtime queries
│           ├── gemini.ts        # Hedged request orchestrator & Google GenAI SDK client
│           ├── guard.ts         # Pre-call deterministic injection and scope guard
│           ├── knowledge.snapshot.json # Generated build-time knowledge snapshot
│           ├── knowledge-cache.ts # In-memory 12-hour SWR knowledge cache
│           ├── rate-limit.ts    # Sliding-window IP rate limiter
│           └── retrieval.ts     # Grounding retrieval and ranking algorithm
└── tests/                       # 28 test files (401 unit, component, API & security tests)
```

---

## Quick Start & Local Setup

### Prerequisites
- **Node.js:** `v20.x` or later (LTS recommended)
- **Package Manager:** `pnpm` (version `11.x` recommended; `corepack enable pnpm`)
- **PostgreSQL Database:** A free [Neon](https://neon.tech/) PostgreSQL project (or local PostgreSQL instance)
- **Google Gemini API Key:** A free API key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/budikusumafauzi-sketch/FauziBudikusumaPortfolio.git
cd FauziBudikusumaPortfolio
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Configure Environment Variables
Copy the template `.env.example` to create your local `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database connection strings and Gemini API key:
```ini
# PostgreSQL connection string for read-only runtime role (Neon pooled connection)
DATABASE_URL="postgresql://portfolio_runtime:CHANGE_ME@ep-example.region.aws.neon.tech/neondb?sslmode=require"

# PostgreSQL connection string for privileged migrations and seed (local only, never deployed)
MIGRATION_DATABASE_URL="postgresql://neondb_owner:CHANGE_ME@ep-example.region.aws.neon.tech/neondb?sslmode=require"

# Google Gemini API key (server-side only)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Primary Gemini Flash model identifier
GEMINI_MODEL="models/gemini-3.5-flash-lite"

# Distinct fallback Gemini model family for hedged requests
GEMINI_FALLBACK_MODEL="models/gemini-3.1-flash-lite"
```

> **Security Note:** Never commit `.env.local` or real API keys to version control. The repository's `.gitignore` automatically excludes `.env` and `.env.local`.

### Step 4: Run Migrations and Seed Database
Run the initial Prisma schema migration and populate the knowledge database using your administrative migration role:
```bash
# Push migrations to the database
pnpm prisma migrate deploy

# Seed the knowledge base records
pnpm db:seed
```

### Step 5: Generate the Static Knowledge Snapshot
Compile the build-time static snapshot (`src/lib/server/knowledge.snapshot.json`):
```bash
pnpm snapshot:generate
```

### Step 6: Verify Local Connectivity
Test your Gemini API credentials and model latency using the built-in diagnostic utility:
```bash
pnpm check:gemini
```

### Step 7: Launch the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## Customization Guide (Using as a Template)

You can easily adapt this codebase into your own personal engineering portfolio. All portfolio facts and configuration live in typed, self-validating data modules under `src/data/`.

### 1. Profile & Identity
- **Basic Info & Bio:** Edit `src/data/profile.ts` to set your name, title, headline, location, summary, and focus areas.
- **Site Metadata & Navigation:** Edit `src/data/site-config.ts` to update your website title, description, and navigation anchor links.
- **Communication Channels:** Edit `src/data/contacts.ts` to configure your email, LinkedIn, GitHub, and professional profiles.

### 2. Journey, Skills, Projects & Credentials
- **Career & Education Timeline:** Edit `src/data/journey.ts` to reflect your work history, degrees, and organizational leadership.
- **Skills Matrix:** Edit `src/data/skills.ts` to list your languages, frameworks, operating systems, networking tools, and hardware proficiencies.
- **Featured Projects:** Edit `src/data/projects.ts` to showcase your software repositories, network deployments, live demos, and tags.
- **Certifications & Licenses:** Edit `src/data/certifications.ts` with your credentials, issuing bodies, credential IDs, and verification URLs.
- **Field Documentation Gallery:** Edit `src/data/gallery.ts` to showcase photos of your physical network racks, server rooms, hardware setups, or engineering activities.

### 3. Grounded AI Knowledge Base
The AI assistant's brain is defined in `src/data/chatbot-knowledge.ts`. Each record contains:
- `id`: Unique identifier (e.g., `kb-proj-01`, `kb-edu-01`)
- `category`: Category tag (`PROFILE`, `EXPERIENCE`, `PROJECTS`, `SKILLS`, `CREDENTIALS`, `POLICIES`)
- `title`: Short descriptive title
- `content`: Ground truth text facts that the AI assistant references
- `keywords`: Token search terms for candidate retrieval

**Synchronizing Your Knowledge Base:**
Whenever you modify `src/data/chatbot-knowledge.ts`, run two simple commands:
```bash
# 1. Update the static build-time snapshot fallback
pnpm snapshot:generate

# 2. Update the remote PostgreSQL knowledge table
pnpm db:seed
```

### 4. Bilingual & Localization Configuration
This template features out-of-the-box bilingual support for **English (`EN`)** and **Indonesian (`ID`)**:
- All translation keys are defined in `src/lib/i18n/dictionaries.ts`.
- The current locale state is provided via React Context in `src/lib/i18n/context.tsx`.

#### How to Adapt Localization:
- **Edit Translations:** Modify the strings in `src/lib/i18n/dictionaries.ts` to update section headings, call-to-action buttons, or status labels.
- **Change Default Language:** Adjust the default locale in `src/lib/i18n/context.tsx` (`"en"` or `"id"`).
- **Single-Language Mode:** If you do not require bilingual switching, simply set your preferred language as default and hide the language toggle component in `src/components/layout/header.tsx`.
- **Add Additional Languages:** Extend `SupportedLocale = "en" | "id"` with your target locale (e.g. `"ja"` or `"de"`), add corresponding dictionary entries, and TypeScript will verify complete translation coverage at compile time.

### 5. Media Assets & Documents
Replace the sample assets in `public/assets/` with your own files:
- `public/assets/profile/`: Your profile portrait photo (`fauzi-portrait.jpg`).
- `public/assets/documents/`: Your CV or résumé PDF (`Fauzi-Budikusuma-CV.pdf`).
- `public/assets/projects/`: Screenshots for your featured project cards.
- `public/assets/certificates/`: Scans or preview images for your credentials.
- `public/assets/gallery/`: High-resolution photos for field documentation.
- `src/app/icon.png` & `src/app/apple-icon.png`: Application and favicon icons.

> [!TIP]
> **Refreshing Preview Screenshots:** When forking or adapting this repository as your personal template, replace the preview screenshots in `docs/previews/` (`hero-dark.png`, `hero-light.png`, `projects-showcase.png`, `credentials-documentation.png`, `ai-assistant-live.png`, `mobile-responsive.png`) with captures of your own customized portfolio to refresh the GitHub `README.md` visual gallery.

---

## Available Scripts & Tooling

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Next.js development server with hot-module replacement |
| `pnpm build` | Generates knowledge snapshot and compiles the production bundle |
| `pnpm start` | Launches the production HTTP server |
| `pnpm lint` | Runs ESLint 9 with Next.js rules to detect syntax and style issues |
| `pnpm typecheck` | Executes TypeScript compiler (`tsc --noEmit`) across the entire repository |
| `pnpm test` | Runs all 28 automated Vitest test suites (401 unit & integration tests) |
| `pnpm verify` | Executes the complete pre-flight gate (`lint` + `typecheck` + `test` + `build`) |
| `pnpm snapshot:generate` | Compiles `src/lib/server/knowledge.snapshot.json` from typed data modules |
| `pnpm db:seed` | Populates PostgreSQL database with knowledge records |
| `pnpm check:gemini` | Validates Gemini API key credentials, model reachability, and latency |
| `pnpm eval:chat` | Executes automated chat evaluation queries against the retrieval engine |

---

## Automated Verification & Testing

Quality and security are enforced through automated verification. Before pushing or deploying, verify that all suites are passing:

```bash
pnpm verify
```

### Test Suite Breakdown (401 Tests Across 28 Files)
- **Unit & Schema Validation:** Validates Zod schemas, data completeness, profile fields, and i18n dictionaries.
- **Component & Lightbox Tests:** Validates keyboard focus trapping, modal rendering, touch gestures, and accessibility attributes.
- **Chatbot Grounding & Contract:** Validates request boundaries, JSON schema conformance, citation requirements, and deterministic refusals.
- **Security & Scope Guard Matrix:** Validates rejection of prompt injections, system override attempts, SQL injection, and secret probing.
- **Database Least-Privilege Verification:** Validates `portfolio_runtime` read success and physical rejection of all write/DDL operations.
- **Hedged Requests & Caching:** Validates SWR caching, 30-minute answer cache hits, and soft-deadline hedged execution.

---

## Deployment Guide (Vercel + Neon)

### 1. Set Up Database on Neon
1. Create a free PostgreSQL database project on [Neon.tech](https://neon.tech/).
2. Run database migrations and seed your data from your local terminal using the owner connection string:
   ```bash
   MIGRATION_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-example.neon.tech/neondb?sslmode=require" pnpm prisma migrate deploy
   MIGRATION_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-example.neon.tech/neondb?sslmode=require" pnpm db:seed
   ```
3. Create a restricted read-only role (`portfolio_runtime`) with `SELECT` permissions on `KnowledgeRecord`:
   ```sql
   CREATE ROLE portfolio_runtime WITH LOGIN PASSWORD 'YOUR_STRONG_PASSWORD';
   GRANT CONNECT ON DATABASE neondb TO portfolio_runtime;
   GRANT USAGE ON SCHEMA public TO portfolio_runtime;
   GRANT SELECT ON TABLE "KnowledgeRecord" TO portfolio_runtime;
   ALTER ROLE portfolio_runtime SET statement_timeout = '3000ms';
   ```

### 2. Deploy to Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Configure Environment Variables in the Vercel Dashboard:

| Variable | Description | Example / Value |
|---|---|---|
| `DATABASE_URL` | Neon pooled connection string for runtime role | `postgresql://portfolio_runtime:PASSWORD@ep-example-pooler.neon.tech/neondb?sslmode=require` |
| `GEMINI_API_KEY` | Google AI Studio API key | `AIzaSy...` |
| `GEMINI_MODEL` | Primary model identifier | `models/gemini-3.5-flash-lite` |
| `GEMINI_FALLBACK_MODEL` | Fallback model identifier | `models/gemini-3.1-flash-lite` |

5. Click **Deploy**. Vercel will automatically run `pnpm build` (which generates the knowledge snapshot during `prebuild`) and deploy your site to the global edge network.

---

## Contributing

Contributions, issues, and feature requests are warmly welcomed! If you are using this repository as a template and develop improvements that could benefit other engineers:
1. Fork the Project (`https://github.com/budikusumafauzi-sketch/FauziBudikusumaPortfolio/fork`).
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`).
3. Ensure all tests and linting pass (`pnpm verify`).
4. Commit your Changes (`git commit -m 'feat: add amazing feature'`).
5. Push to the Branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## License & Author

### License
This project is open-source software licensed under the **[MIT License](LICENSE)**. You are completely free to use, modify, and distribute this codebase for your personal or commercial portfolio.

### Author & Contact
**Fauzi Budikusuma**
*Software Development & Network Engineer*

- **GitHub:** [@budikusumafauzi-sketch](https://github.com/budikusumafauzi-sketch)
- **LinkedIn:** [linkedin.com/in/fauzi-budikusuma](https://www.linkedin.com/in/fauzi-budikusuma)
- **Email:** [budikusumafauzi@gmail.com](mailto:budikusumafauzi@gmail.com)
- **Credly:** [credly.com/users/fauzi-budikusuma](https://www.credly.com/users/fauzi-budikusuma.5538170c)
- **Instagram:** [@budikusuma._fauzi](https://www.instagram.com/budikusuma._fauzi)

---
*Built with precision, systems discipline, and zero hallucination tolerance.*
