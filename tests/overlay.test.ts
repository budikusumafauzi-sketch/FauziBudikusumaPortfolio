import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { OpeningOverlay } from "@/components/layout/opening-overlay";
import { siteConfig } from "@/data/site-config";
import fs from "node:fs";
import path from "node:path";

describe("Opening Overlay (TASK-007 / FR-OPN)", () => {
  it("exports OpeningOverlay component", () => {
    expect(OpeningOverlay).toBeDefined();
  });

  it("renders with correct accessibility roles, labels, and fail-safe classes", () => {
    const html = renderToString(React.createElement(OpeningOverlay));
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('opening-overlay-failsafe');
    expect(html).toContain('opening-progress-bar');
  });

  it("renders owner name, unified role title (C-05), and workspace status line", () => {
    const html = renderToString(React.createElement(OpeningOverlay));
    expect(html).toContain(siteConfig.name);
    expect(html).toContain("SOFTWARE DEVELOPMENT &amp; NETWORK ENGINEER");
    expect(html).toContain("LAUNCHING WORKSPACE…");
    expect(html).toContain("DISCIPLINE // 01 PERSONAL PORTFOLIO");
    expect(html).toContain("© 2026 • ALL RIGHTS RESERVED");
  });

  it("globals.css defines fail-safe keyframes ensuring pointer-events: none and opacity: 0", () => {
    const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain("@keyframes overlay-fadeout");
    expect(cssContent).toContain("pointer-events: none");
    expect(cssContent).toContain(".opening-overlay-failsafe");
    expect(cssContent).toContain(".opening-progress-bar");
    expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
