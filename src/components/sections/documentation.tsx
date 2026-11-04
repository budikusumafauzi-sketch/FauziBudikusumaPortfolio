"use client";

import * as React from "react";
import Image from "next/image";
import { Container, SectionHeader, IconButton } from "@/components/ui/primitives";
import { galleryData } from "@/data/gallery";
import { type GalleryItem } from "@/data/schemas";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Lightbox } from "@/components/ui/lightbox";

export function DocumentationSection() {
  const { t } = useLanguage();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<GalleryItem | null>(null);
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
      const computedGap = parseFloat(window.getComputedStyle(track).gap || "20") || 20;
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
    const docId = selectedDoc?.id;
    setSelectedDoc(null);
    if (docId) {
      setTimeout(() => {
        triggerRefMap.current.get(docId)?.focus();
      }, 50);
    }
  }, [selectedDoc]);

  const openModal = (item: GalleryItem) => {
    setSelectedDoc(item);
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
        // Safe fallback
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

  const handleCardClick = (item: GalleryItem) => {
    if (hasDraggedRef.current || didSwipeRef.current) {
      return;
    }
    openModal(item);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, item: GalleryItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(item);
    }
  };

  return (
    <section id="documentation" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <SectionHeader
            title={t.documentation.title}
            descriptor={t.documentation.descriptor}
            className="mb-0"
          />

          <div className="flex items-center gap-2 shrink-0">
            <IconButton
              aria-label="Previous documentation item"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              variant="default"
              size="sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </IconButton>
            <IconButton
              aria-label="Next documentation item"
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
          <div className="flex gap-5 sm:gap-6 items-stretch select-none">
            {galleryData.map((item) => {
              const docTitle = t.documentation.titles?.[item.id] || item.title;
              return (
                <div
                  key={item.id}
                  className="flex-[0_0_84%] sm:flex-[0_0_46%] lg:flex-[0_0_24%] min-w-0 snap-start"
                >
                  {/* Interactive Card Button Trigger (AC-3, AC-4) */}
                  <button
                    ref={(el) => {
                      if (el) triggerRefMap.current.set(item.id, el);
                      else triggerRefMap.current.delete(item.id);
                    }}
                    type="button"
                    onClick={() => handleCardClick(item)}
                    onPointerDown={handleCardPointerDown}
                    onPointerUp={handleCardPointerUp}
                    onKeyDown={(e) => handleCardKeyDown(e, item)}
                    aria-label={`${t.documentation.previewAria} ${docTitle}`}
                    className="group relative h-80 sm:h-88 w-full overflow-hidden rounded-xl border border-border-default bg-surface-card shadow-sm transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent block text-left"
                  >
                    {/* Gallery Image */}
                    <Image
                      src={item.imagePath}
                      alt={item.alt}
                      fill
                      unoptimized
                      draggable={false}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 24vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                    />

                    {/* Subtle Hover Indicator */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <span className="p-1.5 rounded-md bg-black/70 text-white/90 border border-white/20 flex items-center justify-center">
                        <Maximize2 className="h-3.5 w-3.5 text-accent" />
                      </span>
                    </div>

                    {/* Gradient Scrim for Legibility in Both Dark and Light Themes */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-5 text-white pointer-events-none">
                      {/* Title */}
                      <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight leading-snug">
                        {docTitle}
                      </h3>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shared Lightbox Modal (CR-015, AC-3..AC-6) */}
        {selectedDoc && (
          <Lightbox
            isOpen={Boolean(selectedDoc)}
            onClose={closeModal}
            src={selectedDoc.imagePath}
            alt={selectedDoc.alt}
            title={t.documentation.titles?.[selectedDoc.id] || selectedDoc.title}
            closeAriaLabel={t.documentation.closeModal}
            aspectRatioClass="aspect-[4/3] sm:aspect-[16/10]"
          />
        )}
      </Container>
    </section>
  );
}
