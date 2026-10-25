import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  profileData,
  journeyData,
  skillsData,
  projectsData,
  certificationsData,
  galleryData,
  contactsData,
  siteConfig,
  ProfileSchema,
  JourneyItemSchema,
  SkillItemSchema,
  ProjectItemSchema,
  CertificationItemSchema,
  GalleryItemSchema,
  ContactItemSchema,
} from "@/data";

describe("Typed Content Modules & Zod Validation (TASK-008)", () => {
  it("validates profileData against ProfileSchema", () => {
    expect(() => ProfileSchema.parse(profileData)).not.toThrow();
    expect(profileData.name).toBe("FAUZI BUDIKUSUMA");
    expect(profileData.headline).toBe("SOFTWARE DEVELOPMENT & NETWORK ENGINEER");
    expect(profileData.verification).toBe("VERIFIED");
  });

  it("validates all journeyData items with sequential positions and valid kinds", () => {
    expect(journeyData.length).toBeGreaterThanOrEqual(3);
    const ids = new Set<string>();
    journeyData.forEach((item, index) => {
      expect(() => JourneyItemSchema.parse(item)).not.toThrow();
      expect(item.position).toBe(index);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    });
  });

  it("validates all 34 skills with valid CDN URLs and groups", () => {
    expect(skillsData.length).toBe(34);
    const ids = new Set<string>();
    skillsData.forEach((skill) => {
      expect(() => SkillItemSchema.parse(skill)).not.toThrow();
      expect(skill.iconUrl).toMatch(/^https:\/\//);
      expect(ids.has(skill.id)).toBe(false);
      ids.add(skill.id);
    });
  });

  it("validates 6 projects with valid GitHub URLs and cover SVGs", () => {
    expect(projectsData.length).toBe(6);
    projectsData.forEach((project) => {
      expect(() => ProjectItemSchema.parse(project)).not.toThrow();
      expect(project.coverPath).toMatch(/^\/assets\/projects\//);
      expect(project.repoUrl).toMatch(/^https:\/\/github.com\//);
    });
  });

  it("validates all 7 certificates and confirms scan images exist on disk", () => {
    expect(certificationsData.length).toBe(7);
    certificationsData.forEach((cert) => {
      expect(() => CertificationItemSchema.parse(cert)).not.toThrow();
      const diskPath = path.resolve(process.cwd(), "public" + cert.imagePath);
      expect(fs.existsSync(diskPath)).toBe(true);
    });
  });

  it("validates all gallery items and confirms modular placeholders exist on disk", () => {
    expect(galleryData.length).toBe(6);
    galleryData.forEach((item) => {
      expect(() => GalleryItemSchema.parse(item)).not.toThrow();
      const diskPath = path.resolve(process.cwd(), "public" + item.imagePath);
      expect(fs.existsSync(diskPath)).toBe(true);
      expect(item.verification).toBe("DRAFT");
    });
  });

  it("validates contact channels and confirms safe URL schemes", () => {
    expect(contactsData.length).toBe(5);
    contactsData.forEach((contact) => {
      expect(() => ContactItemSchema.parse(contact)).not.toThrow();
      if (contact.type === "email") {
        expect(contact.href).toMatch(/^https:\/\/mail\.google\.com\/mail\/\?view=cm/);
      } else {
        expect(contact.href).toMatch(/^https:\/\//);
      }
    });
  });

  it("confirms site-config CV placeholder file exists on disk", () => {
    const cvDiskPath = path.resolve(process.cwd(), "public" + siteConfig.cvPath);
    expect(fs.existsSync(cvDiskPath)).toBe(true);
  });

  it("rejects invalid items (negative tests)", () => {
    // Malformed ID
    expect(() =>
      JourneyItemSchema.parse({
        id: "INVALID_UPPERCASE_ID",
        verification: "VERIFIED",
        position: 0,
        kind: "education",
        title: "Test Title",
        organization: "Test Org",
        period: "2024",
        description: "Valid description text here.",
      })
    ).toThrow();

    // Invalid URL protocol
    expect(() =>
      ContactItemSchema.parse({
        id: "contact-invalid",
        verification: "VERIFIED",
        position: 0,
        type: "email",
        label: "Invalid",
        displayText: "test",
        href: "javascript:alert(1)",
        approvedForPublic: false,
      })
    ).toThrow();
  });

  it("ensures no mock strings from DESIGN.md §12 exist in any content module", () => {
    const serialized = JSON.stringify({
      profileData,
      journeyData,
      skillsData,
      projectsData,
      certificationsData,
      galleryData,
      contactsData,
    });

    expect(serialized).not.toContain("[PREVIEW 16:10]");
    expect(serialized).not.toContain("SHA-256 HASH VERIFIED");
    expect(serialized).not.toContain("Lorem ipsum");
  });
});
