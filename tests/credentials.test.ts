import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { CredentialsSection } from "@/components/sections/credentials";
import { certificationsData } from "@/data/certifications";

describe("Credentials Section", () => {
  it("renders section element with id='credentials' and scroll margin", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain('id="credentials"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix (C-11)", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain("Credentials &amp; Certifications");
    expect(html).not.toMatch(/0[0-9]\s*\/\//);
  });

  it("renders all 7 verified certificates from certificationsData", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(certificationsData.length).toBe(7);

    for (const cert of certificationsData) {
      expect(html).toContain(cert.title);
      expect(html).toContain(cert.issuer);
    }
  });

  it("provides accessible carousel arrow controls in the header", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).toContain('aria-label="Previous certificate"');
    expect(html).toContain('aria-label="Next certificate"');
  });

  it("omits fake verification text or SHA-256 hashes (C-03)", () => {
    const html = renderToString(React.createElement(CredentialsSection));
    expect(html).not.toContain("SHA-256");
    expect(html).not.toContain("HASH VERIFIED");
    expect(html).not.toContain("0x7f");
  });
});
