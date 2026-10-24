"use client";

import * as React from "react";
import { Container, SectionHeader, Card, Chip } from "@/components/ui/primitives";
import { profileData } from "@/data/profile";
import { journeyData } from "@/data/journey";
import { useLanguage } from "@/lib/i18n/context";
import { CheckCircle2 } from "lucide-react";

export function ProfileJourneySection() {
  const { t } = useLanguage();

  const principles = [
    t.profileJourney.principle1,
    t.profileJourney.principle2,
    t.profileJourney.principle3,
  ];

  const getJourneyDesc = (id: string, fallback: string) => {
    if (id.includes("amikom")) return t.profileJourney.journeyDescriptions.amikom;
    if (id.includes("kominfo")) return t.profileJourney.journeyDescriptions.kominfo;
    if (id.includes("smk")) return t.profileJourney.journeyDescriptions.smk;
    return fallback;
  };

  return (
    <section id="profile" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title={t.profileJourney.title}
          descriptor={t.profileJourney.descriptor}
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Overview Card */}
          <div className="lg:col-span-5">
            <Card className="p-6 sm:p-8 flex flex-col justify-between h-full bg-surface-card">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    SYS // {t.profileJourney.overviewTag}
                  </span>
                  <Chip variant="accent">{t.common.verified} PROFILE</Chip>
                </div>

                <h3 className="font-display font-bold text-2xl text-text-strong uppercase tracking-tight mb-4">
                  Engineering Foundations
                </h3>

                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
                  {t.profileJourney.summaryP1}
                </p>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  {t.profileJourney.summaryP2}
                </p>

                <div className="border-t border-border-default/80 pt-6 my-6">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4 font-semibold">
                    {t.profileJourney.principlesTag}
                  </h4>
                  <ul className="space-y-3">
                    {principles.map((principle, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-border-default/80 pt-6 mt-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  LOCATION // {profileData.location}
                </span>
              </div>
            </Card>
          </div>

          {/* Right Column: Timeline Card */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-surface-card">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-default/80">
                <h3 className="font-display font-bold text-lg sm:text-xl text-text-strong uppercase tracking-tight">
                  Chronological Journey
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted font-medium">
                  {t.profileJourney.timelineTitle}
                </span>
              </div>

              {/* Vertical Timeline Rail */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-default">
                {journeyData.map((item, index) => {
                  const isCurrent = index === 0;
                  return (
                    <div key={item.id} className="relative group">
                      {/* Timeline Dot Marker */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 h-4 w-4 rounded-full border-2 ${
                          isCurrent
                            ? "border-accent bg-accent"
                            : "border-border-default bg-surface-card"
                        }`}
                        aria-hidden="true"
                      >
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
                        )}
                      </div>

                      {/* Header row: Title and Period */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                        <h4 className="font-display font-bold text-base sm:text-lg text-text-strong uppercase tracking-tight">
                          {item.title}
                        </h4>
                        <span className="font-mono text-xs uppercase tracking-wider text-accent-text font-semibold shrink-0">
                          {item.period}
                        </span>
                      </div>

                      {/* Organization Subtitle */}
                      <p className="font-mono text-xs uppercase tracking-wider text-text-muted mb-3">
                        {item.organization}
                      </p>

                      {/* Description */}
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {getJourneyDesc(item.id, item.description)}
                      </p>

                      {/* Item Tags / Chips */}
                      {item.chips && item.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded bg-surface-raised px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-text-muted border border-border-default/60"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
