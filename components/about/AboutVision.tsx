"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import WordReveal from "./WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutVision() {
  const t = useTranslations("AboutPage.vision");

  return (
    <section className="py-32 lg:py-44 relative bg-background overflow-hidden">
      {/* DEEP AMBIENT LIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: EASE }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/5 blur-[160px] rounded-full pointer-events-none will-change-transform"
      />

      {/* TEXTURE */}
      <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.02] pointer-events-none" />

      {/* DECORATIVE SIDE LINES — fade in */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent origin-top hidden lg:block will-change-transform"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent origin-top hidden lg:block will-change-transform"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* TOP LABEL */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="text-[10px] font-bold uppercase text-primary/60 mb-8 block tracking-[0.4em]"
          >
            — VISION —
          </motion.span>

          {/* TITLE — word reveal */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-10 leading-tight tracking-tight">
            <WordReveal
              text={t("title")}
              as="span"
              delay={0.1}
              stagger={0.06}
              duration={0.75}
            />
          </h2>

          {/* ORNAMENTAL DIVIDER — draws in */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60 origin-right will-change-transform"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
              className="w-2 h-2 rounded-full bg-primary/60 will-change-transform"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60 origin-left will-change-transform"
            />
          </div>

          {/* QUOTE — blur fade */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light leading-relaxed italic max-w-4xl mx-auto will-change-transform"
          >
            &ldquo;{t("text")}&rdquo;
          </motion.p>
        </div>
      </div>
    </section>
  );
}
