import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";
import { contactsData } from "@/data/contacts";

describe("Direct Contact Section", () => {
  it("renders section element with id='contact' and scroll margin", () => {
    const html = renderToString(React.createElement(ContactSection));
    expect(html).toContain('id="contact"');
    expect(html).toContain("scroll-mt-24");
  });

  it("renders SectionHeader without numeric prefix (C-11)", () => {
    const html = renderToString(React.createElement(ContactSection));
    expect(html).toContain("Direct Channels");
    expect(html).not.toMatch(/0[0-9]\s*\/\//);
  });

  it("renders all 4 approved contact channels with verified links and text", () => {
    const html = renderToString(React.createElement(ContactSection));
    expect(contactsData.length).toBe(4);

    for (const channel of contactsData) {
      expect(html).toContain(channel.displayText);
      expect(html).toContain(`href="${channel.href}"`);
    }
  });

  it("adds target='_blank' and rel='noopener noreferrer' to external links", () => {
    const html = renderToString(React.createElement(ContactSection));
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("strictly enforces Scope Guard: no contact message form or inputs", () => {
    const html = renderToString(React.createElement(ContactSection));
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("<input");
  });
});

describe("Footer Component", () => {
  it("renders brand name, logo, and unified role headline (C-05)", () => {
    const html = renderToString(React.createElement(Footer));
    expect(html).toContain("FAUZI BUDIKUSUMA");
    expect(html).toContain("SOFTWARE DEVELOPMENT &amp; NETWORK ENGINEER");
    expect(html).toContain("logo-fb.png");
  });

  it("renders quick navigation anchor links starting with Overview (CR-002)", () => {
    const html = renderToString(React.createElement(Footer));
    expect(html).toContain('href="#home"');
    expect(html).toContain('href="#profile"');
    expect(html).toContain('href="#projects"');
    expect(html).toContain('href="#credentials"');
    expect(html).toContain('href="#documentation"');
    expect(html).toContain('href="#contact"');
  });

  it("provides Back to Top anchor link to #top without overlapping chat launcher (DS-03)", () => {
    const html = renderToString(React.createElement(Footer));
    expect(html).toContain('href="#top"');
    expect(html).toContain('aria-label="Back to top"');
  });
});
