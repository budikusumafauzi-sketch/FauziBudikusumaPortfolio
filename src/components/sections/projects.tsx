"use client";

import * as React from "react";
import Image from "next/image";
import { Container, SectionHeader, Card } from "@/components/ui/primitives";
import { projectsData } from "@/data/projects";
import { type ProjectItem } from "@/data/schemas";
import { ExternalLink, Lock, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Lightbox } from "@/components/ui/lightbox";

export function ProjectsSection() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = React.useState<ProjectItem | null>(null);
  const triggerRefMap = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const closeModal = React.useCallback(() => {
    const projectId = selectedProject?.id;
    setSelectedProject(null);
    if (projectId) {
      setTimeout(() => {
        triggerRefMap.current.get(projectId)?.focus();
      }, 50);
    }
  }, [selectedProject]);

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
                  {/* Interactive Thumbnail Preview Trigger (AC-3, CR-014) */}
                  <button
                    ref={(el) => {
                      if (el) triggerRefMap.current.set(project.id, el);
                      else triggerRefMap.current.delete(project.id);
                    }}
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`${t.projects.previewAria} ${project.title}`}
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-raised mb-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent group/btn block text-left"
                  >
                    <Image
                      src={project.coverPath}
                      alt={`${project.title} Preview Thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover/btn:scale-105"
                    />
                    {/* Hover indicator overlay */}
                    <div className="absolute inset-0 bg-bg-page/40 opacity-0 group-hover/btn:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-strong bg-bg-page/90 px-3 py-1.5 rounded border border-border-default shadow-xs">
                        <Maximize2 className="h-3.5 w-3.5 text-accent" />
                        <span>{t.projects.viewImage}</span>
                      </span>
                    </div>
                  </button>

                  {/* Project Title */}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-text-strong uppercase tracking-tight mb-2.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
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

                {/* Bottom Action Footer Pinned to Card Bottom (Separate link target, AC-5) */}
                <div className="border-t border-border-default/80 pt-4 mt-auto flex items-center justify-between">
                  {isPublic ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-text hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
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

        {/* Shared Lightbox Modal (CR-014, AC-3..AC-6) */}
        {selectedProject && (
          <Lightbox
            isOpen={Boolean(selectedProject)}
            onClose={closeModal}
            src={selectedProject.coverPath}
            alt={selectedProject.title}
            title={selectedProject.title}
            closeAriaLabel={t.projects.closeModal}
            aspectRatioClass="aspect-[4/3] sm:aspect-[16/10]"
          />
        )}
      </Container>
    </section>
  );
}
