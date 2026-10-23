import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import HomePage from "@/app/page";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { siteConfig } from "@/data/site-config";
import { profileData } from "@/data/profile";
import { certificationsData } from "@/data/certifications";
import { galleryData } from "@/data/gallery";
import { projectsData } from "@/data/projects";

describe("Phase 3 Full Static Portfolio QA Integration Sweep", () => {
  const fullPageHtml = renderToString(
    React.createElement(
      ThemeProvider,
      { attribute: "class", defaultTheme: "system", enableSystem: true },
      React.createElement(Navbar),
      React.createElement(HomePage),
      React.createElement(Footer)
    )
  );

  it("renders all 5 navbar anchor target sections with proper scroll-mt offset", () => {
    const requiredSections = [
      "profile",
      "projects",
      "credentials",
      "documentation",
      "contact",
    ];

    for (const sectionId of requiredSections) {
      expect(fullPageHtml).toContain(`id="${sectionId}"`);
      // Ensure the section element carries the scroll-margin offset class
      const sectionMatch = new RegExp(`<section[^>]*id="${sectionId}"[^>]*class="[^"]*scroll-mt-24`);
      expect(fullPageHtml).toMatch(sectionMatch);
    }
  });

  it("enforces single <h1> on the entire home page with proper heading hierarchy", () => {
    const h1Matches = fullPageHtml.match(/<h1[^>]*>/g);
    expect(h1Matches).not.toBeNull();
    expect(h1Matches?.length).toBe(1);
    expect(fullPageHtml).toContain(siteConfig.name);
  });

  it("preserves unified role headline across Hero and Footer (C-05)", () => {
    expect(fullPageHtml).toContain("SOFTWARE DEVELOPMENT &amp; NETWORK ENGINEER");
  });

  it("enforces SectionHeader without numeric prefixes across all sections (C-11)", () => {
    // Assert no occurrences of 01 //, 02 //, etc. in section headings
    expect(fullPageHtml).not.toMatch(/<h2[^>]*>\s*0[0-9]\s*\/\//);
  });

  it("omits mockup string [PREVIEW 16:10] and fake verification hashes (C-03, C-06)", () => {
    expect(fullPageHtml).not.toContain("[PREVIEW 16:10]");
    expect(fullPageHtml).not.toContain("SHA-256");
    expect(fullPageHtml).not.toContain("HASH VERIFIED");
  });

  it("ensures all referenced public assets physically exist on disk", () => {
    const publicDir = path.join(process.cwd(), "public");

    // Profile portrait & logo
    expect(fs.existsSync(path.join(publicDir, profileData.portraitPath))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, "assets/brand/logo-fb.png"))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, siteConfig.cvPath))).toBe(true);

    // Certificates
    for (const cert of certificationsData) {
      expect(fs.existsSync(path.join(publicDir, cert.imagePath))).toBe(true);
    }

    // Projects
    for (const project of projectsData) {
      expect(fs.existsSync(path.join(publicDir, project.coverPath))).toBe(true);
    }

    // Gallery
    for (const item of galleryData) {
      expect(fs.existsSync(path.join(publicDir, item.imagePath))).toBe(true);
    }
  });

  it("strictly enforces Static Resilience: zero DB or Gemini API dependencies in client/page bundles", () => {
    const srcDir = path.join(process.cwd(), "src");

    function scanFiles(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        // Exclude server-only directories from client/page bundle checks
        if (fullPath.includes(path.join("src", "lib", "server")) || fullPath.includes(path.join("src", "app", "api"))) {
          continue;
        }
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(scanFiles(fullPath));
        } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const clientPageFiles = scanFiles(srcDir);
    const forbiddenPatterns = [
      "@prisma/client",
      "@google/genai",
      "process.env.DATABASE_URL",
      "process.env.GEMINI_API_KEY",
    ];

    for (const file of clientPageFiles) {
      const content = fs.readFileSync(file, "utf-8");
      for (const pattern of forbiddenPatterns) {
        expect(content).not.toContain(pattern);
      }
    }
  });
});
