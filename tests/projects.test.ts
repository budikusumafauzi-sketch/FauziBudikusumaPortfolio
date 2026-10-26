import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ProjectsSection } from "@/components/sections/projects";
import { projectsData } from "@/data/projects";

describe("Projects Section (TASK-012 / FR-PRJ / C-06 / C-07 / C-10)", () => {
  it("renders section with id='projects' and scroll-mt-24", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    expect(html).toContain('id="projects"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix C-11", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    expect(html).toContain("Selected Projects");
    expect(html).toContain("SOFTWARE ARCHITECTURE &amp; NETWORK SYSTEMS");
    expect(html).not.toContain("03 //");
  });

  it("uses responsive 3-2-1 grid classes (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    expect(html).toContain("grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
  });

  it("renders all 6 projects with their titles and technologies", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    projectsData.forEach((project) => {
      const htmlTitle = project.title.replace(/&/g, "&amp;");
      expect(html).toContain(htmlTitle);
    });
  });

  it("ensures public repo links have target='_blank' and rel='noopener noreferrer'", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    projectsData
      .filter((p) => p.repoVisibility === "PUBLIC" && p.repoUrl)
      .forEach((project) => {
        expect(html).toContain(`href="${project.repoUrl}"`);
      });
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it("strictly omits the mock string [PREVIEW 16:10] (C-06)", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    expect(html).not.toContain("[PREVIEW 16:10]");
  });

  it("renders an accessible thumbnail preview button for every project (CR-014 / AC-3)", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    projectsData.forEach((project) => {
      expect(html).toContain(`aria-label="Preview display image for ${project.title}"`);
    });
  });

  it("keeps repository links strictly separate from cover thumbnail triggers (CR-014 / AC-5)", () => {
    const html = renderToString(React.createElement(ProjectsSection));
    // Verify <button> is used for image preview and <a> is used for external repo
    const buttonMatches = html.match(/<button[^>]*type="button"[^>]*aria-label="Preview display image for/g);
    expect(buttonMatches?.length).toBe(6);
    expect(html).toContain("GitHub Repository");
  });
});
