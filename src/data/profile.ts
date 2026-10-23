import { ProfileData, ProfileSchema } from "./schemas";

export const profileData: ProfileData = ProfileSchema.parse({
  id: "profile-main",
  verification: "VERIFIED",
  position: 0,
  name: "FAUZI BUDIKUSUMA",
  headline: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER",
  summary:
    "Undergraduate Informatics student at Universitas AMIKOM Yogyakarta and Computer & Network Engineering graduate from SMK Negeri 1 Seyegan. Combines modern full-stack software engineering with enterprise network architecture, Mikrotik routing, and AI-assisted automation.",
  focusAreas: [
    "Full-Stack Web & API Development",
    "Enterprise Network Architecture & Routing",
    "AI-Assisted Systems & Cloud Automation",
  ],
  location: "Yogyakarta, Indonesia",
  portraitPath: "/assets/profile/fauzi-portrait.jpg",
});
