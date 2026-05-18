"use client";

import { m as motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import WordReveal from "./WordReveal";

export default function AboutHero() {
  const t = useTranslations("AboutPage.hero");
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rawGlowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rawGridY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const glowY = useSpring(rawGlowY, { stiffness: 80, damping: 20 });
  const gridY = useSpring(rawGridY, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative pt-32 lg:pt-40 pb-20 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-border/10 bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/20 dark:via-background dark:to-background"
    >
      {/* GRADIENTS — PARALLAX */}
      <motion.div
        style={{ y: shouldReduce ? "0%" : glowY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,163,74,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,163,74,0.25),transparent_70%)] will-change-transform pointer-events-none"
      />

      {/* GRID TEXTURE — SUBTLE PARALLAX */}
      <motion.div
        style={{ y: shouldReduce ? "0%" : gridY }}
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] will-change-transform pointer-events-none"
      />

      {/* DECORATIVE GLOW BLOB */}
      <motion.div
        style={{ y: shouldReduce ? "0%" : glowY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="flex flex-col items-center max-w-4xl mx-auto">

          {/* BREADCRUMB */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60 mb-6"
          >
            <Link href="/" className="hover:text-primary transition-colors duration-300">CREDDA</Link>
            <span className="opacity-40">/</span>
            <span className="text-primary/80">{t("breadcrumb")}</span>
          </motion.nav>

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 px-6 py-2 rounded-full border border-primary/20 bg-primary/10 dark:bg-primary/5 backdrop-blur-md shadow-sm"
          >
            <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
              {t("badge")}
            </span>
          </motion.div>

          {/* TITLE — WORD REVEAL */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-black text-foreground mb-8 tracking-tighter leading-[1.05]">
            {t.rich("title", {
              italic: (chunks) => {
                const text = typeof chunks === "string" ? chunks : String(chunks);
                return (
                  <WordReveal
                    text={text}
                    as="span"
                    className="text-primary not-italic font-serif"
                    delay={0.2}
                    stagger={0.05}
                  />
                );
              },
            })}
          </h1>

          {/* SUBTITLE — BLUR FADE */}
          <motion.p
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* DECORATIVE LINE */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 h-[2px] w-32 bg-primary/40 rounded-full"
          />
        </div>
      </div>

      {/* BOTTOM SEPARATOR */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </section>
  );
}
