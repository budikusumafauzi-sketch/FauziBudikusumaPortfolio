import * as React from "react";
import { Container, SectionHeader, Card } from "@/components/ui/primitives";
import { contactsData } from "@/data/contacts";
import { Mail, ArrowUpRight } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.5a1.63 1.63 0 0 0-1.63 1.63 1.63 1.63 0 0 0 1.63 1.63 1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactSection() {
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5 text-accent" />;
      case "linkedin":
        return <LinkedInIcon className="h-5 w-5 text-accent" />;
      case "github":
        return <GitHubIcon className="h-5 w-5 text-accent" />;
      case "instagram":
        return <InstagramIcon className="h-5 w-5 text-accent" />;
      default:
        return <Mail className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Direct Channels"
          descriptor="COMMUNICATION & PROFESSIONAL INQUIRIES"
          className="mb-10"
        />

        {/* 4 Cards Grid: 4 columns on desktop, 2x2 on tablet/mobile (AC-5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contactsData.map((channel) => {
            const isExternal = channel.href.startsWith("http");
            return (
              <a
                key={channel.id}
                href={channel.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={`${channel.label}: ${channel.displayText}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
              >
                <Card className="h-full flex flex-col justify-between p-5 sm:p-6 bg-surface-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)]">
                  <div>
                    {/* Top Row: Icon & External Arrow */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-surface-raised border border-border-default/60 group-hover:border-accent transition-colors">
                        {getIcon(channel.type)}
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    {/* Channel Label */}
                    <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1.5 font-semibold">
                      {channel.label}
                    </span>

                    {/* Channel Value with Full Word Wrapping to Prevent Truncation (AC-1) */}
                    <p className="font-sans text-sm sm:text-base font-semibold text-text-strong break-all leading-snug">
                      {channel.displayText}
                    </p>
                  </div>

                  {/* Verified Indicator */}
                  <div className="mt-4 pt-3 border-t border-border-default/60 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    <span>CHANNEL // 0{channel.position + 1}</span>
                    <span className="text-text-faint">VERIFIED</span>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
