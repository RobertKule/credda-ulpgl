"use client";

import { m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutCTA() {
  const t = useTranslations("AboutPage.cta");

  return (
    <section className="py-24 lg:py-40 bg-card border-t border-border/50 relative overflow-hidden">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,163,74,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto p-12 md:p-20 rounded-md border border-primary/20 bg-primary/5 backdrop-blur-sm text-center relative overflow-hidden"
        >
          {/* CORNER GLOW ACCENTS */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/6 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />

          {/* TOP LABEL */}
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-primary/70 mb-8 block relative z-10">
            CREDDA — ULPGL
          </span>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-12 leading-tight relative z-10 max-w-3xl mx-auto">
            {t("title")}
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-md text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-primary/90 shadow-[0_0_30px_rgba(22,163,74,0.2)] hover:shadow-[0_0_45px_rgba(22,163,74,0.3)]"
              >
                {t("button")} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link href="/publications">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 border border-border/60 hover:border-primary/40 text-foreground/70 hover:text-foreground px-10 py-4 rounded-md text-sm font-bold uppercase tracking-widest transition-all duration-300"
              >
                Publications
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
