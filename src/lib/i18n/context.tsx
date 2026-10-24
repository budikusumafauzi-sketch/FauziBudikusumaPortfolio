"use client";

import * as React from "react";
import { dictionaries, type Dictionary, type Language } from "./dictionaries";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "fauzi_lang";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.title =
        language === "id"
          ? "Fauzi Budikusuma — Pengembang Perangkat Lunak & Teknik Jaringan"
          : "Fauzi Budikusuma — Software Development & Network Engineer";
    }
  }, [language]);

  const setLanguage = React.useCallback((nextLang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextLang);
    } catch {
      // Safe fallback
    }
    emitChange();
  }, []);

  const value = React.useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t: dictionaries[language],
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext);
  if (!context) {
    // Provide safe fallback default if consumed outside provider in test environments
    return {
      language: "en",
      setLanguage: () => {},
      t: dictionaries.en,
    };
  }
  return context;
}
