import { z } from "zod";
import { profileData } from "./profile";
import { journeyData } from "./journey";
import { skillsData } from "./skills";
import { projectsData } from "./projects";
import { certificationsData } from "./certifications";
import { galleryData } from "./gallery";
import { contactsData } from "./contacts";

export const KnowledgeCategorySchema = z.enum([
  "PROFILE",
  "EDUCATION",
  "EXPERIENCE",
  "SKILL",
  "PROJECT",
  "CERTIFICATION",
  "GALLERY",
  "CONTACT",
]);
export type KnowledgeCategory = z.infer<typeof KnowledgeCategorySchema>;

export const KnowledgeRecordInputSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z]+:[a-z0-9-]+$/, "ID must follow <category-lowercase>:<slug> format"),
    category: KnowledgeCategorySchema,
    title: z.string().min(1).max(160),
    body: z.string().min(1).max(2000),
    keywords: z
      .array(
        z
          .string()
          .min(2)
          .max(40)
          .regex(/^[a-z0-9+#.-]+$/, "Keyword must be lowercase alphanumeric with allowed tokens")
      )
      .max(20),
    url: z
      .string()
      .nullable()
      .refine(
        (val) => val === null || val.startsWith("https://") || val.startsWith("mailto:"),
        "URL must be https:// or mailto: or null"
      ),
    position: z.number().int().nonnegative(),
    source: z.string().min(1),
  })
  .refine(
    (data) => {
      const prefix = data.id.split(":")[0];
      return prefix === data.category.toLowerCase();
    },
    {
      message: "ID prefix must exactly equal the category in lowercase",
      path: ["id"],
    }
  );

export type KnowledgeRecordInput = z.infer<typeof KnowledgeRecordInputSchema>;

/**
 * Sanitizes and bounds keywords to meet SCHEMA.md constraints:
 * - lowercase, 2-40 chars
 * - [a-z0-9+#.-] characters
 * - deduplicated, max 20 items
 */
export function sanitizeKeywords(rawTokens: string[]): string[] {
  const seen = new Set<string>();
  const sanitized: string[] = [];

  for (const raw of rawTokens) {
    const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9+#.-]/g, "");
    if (cleaned.length >= 2 && cleaned.length <= 40 && !seen.has(cleaned)) {
      seen.add(cleaned);
      sanitized.push(cleaned);
      if (sanitized.length >= 20) break;
    }
  }
  return sanitized;
}

/**
 * Privacy lint to reject sensitive personal data patterns.
 */
export function assertPrivacySafe(record: KnowledgeRecordInput): void {
  const forbiddenPatterns = [
    /\b(nik|ktp|passport|sim)\b/i,
    /\b(password|secret|token|api[_-]?key)\b/i,
    /(?:\+?62|08)[0-9]{8,12}\b/,
    /\b(?:rt\s*\d+|rw\s*\d+|kelurahan|kecamatan)\b/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(record.body) || pattern.test(record.title)) {
      throw new Error(`Privacy lint error in record ${record.id}: matched forbidden pattern`);
    }
  }
}

export interface BuildKnowledgeInput {
  profile?: typeof profileData;
  journey?: typeof journeyData;
  skills?: typeof skillsData;
  projects?: typeof projectsData;
  certifications?: typeof certificationsData;
  gallery?: typeof galleryData;
  contacts?: typeof contactsData;
}

/**
 * Pure function deriving KnowledgeRecord inputs from verified content modules.
 * Strictly filters out DRAFT and NOT_PROVIDED items.
 */
