import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fauzi Budikusuma — Software Development & Network Engineer",
  description: "Personal portfolio of Fauzi Budikusuma — Software Development & Network Engineer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
