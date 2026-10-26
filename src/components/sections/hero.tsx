"use client";

import * as React from "react";
import Image from "next/image";
import { Container, Button, Chip, CornerFrame } from "@/components/ui/primitives";
import { profileData } from "@/data/profile";
import { siteConfig } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowUpRight, Download, Mail } from "lucide-react";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Information & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
            {/* Status Indicator */}
            <div className="mb-6 flex items-center gap-3">
              <Chip variant="neutral" dot={true}>
                {t.hero.statusAvailable}
              </Chip>
              <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-text-muted">
                {profileData.location}
              </span>
            </div>

            {/* Main Name Hierarchy (Single <h1>) */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-text-strong leading-[1.08]">
              {profileData.name}
            </h1>

            {/* Unified Role Headline (C-05) */}
            <div className="mt-4 mb-6">
              <span className="inline-block font-mono text-xs sm:text-sm md:text-base font-semibold uppercase tracking-widest text-accent-text bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-md">
                {t.hero.headline}
              </span>
            </div>

            {/* Profile Summary */}
            <div className="space-y-3.5 max-w-2xl mb-6">
              {t.hero.intro.split("\n\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-text-secondary text-base sm:text-lg leading-relaxed text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Core Focus Area Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(t.hero.focusAreas || profileData.focusAreas).map((area) => (
                <span
                  key={area}
                  className="rounded border border-border-default bg-surface-card/60 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-text-muted"
                >
                  {area}
                </span>
              ))}
            </div>

            {/* Action Buttons: Primary, CV Action, and Contact */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button href="#projects" variant="primary" className="gap-2 w-full sm:w-auto">
                <span>{t.hero.viewProjects}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>

              <Button
                href={siteConfig.cvPath}
                download={siteConfig.cvDownloadName}
                variant="secondary"
                className="gap-2 w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                <span>{t.hero.downloadCv}</span>
              </Button>

              <Button href="#contact" variant="ghost" className="gap-2 w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                <span>{t.hero.contactMe}</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Technical Corner-Framed Portrait */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* Outer Decorative Glow */}
              <div
                className="absolute -inset-1 rounded-3xl bg-accent/15 blur-xl pointer-events-none"
                aria-hidden="true"
              />

              <CornerFrame bracketVariant="two-tone" className="p-2 sm:p-2.5 bg-surface-card/80">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-card">
                  <Image
                    src={profileData.portraitPath}
                    alt={t.hero.portraitAlt}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
                    priority
                    className="object-cover object-top transition-transform duration-500"
                  />

                  {/* Gradient Vignette */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-bg-page/90 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </CornerFrame>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
