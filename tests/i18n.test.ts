import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { dictionaries, Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { LanguageProvider } from "@/lib/i18n/context";

describe("Bilingual ID/EN Foundation (TASK-032 / CR-005a)", () => {
  it("defines comprehensive dictionaries for both en and id with identical schema keys", () => {
    const en = dictionaries.en;
    const id = dictionaries.id;

    expect(en).toBeDefined();
    expect(id).toBeDefined();

    // Verify key sections exist in both dictionaries
    const sections: (keyof Dictionary)[] = [
      "common",
      "overlay",
      "nav",
      "hero",
      "profileJourney",
      "skills",
      "projects",
      "credentials",
      "documentation",
      "contact",
      "footer",
      "chat",
      "notFound",
    ];

    sections.forEach((section) => {
      expect(en[section]).toBeDefined();
      expect(id[section]).toBeDefined();
      expect(Object.keys(en[section])).toEqual(Object.keys(id[section]));
    });
  });

  it("ensures no untranslated empty strings exist in either dictionary", () => {
    const validateObject = (obj: Record<string, unknown>, path = "") => {
      Object.entries(obj).forEach(([key, val]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof val === "string") {
          expect(val.trim().length, `String at ${currentPath} should not be empty`).toBeGreaterThan(0);
        } else if (typeof val === "object" && val !== null) {
          validateObject(val as Record<string, unknown>, currentPath);
        }
      });
    };

    validateObject(dictionaries.en as unknown as Record<string, unknown>, "en");
    validateObject(dictionaries.id as unknown as Record<string, unknown>, "id");
  });

  it("renders LanguageToggle segmented switcher with accessible button group and labels", () => {
    const html = renderToString(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(LanguageToggle)
      )
    );

    expect(html).toContain('role="group"');
    expect(html).toContain("ID");
    expect(html).toContain("EN");
    expect(html).toContain("Bahasa Indonesia");
    expect(html).toContain("English");
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
  });

  it("verifies proper noun preservation per CR-005a rules", () => {
    // Verified proper nouns must remain untranslated
    expect(dictionaries.id.footer.brandHeadline).toContain("PENGEMBANG PERANGKAT LUNAK");
    expect(dictionaries.id.profileJourney.summaryP1).toContain("Universitas AMIKOM Yogyakarta");
    expect(dictionaries.id.profileJourney.summaryP2).toContain("Dinas Komunikasi dan Informatika (Kominfo) DIY");
    expect(dictionaries.id.profileJourney.summaryP2).toContain("MikroTik MTCNA");
  });
});
