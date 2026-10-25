import { z } from "zod";

export const VerificationStateSchema = z.enum(["VERIFIED", "DRAFT", "NOT_PROVIDED"]);
export type VerificationState = z.infer<typeof VerificationStateSchema>;

export const BaseItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be kebab-case alphanumeric"),
  verification: VerificationStateSchema,
  position: z.number().int().nonnegative(),
});

// Profile Schema
export const ProfileSchema = BaseItemSchema.extend({
  name: z.string().min(2).max(100),
  headline: z.string().min(5).max(150),
  summary: z.string().min(10).max(1000),
  focusAreas: z.array(z.string().min(2).max(100)).min(1),
  location: z.string().min(2).max(100),
  portraitPath: z.string().startsWith("/"),
});
export type ProfileData = z.infer<typeof ProfileSchema>;

// Journey Schema
export const JourneyItemSchema = BaseItemSchema.extend({
  kind: z.enum(["education", "experience", "organization", "learning"]),
  title: z.string().min(2).max(150),
  organization: z.string().min(2).max(150),
  period: z.string().min(4).max(50),
  description: z.string().min(10).max(1000),
  chips: z.array(z.string().min(1).max(50)).optional(),
});
export type JourneyItem = z.infer<typeof JourneyItemSchema>;

// Skills Schema
export const SkillItemSchema = BaseItemSchema.extend({
  name: z.string().min(1).max(50),
  group: z.enum(["Languages", "Frontend", "Backend & API", "Database & Caching", "DevOps & Tools"]),
  iconUrl: z.string().refine(
    (val) => val.startsWith("/") || val.startsWith("https://") || val.startsWith("http://"),
    { message: "iconUrl must be a local asset path or valid URL" }
  ),
  visibleLabel: z.string().min(1).max(50).optional(),
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

// Projects Schema
export const ProjectItemSchema = BaseItemSchema.extend({
  title: z.string().min(2).max(150),
  summary: z.string().min(10).max(1000),
  technologies: z.array(z.string().min(1).max(50)).min(1),
  coverPath: z.string().startsWith("/"),
  repoUrl: z.string().url().optional(),
  repoVisibility: z.enum(["PUBLIC", "PRIVATE"]),
  demoUrl: z.string().url().optional(),
  status: z.string().optional(),
  license: z.string().optional(),
  linkStatus: z.enum(["VERIFIED", "NOT_PROVIDED", "UNDER_REVIEW"]),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

// Certifications Schema
export const CertificationItemSchema = BaseItemSchema.extend({
  title: z.string().min(2).max(150),
  issuer: z.string().min(2).max(100),
  issuedLabel: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  imagePath: z.string().startsWith("/"),
  credentialUrl: z.string().url().optional(),
  description: z.string().max(500).optional(),
});
export type CertificationItem = z.infer<typeof CertificationItemSchema>;

// Gallery Schema
export const GalleryItemSchema = BaseItemSchema.extend({
  title: z.string().min(2).max(150),
  caption: z.string().min(5).max(300),
  imagePath: z.string().startsWith("/"),
  alt: z.string().min(5).max(200),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

// Contacts Schema
export const ContactItemSchema = BaseItemSchema.extend({
  type: z.enum(["email", "linkedin", "github", "instagram", "credly"]),
  label: z.string().min(2).max(50),
  displayText: z.string().min(2).max(100),
  href: z.string().refine((val) => val.startsWith("mailto:") || val.startsWith("https://"), {
    message: "href must start with mailto: or https://",
  }),
  approvedForPublic: z.boolean(),
});
export type ContactItem = z.infer<typeof ContactItemSchema>;
