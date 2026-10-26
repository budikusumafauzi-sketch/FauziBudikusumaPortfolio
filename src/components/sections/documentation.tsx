"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Container, SectionHeader, IconButton } from "@/components/ui/primitives";
import { galleryData } from "@/data/gallery";
import { type GalleryItem } from "@/data/schemas";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Lightbox } from "@/components/ui/lightbox";

export function DocumentationSection() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<GalleryItem | null>(null);
  const triggerRefMap = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);

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
    const docId = selectedDoc?.id;
    setSelectedDoc(null);
    if (docId) {
      setTimeout(() => {
        triggerRefMap.current.get(docId)?.focus();
      }, 50);
    }
  }, [selectedDoc]);

  // Pointer drag vs click guard (CR-015 / AC-4)
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent, item: GalleryItem) => {
    if (!pointerStartRef.current) return;
    const deltaX = Math.abs(e.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartRef.current.y);
    pointerStartRef.current = null;
    // Movement > 6px is a carousel drag/swipe; <= 6px is an intentional click/tap
    if (deltaX <= 6 && deltaY <= 6) {
      setSelectedDoc(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: GalleryItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedDoc(item);
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

        {/* Carousel Viewport (touch-action pan-y ensures vertical page scrolling is never blocked) */}
        <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
          <div className="flex gap-5 sm:gap-6 items-stretch select-none">
            {galleryData.map((item, idx) => {
              const localizedCaption =
                (t.documentation.captions as Record<string, string>)[`img${idx + 1}`] ||
                item.caption;

              return (
                <div
                  key={item.id}
                  className="flex-[0_0_84%] sm:flex-[0_0_46%] lg:flex-[0_0_24%] min-w-0"
                >
                  {/* Interactive Card Button Trigger (AC-3, AC-4) */}
                  <button
                    ref={(el) => {
                      if (el) triggerRefMap.current.set(item.id, el);
                      else triggerRefMap.current.delete(item.id);
                    }}
                    type="button"
                    onClick={() => {
                      // Fallback for non-pointer activations (e.g. synthetic test clicks)
                      if (!pointerStartRef.current) {
                        setSelectedDoc(item);
                      }
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerUp={(e) => handlePointerUp(e, item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    aria-label={`${t.documentation.previewAria} ${item.title}`}
                    className="group relative h-80 sm:h-88 w-full overflow-hidden rounded-xl border border-border-default bg-surface-card shadow-sm transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent block text-left"
                  >
                    {/* Gallery Image */}
                    <Image
                      src={item.imagePath}
                      alt={item.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 24vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Subtle Hover Indicator */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <span className="p-1.5 rounded-md bg-black/70 text-white/90 border border-white/20 flex items-center justify-center">
                        <Maximize2 className="h-3.5 w-3.5 text-accent" />
                      </span>
                    </div>

                    {/* Gradient Scrim for Legibility in Both Dark and Light Themes */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-5 text-white pointer-events-none">
                      {/* Mono Bracket Index */}
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent-text font-semibold mb-1">
                        [ FIELD LOG // 0{idx + 1} ]
                      </span>

                      {/* Title */}
                      <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-1.5 leading-snug">
                        {item.title}
                      </h3>

                      {/* Verified Caption */}
                      <p className="text-white/85 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                        {localizedCaption}
                      </p>
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
            title={selectedDoc.title}
            closeAriaLabel={t.documentation.closeModal}
            aspectRatioClass="aspect-[4/3] sm:aspect-[16/10]"
          />
        )}
      </Container>
    </section>
  );
}
