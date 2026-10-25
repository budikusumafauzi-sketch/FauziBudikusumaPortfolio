import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { SkillsSection } from "@/components/sections/skills";
import { skillsData } from "@/data/skills";
import fs from "node:fs";
import path from "node:path";

describe("Skills Section & Marquee (TASK-011 / FR-SKL / C-04)", () => {
  it("renders section with id='skills' and scroll-mt-24", () => {
    const html = renderToString(React.createElement(SkillsSection));
    expect(html).toContain('id="skills"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix C-11", () => {
    const html = renderToString(React.createElement(SkillsSection));
    expect(html).toContain("Technical Stack");
    expect(html).toContain("LANGUAGES, FRAMEWORKS &amp; INFRASTRUCTURE");
    expect(html).not.toContain("02 //");
  });

  it("contains an accessible screen-reader list with all 35 skills including Next.js (CR-008)", () => {
    const html = renderToString(React.createElement(SkillsSection));
    expect(skillsData.length).toBe(35);
    expect(html).toContain('class="sr-only"');
    skillsData.forEach((skill) => {
      expect(html).toContain(skill.name);
    });
    expect(html).toContain("Next.js");
    expect(html).toContain('src="/assets/skills/nextjs.svg"');
    expect(html).toContain("dark:invert");
  });

  it("marks duplicated track with aria-hidden='true' for seamless infinite loop without duplicate a11y announcements", () => {
    const html = renderToString(React.createElement(SkillsSection));
    expect(html).toContain('skills-marquee-duplicate');
    expect(html).toContain('aria-hidden="true"');
  });

  it("globals.css defines marquee keyframes and reduced-motion fallback", () => {
    const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toContain("@keyframes marquee");
    expect(css).toContain(".skills-marquee-track");
    expect(css).toContain("animation-play-state: paused");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".skills-marquee-duplicate");
  });
});
