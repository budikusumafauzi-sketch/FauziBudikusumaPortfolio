"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
  closeAriaLabel?: string;
  aspectRatioClass?: string;
}

/**
 * Accessible Lightbox Modal (C-03 & OD-12)
 * Shared across Selected Projects, Credentials & Certifications, and Field Documentation.
 * Provides role="dialog", aria-modal="true", keyboard focus trapping, Escape/backdrop closing,
 * and pure uncropped image rendering without fabricated metadata.
 */
export function Lightbox({
  isOpen,
  onClose,
  src,
  alt,
  title,
  closeAriaLabel = "Close preview",
  aspectRatioClass = "aspect-[4/3] sm:aspect-[16/10]",
}: LightboxProps) {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Focus trap and keyboard handling
  React.useEffect(() => {
    if (!isOpen) return;

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const dialogAriaLabel = title ? `${title} — Preview` : "Image Preview";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={dialogAriaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="w-full flex items-center justify-between pb-3 px-1">
          {title ? (
            <p className="font-mono text-xs text-white/80 uppercase tracking-wider truncate max-w-[80%]">
              {title}
            </p>
          ) : (
            <div />
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={closeAriaLabel}
            className="rounded-full bg-surface-card p-2 text-text-secondary hover:text-text-primary hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-accent transition-colors ml-auto"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Pure Uncropped Image Frame (C-03: Zero fake verification hashes/sidebars) */}
        <div
          className={`relative w-full ${aspectRatioClass} max-h-[80vh] overflow-hidden rounded-xl border border-border-default bg-surface-card shadow-2xl`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1280px) 95vw, 1200px"
          />
        </div>
      </div>
    </div>
  );
}
