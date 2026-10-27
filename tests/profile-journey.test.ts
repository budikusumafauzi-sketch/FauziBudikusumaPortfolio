import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ProfileJourneySection } from "@/components/sections/profile-journey";
import { journeyData } from "@/data/journey";
import { profileData } from "@/data/profile";

describe("Profile & Journey Section (TASK-010 / FR-ABT)", () => {
  it("renders section with id='profile' and scroll-mt-24", () => {
    const html = renderToString(React.createElement(ProfileJourneySection));
    expect(html).toContain('id="profile"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader with correct title and descriptor without numeric prefix C-11", () => {
    const html = renderToString(React.createElement(ProfileJourneySection));
    expect(html).toContain("Profile &amp; Journey");
    expect(html).toContain("BACKGROUND &amp; EXPERTISE");
    expect(html).not.toContain("01 //");
  });

  it("renders all journey items from journeyData", () => {
    const html = renderToString(React.createElement(ProfileJourneySection));
    journeyData.forEach((item) => {
      const htmlTitle = item.title.replace(/&/g, "&amp;");
      const htmlOrg = item.organization.replace(/&/g, "&amp;");
      expect(html).toContain(htmlTitle);
      expect(html).toContain(htmlOrg);
      expect(html).toContain(item.period);
    });
  });

  it("displays engineering foundations summary and operational principles", () => {
    const html = renderToString(React.createElement(ProfileJourneySection));
    expect(html).toContain("Engineering Foundations");
    expect(html).toContain("OPERATIONAL PRINCIPLES:");
    expect(html).toContain(profileData.location);
  });

  it("renders Chronological Journey card header with responsive stacked mobile classes", () => {
    const html = renderToString(React.createElement(ProfileJourneySection));
    expect(html).toContain("Chronological Journey");
    expect(html).toContain("EDUCATION &amp; EXPERIENCE TIMELINE");
    // Verify responsive stacking on mobile (< 640px) and row on sm+
    expect(html).toContain("flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6");
  });
});
