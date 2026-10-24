"use client";

import * as React from "react";
import Image from "next/image";
import { Container, SectionHeader, Card } from "@/components/ui/primitives";
import { projectsData } from "@/data/projects";
import { ExternalLink, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title={t.projects.title}
          descriptor={t.projects.descriptor}
          className="mb-12"
        />

        {/* 3-2-1 Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {projectsData.map((project) => {
            const isPublic = project.repoVisibility === "PUBLIC" && project.repoUrl;
            const projectSummary = t.projects.descriptions[project.id] || project.summary;

            return (
              <Card
                key={project.id}
                className="group flex flex-col justify-between h-full bg-surface-card p-4 sm:p-5 transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)]"
              >
                <div>
                  {/* Aspect-Locked 16:10 Cover Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-raised mb-5">
                    <Image
                      src={project.coverPath}
                      alt={`${project.title} Preview Thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Project Title */}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-text-strong uppercase tracking-tight mb-2.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-3">
                    {projectSummary}
                  </p>

                  {/* Technology Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-surface-raised px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-text-muted border border-border-default/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer Pinned to Card Bottom */}
                <div className="border-t border-border-default/80 pt-4 mt-auto flex items-center justify-between">
                  {isPublic ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-text hover:text-accent transition-colors"
                    >
                      <span>{t.projects.viewRepo}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-text-muted">
                      <Lock className="h-3.5 w-3.5" />
                      <span>{t.projects.privateRepo}</span>
                    </div>
                  )}

                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {project.repoVisibility}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
