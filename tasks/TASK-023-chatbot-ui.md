# TASK-023 — Chatbot UI: launcher, panel and states

| Field | Value |
|---|---|
| **Status** | `TODO` |
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

## 12. Completion Report
*(Append the report using the template in `AGENTS.md` §9 when finished. Then update `Status`, `TODO.md` §1 and commit: `TASK-023: <summary>`.)*
