"use client";

import React from "react";
import { m as motion } from "framer-motion";
import WordReveal from "@/components/about/WordReveal";

interface EditorialPageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  className?: string;
}

export default function EditorialPageHero({
  title,
  subtitle,
  badge,
  className = ""
}: EditorialPageHeroProps) {
  return (
    <section className={`relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/20 dark:via-background dark:to-background ${className}`}>
      {/* Background Textures & Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.1),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40" />

      {/* Floating Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 py-2 rounded-full border border-primary/20 bg-primary/10 dark:bg-primary/5 backdrop-blur-md shadow-sm"
            >
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-primary">
                {badge}
              </span>
            </motion.div>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[1.1] tracking-tight">
            <WordReveal text={title} stagger={0.06} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground/80 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
          
          {/* DECORATIVE LINE */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-[2px] w-32 bg-primary/40 rounded-full"
          />
        </div>
      </div>

      {/* Side accents remain but subtler */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-24 opacity-5 hidden xl:flex">
         <div className="w-px h-24 bg-foreground" />
         <span className="text-[10px] font-bold uppercase tracking-[0.5em] vertical-text">CREDDA</span>
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-24 opacity-5 hidden xl:flex">
         <span className="text-[10px] font-bold uppercase tracking-[0.5em] vertical-text transform rotate-180">ACADEMIC</span>
         <div className="w-px h-24 bg-foreground" />
      </div>

      {/* Style for vertical text */}
      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
      `}</style>
    </section>
  );
}
