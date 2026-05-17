"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("AboutPage.hero");

  return (
    <section className="relative min-h-[55vh] lg:min-h-[62vh] flex items-center justify-center overflow-hidden pt-56 pb-16">
      {/* INSTITUTIONAL BACKGROUND */}
      <div className="absolute inset-0 bg-background" />

      {/* GRADIENTS & TEXTURE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(22,163,74,0.12),transparent_65%)]" />
      <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.025] mix-blend-overlay pointer-events-none" />

      {/* DECORATIVE LIGHT */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      {/* GRID LINES */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* BREADCRUMB */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60 mb-8"
          >
            <Link href="/" className="hover:text-primary transition-colors">CREDDA</Link>
            <span className="opacity-40">/</span>
            <span className="text-primary/80">{t("breadcrumb")}</span>
          </motion.nav>

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8 px-5 py-2 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm"
          >
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-primary">
              {t("badge")}
            </span>
          </motion.div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
            {t.rich("title", {
              italic: (chunks) => (
                <em className="text-primary not-italic font-serif">{chunks}</em>
              ),
            })}
          </h1>

          {/* SUBTITLE */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            {t("subtitle")}
          </p>

          {/* DECORATIVE LINE */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
        </motion.div>
      </div>

      {/* BOTTOM SEPARATOR */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </section>
  );
}
