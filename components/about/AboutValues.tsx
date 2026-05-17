"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";

const VALUE_NUMBERS = ["01", "02", "03", "04", "05"];

export default function AboutValues() {
  const t = useTranslations("AboutPage.values");

  const valueKeys = ["excellence", "ethics", "independence", "impact", "vision"];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* SUBTLE GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground max-w-2xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-8 md:p-10 bg-card/30 backdrop-blur-sm border border-border/50 rounded-md
                         hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_0_30px_rgba(22,163,74,0.06)]
                         transition-all duration-500 overflow-hidden"
            >
              {/* HOVER GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-md" />

              {/* NUMBER */}
              <span className="text-[10px] font-bold tracking-[0.3em] text-primary/40 mb-6 block font-mono">
                {VALUE_NUMBERS[i]}
              </span>

              {/* SEPARATOR */}
              <div className="h-px w-12 bg-primary mb-8 group-hover:w-20 transition-all duration-500" />

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
