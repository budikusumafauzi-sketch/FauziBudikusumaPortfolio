import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import { DocumentationSection } from "@/components/sections/documentation";
import { galleryData } from "@/data/gallery";

describe("Field Documentation Section", () => {
  it("renders section element with id='documentation' and scroll margin", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain('id="documentation"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix (C-11)", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain("Field Documentation");
    expect(html).not.toMatch(/0[0-9]\s*\/\//);
  });

  it("renders all 6 gallery items with clean titles and omits FIELD LOG bracket index and card captions", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(galleryData.length).toBe(6);

    for (const item of galleryData) {
      const escapedTitle = item.title.replace(/&/g, "&amp;");
      expect(html).toContain(escapedTitle);
      if (item.caption) {
        const escapedCaption = item.caption.replace(/&/g, "&amp;");
        expect(html).not.toContain(escapedCaption);
      }
    }
    expect(html).not.toContain("FIELD LOG");
  });

  it("includes touch-pan-y and touch-pan-x for non-blocking vertical scrolling and horizontal swipe", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain("touch-pan-y");
    expect(html).toContain("touch-pan-x");
  });

  it("provides accessible navigation arrow controls in the header", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain('aria-label="Previous documentation item"');
    expect(html).toContain('aria-label="Next documentation item"');
  });

  it("renders accessible button triggers for all 6 documentation photo cards (CR-015 / AC-3)", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    for (const item of galleryData) {
      const escapedTitle = item.title.replace(/&/g, "&amp;");
      expect(html).toContain(`aria-label="Preview field photo for ${escapedTitle}"`);
    }
    const buttonMatches = html.match(/<button[^>]*type="button"[^>]*aria-label="Preview field photo for/g);
    expect(buttonMatches?.length).toBe(6);
  });

  it("configures natural scroll container with CSS scroll snap, touchpad slide, and hidden scrollbars", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("overscroll-x-contain");
    expect(html).toContain("snap-x");
    expect(html).toContain("snap-mandatory");
    expect(html).toContain("[scrollbar-width:none]");
    expect(html).toContain("[-ms-overflow-style:none]");
    expect(html).toContain("[&amp;::-webkit-scrollbar]:hidden");
  });

  it("verifies touch gestures do not invoke setPointerCapture and mouse drag requires > 6px threshold", () => {
    const filePath = path.resolve(process.cwd(), "src/components/sections/documentation.tsx");
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
    const filePath = path.resolve(process.cwd(), "src/components/sections/documentation.tsx");
    const code = fs.readFileSync(filePath, "utf-8");

    expect(code).toContain("deltaX > 6 || deltaY > 6 || deltaScroll > 6");
    expect(code).toContain("didSwipeRef.current = true");
    // Keyboard accessibility for modal activation
    expect(code).toContain('e.key === "Enter" || e.key === " "');
  });
});
