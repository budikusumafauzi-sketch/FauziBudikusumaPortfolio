"use client";

import * as React from "react";
import { useLanguage } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (lang: "id" | "en") => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <div
      role="group"
      aria-label={t.common.languageSwitcherAria}
      className="inline-flex items-center rounded-lg border border-border-default bg-surface-card p-0.5 text-xs font-mono transition-colors shadow-xs"
    >
      <button
        type="button"
        onClick={() => handleSelect("id")}
        aria-pressed={language === "id"}
        aria-label={t.common.indonesianLabel}
        className={`relative flex min-h-[36px] min-w-[36px] sm:min-h-[38px] sm:min-w-[38px] items-center justify-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          language === "id"
            ? "bg-accent text-white shadow-xs"
            : "text-text-muted hover:text-text-strong hover:bg-surface-raised"
        }`}
      >
        ID
      </button>

      <span className="text-border-default/70 select-none px-0.5" aria-hidden="true">
        |
      </span>

      <button
        type="button"
        onClick={() => handleSelect("en")}
        aria-pressed={language === "en"}
        aria-label={t.common.englishLabel}
        className={`relative flex min-h-[36px] min-w-[36px] sm:min-h-[38px] sm:min-w-[38px] items-center justify-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          language === "en"
            ? "bg-accent text-white shadow-xs"
            : "text-text-muted hover:text-text-strong hover:bg-surface-raised"
        }`}
      >
        EN
      </button>
    </div>
  );
}
