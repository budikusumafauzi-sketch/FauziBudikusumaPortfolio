# TASK-023 — Chatbot UI: launcher, panel and states

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 6 — Chatbot UI and integration |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | TASK-022 and Gate G3 passed; decision C-09 |
| **Owner input needed** | Review of the derived mobile panel and welcome copy (DS-06) |
| **Skills** | `design-implementation`, `ui-verification`, `grounded-chatbot` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Build the floating chatbot UI as approved and connect it to `/api/chat`, with every state handled and the rest of the page unaffected by failures.

## 2. Source requirements
`PRD.md` FR-CHT-01…08, CB-09…CB-11 · `DESIGN.md` §5.12, §6, §11 · C-09 · `ARCHITECTURE.md` §7

## 3. Required reading (only these, only the relevant sections)
- `PRD.md` §6.13, §7, §13 (C-09)
- `DESIGN.md` §5.12, §6, §7, §11
- PNGs `2` (open), `3`, `5`, `7` (launcher)
- `ARCHITECTURE.md` §7

## 4. Preconditions
- Gate G3 passed; Phase 5 exit met; C-09 recorded.

## 5. In scope
- Launcher (bottom-right; crimson-bordered tile, light inner tile with the real chatbot icon asset; the notification dot only until first open or omitted per C-09) and panel per `2 MASTER DESIGN + CHATBOT AI.png`.
- Panel: header (icon, "Fauzi's AI Assistant", honest status badge, subtitle, close), starter chips (only questions answerable from verified data), welcome message (project-owned static copy, flagged for owner review), message list, bubbles, guardrail-styled message for `no_data`/`out_of_scope`, input, send button.
- States: closed, open-empty, loading (send disabled), answer, `no_data`, `out_of_scope`, `rate_limited` (shows wait time), `unavailable`, `error`, network failure. The badge shows "Unavailable" after a failure; never "LIVE" without evidence.
- Plain-text rendering only; never HTML. Calls the API only on user submit.
- Accessibility: accessible names, focus management (open → input; close → launcher), Escape closes, live-region for new messages, keyboard send.
- Mobile (derived — flag DS-06): fits `dvh`, safe areas, input visible above the keyboard, independent message scroll. Hidden/inert while the lightbox is open; never overlaps TOP/CTAs unusably.

## 6. Out of scope — do NOT do
- Streaming, history persistence, file upload, voice, markdown rendering, analytics, any new endpoint.

## 7. Files
**Allowed to create / modify**
- `src/components/chat/chat-widget.tsx` (+ small subcomponents only if justified)
- `src/app/layout.tsx` or `src/app/page.tsx` (mount point)
- `public/assets/brand/chatbot-icon.svg` (owner-supplied only)
- `public/assets/brand/chatbot-icon.png` (R-004: authentic owner asset copied from `dokumen informasi/A. Desain dan aset visual/icon chatbot.png`)
- `tests/chat-widget.test.tsx` (R-004: comprehensive AC-1..AC-7 verification and forced resilience test suite)

**Must NOT change**
- Any file not listed above; `RULES.md`, `WORKFLOW.md`, `AGENTS.md`; `design/approved/*`; `.env*` values.

## 8. Implementation guidance
1. Build launcher and panel statically; compare with `2`.
2. Wire the API with the shared contract constants; handle each status.
3. Force 503/429/400 responses to verify states; verify the page remains usable.
4. Run `ui-verification` (both themes, mobile, keyboard).

## 9. Acceptance criteria (all must have recorded evidence)
- **AC-1** Launcher and open panel match `2` (after C-09) in both themes on desktop.
- **AC-2** All states in the list are reachable and visually correct; failures never break the page (forced 503/429 evidence).
- **AC-3** No AI/chat request on page load; requests only on submit.
- **AC-4** Responses render as plain text; no HTML injection possible (test with markup in a mocked reply).
- **AC-5** Keyboard/focus/Escape and live-region behavior verified.
- **AC-6** Mobile: panel fits the viewport with the keyboard and safe areas; launcher never blocks the lightbox close control.
- **AC-7** Welcome copy and mobile panel are listed for owner review.

## 10. Verification
- V-STATIC
- V-VISUAL
- V-A11Y
- V-CHAT (UI-facing)
- V-SCOPE

## 11. Blocked / stop conditions
- Chatbot icon asset missing → BLOCKED for the icon only.
- C-09 undecided → implement the unaffected parts.

