"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Container, SectionHeader, IconButton } from "@/components/ui/primitives";
import { galleryData } from "@/data/gallery";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DocumentationSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);

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

  return (
    <section id="documentation" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <SectionHeader
            title="Field Documentation"
            descriptor="PRACTICAL EXPERIENCE & LAB OPERATIONS"
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
            {galleryData.map((item, idx) => (
              <div
                key={item.id}
                className="flex-[0_0_84%] sm:flex-[0_0_46%] lg:flex-[0_0_24%] min-w-0"
              >
                <div className="group relative h-80 sm:h-88 w-full overflow-hidden rounded-xl border border-border-default bg-surface-card shadow-sm transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_var(--color-accent-glow)]">
                  {/* Gallery Image */}
                  <Image
                    src={item.imagePath}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 24vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Scrim for Legibility in Both Dark and Light Themes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-5 text-white">
                    {/* Mono Bracket Index */}
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">
                      [ FIELD LOG // 0{idx + 1} ]
                    </span>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-1.5 leading-snug">
                      {item.title}
                    </h3>

                    {/* Verified Caption */}
                    <p className="text-white/85 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
