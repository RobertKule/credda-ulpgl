"use client";

import { m as motion } from "framer-motion";
import { Search, Lightbulb, Users } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <section className="py-24 lg:py-32 bg-card/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            {t("desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative p-10 bg-background/50 backdrop-blur-xl border border-border/60 rounded-md hover:border-primary/40 transition-all duration-500 flex flex-col justify-between min-h-[220px]"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                {card.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>
              
              {/* DECORATIVE LIGHT ON HOVER */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-md" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
