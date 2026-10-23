import { JourneyItem, JourneyItemSchema } from "./schemas";

export const journeyData: JourneyItem[] = [
  JourneyItemSchema.parse({
    id: "journey-amikom",
    verification: "VERIFIED",
    position: 0,
    kind: "education",
    title: "Bachelor of Informatics (S1 Informatika)",
    organization: "Universitas AMIKOM Yogyakarta",
    period: "2026 — 2029 (Expected)",
    description:
      "Pursuing undergraduate degree in Informatics focusing on distributed systems architecture, database engineering, and modern full-stack web applications.",
    chips: ["Informatics", "Software Architecture", "Database Systems"],
  }),
  JourneyItemSchema.parse({
    id: "journey-kominfo",
    verification: "VERIFIED",
    position: 1,
    kind: "experience",
    title: "Help Desk Supervisor Intern",
    organization: "Dinas Komunikasi dan Informatika (Kominfo) DIY",
    period: "2025",
    description:
      "Supervised provincial government help desk workflows, analyzed incident escalations, and assisted in troubleshooting enterprise network infrastructure and service continuity.",
    chips: ["Public Sector IT", "Network Troubleshooting", "Help Desk Management"],
  }),
  JourneyItemSchema.parse({
    id: "journey-smk",
    verification: "VERIFIED",
    position: 2,
    kind: "education",
    title: "Computer & Network Engineering (TKJ)",
    organization: "SMK Negeri 1 Seyegan",
    period: "2023 — 2026",
    description:
      "Graduated from vocational diploma in Computer and Network Engineering (TKJ), mastering routing & switching (MikroTik/Cisco), Linux server administration, and structured network cabling.",
    chips: ["MikroTik Routing", "Cisco Switching", "Linux Servers", "Network Topology"],
  }),
];
