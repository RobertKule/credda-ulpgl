"use client";

import { m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutCTA() {
  const t = useTranslations("AboutPage.cta");

  return (
    <section className="py-24 lg:py-40 bg-card border-t border-border/50 relative overflow-hidden">
      {/* BACKGROUND LAYER */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,163,74,0.08),transparent_60%)] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-4xl mx-auto p-12 md:p-20 rounded-md border border-primary/20 bg-primary/5 backdrop-blur-sm text-center relative overflow-hidden will-change-transform"
        >
          {/* CORNER GLOW ACCENTS */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/6 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />

          {/* TOP LABEL */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[10px] font-bold uppercase text-primary/70 mb-8 block tracking-[0.35em] relative z-10"
          >
            CREDDA — ULPGL
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-12 leading-tight relative z-10 max-w-3xl mx-auto will-change-transform"
          >
            {t("title")}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10"
          >
            {/* PRIMARY CTA */}
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-md
                           text-sm font-bold uppercase tracking-widest
                           shadow-[0_0_30px_rgba(22,163,74,0.2)] hover:shadow-[0_0_50px_rgba(22,163,74,0.35)]
                           transition-shadow duration-300 will-change-transform"
              >
                {t("button")}
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25 }}
                  className="will-change-transform"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </Link>

            {/* SECONDARY CTA */}
            <Link href="/publications">
              <motion.button
                whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 border border-border/60 hover:border-primary/40
                           text-foreground/70 hover:text-foreground px-10 py-4 rounded-md
                           text-sm font-bold uppercase tracking-widest
                           transition-[border-color,color] duration-300 will-change-transform"
              >
                Publications
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
