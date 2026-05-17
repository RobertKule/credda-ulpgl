"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutImpact() {
  const t = useTranslations("AboutPage.impact");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-card/20 border-y border-border/50">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(22,163,74,0.07),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group text-center px-4 relative"
            >
              {/* DIVIDER EXCEPT FIRST */}
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-border/40 hidden lg:block" />
              )}

              <div className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-primary mb-3 tracking-tighter
                              group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/70 leading-relaxed max-w-[120px] mx-auto">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
