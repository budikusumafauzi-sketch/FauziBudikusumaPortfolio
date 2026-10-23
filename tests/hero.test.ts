import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { HeroSection } from "@/components/sections/hero";
import { profileData } from "@/data/profile";
import { siteConfig } from "@/data/site-config";

describe("Hero Section (TASK-009 / FR-HRO / FR-CV)", () => {
  it("renders a single <h1> heading with the owner's full name", () => {
    const html = renderToString(React.createElement(HeroSection));
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g);
    expect(h1Matches).not.toBeNull();
    expect(h1Matches?.length).toBe(1);
    expect(html).toContain(profileData.name);
  });

  it("renders the unified role headline per C-05", () => {
    const html = renderToString(React.createElement(HeroSection));
    expect(html).toContain("SOFTWARE DEVELOPMENT &amp; NETWORK ENGINEER");
  });

  it("renders CTAs linking to #projects, CV download, and #contact", () => {
    const html = renderToString(React.createElement(HeroSection));
    expect(html).toContain('href="#projects"');
    expect(html).toContain(`href="${siteConfig.cvPath}"`);
    expect(html).toContain(`download="${siteConfig.cvDownloadName}"`);
    expect(html).toContain('href="#contact"');
  });

  it("renders portrait with proper alt text", () => {
    const html = renderToString(React.createElement(HeroSection));
    expect(html).toContain('alt="Fauzi Budikusuma — Formal Portrait"');
  });
});
