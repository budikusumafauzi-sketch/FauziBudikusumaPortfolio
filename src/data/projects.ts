import { ProjectItem, ProjectItemSchema } from "./schemas";

export const projectsData: ProjectItem[] = [
  ProjectItemSchema.parse({
    id: "project-network-monitoring-dashboard",
    verification: "VERIFIED",
    position: 0,
    title: "Network Monitoring Dashboard",
    summary:
      "Real-time network telemetry and SNMP device monitoring dashboard providing active node health, bandwidth throughput, and automated incident alerts.",
    technologies: ["SNMP", "Fastify", "TypeScript", "Tailwind CSS"],
    coverPath: "/assets/projects/placeholder-project-1.svg",
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
      "Automated intelligence platform aggregating, categorizing, and summarizing tech news and academic research streams via NLP pipelines.",
    technologies: ["FastAPI", "Python", "PostgreSQL", "Docker"],
    coverPath: "/assets/projects/placeholder-project-2.svg",
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
      "Developer workflow orchestration and sandbox environment for containerized microservices and automated API testing pipelines.",
    technologies: ["Node.js", "Docker", "TypeScript", "Redis"],
    coverPath: "/assets/projects/placeholder-project-3.svg",
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
      "Infrastructure security monitoring and network anomaly detection system providing automated traffic analysis and alerting.",
    technologies: ["Python", "Network Security", "FastAPI", "Docker"],
    coverPath: "/assets/projects/placeholder-project-4.svg",
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
      "Multi-area OSPF and BGP routing topology built on MikroTik Cloud Hosted Router (CHR) featuring VLAN segmentation and hardened firewall filters.",
    technologies: ["MikroTik CHR", "OSPF", "BGP", "VLAN", "Firewall"],
    coverPath: "/assets/projects/placeholder-project-5.svg",
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
      "Enterprise leaf-spine architecture simulation with redundant core switching, LACP link aggregation, and resilient disaster recovery routing.",
    technologies: ["Leaf-Spine", "Cisco Packet Tracer", "LACP", "VLAN"],
    coverPath: "/assets/projects/placeholder-project-6.svg",
    repoUrl: "https://github.com/budikusumafauzi-sketch/Enterprise-Data-Center-Network-Simulation",
    repoVisibility: "PUBLIC",
    linkStatus: "VERIFIED",
  }),
];
