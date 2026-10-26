import { GalleryItem, GalleryItemSchema } from "./schemas";

// Verified field documentation records updated on 2026-10-26 with Owner-supplied photos from 'Dokumentasi'
export const galleryData: GalleryItem[] = [
  GalleryItemSchema.parse({
    id: "gallery-gdg-jogja-gen-ai",
    verification: "VERIFIED",
    position: 0,
    title: "Google Developer Groups (GDG) Jogja — Build Your First Gen AI App",
    caption:
      "Active participation in Google Developer Groups (GDG) Jogja session on building generative AI applications.",
    imagePath: "/assets/gallery/gdg-jogja-gen-ai-app.jpeg",
    alt: "Event Google Developer Groups (GDG) Jogja Build Your First Gen AI App",
  }),
  GalleryItemSchema.parse({
    id: "gallery-magang-kominfo-diy",
    verification: "VERIFIED",
    position: 1,
    title: "Internship Activities at Dinas Kominfo DIY",
    caption:
      "Field technical support and help desk supervisor activities at Dinas Komunikasi dan Informatika (Kominfo) DIY.",
    imagePath: "/assets/gallery/magang-kominfo-diy.jpeg",
    alt: "Field technical support activities at Dinas Kominfo DIY",
  }),
  GalleryItemSchema.parse({
    id: "gallery-magang-monitoring-jaringan",
    verification: "VERIFIED",
    position: 2,
    title: "Network Monitoring Internship Activities",
    caption:
      "Real-time enterprise network telemetry and provincial infrastructure monitoring during internship at Dinas Kominfo DIY.",
    imagePath: "/assets/gallery/magang-monitoring-jaringan.jpeg",
    alt: "Network monitoring internship activities at Dinas Kominfo DIY",
  }),
  GalleryItemSchema.parse({
    id: "gallery-maintenance-server",
    verification: "VERIFIED",
    position: 3,
    title: "Server & Infrastructure Maintenance",
    caption:
      "Routine server hardware maintenance, structured rack inspection, and operational node integrity checks.",
    imagePath: "/assets/gallery/maintenance-server.png",
    alt: "Server hardware and network infrastructure maintenance",
  }),
  GalleryItemSchema.parse({
    id: "gallery-policy-brief-sleman",
    verification: "VERIFIED",
    position: 4,
    title: "Handover of Sleman Regency Organizational Policy Brief Outcomes",
    caption:
      "Formal handover of organizational policy brief formulation outcomes for Sleman Regency.",
    imagePath: "/assets/gallery/policy-brief-organisasi-kab-sleman.jpeg",
    alt: "Handover of Sleman Regency organizational policy brief outcomes",
  }),
  GalleryItemSchema.parse({
    id: "gallery-survey-gedung-agung",
    verification: "VERIFIED",
    position: 5,
    title: "Gedung Agung Network Survey",
    caption:
      "On-site field survey and network infrastructure assessment conducted at Gedung Agung.",
    imagePath: "/assets/gallery/survey-gedung-agung.jpg",
    alt: "Network infrastructure field survey at Gedung Agung",
  }),
];
