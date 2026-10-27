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
    focusAreas: string[];
  };
  profileJourney: {
    title: string;
    descriptor: string;
    overviewTag: string;
    summaryP1: string;
    summaryP2: string;
    summaryP3: string;
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
    journeyChips: {
      amikom: string[];
      kominfo: string[];
      smk: string[];
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
    descriptions: Record<string, string>;
  };
  documentation: {
    title: string;
    descriptor: string;
    swipeHint: string;
    closeModal: string;
    previewAria: string;
    titles: Record<string, string>;
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
        "I focus on software development and IT infrastructure engineering, with a strong emphasis on application design, system integration, network reliability, and technical process automation. My practical experience in information technology services covers network monitoring, device status analysis, troubleshooting, and technical documentation. I also develop projects spanning web applications, monitoring systems, enterprise network simulations, and AI-assisted solutions.\n\nThroughout every development process, I prioritize systematic problem-solving, implementation accuracy, security, and long-term system maintainability. I continually deepen my technical competence through project development and technology exploration, aiming to build scalable, reliable solutions that deliver tangible value to users and organizations.",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
      downloadCv: "Download CV",
      statusAvailable: "OPEN TO WORK COLLABORATIONS",
      portraitAlt: "Fauzi Budikusuma — Formal Portrait",
      focusAreas: [
        "Full-Stack Web & API Development",
        "Enterprise Network Architecture & Routing",
        "Artificial Intelligence & Machine Learning",
      ],
    },
    profileJourney: {
      title: "Profile & Journey",
      descriptor: "BACKGROUND & EXPERTISE",
      overviewTag: "OVERVIEW",
      summaryP1:
        "I focus on software development and network engineering, with a keen attention to application design, system integration, infrastructure monitoring, and technical troubleshooting. I build my core competencies through hands-on project engineering and practical field experience in information technology services.",
      summaryP2:
        "My practical experience encompasses network and device health monitoring, bandwidth utilization analysis, technical incident resolution, as well as documentation and deployment support for network hardware. On the software engineering side, I explore web applications, monitoring platforms, infrastructure simulations, and artificial intelligence integration to deliver functional, well-structured solutions.",
      summaryP3:
        "In every engineering engagement, I prioritize a systematic methodology, implementation rigor, traceable documentation, and a steadfast commitment to system security and reliability. I continually advance my technical capabilities through iterative practice, rigorous evaluation, and continuous learning to deliver solutions that solve real-world problems.",
      principlesTag: "OPERATIONAL PRINCIPLES:",
      principlesTitle: "OPERATIONAL PRINCIPLES",
      principle1: "System Reliability & Structured Architecture",
      principle2: "Network Integrity & Technical Security",
      principle3: "Accurate & Evidence-Based Documentation",
      chronoTag: "CHRONO",
      timelineTitle: "EDUCATION & EXPERIENCE TIMELINE",
      journeyDescriptions: {
        amikom:
          "Pursuing a bachelor's degree in Informatics, building a solid foundation in computing, algorithms, database systems, and software engineering. I also focus on deepening my understanding of Artificial Intelligence (AI) and Machine Learning (ML), including concepts, methodologies, and their real-world applications in developing intelligent systems and data-driven solutions.",
        kominfo:
          "Underwent practical training in information technology services, supporting network and bandwidth monitoring, device health inspection, troubleshooting, and technical documentation. Utilized The Dude and PRTG to assist network monitoring across provincial government and educational environments, while actively supporting network equipment installation according to team requirements.",
        smk:
          "Built a technical foundation in network topology, device configuration, routing, switching, system administration, and connectivity troubleshooting. This learning experience formed the bedrock for broader exploration into IT infrastructure and systems development.",
      },
      journeyChips: {
        amikom: [
          "Informatics",
          "Software Development",
          "Artificial Intelligence",
          "Machine Learning",
        ],
        kominfo: [
          "Network Monitoring",
          "Troubleshooting",
          "Technical Documentation",
        ],
        smk: [
          "MikroTik",
          "Cisco",
          "System Administration",
          "Network Topology",
        ],
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
          "Network monitoring application providing device status, latency metrics, packet loss, and connectivity history through a visual dashboard. Features incident logging and automated alerts to help identify disruptions and evaluate network reliability.",
        "project-research-news-intelligence-center":
          "Information intelligence platform aggregating and organizing technology news and research publications. Integrates AI-assisted analysis to support information summarization, key takeaway extraction, topic clustering, and trend monitoring through a centralized dashboard.",
        "project-stacklab":
          "Interactive technical learning and simulation platform providing hands-on sandbox environments for SQL, APIs, JSON, Linux, and computer networks. Designed to help users test their understanding, explore configurations, and practice technical skills in a structured workspace.",
        "project-sentinel":
          "Cybersecurity intelligence platform designed to evaluate device security posture based on verifiable technical signals. Combines rule-based risk evaluation, threat intelligence, and mitigation recommendations with AI as an analytical assistant rather than an autonomous decision maker.",
        "project-enterprise-network-lab":
          "Enterprise network lab simulation utilizing MikroTik Cloud Hosted Router (CHR), focusing on OSPF and BGP routing, VLAN segmentation, and firewall rule enforcement. Serves as a practical environment to understand multi-area network topology, inter-site connectivity, and network infrastructure management.",
        "project-datacenter-simulation":
          "Data center network architecture simulation built with a layered topology covering core, distribution, access, WAN connectivity, server farm, and network operations center. The design emphasizes link redundancy, network segmentation, high service availability, and operational observability.",
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
      descriptions: {
        "cert-mtcna":
          "Certification demonstrating foundational competency in MikroTik-based network management, covering routing configuration, wireless networking, firewalls, and bandwidth management to ensure reliable network connectivity.",
        "cert-google-cybersecurity":
          "Professional certification program covering cybersecurity fundamentals, threat and vulnerability identification, network hardening, and the use of security tools such as SIEM. Also encompasses the practical use of Linux, SQL, and Python to support security analysis and incident response.",
        "cert-google-ai":
          "Foundational learning program on leveraging generative artificial intelligence effectively and responsibly, including prompt design, AI integration into daily workflows, productivity optimization, and understanding ethical AI practices.",
        "cert-uji-kompetensi-1":
          "Competency certificate covering foundational local area network design, topology planning, hardware requirement identification, structured cabling, and network infrastructure installation according to technical standards.",
        "cert-uji-kompetensi-2":
          "Competency certificate covering foundational local area network design, topology planning, hardware requirement identification, structured cabling, and network infrastructure installation according to technical standards.",
        "cert-nilai-pkl-1":
          "Official credential verifying the completion of practical field work in information technology services. Activities encompassed technical support, network and device monitoring, connectivity troubleshooting, technical documentation, and IT infrastructure maintenance support.",
        "cert-nilai-pkl-2":
          "Official credential verifying the completion of practical field work in information technology services. Activities encompassed technical support, network and device monitoring, connectivity troubleshooting, technical documentation, and IT infrastructure maintenance support.",
      },
    },
    documentation: {
      title: "Field Documentation",
      descriptor: "PHOTOGRAPHIC RECORDS OF DEPLOYMENTS & COLLABORATIONS",
      swipeHint: "SWIPE ↔",
      closeModal: "Close field photo preview",
      previewAria: "Preview field photo for",
      titles: {
        "gallery-gdg-jogja-gen-ai": "Google Developer Groups (GDG) Jogja — Build Your First Gen AI App",
        "gallery-magang-kominfo-diy": "Internship Activities at Dinas Kominfo DIY",
        "gallery-magang-monitoring-jaringan": "Network Monitoring Internship Activities",
        "gallery-maintenance-server": "Server & Infrastructure Maintenance",
        "gallery-policy-brief-sleman": "Handover of Sleman Regency Organizational Policy Brief Outcomes",
        "gallery-survey-gedung-agung": "Gedung Agung Network Survey",
      },
      captions: {
        img1: "Active participation in Google Developer Groups (GDG) Jogja session on building generative AI applications.",
        img2: "Field technical support and help desk supervisor activities at Dinas Komunikasi dan Informatika (Kominfo) DIY.",
        img3: "Real-time enterprise network telemetry and provincial infrastructure monitoring during internship at Dinas Kominfo DIY.",
        img4: "Routine server hardware maintenance, structured rack inspection, and operational node integrity checks.",
        img5: "Formal handover of organizational policy brief formulation outcomes for Sleman Regency.",
        img6: "On-site field survey and network infrastructure assessment conducted at Gedung Agung.",
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
      tagline2: "BUILT WITH PURPOSE. GROWING THROUGH EXPERIENCE.",
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
        "Saya berfokus pada pengembangan perangkat lunak dan rekayasa infrastruktur TI, dengan perhatian pada perancangan aplikasi, integrasi sistem, keandalan jaringan, serta otomatisasi proses teknis. Pengalaman praktik di bidang layanan teknologi informasi mencakup pemantauan jaringan, analisis status perangkat, pemecahan masalah, dan dokumentasi teknis. Saya juga mengembangkan berbagai proyek yang mencakup aplikasi web, sistem pemantauan, simulasi jaringan perusahaan, dan solusi berbantuan kecerdasan buatan.\n\nDalam setiap proses pengembangan, saya mengutamakan pemecahan masalah secara sistematis, ketepatan implementasi, keamanan, dan pemeliharaan sistem jangka panjang. Saya terus memperdalam kompetensi teknis melalui pengembangan proyek dan eksplorasi teknologi, dengan tujuan membangun solusi yang terukur, andal, serta memberikan nilai nyata bagi pengguna dan organisasi.",
      viewProjects: "Lihat Proyek",
      contactMe: "Hubungi Saya",
      downloadCv: "Unduh CV",
      statusAvailable: "TERBUKA UNTUK KOLABORASI KERJA",
      portraitAlt: "Fauzi Budikusuma — Potret Formal",
      focusAreas: [
        "Pengembangan Web & API Full-Stack",
        "Arsitektur & Routing Jaringan Enterprise",
        "Kecerdasan Buatan & Pembelajaran Mesin",
      ],
    },
    profileJourney: {
      title: "Profil & Perjalanan",
      descriptor: "LATAR BELAKANG & KEAHLIAN",
      overviewTag: "RINGKASAN",
      summaryP1:
        "Saya berfokus pada pengembangan perangkat lunak dan rekayasa jaringan, dengan perhatian pada perancangan aplikasi, integrasi sistem, pemantauan infrastruktur, dan pemecahan masalah teknis. Saya membangun kompetensi melalui pengembangan proyek serta pengalaman praktik langsung di bidang layanan teknologi informasi.",
      summaryP2:
        "Pengalaman praktik tersebut mencakup pemantauan kondisi jaringan dan perangkat, pemeriksaan penggunaan bandwidth, penanganan kendala teknis, serta dokumentasi dan dukungan instalasi perangkat jaringan. Di sisi pengembangan perangkat lunak, saya mengeksplorasi aplikasi web, sistem pemantauan, simulasi infrastruktur, dan pemanfaatan kecerdasan buatan untuk membangun solusi yang fungsional dan terstruktur.",
      summaryP3:
        "Dalam setiap pekerjaan, saya mengutamakan pendekatan sistematis, ketelitian implementasi, dokumentasi yang dapat ditelusuri, serta perhatian terhadap keamanan dan keandalan sistem. Saya terus mengembangkan kompetensi melalui praktik, evaluasi, dan pembelajaran berkelanjutan untuk menghasilkan solusi yang relevan dengan kebutuhan nyata.",
      principlesTag: "PRINSIP KERJA:",
      principlesTitle: "PRINSIP KERJA",
      principle1: "Keandalan Sistem dan Arsitektur yang Terstruktur",
      principle2: "Integritas Jaringan dan Keamanan Teknis",
      principle3: "Dokumentasi Akurat dan Berbasis Bukti",
      chronoTag: "KRONOLOGI",
      timelineTitle: "LINI MASA PENDIDIKAN & PENGALAMAN",
      journeyDescriptions: {
        amikom:
          "Menempuh pendidikan sarjana di bidang Informatika dengan membangun fondasi dalam komputasi, algoritma, basis data, dan pengembangan perangkat lunak. Saya juga berfokus memperdalam pemahaman mengenai Kecerdasan Buatan (Artificial Intelligence/AI) dan Pembelajaran Mesin (Machine Learning/ML), termasuk konsep, metode, serta penerapannya dalam pengembangan sistem cerdas dan solusi berbasis data.",
        kominfo:
          "Menjalani praktik di bidang layanan teknologi informasi dengan mendukung pemantauan jaringan dan bandwidth, pemeriksaan status perangkat, troubleshooting, serta dokumentasi teknis. Menggunakan The Dude dan PRTG untuk membantu pemantauan jaringan di lingkungan pemerintah Provinsi dan sekolah, serta mendukung kegiatan instalasi perangkat jaringan sesuai kebutuhan tim.",
        smk:
          "Membangun fondasi teknis dalam topologi jaringan, konfigurasi perangkat, routing, switching, administrasi sistem, dan pemecahan masalah konektivitas. Pengalaman pembelajaran ini membentuk dasar untuk mengeksplorasi infrastruktur TI dan pengembangan sistem secara lebih luas.",
      },
      journeyChips: {
        amikom: [
          "Informatika",
          "Pengembangan Perangkat Lunak",
          "Artificial Intelligence",
          "Machine Learning",
        ],
        kominfo: [
          "Pemantauan Jaringan",
          "Troubleshooting",
          "Dokumentasi Teknis",
        ],
        smk: [
          "MikroTik",
          "Cisco",
          "Administrasi Sistem",
          "Topologi Jaringan",
        ],
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
          "Aplikasi pemantauan jaringan yang menyajikan status perangkat, metrik latensi, kehilangan paket, dan riwayat konektivitas melalui dasbor visual. Dilengkapi pencatatan kejadian serta peringatan otomatis untuk membantu mengidentifikasi gangguan dan mengevaluasi keandalan jaringan.",
        "project-research-news-intelligence-center":
          "Platform intelijen informasi yang mengumpulkan dan mengorganisasi berita teknologi serta publikasi penelitian. Mengintegrasikan analisis berbantuan AI untuk mendukung peringkasan informasi, ekstraksi poin penting, pengelompokan topik, dan pemantauan tren melalui satu dasbor terpusat.",
        "project-stacklab":
          "Platform pembelajaran dan simulasi teknis interaktif yang menyediakan lingkungan praktik untuk SQL, API, JSON, Linux, dan jaringan komputer. Dirancang untuk membantu pengguna menguji pemahaman, mengeksplorasi konfigurasi, dan melatih keterampilan teknis melalui lingkungan kerja yang terstruktur.",
        "project-sentinel":
          "Platform intelijen keamanan siber yang dirancang untuk mengevaluasi kondisi keamanan perangkat berdasarkan sinyal teknis yang dapat diverifikasi. Menggabungkan evaluasi risiko berbasis aturan, informasi ancaman, dan rekomendasi mitigasi dengan AI sebagai pendukung analisis, bukan penentu hasil penilaian keamanan.",
        "project-enterprise-network-lab":
          "Simulasi laboratorium jaringan perusahaan menggunakan MikroTik Cloud Hosted Router (CHR), dengan fokus pada routing OSPF dan BGP, segmentasi VLAN, serta penerapan aturan firewall. Proyek ini menjadi sarana praktik untuk memahami desain jaringan multiwilayah, konektivitas antarsitus, dan pengelolaan infrastruktur jaringan.",
        "project-datacenter-simulation":
          "Simulasi arsitektur jaringan pusat data dengan pendekatan berlapis yang mencakup core, distribution, access, konektivitas WAN, server farm, dan pusat operasi jaringan. Perancangan menekankan redundansi koneksi, segmentasi jaringan, ketersediaan layanan, dan kemudahan pemantauan infrastruktur.",
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
      descriptions: {
        "cert-mtcna":
          "Sertifikasi yang menunjukkan kompetensi dasar dalam pengelolaan jaringan berbasis MikroTik, mencakup konfigurasi routing, jaringan nirkabel, firewall, serta manajemen bandwidth untuk mendukung konektivitas jaringan yang andal.",
        "cert-google-cybersecurity":
          "Program sertifikasi profesional yang mencakup dasar-dasar keamanan siber, identifikasi ancaman dan kerentanan, pengamanan jaringan, serta penggunaan alat keamanan seperti SIEM. Materi juga mencakup pemanfaatan Linux, SQL, dan Python untuk mendukung analisis serta penanganan masalah keamanan.",
        "cert-google-ai":
          "Program pembelajaran dasar mengenai pemanfaatan kecerdasan buatan generatif secara efektif dan bertanggung jawab, termasuk penyusunan prompt, integrasi AI ke dalam alur kerja, peningkatan produktivitas, serta pemahaman mengenai penggunaan AI yang etis.",
        "cert-uji-kompetensi-1":
          "Sertifikat kompetensi yang mencakup dasar perancangan jaringan area lokal, penyusunan topologi, identifikasi kebutuhan perangkat, pengkabelan terstruktur, dan instalasi infrastruktur jaringan sesuai kebutuhan teknis.",
        "cert-uji-kompetensi-2":
          "Sertifikat kompetensi yang mencakup dasar perancangan jaringan area lokal, penyusunan topologi, identifikasi kebutuhan perangkat, pengkabelan terstruktur, dan instalasi infrastruktur jaringan sesuai kebutuhan teknis.",
        "cert-nilai-pkl-1":
          "Dokumen pengakuan atas pelaksanaan praktik kerja lapangan di bidang layanan teknologi informasi. Kegiatan praktik mencakup dukungan teknis, pemantauan jaringan dan perangkat, penanganan kendala konektivitas, serta dokumentasi dan dukungan pemeliharaan infrastruktur TI.",
        "cert-nilai-pkl-2":
          "Dokumen pengakuan atas pelaksanaan praktik kerja lapangan di bidang layanan teknologi informasi. Kegiatan praktik mencakup dukungan teknis, pemantauan jaringan dan perangkat, penanganan kendala konektivitas, serta dokumentasi dan dukungan pemeliharaan infrastruktur TI.",
      },
    },
    documentation: {
      title: "Dokumentasi Lapangan",
      descriptor: "PENGALAMAN PRAKTIK & OPERASIONAL LAB",
      swipeHint: "GESER ↔",
      closeModal: "Tutup pratinjau foto lapangan",
      previewAria: "Lihat foto lapangan untuk",
      titles: {
        "gallery-gdg-jogja-gen-ai": "Google Developer Groups (GDG) Jogja — Build Your First Gen AI App",
        "gallery-magang-kominfo-diy": "Kegiatan Magang di Dinas Kominfo DIY",
        "gallery-magang-monitoring-jaringan": "Kegiatan Magang Monitoring Jaringan",
        "gallery-maintenance-server": "Maintenance Server & Infrastruktur",
        "gallery-policy-brief-sleman": "Penyerahan Policy Brief Organisasi Kabupaten Sleman",
        "gallery-survey-gedung-agung": "Survey Lapangan Gedung Agung",
      },
      captions: {
        img1: "Partisipasi aktif dalam sesi teknis Google Developer Groups (GDG) Jogja membangun aplikasi generative AI.",
        img2: "Dokumentasi kegiatan operasional dan supervisi helpdesk TI di Dinas Kominfo DIY.",
        img3: "Pemantauan telemetri jaringan enterprise dan infrastruktur provinsi saat magang di Dinas Kominfo DIY.",
        img4: "Pemeliharaan rutin perangkat keras server, inspeksi rak, dan pemeriksaan integritas node operasional.",
        img5: "Penyerahan resmi hasil perumusan policy brief organisasi untuk Pemerintah Kabupaten Sleman.",
        img6: "Survey lapangan teknis dan asesmen infrastruktur jaringan yang dilaksanakan di Gedung Agung.",
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
      tagline2: "DIBANGUN DENGAN TUJUAN. BERKEMBANG MELALUI PENGALAMAN.",
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
