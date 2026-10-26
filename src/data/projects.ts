import { ProjectItem, ProjectItemSchema } from "./schemas";

// Verified project records updated on 2026-10-26 with Owner-supplied project display photos from 'Foto Project'
export const projectsData: ProjectItem[] = [
  ProjectItemSchema.parse({
    id: "project-network-monitoring-dashboard",
    verification: "VERIFIED",
    position: 0,
    title: "Network Monitoring Dashboard",
    summary:
      "Network monitoring application presenting device health, latency telemetry, packet loss, and connectivity history through visual dashboards. Features automated incident logging and proactive alerting to detect disruptions and evaluate network reliability.",
    technologies: ["SNMP", "Fastify", "TypeScript", "Tailwind CSS"],
    coverPath: "/assets/projects/network-monitoring-dashboard.png",
    repoUrl: "https://github.com/budikusumafauzi-sketch/network-monitoring-dashboard",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
  ProjectItemSchema.parse({
    id: "project-research-news-intelligence-center",
    verification: "VERIFIED",
    position: 1,
    title: "Research News Intelligence Center",
    summary:
      "Information intelligence platform that aggregates and organizes tech news and academic research publications. Integrates AI-assisted analytics to power automated summarization, key takeaway extraction, topic clustering, and trend tracking via a centralized dashboard.",
    technologies: ["FastAPI", "Python", "PostgreSQL", "Docker"],
    coverPath: "/assets/projects/research-news-intelligence-center.png",
    repoUrl: "https://github.com/budikusumafauzi-sketch/research-news-intelligence-center",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
  ProjectItemSchema.parse({
    id: "project-stacklab",
    verification: "VERIFIED",
    position: 2,
    title: "StackLab",
    summary:
      "Interactive learning and technical simulation platform offering hands-on practice environments for SQL, APIs, JSON, Linux systems, and computer networking. Designed to validate comprehension, test configurations, and sharpen technical engineering skills in structured workspaces.",
    technologies: ["Node.js", "Docker", "TypeScript", "Redis"],
    coverPath: "/assets/projects/stacklab.jpg",
    repoUrl: "https://github.com/budikusumafauzi-sketch/stacklab-v1",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
  ProjectItemSchema.parse({
    id: "project-sentinel",
    verification: "VERIFIED",
    position: 3,
    title: "Sentinel",
    summary:
      "Cybersecurity intelligence platform engineered to evaluate device security posture based on verifiable technical signals. Combines rule-based risk evaluation, threat intelligence, and remediation recommendations, utilizing AI as an analytical assistant rather than an authoritative decision-maker.",
    technologies: ["Python", "Network Security", "FastAPI", "Docker"],
    coverPath: "/assets/projects/sentinel.png",
    repoUrl: "https://github.com/budikusumafauzi-sketch/sentinel",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
  ProjectItemSchema.parse({
    id: "project-enterprise-network-lab",
    verification: "VERIFIED",
    position: 4,
    title: "Enterprise Network Lab (MikroTik CHR)",
    summary:
      "Enterprise network laboratory simulation utilizing MikroTik Cloud Hosted Router (CHR), focusing on OSPF and BGP routing, VLAN segmentation, and hardened firewall filtering. Serves as a practical testbed for multi-region network design, inter-site connectivity, and network infrastructure governance.",
    technologies: ["MikroTik CHR", "OSPF", "BGP", "VLAN", "Firewall"],
    coverPath: "/assets/projects/enterprise-network-lab-mikrotik.png",
    repoUrl: "https://github.com/budikusumafauzi-sketch/enterprise-network-lab-mikrotik",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
  ProjectItemSchema.parse({
    id: "project-datacenter-simulation",
    verification: "VERIFIED",
    position: 5,
    title: "Data Center Network Simulation",
    summary:
      "Hierarchical data center network architecture simulation spanning core, distribution, access, WAN edge, server farm, and network operations center (NOC). Design emphasizes connection redundancy, network segmentation, high service availability, and comprehensive infrastructure observability.",
    technologies: ["Leaf-Spine", "Cisco Packet Tracer", "LACP", "VLAN"],
    coverPath: "/assets/projects/enterprise-data-center-network-simulation.png",
    repoUrl: "https://github.com/budikusumafauzi-sketch/Enterprise-Data-Center-Network-Simulation",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
];
