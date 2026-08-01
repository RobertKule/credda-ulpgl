"use client";

import { m as motion } from "framer-motion";
import { Sword, Leaf, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
      icon: <Sword className="w-5 h-5" />,
      title: t("cards.research.title"),
      desc: t("cards.research.desc"),
      mediaType: "image",
      mediaSrc: "/images/hero/profKenedyWithEtudiant6.jpeg",
    },
    {
      id: "innovation",
      icon: <Leaf className="w-5 h-5" />,
      title: t("cards.innovation.title"),
      desc: t("cards.innovation.desc"),
      mediaType: "video",
      mediaSrc: "/video/creddaHero.mp4",
    },
    {
      id: "impact",
      icon: <ShieldCheck className="w-5 h-5" />,
      title: t("cards.impact.title"),
      desc: t("cards.impact.desc"),
      mediaType: "image",
      mediaSrc: "/images/about/gouvernement1.jpg",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background border-y border-border/10 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
              className="group relative flex flex-col bg-card/20 border border-border/40 rounded-xl overflow-hidden hover:border-primary/30 transition-colors duration-500 will-change-transform"
            >
              {/* MEDIA CONTAINER */}
              <div className="relative w-full h-[240px] overflow-hidden bg-muted">
                {/* Overlay gradient for text legibility if needed, or just elegant darkening */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none" />
                
                {card.mediaType === "image" ? (
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Image
                      src={card.mediaSrc}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <video
                      src={card.mediaSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Floating Icon Badge */}
                <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-lg border border-primary/10">
                  {card.icon}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-card/30 to-background">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light mt-auto">
                  {card.desc}
                </p>
              </div>

              {/* BOTTOM ACCENT BAR */}
              <div className="h-1 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute bottom-0 left-0" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
