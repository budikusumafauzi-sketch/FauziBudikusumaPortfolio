# DESIGN.md — How the interface must look and behave

**Source of truth for visual design: `design/approved/`** (seven owner-approved Google Stitch PNG exports). This document explains how to implement those images consistently. It never replaces them.
**Companion:** behavior → `PRD.md` · conflicts/decisions → `PRD.md` §13–§15 (C-xx, OD-xx) · tokens/CSS live in the codebase once built (`src/app/globals.css`).
**Labels:** **OBSERVED** (measured/seen in the PNGs) · **INTERPRETATION** (reasoned from the PNGs) · **RECOMMENDED** (needs validation) · **OPEN** (needs owner/measurement).

> **Rule 0.** The PNGs are visual references, **not production assets** and **not content**. Their imagery (project thumbnails, certificate art, gallery photos, captions, IDs) is illustrative/AI-generated mock material (PRD C-10). Never crop, trace or display a screenshot as a logo, photo, thumbnail or certificate.

---

## 1. Asset inventory and reference-to-component map

Inspected for this document: opening, desktop dark (all regions), desktop dark with chatbot open (pixel-diff confirms it differs from `3` **only** in the chat-panel region), certificate preview, desktop light, mobile dark, mobile light. Colors below were **sampled from pixels**; see §3.

| File in `design/approved/` | Size (px) | Governs |
|---|---|---|
| `1 OPENING.png` | 1280×1024 | Opening overlay: emblem placement, name, subtitle, progress, status line, bottom meta |
| `2 MASTER DESIGN + CHATBOT AI.png` | 1448×4056 | Full desktop dark **with chat panel open**: panel anatomy, header, chips, bubbles, guardrail message, input |
| `3 MASTER DESIGN.png` | 1448×4056 | **Primary desktop layout** (dark, chat closed): all sections, grid, card anatomy, launcher + TOP |
| `4 PREVIEW CERTIFICATION.png` | 1259×4106 | Certificate lightbox appearance (and credentials row) — **see C-03: extra chrome is not to be implemented** |
| `5 PREVIEW MOBILE DARK MODE.png` | 715×6107 | Mobile dark: hamburger header, stacking order, 1-column cards, swipe rows, 2×2 contact |
| `6 LIGHT MODE.png` | 1119×5035 | Desktop light theme |
| `7 PREVIEW MOBILE LIGHT MODE.png` | 683×6107 | Mobile light theme |

Export canvas widths are **not** reliable CSS viewport widths (the exports include an outer frame/margins and differ per file). Use them for proportions and relationships, not as breakpoints.

| Component | Primary reference | Also check |
|---|---|---|
| Opening overlay | 1 | 5, 7 (mobile fit — not depicted; verify) |
| Navbar (desktop / mobile) | 3 / 5 | 6, 7 |
| Hero | 3 | 5, 6, 7 |
| Profile & Journey | 3 | 5, 6 |
| Skills marquee | 3 | 5 |
| Projects grid | 3 | 5, 6 |
| Credentials carousel | 3 | 4, 5, 6, 7 |
| Certificate lightbox | 4 | — |
| Field Documentation | 3 | 5, 6, 7 |
| Direct Channels | 3 | 5 (2×2), 6, 7 |
| Footer + TOP | 3 | 5, 7 |
| Chat launcher + panel | 2 | 3 (closed), 5, 7 (launcher) |
| Light theme | 6 | 7 |

## 2. Design direction (OBSERVED)

Premium, editorial-minimalist, restrained. Near-black charcoal surfaces with thin cool-gray borders; large uppercase heavy headings with tight tracking; monospaced micro-labels and chips; a single crimson accent used for the primary CTA, active/hover borders, small markers and corner brackets; framed portrait with crimson corner brackets; cards with consistent padding, rounded corners and hairline borders. Light mode keeps the same identity on near-white surfaces with a deeper crimson — it is **not** a color inversion.
Avoid: neon, random gradients, decorative dashboards, charts, oversized animated elements, anything that reads as a generic AI template.

## 3. Design tokens (sampled from the PNGs)

