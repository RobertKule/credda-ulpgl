"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Leaf, CloudRain, Trees, Factory } from "lucide-react";
import { Link } from "@/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

const AXIS_ICONS = [
  <Leaf key="leaf" className="w-6 h-6" />,
  <CloudRain key="cloud" className="w-6 h-6" />,
  <Trees key="trees" className="w-6 h-6" />,
  <Factory key="factory" className="w-6 h-6" />,
];

export default function CliniqueCDESection() {
  const t = useTranslations("AboutPage.cde");
  const axes = t.raw("axes") as { title: string; desc: string }[];

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/home/cta.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">

        {/* HEADER — centré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-primary/60" />
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-primary">
              {t("badge")}
            </span>
            <div className="w-6 h-px bg-primary/60" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
            {t("title")}
          </h2>

          <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* AXES GRID — 2×2 centré dans une card */}
        <div className="bg-background/70 dark:bg-background/60 backdrop-blur-md rounded-2xl border border-border/30 p-6 md:p-10 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {axes.map((axis, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative p-5 md:p-6 bg-background/80 dark:bg-background/50 border border-border/50 rounded-xl hover:border-primary/40 transition-all duration-400 overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Ordinal */}
                <span className="absolute top-4 right-5 text-[9px] font-black tracking-[0.3em] text-foreground/10 font-mono">
                  0{i + 1}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-400">
                  {AXIS_ICONS[i]}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                  {axis.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-3">
                  {axis.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA — centré dans la card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-8 flex justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 rounded-sm shadow-md shadow-primary/20"
            >
              Soumettre un cas clinique
              <span className="text-base">→</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
