"use client";

import { m as motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FolderKanban,
  BarChart3,
  GraduationCap,
  Network,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ICONS = [FolderKanban, BarChart3, GraduationCap, Network];

const ACCENT_COLORS = [
  { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary group-hover:text-primary-foreground", border: "group-hover:border-primary/40" },
  { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary group-hover:text-primary-foreground", border: "group-hover:border-primary/40" },
  { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary group-hover:text-primary-foreground", border: "group-hover:border-primary/40" },
  { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary group-hover:text-primary-foreground", border: "group-hover:border-primary/40" },
];

const SECTION_PAD = "w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16";

export default function PiliersSection() {
  const t = useTranslations("HomePage.piliers");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section
      id="services"
      className="relative py-24 lg:py-40 border-y border-border dark:border-border/15 overflow-hidden"
    >
      {/* Background image — full bleed, NO overlay on outer section */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/arbres/arbresl.jpg"
          alt=""
          fill
          className="object-cover"
          quality={75}
        />
      </div>

      {/* Content wrapped in a frosted sub-section with margins */}
      <div className={`${SECTION_PAD} relative z-10`}>
        <div className="bg-background/90 dark:bg-background/85 backdrop-blur-sm rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-xl border border-border/30">

        <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-primary/60" />
              <span className="text-[11px] font-black tracking-[0.35em] uppercase text-primary">
                {t("badge")}
              </span>
              <div className="w-8 h-px bg-primary/60" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight will-change-transform"
            >
              {t("title")}
            </motion.h2>
          </div>

        {/* PILLARS GRID — 2x2 responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            const colors = ACCENT_COLORS[i];

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE } }}
                className={`group relative flex flex-col p-8 bg-card/40 dark:bg-card/30 backdrop-blur-md border border-border/50 rounded-xl
                           ${colors.border}
                           hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)]
                           hover:bg-card/70
                           transition-all duration-500 overflow-hidden will-change-transform min-h-[200px] justify-center`}
              >
                {/* Top accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Ordinal number */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  className="absolute top-5 right-5 text-[10px] font-mono font-black tracking-[0.3em] text-foreground/8"
                >
                  0{i + 1}
                </motion.span>

                {/* Icon — centered */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 will-change-transform
                                ${colors.bg} ${colors.text} ${colors.hover}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* BOTTOM CONNECTOR TO CTA */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent origin-left"
        />
        </div>
      </div>
    </section>
  );
}