Define as **semantic CSS custom properties** (e.g. `--color-bg-page`) in one place (`globals.css`, using Tailwind's theme mechanism for the installed version). **Never scatter raw hex values in components** (RULES R-063). Hover/active/focus values not visible in the PNGs are **RECOMMENDED** and must be checked for contrast.

### 3.1 Color — dark theme
| Token | Value | Basis |
|---|---|---|
| `bg-page` | `#131316` | **OBSERVED**, dominant desktop page color |
| `bg-deep` | `#0E0E11` | **OBSERVED** in desktop export (role to confirm: footer/outer areas) |
| `bg-page-mobile` | `#0B0B0E` | **OBSERVED** in mobile export (differs from desktop — OPEN DS-04) |
| `surface-card` | `#131318` | **OBSERVED** inside cards |
| `surface-raised` | `#1A1A22` | **OBSERVED** (chips/inputs/raised — role to confirm) |
| `border-default` | `#262630` | **OBSERVED** card border |
| `border-nav` | `#1E1E26` | **OBSERVED** nav bottom edge |
| `text-primary` | `#E5E1E6` | **OBSERVED** headings/name |
| `text-strong` | `#FEFEFE` | **OBSERVED** (titles/button label on fills) |
| `text-secondary` | `#C7C5D0` | **OBSERVED** hero/profile body |
| `text-muted` | `#9A98A2` | **OBSERVED** card descriptions |
| `text-faint` | `#6D6C74` | **OBSERVED** (decorative labels only — fails small-text contrast; do not use for essential text) |
| `accent` | `#E11D48` | **OBSERVED** primary button / borders |
| `accent-text` | `#FFB3B6` | **OBSERVED** crimson-tinted text/chips on dark |
| `accent-chip-bg` | `#28141B` | **OBSERVED** headline highlight background |
| `accent-hover`, `accent-active` | RECOMMENDED: derive one step darker/lighter and re-check contrast | — |
| `focus-ring` | RECOMMENDED: `accent` (or `accent-text`) at 2 px with offset | — |

### 3.2 Color — light theme
| Token | Value | Basis |
|---|---|---|
| `bg-page` | `#FAFAFC` | **OBSERVED** |
| `bg-alt` / white sections | `#FFFFFF` | **OBSERVED** (alternating section bands; which elements are cards vs bands — confirm in TASK-004) |
| `surface-chip` | `#F1F1F5` | **OBSERVED** |
| `border-default` | `#E4E4EC` (nav `#E3E3E5`) | **OBSERVED** |
| `text-primary` | `#111115` | **OBSERVED** |
| `text-secondary` | `#52525E` | **OBSERVED** body |
| `text-muted` | `#7C7C85` | **OBSERVED** |
| `accent` | `#BE123C` (desktop export) | **OBSERVED** — mobile light export shows a brighter crimson (≈ dark-mode `#E11D48`): OPEN DS-05, pick one after contrast check |

### 3.3 Contrast evidence (authoritative Phase 7 audit record — TASK-024)
| Pair | Theme | Ratio | Text Size | Pass/Fail | Notes |
|---|---|---|---|---|---|
| `text-strong` (`#FEFEFE`) on `bg-page` (`#131316`) | Dark | **18.39:1** | Any | PASS | Titles and headings |
| `text-primary` (`#E5E1E6`) on `bg-page` (`#131316`) | Dark | **14.34:1** | Any | PASS | Primary body and labels |
| `text-secondary` (`#C7C5D0`) on `bg-page` (`#131316`) | Dark | **10.88:1** | Any | PASS | Secondary text and summaries |
| `text-muted` (`#9A98A2`) on `bg-page` (`#131316`) | Dark | **6.52:1** | Normal/Small | PASS | Exceeds 4.5:1 threshold |
| `accent-text` (`#FFB3B6`) on `bg-page` (`#131316`) | Dark | **10.93:1** | Small | PASS | Small crimson text, badges & chips |
| `accent-text` (`#FFB3B6`) on `accent-chip-bg` (`#28141B`) | Dark | **10.26:1** | Small | PASS | Headline chip & status badges |
| `accent` (`#E11D48`) on `bg-page` (`#131316`) | Dark | **3.95:1** | Large / UI | PASS | Exceeds 3.0:1 for large text (≥24px/bold) & UI borders/fills. Restricted per R-041/Item 38. |
| `white` (`#FFFFFF`) on `accent` (`#E11D48`) | Dark | **4.70:1** | Normal/Small | PASS | Primary CTA button label |
| `text-strong` (`#FEFEFE`) on `surface-card` (`#131318`) | Dark | **18.36:1** | Any | PASS | Card titles |
| `text-primary` (`#E5E1E6`) on `surface-card` (`#131318`) | Dark | **14.32:1** | Any | PASS | Card primary text |
| `text-secondary` (`#C7C5D0`) on `surface-card` (`#131318`) | Dark | **10.87:1** | Any | PASS | Card descriptions |
| `text-muted` (`#9A98A2`) on `surface-card` (`#131318`) | Dark | **6.51:1** | Normal/Small | PASS | Card metadata & tags |
| `text-strong` (`#0A0A0C`) on `bg-page` (`#FAFAFC`) | Light | **18.98:1** | Any | PASS | Titles and headings |
| `text-primary` (`#111115`) on `bg-page` (`#FAFAFC`) | Light | **18.07:1** | Any | PASS | Primary body |
| `text-secondary` (`#52525E`) on `bg-page` (`#FAFAFC`) | Light | **7.39:1** | Any | PASS | Secondary text |
| `text-muted` (`#71717A`) on `bg-page` (`#FAFAFC`) | Light | **4.64:1** | Normal/Small | PASS | Tuned in Phase 7 to meet 4.5:1 |
| `accent-text` (`#9F1239`) on `bg-page` (`#FAFAFC`) | Light | **7.69:1** | Small | PASS | Small crimson text & badges |
| `accent-text` (`#9F1239`) on `accent-chip-bg` (`#FFE4E6`) | Light | **6.68:1** | Small | PASS | Headline chip & status badges |
| `accent` (`#BE123C`) on `bg-page` (`#FAFAFC`) | Light | **6.03:1** | Any | PASS | Exceeds 4.5:1 across all sizes |
| `white` (`#FFFFFF`) on `accent` (`#BE123C`) | Light | **6.29:1** | Normal/Small | PASS | Primary CTA button label |
| `text-strong` (`#0A0A0C`) on `surface-card` (`#FFFFFF`) | Light | **19.78:1** | Any | PASS | Card titles |
| `text-primary` (`#111115`) on `surface-card` (`#FFFFFF`) | Light | **18.84:1** | Any | PASS | Card primary text |
| `text-secondary` (`#52525E`) on `surface-card` (`#FFFFFF`) | Light | **7.70:1** | Any | PASS | Card descriptions |
| `text-muted` (`#71717A`) on `surface-card` (`#FFFFFF`) | Light | **4.83:1** | Normal/Small | PASS | Tuned in Phase 7 to meet 4.5:1 |
| `white` (`#FFFFFF`) on Field Doc Scrim (`black/90`) | Both | **> 15:1** | Any | PASS | Gallery titles & captions |
| `accent-text` (`#FFB3B6`) on Field Doc Scrim (`black/90`) | Both | **> 10:1** | Small | PASS | Field log index brackets |
| `text-faint` (`#6D6C74`) on `bg-page` (`#131316`) | Dark | **3.57:1** | Non-text UI | PASS | Decorative bracket corners/borders (≥3.0:1). Forbidden for essential text per Item 38. |

Every essential readable text pair in both dark and light themes strictly meets or exceeds WCAG AA (normal text ≥ 4.5:1, large text ≥ 3.0:1, non-text UI ≥ 3.0:1). Small crimson text strictly uses `accent-text`, and `accent` (`#E11D48`) on dark surfaces is restricted to large headlines, fills, and interactive borders.

### 3.4 Typography tokens (OBSERVED roles; sizes OPEN)
| Role | Family | Observed usage |
|---|---|---|
| Display / headings | **Plus Jakarta Sans** | Hero name (uppercase, heavy, tight tracking), section titles (uppercase), card titles, panel titles |
| Body / UI | **Inter** | Paragraphs, descriptions, nav links, buttons (desktop), list items |
| Technical / labels | **JetBrains Mono** | Section sub-labels, chips, tags, status labels, license text, dates, "Click preview", mono CTA labels on mobile |
Load via `next/font` with only used weights; expose as CSS variables. **Do not invent a type scale from memory.** Measure the hero name, section titles, card titles, body and mono labels in the PNGs relative to body text (e.g. overlay/ratio method) and record the final scale as tokens in TASK-004. Uppercase headings + `letter-spacing` need a tight value for display and a wide value for mono labels — measure.

### 3.5 Shape, spacing, elevation (OBSERVED relations; exact values OPEN)
- Content column: in `3 MASTER DESIGN.png` content spans x = 61 → 1385 of a 1448-px export (≈ 4 % gutters, ≈ 1324 px content). The real `max-width` is **not** known from this: choose by overlay in TASK-004 and record it.
- Project grid: 3 equal columns with a consistent gutter (≈ 25 export-px) and equal card widths (≈ 425 export-px).
- Radii: small on chips/buttons, moderate on cards (≈ 8–12 px feel), larger on the portrait frame — measure.
- Borders: 1 px hairlines everywhere; shadows are minimal in dark; light mode uses a soft shadow on the portrait frame and the TOP/launcher controls.
- Primary button has a soft crimson glow in dark mode.
- Vertical rhythm between sections is large and uniform — derive the section gap from the PNG, then reuse one token.

### 3.6 Motion tokens (RECOMMENDED — static PNGs cannot show motion)
UI transitions 150–250 ms ease-out; entrance 400–600 ms; theme switch ≤ 200 ms (no slow full-page fade); marquee loop speed to be tuned visually (start ≈ 40 s per loop); marquee pause easing ≈ 300 ms. All values are tokens; none hard-coded in components.

## 4. Layout and responsive behavior

**Breakpoints (OD-10, RECOMMENDED):** start from the framework's standard breakpoints and **validate each against the references**; adjust only if a reference demands it. Required behavior (not export widths):

| Viewport | Hero | Profile & Journey | Projects | Credentials | Documentation | Contact |
|---|---|---|---|---|---|---|
| Desktop | Text left, portrait right | 2 columns | **3 columns** | Carousel, ≈ 4 cards visible + arrows beside the heading | 4 cards across | 4 cards in a row |
| Tablet | Per validation | 1–2 columns | **2 columns** | Fewer cards visible | Horizontal drag | 2×2 or 4 (validate) |
| Mobile | **Portrait first**, then name, summary, CTAs (primary full-width, two secondary side-by-side) | Stacked cards | **1 column** | Swipe row with partial next card + arrows beside heading | Swipe row with "SWIPE" hint | **2×2** cards with sub-labels ("@gmail.com ↗", "Connect ↗", "Repos ↗", "Follow ↗") |

Global: no horizontal page scroll; wide content scrolls inside its own container; mobile header = monogram + wordmark, theme toggle, hamburger.

## 5. Section specifications

### 5.1 Navbar (DS-NAV) — refs 3, 5, 6, 7; decisions C-01, C-02
- Sticky, translucent/blur-free solid bar with a hairline bottom border; same page background tone.
- Left: **monogram in a rounded bordered square** + wordmark "FAUZI BUDIKUSUMA" with small mono "PORTFOLIO" beneath. (Whether the nav monogram is the logo SVG or the letters "FB" in text is OPEN DS-02.)
- Center/right desktop: text links (Inter, medium, secondary color; hover → brighter). Theme toggle (bordered square with moon in dark / sun in light — icon shows the **current** theme in the exports; set a clear accessible name + `aria-pressed`/label that states the action).
- **The ID/EN switch shown in the exports is not implemented if C-01 is approved as recommended.**
- Mobile: hamburger opens a drawer/menu; focus trap not required unless it covers the page, but Escape + close-on-select + focus return are required (FR-NAV-03). Menu design is **not depicted** in the PNGs → derive from tokens and flag for owner review (DS-06).
- Anchor offset = measured navbar height + small buffer so headings are never covered.

### 5.2 Opening overlay (DS-OPN) — ref 1
- Full-screen near-black (`#131316`-class), centered stack: emblem inside a square frame with **four corner markers** (two crimson, two gray), name in huge uppercase Plus Jakarta, mono spaced subtitle "SOFTWARE DEVELOPMENT & NETWORK ENGINEER" (subject to C-05), short progress bar (crimson fill portion on a gray track), status line "• LAUNCHING WORKSPACE…" with a crimson dot.
- Bottom-left chip "DISCIPLINE // 01 PERSONAL PORTFOLIO"; bottom-right "© 2026 • ALL RIGHTS RESERVED".
- Faint corner texts in the export are unreadable → omit (C-11/DS-07).
- Behavior: FR-OPN-01…05. Provide a hard timeout fail-safe; the overlay must be removable even if JS animation libraries fail; reduced motion → no movement, short fade only.
- The emblem is a metallic "FB" mark in a crimson ring with crosshair ticks — requires the **real logo file** (`public/assets/brand/logo-monogram.svg`); until supplied the task is BLOCKED (never trace the screenshot).

### 5.3 Hero (DS-HRO) — refs 3, 5, 6, 7
- Desktop: left column text (name → highlighted headline chip → paragraph → 3 buttons), right column framed portrait.
- Name: uppercase heavy display; headline: mono/semibold uppercase on a crimson-tinted chip (dark: bg `#28141B`, text `#FFB3B6`; light: crimson text on subtle tint).
- Buttons: **View Projects** = crimson fill + down-arrow icon (+ glow in dark); **Contact Me** and **Download CV** = 1 px bordered, transparent/surface, arrow-up-right and download icons. Desktop labels Inter uppercase tracking; mobile labels appear mono (INTERPRETATION — validate).
- Portrait frame: rounded border container, inner photo ≈ **4:5**, **crimson L-shaped corner brackets** at all four corners, faint pink radial glow behind the subject top, soft bottom fade. Use the real portrait asset with `next/image` and reserved aspect ratio.
- Entrance: restrained stagger (RECOMMENDED), disabled under reduced motion.

### 5.4 Profile & Journey (DS-ABT) — refs 3, 5, 6
- Section title (uppercase display) with right-aligned mono descriptor "SOFTWARE DEVELOPMENT, IT NETWORKING, AND FORMAL BACKGROUND" and a hairline rule (descriptor text is design copy → owner-verify).
- Left card **Profile Summary** (+ mono "OVERVIEW" tag): two specialization chips (first crimson-tinted, second neutral), two paragraphs, divider, mono "OPERATIONAL PRINCIPLES:" with 3 crimson-bullet items.
- Right card **Education & Experience Timeline** (+ "CHRONO" tag on mobile): vertical rail with dots (current item: crimson dot; others gray), entries with bold uppercase title, mono date range right-aligned, description, optional chips.
- Copy differs between desktop and mobile in the exports (dates, role wording, truncated descriptions) — **single source in `src/data/journey.ts`**; never fork copy per breakpoint (PRD C-10).

### 5.5 Skills marquee (DS-SKL) — refs 3, 5; decision C-04
- Row of uniform **square bordered tiles** (icon only), equal spacing, edges fading/clipped (first tile appears dimmed at the left edge = scrolling in).
- CSS-only infinite loop of a duplicated track; `aria-hidden` on the duplicate; one visually-hidden list of skill names for assistive tech; pause on hover/focus; **reduced motion → static wrapping grid**.
- Icons: Lucide glyphs are acceptable for generic tiles; real technology logos only from owner-approved assets in `public/assets/skills/`.

### 5.6 Projects grid (DS-PRJ) — refs 3, 5, 6; decisions C-06, C-07
- Grid: **3 / 2 / 1** columns. Cards equal height (use grid stretch + footer pinned to the bottom).
- Card anatomy (top → bottom): inset **16:10** image with rounded corners → mono status label (when approved) → title (display, semibold) → 3–4 line description (muted) → mono tag chips → hairline divider → footer row: **"GitHub Repository ↗"** left, mono license/visibility right.
- **Last row rule:** with n not divisible by 3, remaining cards keep exactly 1/3 width and sit left-aligned; they never stretch. Implement with a true grid (not flex-grow). Verify with 4, 5 and 6 cards.
- The crimson border on card 1 in every export is INTERPRETED as the **hover/active** state (OPEN DS-08 to confirm); hover = crimson border + subtle lift/shadow (RECOMMENDED).
- Images: `next/image` with explicit dimensions/aspect; no layout shift; real thumbnails only. Missing thumbnail → designed neutral placeholder consistent with the card (never a fake screenshot).
- No filters, search, categories, detail modal.

### 5.7 Credentials carousel (DS-CRT) — refs 3, 4, 6; decisions C-03, C-08
- Heading "VERIFIED CREDENTIALS" with **square prev/next buttons** (bordered, chevrons) aligned right of the heading; Embla viewport below.
- Card anatomy: image area (≈ **1.8 : 1** observed; finalize by measurement) with badge top-left (solid crimson or dark chip) and issuer chip top-right → title → description (3–4 lines) → footer: mono "• Click preview" (left) + dated chip (right).
- Only verified fields are rendered (C-08). Issuer chips need a **solid background** (the light-mode export shows red-on-image text that is hard to read — a defect to avoid).
- Whole card is the button for the lightbox (keyboard focusable, visible focus ring, Enter/Space). Missing image → unavailable state, not clickable (FR-CRT-08).
- Mobile: partial next card visible to hint swiping.

### 5.8 Certificate lightbox (DS-LBX) — ref 4, decision C-03 (**image-only**)
- Fixed overlay with dark scrim, **centered** dialog; contents: the full certificate image (`object-fit: contain`, `max-width/height` within the viewport) and a close **X** button (accessible name "Close certificate preview", ≥ 44 px target).
- Optional decorative crimson corner brackets around the image (RECOMMENDED allowed; no text).
- **Not implemented:** header caption line, "CLOSE (ESC)" pill, "SHA-256 HASH VERIFIED…", "ACTIVE STATUS: VALID THROUGH…".
- Behavior: `role="dialog"` + `aria-modal="true"` + accessible name from the certificate title; focus moves into the dialog on open and **returns to the invoking card**; Escape closes; Tab stays inside while open; body scroll locked **without jumping scroll position**; backdrop-click closing is **OPEN (OD-12)** — default: not enabled; chat launcher is hidden/inert while the dialog is open.

### 5.9 Field Documentation (DS-GAL) — refs 3, 5, 6, 7
- Heading "FIELD DOCUMENTATION" + (mobile) mono "SWIPE ↔" hint.
- Image cards with rounded corners, hairline border, **bottom gradient scrim** with mono-bracket caption `[TITLE]` (bold) + one/two-line description. Add a sufficient scrim so captions stay legible in **both** themes (light export shows weak contrast).
- Card size: appears **fixed height** (≈ 320–350 export-px) with 4 across on desktop — finalize in TASK-014 by measurement. Mobile: horizontal swipe, `touch-action: pan-y`, partial next card visible.
- Real photos only; alt text meaningful; captions only if owner-confirmed.

### 5.10 Direct Channels / Contact (DS-CNT) — refs 3, 5, 6
- Desktop: 4 bordered cards in a row: left icon (Lucide mail/briefcase/terminal/camera glyph), tiny mono label (EMAIL / LINKEDIN / GITHUB / INSTAGRAM), value in semibold, arrow-up-right at right.
- Mobile: 2×2, icon in crimson, value + crimson mono sub-link ("Connect ↗", …).
- Values must **never truncate** (the light export clips the email/GitHub text — do not replicate). Allow wrapping/`break-all`/smaller text as needed. Links open in a new tab with `rel="noopener noreferrer"`; email uses `mailto:` only if approved (OD-11).

### 5.11 Footer and Back to Top (DS-FTR) — refs 3, 5, 7
- Left: bold name + bordered mono location chip ("YOGYAKARTA, ID" — owner-verify), tagline in two lines, small mono copyright. Mobile: centered stack.
- **TOP** control: bordered rectangle with up-arrow + mono "TOP", sits immediately **left of** the chat launcher in all exports (OPEN DS-03: static in the footer vs. part of the floating group). RECOMMENDED: an anchor to `#home` that never overlaps the launcher.

### 5.12 Chatbot (DS-CHT) — ref 2 (open), 3/5/7 (closed)
- **Launcher:** fixed bottom-right; rounded-square tile, **2 px crimson border**, light (white) inner tile with a dark headset-bot icon in both themes; small crimson dot at the top-right corner (C-09: show only until first open, or omit).
- **Panel** (anchored above the launcher): rounded card with hairline border and shadow. Header: small icon tile, title "Fauzi's AI Assistant", small crimson-bordered status badge "LIVE" (C-09: must reflect real state), mono subtitle "Answers strictly from verified profile data", close **X**. Below: row of starter chips (e.g. "What projects has he built?", "Skills & networking background" — must be answerable from real data). Messages: visitor bubbles right (neutral raised), assistant bubbles left with small avatar, key terms may be highlighted in crimson-light; a distinct bordered **guardrail message** with a lock icon and mono label "SCOPE GUARDRAIL ENFORCED" for out-of-scope replies. Footer: text input "Ask a question about Fauzi…" + crimson square send button.
- Panel size: RECOMMENDED `min(24rem, 100vw − 2rem)` wide, `min(32rem, 70dvh)` tall on desktop; mobile: fits `dvh`, keeps input visible above the on-screen keyboard, honors `env(safe-area-inset-*)`; messages area scrolls independently.
- States to build: closed, open-empty (welcome + chips), loading (typing indicator, send disabled), answer, `no_data`/`out_of_scope` (guardrail style), `rate_limited`, `unavailable`, `error`. Statuses map to `ARCHITECTURE.md` §7 — the UI never shows raw errors.
- Mobile panel layout is **not depicted** (only the launcher is) → derive, then flag for owner review (DS-06).
- Behavior in `PRD.md` FR-CHT-xx / CB-xx.

## 6. Interaction-state matrix (all required)

| Component | Default | Hover (pointer only) | Focus-visible | Active/pressed | Disabled / loading / error |
|---|---|---|---|---|---|
| Primary button | crimson fill (+ glow dark) | slightly brighter/darker fill | visible ring, offset | slightly darker, no layout shift | — |
| Secondary button | 1 px border | border → crimson-tinted / text brighter | ring | subtle fill | — |
| Nav link | secondary text | primary text (+ underline/indicator if design shows) | ring | — | — |
| Icon buttons (theme, menu, arrows, X, TOP) | bordered square | border brighter | ring | pressed fill | carousel arrows `disabled` at ends (Embla) |
| Project card | hairline border | **crimson border** (+ lift) | ring on the repo link | — | missing repo → non-link state |
| Credential card | hairline border | crimson border | ring on the card button | — | missing image → unavailable, inert |
| Gallery card | hairline border | optional subtle emphasis | ring if focusable | — | — |
| Contact card | hairline border | border/arrow emphasis | ring | — | — |
| Chat launcher | crimson border | brighter | ring | pressed | — |
| Chat input / send | border | border brighter | ring | — | send disabled when empty/loading |
| Lightbox X | bordered | brighter | ring | pressed | — |
Hover must never be the only way to reach content or an action (touch has no hover).

## 7. Motion and reduced motion

Entrance: hero stagger only. Marquee: CSS loop, slow/pause on hover/focus. Carousel/gallery: Embla drag with natural inertia. Lightbox/chat: short fade/scale. Theme change: ≤ 200 ms color transition, never page-wide slow fade.
**`prefers-reduced-motion: reduce`:** no auto-moving marquee (static wrapping grid), no entrance transforms (instant or fade ≤ 100 ms), no parallax/glow animations, opening overlay shows without movement, carousel keeps functional drag/arrow navigation without smooth-scroll animation. Implement via one shared CSS rule/variable plus Motion's reduced-motion support — verify manually (TASK-024).

## 8. Theme behavior
`next-themes` with the `class`/attribute strategy that avoids a flash (verify). Default theme: owner-decided (OPEN DS-09; RECOMMENDED: respect system, fall back to dark since the master design is dark). Persist preference. Everything — cards, chips, portrait frame glow, lightbox scrim, chat panel, guardrail message, focus rings — is defined in **both** themes through tokens.

## 9. Images, ratios, cropping, placeholders
| Image | Ratio / fit | Notes |
|---|---|---|
| Portrait | ≈ 4:5, `cover` with focal point on face | WebP; priority load (above the fold) |
| Project cover | **16:10**, `cover` | Real project screenshots only |
| Certificate card image | ≈ 1.8:1, `cover` (preview only) | Card crop is allowed **only** for the card; the lightbox uses the full file |
| Certificate lightbox | natural ratio, **`contain`** | Never cropped |
| Gallery | fixed card height, `cover` | Authentic photos only |
| Skill tiles | square tile, icon `contain` | SVG preferred |
| Logo | SVG | Real asset only |
Always reserve dimensions (`width/height` or aspect-ratio) to avoid layout shift. Placeholders (only when an approved fallback is allowed — OD-09): neutral surface + small icon, no fake content, never shipped at release (RULES R-016).
Asset folders and naming: `ARCHITECTURE.md` §4.

## 10. Accessibility design rules
Semantic landmarks (`header`, `nav`, `main`, `section` with headings in order, `footer`) · visible `:focus-visible` on every interactive element · accessible names for icon-only controls · alt text per FR-GAL-03 · contrast per §3.3 in both themes (including text over images: use scrims/solid chips) · reduced-motion per §7 · modal and chat focus management · no hover-only content · touch targets ≥ 44 px (RECOMMENDED).

## 11. Stacking order (RECOMMENDED)
content < sticky nav < floating TOP/launcher < chat panel < lightbox overlay < opening overlay. While the lightbox is open the launcher/panel are hidden or inert so they cannot cover the close control.

## 12. Known defects in the references (do **not** copy)
Truncated email/GitHub text (light) · low-contrast red issuer chip over images (light) · weak caption contrast on gallery images (light) · stray line break inside the profile paragraph ("…and IT⏎networking") · inconsistent journey wording/dates between desktop and mobile · Enterprise Network Lab description not matching its tags · headline text varying between exports · mock certificate/hash/validity claims · ID/EN switch (C-01).

## 13. Open design items (RESOLVED at Gate G0)
| ID | Item | RECOMMENDED | Status / Decision (Gate G0) |
|---|---|---|---|
| DS-01 | Final type scale, spacing, radii, container width | Measure by overlay in TASK-004; record as tokens | **APPROVED** (Measure in TASK-004, record as tokens) |
| DS-02 | Navbar monogram: logo SVG vs "FB" text | Use the approved logo asset if it works at small size | **APPROVED** (Use approved logo asset if works at small size) |
| DS-03 | TOP: static in footer vs floating group | Static anchor in footer | **APPROVED** (Static anchor in footer) |
| DS-04 | Mobile dark page bg `#0B0B0E` vs desktop `#131316` | Choose one token after review | **APPROVED** (Choose one token after review) |
| DS-05 | Light-mode accent `#BE123C` vs brighter mobile crimson | `#BE123C` (better contrast) unless owner prefers | **APPROVED** (`#BE123C` adopted for contrast) |
| DS-06 | Mobile menu and mobile chat panel are not depicted | Derive from tokens; owner review at Gate G3/Phase 6 | **APPROVED** (Derive from tokens; review at Gate G3/Phase 6) |
| DS-07 | Faint corner text in the opening export | Omit | **APPROVED** (Omit faint corner text) |
| DS-08 | Crimson card border = hover state? | Treat as hover/focus | **APPROVED** (Treat as hover/focus state) |
| DS-09 | Default theme | System, fallback dark | **APPROVED** (System with fallback to dark) |

## 14. Fidelity verification procedure (used by every UI task)
1. Open the relevant PNG(s) at full scale and list what must match.
2. Run the page in the browser at matching widths in the same theme; capture screenshots.
3. Compare section by section: order, alignment, spacing rhythm, typography hierarchy, card anatomy, ratios, colors (sample pixels), states.
4. Record each difference as *fixed*, *intentional* (cite C-xx/OD-xx decision), or *open*. Unexplained differences block the task.
5. Never "fix" a difference by changing the reference or by inventing a new style.
Skill: `.agents/skills/design-implementation/SKILL.md`.
