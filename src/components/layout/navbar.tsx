"use client";

import * as React from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { Container, IconButton } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu on Escape and return focus
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Cleanly reset/close mobile menu when resizing to desktop width (>= 768px) per Item 31
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-nav bg-bg-page/90 backdrop-blur-md transition-colors duration-200">
      <Container className="flex h-16 sm:h-[4.25rem] items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          href="#home"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:rounded-md"
          aria-label="Fauzi Budikusuma — Scroll to top"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border-default bg-surface-card p-1.5 transition-colors group-hover:border-accent">
            <Image
              src="/assets/brand/logo-fb.png"
              alt="FB Monogram"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold uppercase tracking-tight text-xs sm:text-sm text-text-strong">
              {siteConfig.name}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-text-muted">
              PORTFOLIO
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Primary navigation"
        >
          {siteConfig.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-strong focus-visible:rounded"
            >
              {item.label}
            </a>
          ))}
          <div className="h-4 w-px bg-border-default" aria-hidden="true" />
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <IconButton
            ref={menuButtonRef}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </IconButton>
        </div>
      </Container>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="md:hidden border-b border-border-default bg-bg-page/95 backdrop-blur-xl px-4 py-4 shadow-xl"
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {siteConfig.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center rounded-md px-3 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-strong focus-visible:rounded"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
