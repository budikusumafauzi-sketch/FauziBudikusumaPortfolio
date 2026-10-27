export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  title: string;
  description: string;
  navItems: NavItem[];
  cvPath: string;
  cvDownloadName: string;
}

export const siteConfig: SiteConfig = {
  name: "FAUZI BUDIKUSUMA",
  role: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER",
  title: "Fauzi Budikusuma — Software Development & Network Engineer",
  description:
    "Personal portfolio and verified interactive showcase of Fauzi Budikusuma — Software Development & Network Engineer.",
  navItems: [
    { label: "Overview", href: "#home" },
    { label: "Profile & Journey", href: "#profile" },
    { label: "Projects", href: "#projects" },
    { label: "Credentials", href: "#credentials" },
    { label: "Documentation", href: "#documentation" },
    { label: "Contact", href: "#contact" },
  ],
  cvPath: "/assets/documents/Fauzi-Budikusuma-CV.pdf",
  cvDownloadName: "Fauzi-Budikusuma-CV.pdf",
};
