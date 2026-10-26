import { CertificationItem, CertificationItemSchema } from "./schemas";

export const certificationsData: CertificationItem[] = [
  CertificationItemSchema.parse({
    id: "cert-mtcna",
    verification: "VERIFIED",
    position: 0,
    title: "MikroTik Certified Network Associate (MTCNA)",
    issuer: "MikroTik",
    issuedLabel: "Issued 2026",
    category: "Networking",
    imagePath: "/assets/certificates/mikrotik-mtcna.jpg",
    description:
      "Certification demonstrating foundational competency in MikroTik-based network management, covering routing configuration, wireless networking, firewalls, and bandwidth management to ensure reliable network connectivity.",
  }),
  CertificationItemSchema.parse({
    id: "cert-google-cybersecurity",
    verification: "VERIFIED",
    position: 1,
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    issuedLabel: "Issued 2025",
    category: "Security",
    imagePath: "/assets/certificates/google-cybersecurity.jpg",
    description:
      "Professional certification program covering cybersecurity fundamentals, threat and vulnerability identification, network hardening, and the use of security tools such as SIEM. Also encompasses the practical use of Linux, SQL, and Python to support security analysis and incident response.",
  }),
  CertificationItemSchema.parse({
    id: "cert-google-ai",
    verification: "VERIFIED",
    position: 2,
    title: "Google AI Essentials",
    issuer: "Google",
    issuedLabel: "Issued 2025",
    category: "AI & ML",
    imagePath: "/assets/certificates/google-ai-essentials.jpg",
    description:
      "Foundational learning program on leveraging generative artificial intelligence effectively and responsibly, including prompt design, AI integration into daily workflows, productivity optimization, and understanding ethical AI practices.",
  }),
  CertificationItemSchema.parse({
    id: "cert-uji-kompetensi-1",
    verification: "VERIFIED",
    position: 3,
    title: "Sertifikat Uji Kompetensi Keahlian (Bagian 1)",
    issuer: "BNSP / LSP SMK N 1 Seyegan",
    issuedLabel: "Issued 2026",
    category: "Vocational",
    imagePath: "/assets/certificates/uji-kompetensi-1.jpg",
    description:
      "Competency certificate covering foundational local area network design, topology planning, hardware requirement identification, structured cabling, and network infrastructure installation according to technical standards.",
  }),
  CertificationItemSchema.parse({
    id: "cert-uji-kompetensi-2",
    verification: "VERIFIED",
    position: 4,
    title: "Sertifikat Uji Kompetensi Keahlian (Bagian 2)",
    issuer: "BNSP / LSP SMK N 1 Seyegan",
    issuedLabel: "Issued 2026",
    category: "Vocational",
    imagePath: "/assets/certificates/uji-kompetensi-2.jpg",
    description:
      "Competency certificate covering foundational local area network design, topology planning, hardware requirement identification, structured cabling, and network infrastructure installation according to technical standards.",
  }),
  CertificationItemSchema.parse({
    id: "cert-nilai-pkl-1",
    verification: "VERIFIED",
    position: 5,
    title: "Sertifikat Praktik Kerja Lapangan (Bagian 1)",
    issuer: "Dinas Kominfo DIY",
    issuedLabel: "Issued 2025",
    category: "Industry Experience",
    imagePath: "/assets/certificates/nilai-pkl-1.jpg",
    description:
      "Official credential verifying the completion of practical field work in information technology services. Activities encompassed technical support, network and device monitoring, connectivity troubleshooting, technical documentation, and IT infrastructure maintenance support.",
  }),
  CertificationItemSchema.parse({
    id: "cert-nilai-pkl-2",
    verification: "VERIFIED",
    position: 6,
    title: "Sertifikat Penilaian Praktik Kerja Lapangan (Bagian 2)",
    issuer: "Dinas Kominfo DIY",
    issuedLabel: "Issued 2025",
    category: "Industry Experience",
    imagePath: "/assets/certificates/nilai-pkl-2.jpg",
    description:
      "Official credential verifying the completion of practical field work in information technology services. Activities encompassed technical support, network and device monitoring, connectivity troubleshooting, technical documentation, and IT infrastructure maintenance support.",
  }),
];
