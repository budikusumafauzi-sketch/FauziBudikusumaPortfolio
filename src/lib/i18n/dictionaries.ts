export type Language = "en" | "id";

export interface Dictionary {
  common: {
    languageSwitcherAria: string;
    englishLabel: string;
    indonesianLabel: string;
    themeToggleAria: string;
    verified: string;
    channel: string;
  };
  overlay: {
    subtitle: string;
    status: string;
    discipline: string;
    copyright: string;
  };
  nav: {
    overview: string;
    profile: string;
    projects: string;
    credentials: string;
    documentation: string;
    contact: string;
    portfolio: string;
    openMenuAria: string;
    closeMenuAria: string;
    brandAria: string;
  };
  hero: {
    headline: string;
    intro: string;
    viewProjects: string;
    contactMe: string;
    downloadCv: string;
    statusAvailable: string;
    portraitAlt: string;
  };
  profileJourney: {
    title: string;
    descriptor: string;
    overviewTag: string;
    summaryP1: string;
    summaryP2: string;
    principlesTag: string;
    principlesTitle: string;
    principle1: string;
    principle2: string;
    principle3: string;
    chronoTag: string;
    timelineTitle: string;
    journeyDescriptions: {
      amikom: string;
      kominfo: string;
      smk: string;
    };
  };
  skills: {
    title: string;
    descriptor: string;
    groups: {
      languages: string;
      frontend: string;
      backend: string;
      database: string;
      devops: string;
    };
  };
  projects: {
    title: string;
    descriptor: string;
    viewRepo: string;
    privateRepo: string;
    inDevelopment: string;
    completed: string;
    viewImage: string;
    closeModal: string;
    previewAria: string;
    descriptions: Record<string, string>;
  };
  credentials: {
    title: string;
    descriptor: string;
    viewCredential: string;
    verifiedAccreditation: string;
    issuedBy: string;
    date: string;
    category: string;
    closeModal: string;
  };
  documentation: {
    title: string;
    descriptor: string;
    swipeHint: string;
    captions: {
      img1: string;
      img2: string;
      img3: string;
      img4: string;
      img5: string;
      img6: string;
    };
  };
  contact: {
    title: string;
    descriptor: string;
    emailAria: string;
    channels: {
      email: string;
      linkedin: string;
      github: string;
      instagram: string;
      credly: string;
    };
  };
  footer: {
    brandHeadline: string;
    location: string;
    tagline1: string;
    tagline2: string;
    copyright: string;
    top: string;
    backToTopAria: string;
  };
  chat: {
    title: string;
    statusLive: string;
    statusUnavailable: string;
    subtitle: string;
    welcome: string;
    suggestedQuestions: string;
    starters: string[];
    placeholder: string;
    disclaimer: string;
    sendAria: string;
    launcherAriaOpen: string;
    launcherAriaClosed: string;
    closeAria: string;
    verifiedSources: string;
    retrieving: string;
    scopeGuard: string;
    portfolioGuard: string;
    rateLimitExceeded: string;
    serviceNotice: string;
  };
  notFound: {
    title: string;
    subtitle: string;
    backHome: string;
  };
}

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    common: {
      languageSwitcherAria: "Language selector",
      englishLabel: "English",
      indonesianLabel: "Bahasa Indonesia",
      themeToggleAria: "Toggle color theme",
      verified: "VERIFIED",
      channel: "CHANNEL",
    },
    overlay: {
      subtitle: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER",
      status: "• LAUNCHING WORKSPACE…",
      discipline: "DISCIPLINE // 01 PERSONAL PORTFOLIO",
      copyright: "© 2026 • ALL RIGHTS RESERVED",
    },
    nav: {
      overview: "Overview",
      profile: "Profile & Journey",
      projects: "Projects",
      credentials: "Credentials",
      documentation: "Documentation",
      contact: "Contact",
      portfolio: "PORTFOLIO",
      openMenuAria: "Open navigation menu",
      closeMenuAria: "Close navigation menu",
      brandAria: "Fauzi Budikusuma — Scroll to top",
    },
    hero: {
      headline: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER",
      intro:
        "Undergraduate Informatics student at Universitas AMIKOM Yogyakarta specializing in Software Development and IT Networking. Proven track record in full-stack architecture, network infrastructure configuration, and enterprise IT support.",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
      downloadCv: "Download CV",
      statusAvailable: "AVAILABLE FOR WORKSPACE COLLABORATION",
      portraitAlt: "Fauzi Budikusuma — Formal Portrait",
    },
    profileJourney: {
      title: "Profile & Journey",
      descriptor: "BACKGROUND & EXPERTISE",
      overviewTag: "OVERVIEW",
      summaryP1:
        "I am a dedicated undergraduate student in Informatics at Universitas AMIKOM Yogyakarta, pursuing dual specializations in Software Engineering and Network Architecture. My practical foundation bridges modern software systems with robust routing and infrastructure protocols.",
      summaryP2:
        "With hands-on experience as a Help Desk Supervisor Intern at Dinas Komunikasi dan Informatika (Kominfo) DIY and industry certifications including MikroTik MTCNA, I bring disciplined engineering practices to both codebases and production networks.",
      principlesTag: "OPERATIONAL PRINCIPLES:",
      principlesTitle: "OPERATIONAL PRINCIPLES",
      principle1: "Resilient & Auditable Architecture",
      principle2: "Strict Network Integrity & Standards",
      principle3: "Truthful, Zero-Hallucination Delivery",
      chronoTag: "CHRONO",
      timelineTitle: "EDUCATION & EXPERIENCE TIMELINE",
      journeyDescriptions: {
        amikom:
          "Pursuing Bachelor's Degree in Informatics, focusing on software development and enterprise computer networking.",
        kominfo:
          "Supervised IT helpdesk operations, diagnosed enterprise network issues, managed user ticket workflows, and configured local area network infrastructure across provincial government departments.",
        smk:
          "Specialized in Computer and Network Engineering (TKJ). Mastered foundational network topology, Linux server administration, and routing protocols.",
      },
    },
    skills: {
      title: "Technical Stack",
      descriptor: "LANGUAGES, FRAMEWORKS & INFRASTRUCTURE",
      groups: {
        languages: "Languages",
        frontend: "Frontend",
        backend: "Backend & API",
        database: "Database & Caching",
        devops: "DevOps & Tools",
      },
    },
    projects: {
      title: "Selected Projects",
      descriptor: "SOFTWARE ARCHITECTURE & NETWORK SYSTEMS",
      viewRepo: "GitHub Repository",
      privateRepo: "Private repository",
      inDevelopment: "In Development",
      completed: "Completed",
      viewImage: "Preview Display",
      closeModal: "Close project display preview",
      previewAria: "Preview display image for",
      descriptions: {
        "project-network-monitoring-dashboard":
          "Real-time network telemetry and SNMP device monitoring dashboard providing active node health, bandwidth throughput, and automated incident alerts.",
        "project-research-news-intelligence-center":
          "Automated intelligence platform aggregating, categorizing, and summarizing tech news and academic research streams via NLP pipelines.",
        "project-stacklab":
          "Developer workflow orchestration and sandbox environment for containerized microservices and automated API testing pipelines.",
        "project-sentinel":
          "Infrastructure security monitoring and network anomaly detection system providing automated traffic analysis and alerting.",
        "project-enterprise-network-lab":
          "Multi-area OSPF and BGP routing topology built on MikroTik Cloud Hosted Router (CHR) featuring VLAN segmentation and hardened firewall filters.",
        "project-datacenter-simulation":
          "Enterprise leaf-spine architecture simulation with redundant core switching, LACP link aggregation, and resilient disaster recovery routing.",
      },
    },
    credentials: {
      title: "Credentials & Certifications",
      descriptor: "PROFESSIONAL VALIDATION & EXCELLENCE",
      viewCredential: "View Credential",
      verifiedAccreditation: "VERIFIED ACCREDITATION",
      issuedBy: "ISSUED BY",
      date: "DATE",
      category: "CATEGORY",
      closeModal: "Close certificate preview",
    },
    documentation: {
      title: "Field Documentation",
      descriptor: "PHOTOGRAPHIC RECORDS OF DEPLOYMENTS & COLLABORATIONS",
      swipeHint: "SWIPE ↔",
      captions: {
        img1: "Hardware routing configuration session with multi-area OSPF protocols.",
        img2: "Technical supervision, ticket resolution, and provincial network continuity.",
        img3: "Patch panel cable management and Cat6 termination testing.",
        img4: "Deployment of virtualization nodes and network monitoring agents.",
        img5: "Full-stack software development workstation and API testing environment.",
        img6: "Practical vocational competency examination in wide area network design.",
      },
    },
    contact: {
      title: "Direct Channels",
      descriptor: "COMMUNICATION & PROFESSIONAL INQUIRIES",
      emailAria: "Email Fauzi via Gmail (opens in a new tab)",
      channels: {
        email: "Direct Email",
        linkedin: "LinkedIn Profile",
        github: "GitHub Repositories",
        instagram: "Instagram Activity",
        credly: "Credly Profile",
      },
    },
    footer: {
      brandHeadline: "SOFTWARE DEVELOPMENT & NETWORK ENGINEER",
      location: "YOGYAKARTA, ID",
      tagline1: "Crafted with Next.js, Tailwind CSS & Prisma.",
      tagline2: "Zero-cost, truthful, verifiable engineering.",
      copyright: "© 2026 Fauzi Budikusuma. All rights reserved.",
      top: "TOP",
      backToTopAria: "Back to top",
    },
    chat: {
      title: "Fauzi's AI Assistant",
      statusLive: "LIVE",
      statusUnavailable: "UNAVAILABLE",
      subtitle: "Answers strictly from verified profile data",
      welcome:
        "Hello! I am Fauzi's AI Assistant. I can answer questions about Fauzi Budikusuma's software development, network engineering projects, verified credentials, and professional background strictly using verified portfolio records.",
      suggestedQuestions: "Suggested questions:",
      starters: [
        "What is Fauzi's professional background?",
        "What technical skills and tools does Fauzi use?",
        "Tell me about Fauzi's selected projects.",
        "What certifications and internship experience does Fauzi have?",
        "How can I contact Fauzi directly?",
      ],
      placeholder: "Ask a question about Fauzi…",
      disclaimer: "Plain text only · Grounded in PostgreSQL records",
      sendAria: "Send question",
      launcherAriaOpen: "Close Fauzi's AI Assistant",
      launcherAriaClosed: "Open Fauzi's AI Assistant",
      closeAria: "Close AI Assistant",
      verifiedSources: "Verified Portfolio Sources:",
      retrieving: "Retrieving verified portfolio records…",
      scopeGuard: "SCOPE GUARDRAIL ENFORCED",
      portfolioGuard: "PORTFOLIO GUARDRAIL",
      rateLimitExceeded: "RATE LIMIT EXCEEDED",
      serviceNotice: "SERVICE NOTICE",
    },
    notFound: {
      title: "PAGE NOT FOUND",
      subtitle: "The requested workspace resource could not be found.",
      backHome: "RETURN TO HOME",
    },
  },
  id: {
    common: {
      languageSwitcherAria: "Pilihan bahasa",
      englishLabel: "English",
      indonesianLabel: "Bahasa Indonesia",
      themeToggleAria: "Ganti tema tampilan",
      verified: "TERVERIFIKASI",
      channel: "SALURAN",
    },
    overlay: {
      subtitle: "PENGEMBANG PERANGKAT LUNAK & TEKNIK JARINGAN",
      status: "• MEMULAI RUANG KERJA…",
      discipline: "DISIPLIN // 01 PORTOFOLIO PRIBADI",
      copyright: "© 2026 • HAK CIPTA DILINDUNGI",
    },
    nav: {
      overview: "Ringkasan",
      profile: "Profil & Perjalanan",
      projects: "Proyek",
      credentials: "Sertifikasi",
      documentation: "Dokumentasi",
      contact: "Kontak",
      portfolio: "PORTOFOLIO",
      openMenuAria: "Buka menu navigasi",
      closeMenuAria: "Tutup menu navigasi",
      brandAria: "Fauzi Budikusuma — Kembali ke atas",
    },
    hero: {
      headline: "PENGEMBANG PERANGKAT LUNAK & TEKNIK JARINGAN",
      intro:
        "Mahasiswa S1 Informatika di Universitas AMIKOM Yogyakarta yang mendalami Pengembangan Perangkat Lunak dan Teknik Jaringan. Berpengalaman dalam arsitektur full-stack, konfigurasi infrastruktur jaringan, dan dukungan TI enterprise.",
      viewProjects: "Lihat Proyek",
      contactMe: "Hubungi Saya",
      downloadCv: "Unduh CV",
      statusAvailable: "TERSEDIA UNTUK KOLABORASI RUANG KERJA",
      portraitAlt: "Fauzi Budikusuma — Potret Formal",
    },
    profileJourney: {
      title: "Profil & Perjalanan",
      descriptor: "LATAR BELAKANG & KEAHLIAN",
      overviewTag: "RINGKASAN",
      summaryP1:
        "Saya adalah mahasiswa S1 Informatika di Universitas AMIKOM Yogyakarta yang mendalami bidang Rekayasa Perangkat Lunak dan Arsitektur Jaringan. Landasan praktis saya memadukan sistem perangkat lunak modern dengan protokol routing dan infrastruktur jaringan yang andal.",
      summaryP2:
        "Dengan pengalaman langsung sebagai Help Desk Supervisor Intern di Dinas Komunikasi dan Informatika (Kominfo) DIY serta sertifikasi industri termasuk MikroTik MTCNA, saya menerapkan praktik rekayasa yang terdisiplin pada basis kode maupun jaringan produksi.",
      principlesTag: "PRINSIP OPERASIONAL:",
      principlesTitle: "PRINSIP OPERASIONAL",
      principle1: "Arsitektur Andal & Dapat Diaudit",
      principle2: "Integritas Jaringan & Standar yang Ketat",
      principle3: "Penyampaian Faktual & Tanpa Halusinasi",
      chronoTag: "KRONOLOGI",
      timelineTitle: "LINI MASA PENDIDIKAN & PENGALAMAN",
      journeyDescriptions: {
        amikom:
          "Menempuh pendidikan S1 Informatika, berfokus pada pengembangan perangkat lunak dan jaringan komputer enterprise.",
        kominfo:
          "Mensupervisi operasional helpdesk TI, mendiagnosis kendala jaringan enterprise, mengelola alur tiket pengguna, dan mengonfigurasi infrastruktur LAN antar dinas pemerintah provinsi.",
        smk:
          "Kompetensi keahlian Teknik Komputer dan Jaringan (TKJ). Menguasai topologi jaringan dasar, administrasi server Linux, dan protokol routing.",
      },
    },
    skills: {
      title: "Kemampuan Teknis",
      descriptor: "BAHASA PEMROGRAMAN, FRAMEWORK & INFRASTRUKTUR",
      groups: {
        languages: "Bahasa Pemrograman",
        frontend: "Frontend",
        backend: "Backend & API",
        database: "Basis Data & Caching",
        devops: "DevOps & Peralatan",
      },
    },
    projects: {
      title: "Proyek Pilihan",
      descriptor: "ARSITEKTUR PERANGKAT LUNAK & SISTEM JARINGAN",
      viewRepo: "Repositori GitHub",
      privateRepo: "Repositori privat",
      inDevelopment: "Dalam Pengembangan",
      completed: "Selesai",
      viewImage: "Lihat Tampilan",
      closeModal: "Tutup pratinjau tampilan proyek",
      previewAria: "Lihat gambar tampilan proyek",
      descriptions: {
        "project-network-monitoring-dashboard":
          "Dasbor telemetri jaringan waktu-nyata dan pemantauan perangkat SNMP yang menyediakan status kesehatan node aktif, throughput bandwidth, dan peringatan insiden otomatis.",
        "project-research-news-intelligence-center":
          "Platform intelijen otomatis yang mengagregasi, mengkategorikan, dan meringkas berita teknologi serta riset akademik melalui alur kerja NLP.",
        "project-stacklab":
          "Orkestrasi alur kerja pengembang dan lingkungan sandbox untuk layanan mikro berbasis kontainer serta alur pengujian API otomatis.",
        "project-sentinel":
          "Sistem pemantauan keamanan infrastruktur dan deteksi anomali jaringan yang menyediakan analisis lalu lintas otomatis serta sistem peringatan.",
        "project-enterprise-network-lab":
          "Topologi perutean OSPF dan BGP multi-area yang dibangun pada MikroTik Cloud Hosted Router (CHR) dengan segmentasi VLAN dan filter firewall yang diperketat.",
        "project-datacenter-simulation":
          "Simulasi arsitektur leaf-spine enterprise dengan peralihan inti redundan, agregasi tautan LACP, dan perutean pemulihan bencana yang tangguh.",
      },
    },
    credentials: {
      title: "Sertifikasi & Kredensial",
      descriptor: "VALIDASI PROFESIONAL & KEUNGGULAN",
      viewCredential: "Lihat Sertifikat",
      verifiedAccreditation: "AKREDITASI TERVERIFIKASI",
      issuedBy: "DITERBITKAN OLEH",
      date: "TANGGAL",
      category: "KATEGORI",
      closeModal: "Tutup pratinjau sertifikat",
    },
    documentation: {
      title: "Dokumentasi Lapangan",
      descriptor: "PENGALAMAN PRAKTIK & OPERASIONAL LAB",
      swipeHint: "GESER ↔",
      captions: {
        img1: "Sesi konfigurasi perutean perangkat keras dengan protokol OSPF multi-area.",
        img2: "Supervisi teknis, penyelesaian tiket, dan kontinuitas jaringan provinsi.",
        img3: "Manajemen kabel patch panel dan pengujian terminasi Cat6.",
        img4: "Penerapan node virtualisasi dan agen pemantauan jaringan.",
        img5: "Stasiun kerja pengembangan perangkat lunak full-stack dan lingkungan pengujian API.",
        img6: "Ujian kompetensi kejuruan praktis dalam desain jaringan area luas (WAN).",
      },
    },
    contact: {
      title: "Saluran Komunikasi",
      descriptor: "KOMUNIKASI & KERJASAMA PROFESIONAL",
      emailAria: "Kirim email ke Fauzi lewat Gmail (membuka tab baru)",
      channels: {
        email: "Email Langsung",
        linkedin: "Profil LinkedIn",
        github: "Repositori GitHub",
        instagram: "Aktivitas Instagram",
        credly: "Profil Credly",
      },
    },
    footer: {
      brandHeadline: "PENGEMBANG PERANGKAT LUNAK & TEKNIK JARINGAN",
      location: "YOGYAKARTA, ID",
      tagline1: "Dibangun dengan Next.js, Tailwind CSS & Prisma.",
      tagline2: "Rekayasa tanpa biaya, faktual, dan dapat diverifikasi.",
      copyright: "© 2026 Fauzi Budikusuma. Hak cipta dilindungi.",
      top: "ATAS",
      backToTopAria: "Kembali ke atas",
    },
    chat: {
      title: "Asisten AI Fauzi",
      statusLive: "AKTIF",
      statusUnavailable: "TIDAK TERSEDIA",
      subtitle: "Menjawab secara ketat berdasarkan data profil terverifikasi",
      welcome:
        "Halo! Saya Asisten AI Fauzi. Saya dapat menjawab pertanyaan seputar pengembangan perangkat lunak, teknik jaringan, sertifikasi terverifikasi, dan latar belakang profesional Fauzi Budikusuma secara ketat menggunakan data portofolio publik terverifikasi.",
      suggestedQuestions: "Pertanyaan yang disarankan:",
      starters: [
        "Apa latar belakang profesional Fauzi?",
        "Keahlian teknis dan perangkat apa yang dikuasai Fauzi?",
        "Ceritakan proyek pilihan yang dibangun Fauzi.",
        "Sertifikasi dan pengalaman magang apa yang dimiliki Fauzi?",
        "Bagaimana cara menghubungi Fauzi secara langsung?",
      ],
      placeholder: "Tanyakan tentang Fauzi…",
      disclaimer: "Teks polos saja · Bersumber dari data PostgreSQL",
      sendAria: "Kirim pertanyaan",
      launcherAriaOpen: "Tutup Asisten AI Fauzi",
      launcherAriaClosed: "Buka Asisten AI Fauzi",
      closeAria: "Tutup Asisten AI",
      verifiedSources: "Sumber Portofolio Terverifikasi:",
      retrieving: "Mengambil data portofolio terverifikasi…",
      scopeGuard: "PEMBATAS CAKUPAN DITERAPKAN",
      portfolioGuard: "PEMBATAS PORTOFOLIO",
      rateLimitExceeded: "BATAS PERMINTAAN TERLAMPAUI",
      serviceNotice: "PEMBERITAHUAN LAYANAN",
    },
    notFound: {
      title: "HALAMAN TIDAK DITEMUKAN",
      subtitle: "Sumber daya ruang kerja yang diminta tidak dapat ditemukan.",
      backHome: "KEMBALI KE BERANDA",
    },
  },
};
