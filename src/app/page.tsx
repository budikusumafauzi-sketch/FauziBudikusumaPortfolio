import { HeroSection } from "@/components/sections/hero";
import { ProfileJourneySection } from "@/components/sections/profile-journey";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { CredentialsSection } from "@/components/sections/credentials";
import { DocumentationSection } from "@/components/sections/documentation";
import { ContactSection } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProfileJourneySection />
      <SkillsSection />
      <ProjectsSection />
      <CredentialsSection />
      <DocumentationSection />
      <ContactSection />
    </main>
  );
}
