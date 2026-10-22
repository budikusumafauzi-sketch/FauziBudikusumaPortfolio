"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "@/components/ui/primitives";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <IconButton
        aria-label="Toggle theme"
        className={`opacity-70 ${className}`}
        disabled
      >
        <span className="h-4 w-4" />
      </IconButton>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <IconButton
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={handleToggle}
      className={className}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-text-primary transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 text-text-primary transition-transform duration-200" />
      )}
    </IconButton>
  );
}
