import { HeroSection } from "@/components/sections/hero";
import { ProfileJourneySection } from "@/components/sections/profile-journey";
import { Container } from "@/components/ui/primitives";

export default function HomePage() {
  const remainingSections = [
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "credentials", label: "Credentials" },
    { id: "documentation", label: "Documentation" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProfileJourneySection />

      <Container className="space-y-16 py-12">
        {remainingSections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="rounded-xl border border-border-default/40 bg-surface-card/20 p-8"
          >
            <h2 className="font-display text-lg font-bold uppercase text-text-muted">
              {sec.label}
            </h2>
          </section>
        ))}
      </Container>
    </main>
  );
}
