import { describe, it, expect } from "vitest";
import {
  buildKnowledgeRecords,
  KnowledgeRecordInputSchema,
  assertPrivacySafe,
  KnowledgeRecordInput,
} from "../src/data/chatbot-knowledge";
import { projectsData } from "../src/data/projects";
import { galleryData } from "../src/data/gallery";

describe("Deterministic KnowledgeRecord Builder (TASK-018)", () => {
  it("builds deterministic records with identical count and payload across repeated runs", () => {
    const run1 = buildKnowledgeRecords();
    const run2 = buildKnowledgeRecords();

    expect(run1.length).toBeGreaterThan(0);
    expect(run1).toEqual(run2);
    expect(run1.length).toBe(36); // 3 profile + 3 journey + 6 skills + 6 projects + 7 certs + 6 gallery (VERIFIED) + 5 contacts
  });

  it("strictly enforces unique IDs across all generated records", () => {
    const records = buildKnowledgeRecords();
    const ids = records.map((r) => r.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it("strictly enforces ID prefix rule: id must match <category-lowercase>:<slug>", () => {
    const records = buildKnowledgeRecords();

    for (const record of records) {
      const [prefix, slug] = record.id.split(":");
      expect(prefix).toBe(record.category.toLowerCase());
      expect(slug).toBeDefined();
      expect(slug.length).toBeGreaterThan(0);
      expect(/^[a-z0-9-]+$/.test(slug)).toBe(true);
    }
  });

  it("enforces keyword bounds and sanitization (2-40 chars, max 20 items, lowercase tokens)", () => {
    const records = buildKnowledgeRecords();

    for (const record of records) {
      expect(record.keywords.length).toBeLessThanOrEqual(20);
      for (const kw of record.keywords) {
        expect(kw.length).toBeGreaterThanOrEqual(2);
        expect(kw.length).toBeLessThanOrEqual(40);
        expect(/^[a-z0-9+#.-]+$/.test(kw)).toBe(true);
      }
    }
  });

  it("strictly excludes DRAFT and NOT_PROVIDED items from the knowledge corpus", () => {
    // Current gallery data is all VERIFIED in production
    expect(galleryData.every((g) => g.verification === "VERIFIED")).toBe(true);

    const records = buildKnowledgeRecords();
    const galleryRecords = records.filter((r) => r.category === "GALLERY");
    expect(galleryRecords.length).toBe(6);

    // If an item in gallery is marked DRAFT, it must not be included
    const mockGallery = [
      ...galleryData,
      {
        ...galleryData[0],
        id: "gallery-draft-test",
        verification: "DRAFT" as const,
      },
    ];
    const recordsWithDraftGallery = buildKnowledgeRecords({ gallery: mockGallery });
    expect(recordsWithDraftGallery.some((r) => r.id === "gallery:gallery-draft-test")).toBe(false);

    // If an item in projects is marked DRAFT, it must not be included
    const mockProjects = [
      ...projectsData,
      {
        ...projectsData[0],
        id: "project-draft-test",
        verification: "DRAFT" as const,
      },
    ];

    const recordsWithDraft = buildKnowledgeRecords({ projects: mockProjects });
    expect(recordsWithDraft.some((r) => r.id === "project:draft-test")).toBe(false);
  });

  it("rejects malformed records via KnowledgeRecordInputSchema", () => {
    const invalidRecord = {
      id: "project:invalid_slug_with_UPPERCASE",
      category: "PROJECT",
      title: "Invalid Project",
      body: "Some body",
      keywords: ["ok"],
      url: "ftp://invalid-scheme.com",
      position: -1,
      source: "projects",
    };

    expect(() => KnowledgeRecordInputSchema.parse(invalidRecord)).toThrow();
  });

  it("rejects category prefix mismatch in ID", () => {
    const mismatchedRecord = {
      id: "skill:main",
      category: "PROFILE" as const,
      title: "Fauzi",
      body: "Profile summary text",
      keywords: ["fauzi"],
      url: null,
      position: 0,
      source: "profile",
    };

    expect(() => KnowledgeRecordInputSchema.parse(mismatchedRecord)).toThrow();
  });

  it("assertPrivacySafe throws on forbidden private patterns", () => {
    const leakedPhoneRecord: KnowledgeRecordInput = {
      id: "contact:leaked",
      category: "CONTACT",
      title: "Direct Phone",
      body: "Call Fauzi at 081234567890 for direct inquiries",
      keywords: ["phone", "contact"],
      url: null,
      position: 0,
      source: "contacts",
    };

    expect(() => assertPrivacySafe(leakedPhoneRecord)).toThrow(/Privacy lint error/);

    const leakedTokenRecord: KnowledgeRecordInput = {
      id: "profile:secret",
      category: "PROFILE",
      title: "Profile info",
      body: "Contains secret api_key in text",
      keywords: ["profile"],
      url: null,
      position: 0,
      source: "profile",
    };

    expect(() => assertPrivacySafe(leakedTokenRecord)).toThrow(/Privacy lint error/);
  });
});
