"use client";

import * as React from "react";
import Image from "next/image";
import { Container, SectionHeader, Card, IconButton, Chip } from "@/components/ui/primitives";
import { certificationsData } from "@/data/certifications";
import { CertificationItem } from "@/data/schemas";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Lightbox } from "@/components/ui/lightbox";

export function CredentialsSection() {
  const { t } = useLanguage();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);
  const [selectedCert, setSelectedCert] = React.useState<CertificationItem | null>(null);
  const triggerRefMap = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  // Mouse drag-to-scroll state (desktop mouse only)
  const [isDragging, setIsDragging] = React.useState(false);
  const mouseDragRef = React.useRef<{
    isDown: boolean;
    startX: number;
    scrollLeft: number;
    hasMoved: boolean;
  }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });
  const hasDraggedRef = React.useRef(false);

  // Card Anti-Misfire Click vs Swipe Guard (Requirement D)
  const cardPointerRef = React.useRef<{
    x: number;
    y: number;
    scrollLeft: number;
  } | null>(null);
  const didSwipeRef = React.useRef(false);

  // Real-time synchronization of prev (<) and next (>) navigation buttons (Requirement E)
  const updateScrollButtons = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, clientWidth, scrollWidth } = container;
    const canScrollPrev = scrollLeft > 4;
    const canScrollNext = scrollLeft + clientWidth < scrollWidth - 4;
    setPrevBtnDisabled(!canScrollPrev);
    setNextBtnDisabled(!canScrollNext);
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons, { passive: true });

    const observer = new ResizeObserver(() => {
      updateScrollButtons();
    });
    observer.observe(container);
    if (container.firstElementChild) {
      observer.observe(container.firstElementChild);
    }

    updateScrollButtons();

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      observer.disconnect();
    };
  }, [updateScrollButtons]);

  const getStepWidth = () => {
    const container = scrollContainerRef.current;
    if (!container) return 320;
    const track = container.firstElementChild as HTMLElement | null;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    if (firstCard && track) {
      const cardWidth = firstCard.offsetWidth;
      const computedGap = parseFloat(window.getComputedStyle(track).gap || "24") || 24;
      return cardWidth + computedGap;
    }
    return container.clientWidth * 0.85;
  };

  const scrollPrev = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const stepWidth = getStepWidth();
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({
      left: -stepWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const scrollNext = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const stepWidth = getStepWidth();
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({
      left: stepWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

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

  // Separation of Touch vs Desktop Mouse Drag (Requirement C)
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // For touch devices, NEVER capture pointer or prevent default.
    // Let native mobile scrolling handle touch swipe with inertial momentum.
    if (e.pointerType === "touch") return;

    if (e.pointerType === "mouse" && e.button === 0) {
      const container = scrollContainerRef.current;
      if (!container) return;
      mouseDragRef.current = {
        isDown: true,
        startX: e.clientX,
        scrollLeft: container.scrollLeft,
        hasMoved: false,
      };
    }
  };

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;

    const drag = mouseDragRef.current;
    if (!drag.isDown) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaX = e.clientX - drag.startX;

    // Movement > 6px initiates desktop mouse drag-to-scroll
    if (!drag.hasMoved && Math.abs(deltaX) > 6) {
      drag.hasMoved = true;
      hasDraggedRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback if setPointerCapture is unsupported
      }
    }

    if (drag.hasMoved) {
      container.scrollLeft = drag.scrollLeft - deltaX;
    }
  };

  const handleContainerPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;

    const drag = mouseDragRef.current;
    if (drag.isDown) {
      if (drag.hasMoved) {
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Safe fallback
        }
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      } else {
        hasDraggedRef.current = false;
      }
      drag.isDown = false;
      drag.hasMoved = false;
      setIsDragging(false);
    }
  };

  // Laptop Touchpad Wheel Support (Requirement B)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Shift + vertical wheel converted to horizontal scroll
    if (e.shiftKey && Math.abs(e.deltaY) > 0 && e.deltaX === 0) {
      container.scrollLeft += e.deltaY;
    }
    // Dominant horizontal touchpad swipe is handled natively by overflow-x-auto,
    // and overscroll-x-contain prevents page navigation gestures.
  };

  // Card Anti-Misfire Click vs Swipe Guard (Requirement D)
  const handleCardPointerDown = (e: React.PointerEvent) => {
    cardPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollContainerRef.current?.scrollLeft ?? 0,
    };
  };

  const handleCardPointerUp = (e: React.PointerEvent) => {
    const start = cardPointerRef.current;
    if (!start) return;

    const currentScrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
    const deltaX = Math.abs(e.clientX - start.x);
    const deltaY = Math.abs(e.clientY - start.y);
    const deltaScroll = Math.abs(currentScrollLeft - start.scrollLeft);

    cardPointerRef.current = null;

    if (hasDraggedRef.current || deltaX > 6 || deltaY > 6 || deltaScroll > 6) {
      didSwipeRef.current = true;
      setTimeout(() => {
        didSwipeRef.current = false;
      }, 150);
    }
  };

  const handleCardClick = (cert: CertificationItem) => {
    if (hasDraggedRef.current || didSwipeRef.current) {
      return;
    }
    openModal(cert);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, cert: CertificationItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(cert);
    }
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

        {/* Natural Scroll Container with CSS Scroll Snap & Native Touchpad/Swipe Support */}
        <div
          ref={scrollContainerRef}
          onPointerDown={handleContainerPointerDown}
          onPointerMove={handleContainerPointerMove}
          onPointerUp={handleContainerPointerUpOrCancel}
          onPointerCancel={handleContainerPointerUpOrCancel}
          onWheel={handleWheel}
          className={`overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto ${
            isDragging ? "snap-proximity cursor-grabbing select-none" : "snap-x snap-mandatory cursor-grab"
          } [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x touch-pan-y [-webkit-overflow-scrolling:touch]`}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y",
          }}
        >
          <div className="flex gap-6 sm:gap-8 items-stretch select-none">
            {certificationsData.map((cert) => (
              <div
                key={cert.id}
                className="flex-[0_0_88%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] min-w-0 snap-start"
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
                        onClick={() => handleCardClick(cert)}
                        onPointerDown={handleCardPointerDown}
                        onPointerUp={handleCardPointerUp}
                        onKeyDown={(e) => handleCardKeyDown(e, cert)}
                        aria-label={`Preview full certificate scan for ${cert.title}`}
                        className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-surface-raised mb-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent group/btn"
                      >
                        <Image
                          src={cert.imagePath}
                          alt={`${cert.title} Certificate Scan`}
                          fill
                          draggable={false}
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
                          className="object-cover object-top transition-transform duration-300 group-hover/btn:scale-105 select-none pointer-events-none"
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
                    {(t.credentials.descriptions?.[cert.id] || cert.description) && (
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                        {t.credentials.descriptions?.[cert.id] || cert.description}
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
