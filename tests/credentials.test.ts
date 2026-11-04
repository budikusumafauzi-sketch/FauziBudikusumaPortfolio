import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import { CredentialsSection } from "@/components/sections/credentials";
import { certificationsData } from "@/data/certifications";

describe("Credentials Section", () => {
  it("renders section element with id='credentials' and scroll margin", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain('id="credentials"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix (C-11)", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain("Credentials &amp; Certifications");
    expect(html).not.toMatch(/0[0-9]\s*\/\//);
  });

  it("renders all 7 verified certificates from certificationsData", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(certificationsData.length).toBe(7);

    for (const cert of certificationsData) {
      expect(html).toContain(cert.title);
      expect(html).toContain(cert.issuer);
    }
  });

  it("provides accessible carousel arrow controls in the header", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain('aria-label="Previous certificate"');
    expect(html).toContain('aria-label="Next certificate"');
  });

  it("omits fake verification text or SHA-256 hashes (C-03)", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).not.toContain("SHA-256");
    expect(html).not.toContain("HASH VERIFIED");
    expect(html).not.toContain("0x7f");
  });

  it("configures natural scroll container with CSS scroll snap, touchpad slide, and hidden scrollbars", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("overscroll-x-contain");
    expect(html).toContain("snap-x");
    expect(html).toContain("snap-mandatory");
    expect(html).toContain("[scrollbar-width:none]");
    expect(html).toContain("[-ms-overflow-style:none]");
    expect(html).toContain("[&amp;::-webkit-scrollbar]:hidden");
    expect(html).toContain("touch-pan-x");
    expect(html).toContain("touch-pan-y");
  });

  it("verifies touch gestures do not invoke setPointerCapture and mouse drag requires > 6px threshold", () => {
    const filePath = path.resolve(process.cwd(), "src/components/sections/credentials.tsx");
    const code = fs.readFileSync(filePath, "utf-8");

    // Touch bypasses pointer capture to preserve native mobile inertia
    expect(code).toContain('if (e.pointerType === "touch") return;');
    // Mouse drag threshold check
    expect(code).toContain("Math.abs(deltaX) > 6");
    expect(code).toContain("setPointerCapture");
    // Draggable false on images
    expect(code).toContain("draggable={false}");
  });

  it("guards against misfire: swipe movement or scroll displacement > 6px cancels lightbox opening", () => {
    const filePath = path.resolve(process.cwd(), "src/components/sections/credentials.tsx");
    const code = fs.readFileSync(filePath, "utf-8");

    expect(code).toContain("deltaX > 6 || deltaY > 6 || deltaScroll > 6");
    expect(code).toContain("didSwipeRef.current = true");
    // Keyboard accessibility for modal activation
    expect(code).toContain('e.key === "Enter" || e.key === " "');
  });
});
