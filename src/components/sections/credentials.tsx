"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Container, SectionHeader, Card, IconButton, Chip } from "@/components/ui/primitives";
import { certificationsData } from "@/data/certifications";
import { CertificationItem } from "@/data/schemas";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Lightbox } from "@/components/ui/lightbox";

export function CredentialsSection() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);
  const [selectedCert, setSelectedCert] = React.useState<CertificationItem | null>(null);
  const triggerRefMap = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    queueMicrotask(() => {
      onSelect();
    });
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const closeModal = React.useCallback(() => {
    const certId = selectedCert?.id;
    setSelectedCert(null);
    if (certId) {
      setTimeout(() => {
        triggerRefMap.current.get(certId)?.focus();
      }, 50);
    }
  }, [selectedCert]);

  const openModal = (cert: CertificationItem) => {
    setSelectedCert(cert);
  };

  return (
    <section id="credentials" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <SectionHeader
            title={t.credentials.title}
            descriptor={t.credentials.descriptor}
            className="mb-0"
          />

          {/* Carousel Arrows in Header */}
          <div className="flex items-center gap-2 shrink-0">
            <IconButton
              aria-label="Previous certificate"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              variant="default"
              size="sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </IconButton>
            <IconButton
              aria-label="Next certificate"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              variant="default"
              size="sm"
            >
              <ChevronRight className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 sm:gap-8 items-stretch select-none">
            {certificationsData.map((cert) => (
              <div
                key={cert.id}
                className="flex-[0_0_88%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] min-w-0"
              >
                <Card className="group flex flex-col justify-between h-full bg-surface-card p-4 sm:p-5 transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)]">
                  <div>
                    {/* Thumbnail Preview Click Trigger (or inert unavailable state per AC-4) */}
                    {cert.imagePath ? (
                      <button
                        ref={(el) => {
                          if (el) triggerRefMap.current.set(cert.id, el);
                          else triggerRefMap.current.delete(cert.id);
                        }}
                        type="button"
                        onClick={() => openModal(cert)}
                        aria-label={`Preview full certificate scan for ${cert.title}`}
                        className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-surface-raised mb-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent group/btn"
                      >
                        <Image
                          src={cert.imagePath}
                          alt={`${cert.title} Certificate Scan`}
                          fill
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
                          className="object-cover object-top transition-transform duration-300 group-hover/btn:scale-105"
                        />
                        <div className="absolute inset-0 bg-bg-page/40 opacity-0 group-hover/btn:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-strong bg-bg-page/90 px-3 py-1.5 rounded border border-border-default">
                            <Maximize2 className="h-3.5 w-3.5 text-accent" />
                            <span>{t.credentials.viewCredential}</span>
                          </span>
                        </div>
                      </button>
                    ) : (
                      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-surface-raised mb-4 flex items-center justify-center border border-dashed border-border-default select-none">
                        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                          Scan Preview Unavailable
                        </span>
                      </div>
                    )}

                    {/* Metadata Header: Issuer & Year */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-semibold text-accent-text tracking-wide">
                        {cert.issuer}
                      </span>
                      <Chip variant="neutral">
                        {cert.issuedLabel}
                      </Chip>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-text-strong uppercase tracking-tight mb-2">
                      {cert.title}
                    </h3>

                    {/* Description */}
                    {cert.description && (
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: Category */}
                  <div className="border-t border-border-default/80 pt-3 mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    <span>{t.credentials.category} {"//"} {cert.category}</span>
                    <span className="text-text-muted">{t.common.verified}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Image-Only Lightbox Modal (C-03 & OD-12 via shared Lightbox) */}
        {selectedCert && (
          <Lightbox
            isOpen={Boolean(selectedCert)}
            onClose={closeModal}
            src={selectedCert.imagePath}
            alt={selectedCert.title}
            title={`${selectedCert.title} (${selectedCert.issuer})`}
            closeAriaLabel={t.credentials.closeModal}
            aspectRatioClass="aspect-[4/3] sm:aspect-[16/11]"
          />
        )}
      </Container>
    </section>
  );
}
