import { describe, it, expect } from "vitest";
import { siteConfig } from "@/data/site-config";
import { Navbar } from "@/components/layout/navbar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

describe("Navigation & Site Config (TASK-006 / C-02)", () => {
  it("exports Navbar and ThemeToggle components", () => {
    expect(Navbar).toBeDefined();
    expect(ThemeToggle).toBeDefined();
  });

  it("strictly defines the approved navigation links starting with Overview (CR-002)", () => {
    const expectedLabels = [
      "Overview",
      "Profile & Journey",
      "Projects",
      "Credentials",
      "Documentation",
      "Contact",
    ];

    expect(siteConfig.navItems.map((item) => item.label)).toEqual(expectedLabels);

    const expectedHrefs = [
      "#home",
      "#profile",
      "#projects",
      "#credentials",
      "#documentation",
      "#contact",
    ];

    expect(siteConfig.navItems.map((item) => item.href)).toEqual(expectedHrefs);
  });

  it("contains no CV download button in navbar data (CV belongs in Hero per C-02)", () => {
    const hasCv = siteConfig.navItems.some((item) =>
      item.label.toLowerCase().includes("cv")
    );
    expect(hasCv).toBe(false);
  });
});
