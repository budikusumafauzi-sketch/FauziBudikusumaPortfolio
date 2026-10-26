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
    title: "Kegiatan Magang di Dinas Kominfo DIY",
    caption:
      "Field technical support and help desk supervisor activities at Dinas Komunikasi dan Informatika (Kominfo) DIY.",
    imagePath: "/assets/gallery/magang-kominfo-diy.jpeg",
    alt: "Dokumentasi kegiatan magang di Dinas Kominfo DIY",
  }),
  GalleryItemSchema.parse({
    id: "gallery-magang-monitoring-jaringan",
    verification: "VERIFIED",
    position: 2,
    title: "Kegiatan Magang Monitoring Jaringan",
    caption:
      "Real-time enterprise network telemetry and provincial infrastructure monitoring during internship at Dinas Kominfo DIY.",
    imagePath: "/assets/gallery/magang-monitoring-jaringan.jpeg",
    alt: "Dokumentasi kegiatan magang monitoring jaringan Dinas Kominfo DIY",
  }),
  GalleryItemSchema.parse({
    id: "gallery-maintenance-server",
    verification: "VERIFIED",
    position: 3,
    title: "Maintenance Server & Infrastruktur",
    caption:
      "Routine server hardware maintenance, structured rack inspection, and operational node integrity checks.",
    imagePath: "/assets/gallery/maintenance-server.png",
    alt: "Dokumentasi kegiatan maintenance server dan infrastruktur",
  }),
  GalleryItemSchema.parse({
    id: "gallery-policy-brief-sleman",
    verification: "VERIFIED",
    position: 4,
    title: "Penyerahan Hasil Perumusan Policy Brief Organisasi Kab Sleman",
    caption:
      "Formal handover of organizational policy brief formulation outcomes for Sleman Regency.",
    imagePath: "/assets/gallery/policy-brief-organisasi-kab-sleman.jpeg",
    alt: "Penyerahan hasil perumusan policy brief organisasi Kabupaten Sleman",
  }),
  GalleryItemSchema.parse({
    id: "gallery-survey-gedung-agung",
    verification: "VERIFIED",
    position: 5,
    title: "Survey Jaringan Gedung Agung",
    caption:
      "On-site field survey and network infrastructure assessment conducted at Gedung Agung.",
    imagePath: "/assets/gallery/survey-gedung-agung.jpg",
    alt: "Dokumentasi kegiatan survey jaringan di Gedung Agung",
  }),
];
