"use client";

import * as React from "react";
import Image from "next/image";
import { CornerFrame } from "@/components/ui/primitives";
import { siteConfig } from "@/data/site-config";

const emptySubscribe = () => () => {};

export function OpeningOverlay() {
  const isAlreadyOpened = React.useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return Boolean(sessionStorage.getItem("fb_portfolio_opened"));
      } catch {
        return false;
      }
    },
    () => false
  );

  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    try {
      sessionStorage.setItem("fb_portfolio_opened", "true");
    } catch {
      // Ignore storage errors in private browsing/sandboxed iframes
    }

    // Fail-safe timeout to unmount component after CSS animation finishes
    const timer = setTimeout(() => {
      setDismissed(true);
    }, 2900);

    // Quick dismiss on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDismissed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isAlreadyOpened || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Launching portfolio workspace"
      onClick={() => setDismissed(true)}
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-bg-page text-text-primary select-none cursor-pointer opening-overlay-failsafe"
    >
      {/* Top Header Placeholder / Clean Spacer */}
      <div className="flex items-center justify-between w-full opacity-60">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
          SYS // V1.0 INITIALIZATION
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
          ESC TO SKIP
        </span>
      </div>

      {/* Center Stack per 1 OPENING.png */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Emblem in Two-Tone CornerFrame */}
        <CornerFrame
          bracketVariant="two-tone"
          className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center p-3 sm:p-4 bg-surface-card"
        >
          <div className="relative h-full w-full">
            <Image
              src="/assets/brand/logo-fb.png"
              alt="Fauzi Budikusuma Logo"
              fill
              sizes="96px"
              className="object-contain"
              priority
            />
          </div>
        </CornerFrame>

        {/* Name in Huge Plus Jakarta Display */}
        <h1 className="font-display font-black uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-text-strong mt-8 sm:mt-10">
          {siteConfig.name}
        </h1>

        {/* Subtitle in JetBrains Mono per C-05 */}
        <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-text-secondary mt-3 max-w-md">
          {siteConfig.role}
        </p>

        {/* Animated Progress Bar */}
        <div className="w-48 sm:w-64 h-1 bg-border-default/80 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-accent opening-progress-bar rounded-full" />
        </div>

        {/* Status Line with Pulsing Crimson Marker */}
        <div className="flex items-center justify-center gap-2 font-mono text-[11px] sm:text-xs text-text-muted uppercase tracking-wider mt-4">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span>LAUNCHING WORKSPACE…</span>
        </div>
      </div>

      {/* Bottom Bar per 1 OPENING.png */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4">
        <div className="rounded-md border border-border-default bg-surface-card/60 px-3 py-1.5">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-text-muted">
            DISCIPLINE // 01 PERSONAL PORTFOLIO
          </span>
        </div>
        <div>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-text-muted">
            © 2026 • ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </div>
  );
}