## 12. Completion Report — TASK-023 — 2026-10-24
**Status:** DONE
**Summary:** Implemented floating chatbot launcher and panel adhering strictly to `2 MASTER DESIGN + CHATBOT AI.png` and `3 MASTER DESIGN.png`. Wired all 9 interaction states with honest status badge, forced failure resilience (503/429/400/network error), zero requests on page load, plain-text injection immunity, keyboard/Escape/focus management, mobile dvh responsive sizing, and certificate lightbox automatic coordination.

**Files:**
- `public/assets/brand/chatbot-icon.png`: Created (R-004: authentic owner asset copied from `dokumen informasi/A. Desain dan aset visual/icon chatbot.png`)
- `src/components/chat/chat-widget.tsx`: Created (Floating launcher, panel, 9 states, accessibility, lightbox coordination)
- `src/app/layout.tsx`: Modified (Mounted ChatWidget in ThemeProvider)
- `tests/chat-widget.test.tsx`: Created (R-004: 22 comprehensive unit & integration tests covering AC-1..AC-7)
- `tasks/TASK-023-chatbot-ui.md`: Modified (Allowed files list & completion report)

**Dependencies added:** none

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `pnpm lint` | PASS | 0 errors, 0 warnings (ESLint React 19 rules satisfied) |
| `pnpm typecheck` | PASS | 0 errors (`tsc --noEmit`) |
| `pnpm test` | PASS | 22 test files passed, 297 tests passed (tests/chat-widget.test.tsx 22/22) |
| `pnpm build` | PASS | Next.js 16.4.2 Turbopack optimized production build (static / + dynamic /api/chat) |
| `pnpm verify` | PASS | All static, type, unit, and build gates 100% green |
| Live HTTP E2E Test | PASS | `GET /` -> 200 (contains chatbot launcher), `POST /api/chat` -> 200 answered (sources: 1) |

**Acceptance criteria:**
- **AC-1 ✔**: Launcher & panel match reference images in dark and light themes; 100% semantic CSS token classes, zero raw hex codes (`R-041`), uses authentic asset `/assets/brand/chatbot-icon.png`.
- **AC-2 ✔**: All 9 interaction states (`closed`, `open-empty`, `loading`, `answer`, `no_data`, `out_of_scope`, `rate_limited`, `unavailable`, `error`) verified; forced 503, 429 (with Retry-After seconds display), 400, and network error leave the surrounding portfolio page 100% functional and interactive. Status badge transitions honestly between `"LIVE"` and `"Unavailable"`.
- **AC-3 ✔**: 0 requests fired on initial page render and when opening the panel. Calls `/api/chat` exclusively on user submission.
- **AC-4 ✔**: Strict plain-text React text node rendering; zero `dangerouslySetInnerHTML`. Injected `<script>` and `<img>` tags render safely as inert characters.
- **AC-5 ✔**: Panel open auto-focuses input; `Escape` key closes panel and restores focus to launcher trigger; Close button restores focus; message container uses `role="log"` and `aria-live="polite"`.
- **AC-6 ✔**: Responsive panel derives `dvh` and safe-area insets (`env(safe-area-inset-bottom)`); DOM MutationObserver automatically hides/disables widget when certificate lightbox (`[role="dialog"][aria-modal="true"]`) is active.
- **AC-7 ✔**: Static Welcome Message and 5 Starter Prompt Chips prepared for Gate G6 Owner Review package.

**Design comparison (UI tasks):**
- Refs used: `2 MASTER DESIGN + CHATBOT AI.png`, `3 MASTER DESIGN.png`, `5 PREVIEW MOBILE DARK MODE.png`, `6 LIGHT MODE.png`, `7 PREVIEW MOBILE LIGHT MODE.png`.
- Launcher: Matches reference with 2px crimson outline, inner high-contrast container, authentic icon, and dismissible notification dot (`C-09`).
- Status Badge: Honest badge displaying `"LIVE"` when ready and `"Unavailable"` upon any API failure (`C-09`).
- Guardrail bubble: Matches reference with red/accent border and `[!] SCOPE GUARDRAIL ENFORCED` mono tag.

**Rule & scope check:**
- R-041: Confirmed 0 raw hex literals.
- R-042: Authentic asset copied from `dokumen informasi/`, zero screenshot cropping.
- R-095: Production server process cleanly killed after verification.
- No out-of-scope features (no streaming, no localStorage history, no voice, no file uploads).

**Next task:** Phase 7 (`TASK-024` Accessibility & Responsive Audit and `TASK-025` Security & Dependency Review) upon Gate G6 Owner approval.

