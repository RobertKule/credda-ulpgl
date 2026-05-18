"use client";

import { m as motion } from "framer-motion";
import { Search, Lightbulb, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTION_HEADER = {
  badge: {
    initial: { opacity: 0, x: -10 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: EASE },
  },
  title: {
    initial: { opacity: 0, y: 20, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay: 0.1, ease: EASE },
  },
  desc: {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.2, ease: EASE },
  },
};

export default function AboutMission() {
  const t = useTranslations("AboutPage.mission");

  const cards = [
    {
      id: "research",
      icon: <Search className="w-6 h-6" />,
      title: t("cards.research.title"),
      desc: t("cards.research.desc"),
    },
    {
      id: "innovation",
      icon: <Lightbulb className="w-6 h-6" />,
      title: t("cards.innovation.title"),
      desc: t("cards.innovation.desc"),
    },
    {
      id: "impact",
      icon: <Users className="w-6 h-6" />,
      title: t("cards.impact.title"),
      desc: t("cards.impact.desc"),
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-card/30 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-20">
          <motion.span
            {...SECTION_HEADER.badge}
            viewport={{ once: true }}
            className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block"
          >
            {t("badge")}
          </motion.span>
          <motion.h2
            {...SECTION_HEADER.title}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 will-change-transform"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            {...SECTION_HEADER.desc}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground font-light leading-relaxed will-change-transform"
          >
            {t("desc")}
          </motion.p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -8, transition: { duration: 0.35, ease: EASE } }}
              className="group relative p-10 bg-background/50 backdrop-blur-xl border border-border/60 rounded-md
                         hover:border-primary/40 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]
                         transition-[border-color,box-shadow] duration-500 flex flex-col justify-between min-h-[220px] will-change-transform"
            >
              {/* ICON */}
              <motion.div
                whileHover={{ rotate: 6, scale: 1.12, transition: { duration: 0.3 } }}
                className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-8 will-change-transform"
              >
                {card.icon}
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-md" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
