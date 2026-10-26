import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
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

  it("includes touch-pan-y for non-blocking vertical scrolling", () => {
    const html = renderToString(React.createElement(DocumentationSection));
    expect(html).toContain("touch-pan-y");
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
});