export function buildKnowledgeRecords(inputs: BuildKnowledgeInput = {}): KnowledgeRecordInput[] {
  const profile = inputs.profile ?? profileData;
  const journey = inputs.journey ?? journeyData;
  const skills = inputs.skills ?? skillsData;
  const projects = inputs.projects ?? projectsData;
  const certifications = inputs.certifications ?? certificationsData;
  const gallery = inputs.gallery ?? galleryData;
  const contacts = inputs.contacts ?? contactsData;

  const records: KnowledgeRecordInput[] = [];

  // 1. Profile (PROFILE)
  if (profile.verification === "VERIFIED") {
    const keywords = sanitizeKeywords([
      "fauzi",
      "budikusuma",
      "profile",
      "about",
      "software",
      "network",
      "engineer",
      "informatics",
      "mikrotik",
      "yogyakarta",
      "amikom",
    ]);

    records.push({
      id: "profile:main",
      category: "PROFILE",
      title: `${profile.name} — ${profile.headline}`,
      body: `${profile.summary} Focus Areas: ${profile.focusAreas.join(", ")}. Location: ${profile.location}.`,
      keywords,
      url: null,
      position: 0,
      source: "profile",
    });
  }

  // 2. Journey (EDUCATION & EXPERIENCE)
  let eduPos = 0;
  let expPos = 0;
  for (const item of journey) {
    if (item.verification !== "VERIFIED") continue;

    const slug = item.id.replace(/^journey-/, "");
    const baseKeywords = [item.title, item.organization, ...(item.chips ?? [])];

    if (item.kind === "education") {
      records.push({
        id: `education:${slug}`,
        category: "EDUCATION",
        title: `${item.title} at ${item.organization}`,
        body: `${item.description} Period: ${item.period}.`,
        keywords: sanitizeKeywords(["education", "study", "degree", ...baseKeywords]),
        url: null,
        position: eduPos++,
        source: "journey",
      });
    } else {
      records.push({
        id: `experience:${slug}`,
        category: "EXPERIENCE",
        title: `${item.title} — ${item.organization}`,
        body: `${item.description} Period: ${item.period}.`,
        keywords: sanitizeKeywords(["experience", "work", "job", "career", ...baseKeywords]),
        url: null,
        position: expPos++,
        source: "journey",
      });
    }
  }

  // 3. Skills (SKILL) — Grouped by category per SCHEMA.md §4
  const verifiedSkills = skills.filter((s) => s.verification === "VERIFIED");
  const groupOrder = [
    "Languages",
    "Frontend",
    "Backend & API",
    "Database & Caching",
    "DevOps & Tools",
  ] as const;

  const groupSlugMap: Record<string, string> = {
    Languages: "languages",
    Frontend: "frontend",
    "Backend & API": "backend-api",
    "Database & Caching": "database-caching",
    "DevOps & Tools": "devops-tools",
  };

  groupOrder.forEach((groupName, idx) => {
    const groupItems = verifiedSkills.filter((s) => s.group === groupName);
    if (groupItems.length === 0) return;

    const skillNames = groupItems.map((s) => s.name);
    const slug = groupSlugMap[groupName] || groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    records.push({
      id: `skill:${slug}`,
      category: "SKILL",
      title: `${groupName} Skills`,
      body: `Verified technical competencies in ${groupName}: ${skillNames.join(", ")}.`,
      keywords: sanitizeKeywords(["skill", "stack", "technology", slug, ...skillNames]),
      url: null,
      position: idx,
      source: "skills",
    });
  });

  // 4. Projects (PROJECT)
  let projPos = 0;
  for (const project of projects) {
    if (project.verification !== "VERIFIED") continue;

    const slug = project.id.replace(/^project-/, "");
    const statusNote = project.status ? ` Status: ${project.status}.` : "";
    const licenseNote = project.license ? ` License: ${project.license}.` : "";

    records.push({
      id: `project:${slug}`,
      category: "PROJECT",
      title: project.title,
      body: `${project.summary}${statusNote}${licenseNote} Built with: ${project.technologies.join(", ")}.`,
      keywords: sanitizeKeywords(["project", "built", "repo", ...project.technologies, project.title]),
      url: project.repoUrl ?? project.demoUrl ?? null,
      position: projPos++,
      source: "projects",
    });
  }

  // 5. Certifications (CERTIFICATION)
  let certPos = 0;
  for (const cert of certifications) {
    if (cert.verification !== "VERIFIED") continue;

    const slug = cert.id.replace(/^cert-/, "");
    const desc = cert.description ? ` Details: ${cert.description}` : "";

    records.push({
      id: `certification:${slug}`,
      category: "CERTIFICATION",
      title: `${cert.title} (${cert.issuer})`,
      body: `Verified credential issued by ${cert.issuer}. ${cert.issuedLabel}. Category: ${cert.category}.${desc}`,
      keywords: sanitizeKeywords(["certification", "credential", "certificate", "verified", cert.issuer, cert.category, cert.title]),
      url: cert.credentialUrl ?? null,
      position: certPos++,
      source: "certifications",
    });
  }

  // 6. Gallery (GALLERY) — Only if VERIFIED
  let galPos = 0;
  for (const item of gallery) {
    if (item.verification !== "VERIFIED") continue;

    const slug = item.id.replace(/^gallery-/, "");
    records.push({
      id: `gallery:${slug}`,
      category: "GALLERY",
      title: item.title,
      body: item.caption,
      keywords: sanitizeKeywords(["gallery", "documentation", item.title]),
      url: null,
      position: galPos++,
      source: "gallery",
    });
  }

  // 7. Contacts (CONTACT) — Only if VERIFIED and approvedForPublic
  let contactPos = 0;
  for (const contact of contacts) {
    if (contact.verification !== "VERIFIED" || !contact.approvedForPublic) continue;

    const slug = contact.type;
    records.push({
      id: `contact:${slug}`,
      category: "CONTACT",
      title: `Direct Channel: ${contact.label}`,
      body: `Fauzi Budikusuma's approved contact channel via ${contact.label}: ${contact.displayText}.`,
      keywords: sanitizeKeywords(["contact", "channel", "reach", "hire", contact.type, contact.label]),
      url: contact.href,
      position: contactPos++,
      source: "contacts",
    });
  }

  // Validate every record with Zod and privacy assertion
  for (const record of records) {
    KnowledgeRecordInputSchema.parse(record);
    assertPrivacySafe(record);
  }

  return records;
}
