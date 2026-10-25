# TASK-034 — Favicon from LOGO FB.png (CR-006)

| Field | Value |
|---|---|
| **Status** | `DONE` |
| **Phase** | 7 — Quality and security review (Revision 2 & Optimization) |
| **Hat** | UI |
| **Priority** | P0 |
| **Depends on** | Gate G7 / CR-001..CR-005 |
| **Owner input needed** | none (asset provided in workspace) |
| **Skills** | `design-implementation`, `ui-verification` |

> Autonomy: create/edit files in the allowed list and run permitted terminal commands **without asking** (`AGENTS.md` §3). Stop only for the events in `RULES.md` §12. Phase and gate rules: `WORKFLOW.md`.

## 1. Objective
Use `dokumen informasi/A. Desain dan aset visual/LOGO FB.png` as the browser tab favicon and site icon suite (`icon.png`, `apple-icon.png`, `favicon.ico`) without distortion, without stretching, and without adding runtime dependencies per Owner Change Request CR-006.

## 2. Source requirements
- `PRD.md` §8.2, §15 (CR-006)
- `DESIGN.md` §9
- Directives Items 11–15

## 3. Required reading
- `PRD.md` §8.2, §15 (CR-006)
- `DESIGN.md` §9
- `src/app/layout.tsx`

## 4. In scope
- Verify `dokumen informasi/A. Desain dan aset visual/LOGO FB.png` and ensure identical presence at `public/assets/brand/logo-fb.png`.
- Generate site icon suite from `LOGO FB.png`:
  - `src/app/icon.png` (512×512 square PNG)
  - `src/app/apple-icon.png` (180×180 PNG)
  - `src/app/favicon.ico` (32×32 / 16×16 Windows icon)
  - `public/favicon.ico` (root fallback)
- Configure Next.js App Router metadata conventions in `src/app/layout.tsx`.
- Verify legibility and appearance at 16×16 and 32×32 px.
- Report status of Navbar and Opening Overlay logo assets (Item 14).
- Production build verification: HTTP 200 on `/icon.png`, `/apple-icon.png`, `/favicon.ico`, and `<link rel="icon">` tags in HTML.

## 5. Out of scope
- Changing Navbar or Opening Overlay layout or logos (Item 14).
- Adding runtime image-processing dependencies (`R-094`).

## 6. Files
**Allowed to modify / create:**
- `public/assets/brand/logo-fb.png`
- `public/favicon.ico`
- `src/app/icon.png`
- `src/app/apple-icon.png`
- `src/app/favicon.ico`
- `src/app/layout.tsx`
- `PRD.md` §8.2, §15
- `DESIGN.md` §9
- `TODO.md`
- `tasks/TASK-034-favicon-brand-asset.md`

## 7. Acceptance criteria
- **AC-1** `LOGO FB.png` preserved intact at `public/assets/brand/logo-fb.png`.
- **AC-2** `src/app/icon.png` (512×512), `src/app/apple-icon.png` (180×180), and `src/app/favicon.ico` generated without distortion and aspect ratio preserved.
- **AC-3** `src/app/layout.tsx` includes explicit icon metadata pointing to `/favicon.ico`, `/icon.png`, and `/apple-icon.png`.
- **AC-4** Production build returns HTTP 200 with proper `content-type` (`image/png` and `image/x-icon`), and HTML includes valid `<link rel="icon">` and `<link rel="apple-touch-icon">` tags.
- **AC-5** Navbar and Opening Overlay logo status inspected and reported (Item 14).

## 8. Completion Report — TASK-034 — 2026-10-25
**Status:** DONE
**Summary:** Configured `LOGO FB.png` as the browser tab favicon and comprehensive site icon suite. Generated 512×512 `src/app/icon.png`, 180×180 `src/app/apple-icon.png`, and `src/app/favicon.ico` using high-quality bicubic resampling from the authentic 5016×5016 source without distortion. Configured `src/app/layout.tsx` metadata and verified production HTTP 200 responses.

**Item 14 Audit (Navbar & Opening Overlay Logos):**
- Navbar (`src/components/layout/navbar.tsx` lines 103–110): Already uses authentic `/assets/brand/logo-fb.png` with dimensions 32×32 px inside a rounded technical container.
- Opening Overlay (`src/components/layout/opening-overlay.tsx` lines 82–90): Already uses authentic `/assets/brand/logo-fb.png` inside the crimson-bracketed `CornerFrame`.
- Result: Both components are already using the verified authentic brand asset. No placeholder or monogram text was present.

**Files:**
- `public/assets/brand/logo-fb.png` (VERIFIED): Identical to `dokumen informasi/A. Desain dan aset visual/LOGO FB.png` (6,689,943 bytes, 5016×5016).
- `src/app/icon.png` (CREATED): 512×512 square PNG with crisp metallic FB monogram and crimson reticle on `#050606`.
- `src/app/apple-icon.png` (CREATED): 180×180 PNG formatted for Apple devices.
- `src/app/favicon.ico` (CREATED): Multi-resolution Windows ICO.
- `public/favicon.ico` (CREATED): Root favicon fallback.
- `src/app/layout.tsx` (MODIFIED): Added explicit `icons` field to `metadata`.
- `PRD.md` §8.2, §15 (MODIFIED): Updated site logo entry to VERIFIED and recorded CR-006.
- `DESIGN.md` §9 (MODIFIED): Added site icons & favicon specifications to image table.

**Dependencies added:** none (`R-094` strictly respected; used zero runtime dependencies).

**Verification evidence:**
| Command / check | Result | Key output |
|---|---|---|
| `node -e "assert(fs.readFileSync('...').equals(...))"` | PASS | `Equal: true` (binary match to source) |
| `next build` static generation | PASS | Prerendered `○ /apple-icon.png`, `○ /icon.png` |
| HTTP GET `/icon.png` on production build | 200 OK | `type: image/png` |
| HTTP GET `/apple-icon.png` on production build | 200 OK | `type: image/png` |
| HTTP GET `/favicon.ico` on production build | 200 OK | `type: image/x-icon` |
| HTML `<head>` tags audit | PASS | `<link rel="icon" href="/favicon.ico" sizes="any"/>`, `<link rel="icon" href="/icon.png" type="image/png" sizes="512x512"/>`, `<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180"/>` |

**Acceptance criteria:**
- AC-1 ✔ — `LOGO FB.png` preserved intact at `public/assets/brand/logo-fb.png`.
- AC-2 ✔ — High quality non-distorted icons generated.
- AC-3 ✔ — Next.js metadata configured.
- AC-4 ✔ — Production build serves all icons with HTTP 200 and valid HTML link tags.
- AC-5 ✔ — Item 14 audit completed and recorded.

**Next task:** TASK-035 (CR-007)
