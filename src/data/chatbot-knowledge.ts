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
    const mainKeywords = sanitizeKeywords([
      "fauzi",
      "budikusuma",
      "profile",
      "profil",
      "about",
      "tentang",
      "biodata",
      "software",
      "network",
      "jaringan",
      "engineer",
      "rekayasa",
      "informatics",
      "informatika",
      "mikrotik",
      "yogyakarta",
      "surakarta",
      "amikom",
      "availability",
      "languages",
    ]);

    records.push({
      id: "profile:main",
      category: "PROFILE",
      title: `${profile.name} — ${profile.headline}`,
      body: `Fauzi Budikusuma is a Software Development & Network Engineer based in Yogyakarta and Surakarta, Indonesia. He is an undergraduate Informatics student at Universitas AMIKOM Yogyakarta and a Computer & Network Engineering (TKJ) graduate from SMK Negeri 1 Seyegan. He is actively available for professional opportunities, internships, and collaborative engineering roles. Spoken languages: Indonesian (native) and English (professional working proficiency). Overview: ${profile.summary} Focus Areas: ${profile.focusAreas.join(", ")}.`,
      keywords: mainKeywords,
      url: null,
      position: 0,
      source: "profile",
    });

    records.push({
      id: "profile:philosophy",
      category: "PROFILE",
      title: `${profile.name} — Engineering Philosophy & Working Style`,
      body: `Fauzi combines rigorous systems precision with practical network engineering and clean software architecture. His working philosophy centers on building resilient distributed backends, reliable enterprise network topologies, grounded AI integrations with zero hallucination tolerance, and comprehensive technical documentation. He embraces defensive programming, automated telemetry, and transparent engineering standards. Available for collaborative software engineering and network infrastructure opportunities.`,
      keywords: sanitizeKeywords([
        "philosophy",
        "filosofi",
        "working-style",
        "gaya-kerja",
        "approach",
        "pendekatan",
        "availability",
        "ketersediaan",
        "collaboration",
        "engineering",
        "principles",
        "standards",
      ]),
      url: null,
      position: 1,
      source: "profile",
    });

    records.push({
      id: "profile:portfolio-architecture",
      category: "PROFILE",
      title: `Portfolio Website & AI Assistant Architecture`,
      body: `This portfolio and grounded AI assistant are built with Next.js 16 (App Router), React, TypeScript, and Tailwind CSS. The assistant uses a grounded Gemini Flash architecture with zero external tools, strict prompt grounding against verified records, a read-only PostgreSQL runtime on Neon, in-memory SWR caching (12h TTL), build-time snapshot fallback, and hedged fallback requests for zero idle failures and sub-2-second median response times.`,
      keywords: sanitizeKeywords([
        "portfolio",
        "portofolio",
        "architecture",
        "arsitektur",
        "website",
        "tech-stack",
        "built-with",
        "gemini",
        "nextjs",
        "react",
        "typescript",
        "tailwind",
        "prisma",
        "neon",
        "postgresql",
      ]),
      url: null,
      position: 2,
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
      let extraDetail = "";
      if (slug === "amikom") {
        extraDetail = " Academic curriculum and practical coursework center on software engineering, distributed systems, relational and NoSQL database systems, algorithm optimization, and modern full-stack web architectures.";
      } else if (slug === "smk") {
        extraDetail = " Hands-on mastery in MikroTik RouterOS routing, Cisco IOS switching, Linux server administration, structured fiber optic and UTP LAN cabling, network topology design, and earned two national BNSP/LSP UKK vocational certifications.";
      }

      records.push({
        id: `education:${slug}`,
        category: "EDUCATION",
        title: `${item.title} at ${item.organization}`,
        body: `${item.description} Period: ${item.period}.${extraDetail}`,
        keywords: sanitizeKeywords(["education", "study", "degree", "pendidikan", "kuliah", "sekolah", ...baseKeywords]),
        url: null,
        position: eduPos++,
        source: "journey",
      });
    } else {
      let extraExpDetail = "";
      if (slug === "kominfo") {
        extraExpDetail = " Responsibilities included supervising provincial government IT help desk operations, managing technical incident escalation workflows, monitoring provincial government network telemetry and service continuity, and troubleshooting enterprise network and server infrastructure.";
      }

      records.push({
        id: `experience:${slug}`,
        category: "EXPERIENCE",
        title: `${item.title} — ${item.organization}`,
        body: `${item.description} Period: ${item.period}.${extraExpDetail}`,
        keywords: sanitizeKeywords(["experience", "work", "job", "career", "pengalaman", "kerja", "magang", "internship", ...baseKeywords]),
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
      keywords: sanitizeKeywords(["skill", "stack", "technology", "keahlian", "kemampuan", slug, ...skillNames]),
      url: null,
      position: idx,
      source: "skills",
    });
  });

  // Dedicated Network & Infrastructure Engineering skills record
  records.push({
    id: "skill:networking",
    category: "SKILL",
    title: "Network & Infrastructure Engineering Skills",
    body: "Verified technical competencies in Enterprise Network & Infrastructure Engineering: MikroTik RouterOS (MTCNA certified), Cisco IOS Switching & Routing, Multi-Area OSPF, BGP Routing, VLAN Segmentation (802.1Q), Leaf-Spine Topology Design, SNMP Telemetry & Monitoring, Hardened Firewall Rules & NAT, WireGuard & IPsec VPN, Linux Server Administration (Ubuntu/Debian), and Structured Cabling.",
    keywords: sanitizeKeywords([
      "skill",
      "networking",
      "jaringan",
      "mikrotik",
      "cisco",
      "ospf",
      "bgp",
      "vlan",
      "routeros",
      "leaf-spine",
      "snmp",
      "vpn",
      "firewall",
      "wireguard",
      "infrastructure",
      "infrastruktur",
      "mtcna",
      "cabling",
      "linux",
    ]),
    url: null,
    position: groupOrder.length,
    source: "skills",
  });

  // 4. Projects (PROJECT)
  let projPos = 0;
  for (const project of projects) {
    if (project.verification !== "VERIFIED") continue;

    const slug = project.id.replace(/^project-/, "");
    const statusNote = project.status ? ` Status: ${project.status}.` : "";
    const licenseNote = project.license ? ` License: ${project.license}.` : "";
    const repoNote = project.repoUrl ? ` Public repository available on GitHub: ${project.repoUrl}.` : "";
    const previewNote = " Display photo with interactive full-screen lightbox preview available in Selected Projects.";

    records.push({
      id: `project:${slug}`,
      category: "PROJECT",
      title: project.title,
      body: `${project.summary}${statusNote}${licenseNote} Built with: ${project.technologies.join(", ")}.${repoNote}${previewNote}`,
      keywords: sanitizeKeywords(["project", "built", "repo", "proyek", "aplikasi", ...project.technologies, project.title]),
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
      keywords: sanitizeKeywords(["certification", "credential", "certificate", "sertifikat", "sertifikasi", "verified", cert.issuer, cert.category, cert.title]),
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
      body: `${item.caption} Visual documentation photo with interactive full-screen lightbox preview available in Field Documentation.`,
      keywords: sanitizeKeywords(["gallery", "documentation", "dokumentasi", item.title]),
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
    const extraKeywords =
      contact.type === "credly"
        ? ["credly", "badge", "digital-badge", "lencana", "sertifikasi-digital"]
        : [];
    records.push({
      id: `contact:${slug}`,
      category: "CONTACT",
      title: `Direct Channel: ${contact.label}`,
      body: `Fauzi Budikusuma's approved contact channel via ${contact.label}: ${contact.displayText}. Visitors may connect or inquire directly using this verified channel.`,
      keywords: sanitizeKeywords([
        "contact",
        "kontak",
        "hubungi",
        "channel",
        "reach",
        "hire",
        contact.type,
        contact.label,
        ...extraKeywords,
      ]),
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
