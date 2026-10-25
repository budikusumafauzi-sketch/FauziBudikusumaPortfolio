"use client";

import * as React from "react";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { skillsData } from "@/data/skills";
import { useLanguage } from "@/lib/i18n/context";

// Skills that use monochrome/dark fills and require high-contrast handling in dark theme (CR-008)
const DARK_THEME_INVERT_SKILLS = new Set([
  "skill-nextjs",
  "skill-github",
  "skill-rust",
  "skill-flask",
  "skill-fastify",
  "skill-expo",
  "skill-framer-motion",
  "skill-prisma",
  "skill-sqlalchemy",
]);

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-20 overflow-hidden">
      <Container>
        <SectionHeader
          title={t.skills.title}
          descriptor={t.skills.descriptor}
          className="mb-10"
        />

        {/* Visually Hidden Accessible List for Assistive Technology (C-04) */}
        <div className="sr-only">
          <h3>Core Technical Skills & Technologies</h3>
          <ul>
            {skillsData.map((skill) => (
              <li key={skill.id}>
                {skill.name} ({skill.group})
              </li>
            ))}
          </ul>
        </div>

        {/* Marquee Outer Container with Edge Fades */}
        <div className="relative w-full overflow-hidden skills-marquee-container py-4">
          {/* Edge Fade Gradients */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-bg-page to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-bg-page to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          {/* Marquee Animated Track */}
          <div className="skills-marquee-track gap-4 sm:gap-6">
            {/* Primary Track (Keyboard Accessible & Single Screen-Reader Set) */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {skillsData.map((skill) => (
                <div
                  key={skill.id}
                  title={`${skill.name} (${skill.group})`}
                  tabIndex={0}
                  className="group relative flex flex-col items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-border-default bg-surface-card p-3 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_var(--color-accent-glow)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent shrink-0 select-none cursor-default"
                >
                  {/* Skill Icon with Theme-Aware Contrast Handling (CR-008) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.iconUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`h-9 w-9 sm:h-11 sm:w-11 object-contain transition-transform duration-200 group-hover:scale-110 ${
                      DARK_THEME_INVERT_SKILLS.has(skill.id) ? "dark:invert" : ""
                    }`}
                  />

                  {/* Accessible Label (Hidden visually, accessible to screen readers & tooltips) */}
                  <span className="sr-only">{skill.name}</span>
                </div>
              ))}
            </div>

            {/* Duplicated Track for Seamless Infinite Loop (aria-hidden & non-focusable) */}
            <div className="flex gap-4 sm:gap-6 shrink-0 skills-marquee-duplicate" aria-hidden="true">
              {skillsData.map((skill) => (
                <div
                  key={`dup-${skill.id}`}
                  className="group relative flex flex-col items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-border-default bg-surface-card p-3 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_var(--color-accent-glow)] shrink-0 select-none cursor-default"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.iconUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`h-9 w-9 sm:h-11 sm:w-11 object-contain transition-transform duration-200 group-hover:scale-110 ${
                      DARK_THEME_INVERT_SKILLS.has(skill.id) ? "dark:invert" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Summary Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          {[
            t.skills.groups.languages,
            t.skills.groups.frontend,
            t.skills.groups.backend,
            t.skills.groups.database,
            t.skills.groups.devops,
          ].map((cat) => (
            <span
              key={cat}
              className="font-mono text-[11px] uppercase tracking-wider text-text-muted px-3 py-1 rounded-full border border-border-default/60 bg-surface-card/40"
            >
              {cat}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
