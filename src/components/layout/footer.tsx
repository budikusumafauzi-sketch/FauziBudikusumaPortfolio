import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { ArrowUp, MapPin } from "lucide-react";

const CURRENT_YEAR = 2026;

export function Footer() {
  const navLinks = [
    { href: "#profile", label: "Profile" },
    { href: "#projects", label: "Projects" },
    { href: "#credentials", label: "Credentials" },
    { href: "#documentation", label: "Documentation" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-border-default/60 bg-bg-page/80 pt-16 pb-24 text-text-secondary">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Brand & Headline */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative h-8 w-8 overflow-hidden rounded border border-border-default bg-surface-raised flex items-center justify-center">
                <Image
                  src="/assets/brand/logo-fb.png"
                  alt="FB Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="font-display font-bold text-lg text-text-strong uppercase tracking-wider">
                FAUZI BUDIKUSUMA
              </span>
            </div>

            <p className="font-mono text-xs text-accent-text uppercase tracking-wider font-semibold mb-2">
              SOFTWARE DEVELOPMENT &amp; NETWORK ENGINEER
            </p>

            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="h-3.5 w-3.5 text-text-muted" />
              <span>Yogyakarta, Indonesia</span>
            </div>
          </div>

          {/* Quick Anchor Links (C-02: 5 items matching Navbar) */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Back to Top Button (DS-03: placed cleanly inside footer layout to avoid chat launcher collision) */}
          <a
            href="#top"
            aria-label="Back to top"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-surface-card hover:border-accent hover:text-accent text-xs font-mono uppercase tracking-wider text-text-secondary transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Bottom Bar: Copyright & System Notice */}
        <div className="border-t border-border-default/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-text-muted">
          <p>© {CURRENT_YEAR} FAUZI BUDIKUSUMA. ALL RIGHTS RESERVED.</p>
          <p className="text-text-muted">ENGINEERED FOR RESILIENCE &amp; PERFORMANCE</p>
        </div>
      </Container>
    </footer>
  );
}
