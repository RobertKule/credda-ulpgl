"use client";

import React from "react";
import { m as motion } from "framer-motion";
import WordReveal from "@/components/about/WordReveal";
import { useTranslations } from "next-intl";

interface StatItemProps {
  value: string | number;
  label: string;
  delay?: number;
}

const StatItem = ({ value, label, delay = 0 }: StatItemProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-2"
  >
    <span className="text-3xl md:text-5xl font-serif font-black text-primary">
      {value}
    </span>
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 text-center max-w-[120px]">
      {label}
    </span>
  </motion.div>
);

interface MediaCenterHeroProps {
  stats: {
    events: number;
    media: number;
    videos: number;
  };
}

export default function MediaCenterHero({ stats }: MediaCenterHeroProps) {
  const t = useTranslations("MediaCenter.hero");

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center pt-44 pb-24 overflow-hidden border-b border-border/50 bg-background">
      {/* BACKGROUND TEXTURES & EFFECTS */}
      <div className="absolute inset-0 z-0">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-background dark:from-primary/25 dark:via-background dark:to-background z-0" />
        
        {/* Dramatic Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,101,52,0.25),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,101,52,0.35),transparent_60%)] z-10" />
        
        {/* Glass Overlay for Depth */}
        <div className="absolute inset-0 bg-background/40 dark:bg-background/60 z-20" />
        
        {/* Subtle Video Background - Lower opacity to favor gradients */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-[0.02] dark:opacity-[0.08] grayscale contrast-125 select-none pointer-events-none"
        >
          <source src="/videos/media-hero-bg.mp4" type="video/mp4" />
          <img src="/images/media-hero-fallback.jpg" alt="Hero background" className="w-full h-full object-cover" />
        </video>
      </div>

      {/* Floating Institutional Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(22,101,52,0.1),transparent_70%)] blur-[80px] pointer-events-none z-10" />

      {/* Floating Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* GRID TEXTURE */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40 z-0" />

      <div className="container relative z-20 mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            className="mb-8 px-6 py-2 rounded-full border border-primary/25 bg-background dark:bg-primary/10 backdrop-blur-md shadow-sm"
          >
            <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
              {t("badge")}
            </span>
          </motion.div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-black text-foreground mb-8 tracking-tighter leading-none">
            <WordReveal text={t("title")} stagger={0.06} />
          </h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-16"
          >
            {t("subtitle")}
          </motion.p>

          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-8 md:gap-24 items-center">
            <StatItem value={stats.events} label={t("stats.events")} delay={0.6} />
            <StatItem value={stats.media} label={t("stats.media")} delay={0.7} />
            <StatItem value={stats.videos} label={t("stats.videos")} delay={0.8} />
          </div>

          {/* DECORATIVE LINE */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 h-px w-48 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
