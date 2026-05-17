"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutVision() {
  const t = useTranslations("AboutPage.vision");

  return (
    <section className="py-32 lg:py-44 relative bg-background overflow-hidden">
      {/* DEEP AMBIENT LIGHT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />

      {/* TEXTURE */}
      <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.02] pointer-events-none" />

      {/* DECORATIVE SIDE LINES */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent hidden lg:block" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent hidden lg:block" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* TOP LABEL */}
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary/60 mb-8 block">
              — VISION —
            </span>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-10 leading-tight tracking-tight">
              {t("title")}
            </h2>

            {/* ORNAMENTAL DIVIDER */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
            </div>

            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light leading-relaxed italic max-w-4xl mx-auto">
              &ldquo;{t("text")}&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
