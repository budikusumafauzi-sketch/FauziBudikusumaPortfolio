"use client";

import * as React from "react";
import Link from "next/link";
import { Container, Button } from "@/components/ui/primitives";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page text-text-primary px-4 py-16">
      <Container className="text-center max-w-lg">
        <span className="font-mono text-sm uppercase tracking-widest text-accent mb-4 block font-semibold">
          ERROR // 404
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-text-strong mb-4">
          {t.notFound.title}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
          {t.notFound.subtitle}
        </p>
        <Link href="/">
          <Button variant="primary" size="md" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t.notFound.backHome}</span>
          </Button>
        </Link>
      </Container>
    </div>
  );
}
