"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BookOpen, Quote } from "lucide-react";

export default function AboutStory() {
  const t = useTranslations("AboutPage.story");
  const p2 = t("p2");

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden border-t border-border/10">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about/gouvernement.jpg')" }}
      />

      {/* CENTERED CONTENT CARD */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-background/90 dark:bg-background/80 backdrop-blur-md rounded-3xl px-10 py-14 md:px-16 md:py-20 border border-border/30 shadow-2xl text-center"
        >
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">
              {t("badge")}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-extrabold text-foreground leading-[1.15] tracking-tight mb-6">
            {t("title")}
          </h2>

          {/* SEPARATOR */}
          <div className="w-16 h-1 bg-primary/50 rounded-full mx-auto mb-10" />

          {/* PULL QUOTE */}
          <div className="relative inline-block max-w-2xl mx-auto">
            <Quote className="absolute -top-4 -left-4 w-10 h-10 text-primary/20 rotate-180 hidden md:block" />
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed italic font-serif">
              « {p2} »
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}