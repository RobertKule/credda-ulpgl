"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;
const VALUE_NUMBERS = ["01", "02", "03", "04", "05"];

export default function AboutValues() {
  const t = useTranslations("AboutPage.values");
  const valueKeys = ["excellence", "ethics", "independence", "impact", "vision"];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* SUBTLE GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block"
          >
            {t("badge")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground max-w-2xl will-change-transform"
          >
            {t("title")}
          </motion.h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -8, transition: { duration: 0.35, ease: EASE } }}
              className="group relative p-8 md:p-10 bg-card/30 backdrop-blur-sm border border-border/50 rounded-md
                         hover:border-primary/40 hover:bg-card/60
                         hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]
                         transition-[border-color,background-color,box-shadow] duration-500 overflow-hidden will-change-transform"
            >
              {/* HOVER GLOW GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-md" />

              {/* NUMBER */}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.15 }}
                className="text-[10px] font-bold tracking-[0.3em] text-primary/40 mb-6 block font-mono"
              >
                {VALUE_NUMBERS[i]}
              </motion.span>

              {/* SEPARATOR — expands on hover */}
              <div className="h-px bg-primary mb-8 w-12 group-hover:w-20 transition-all duration-500" />

              {/* CONTENT */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                {t(`items.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
