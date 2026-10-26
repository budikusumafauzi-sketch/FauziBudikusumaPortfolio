import { JourneyItem, JourneyItemSchema } from "./schemas";

export const journeyData: JourneyItem[] = [
  JourneyItemSchema.parse({
    id: "journey-amikom",
    verification: "VERIFIED",
    position: 0,
    kind: "education",
    title: "Bachelor of Informatics (S1 Informatika)",
    organization: "Universitas AMIKOM Yogyakarta",
    period: "2026 — 2030",
    description:
      "Pursuing a bachelor's degree in Informatics, building a solid foundation in computing, algorithms, database systems, and software engineering, with focused study on Artificial Intelligence and Machine Learning systems.",
    chips: ["Informatics", "Software Development", "Artificial Intelligence", "Machine Learning"],
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
      "Underwent practical training in IT services, supporting network and bandwidth monitoring, device health inspection, troubleshooting, technical documentation, and network equipment installation using The Dude and PRTG across provincial government and school environments.",
    chips: ["Network Monitoring", "Troubleshooting", "Technical Documentation"],
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
      "Built a technical foundation in network topology, device configuration, routing, switching, system administration, and connectivity troubleshooting, forming the bedrock for broader IT infrastructure exploration.",
    chips: ["MikroTik", "Cisco", "System Administration", "Network Topology"],
  }),
];
