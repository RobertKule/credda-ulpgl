"use client";

import { m as motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function VisionBento() {
  const t = useTranslations("HomePage.vision");

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* COLUMN 1 */}
      <div className="space-y-4 lg:space-y-6">
        {/* LARGE VERTICAL IMAGE */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="relative aspect-[3/4] md:aspect-[4/5] rounded-md overflow-hidden group border border-white/5"
        >
          <Image
            src="/images/reflexion.jpg"
            alt="ULPGL Building"
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        </motion.div>

        {/* TEXT CARD BOTTOM LEFT */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-md flex flex-col justify-end min-h-[220px]"
        >
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4">
            {t("card_vision_badge") || "Notre Vision"}
          </span>
          <p className="text-foreground text-lg font-medium leading-tight">
            {t("card_vision_text") || "Unir l'excellence académique à l'impact social pour l'Afrique de demain."}
          </p>
        </motion.div>
      </div>

      {/* COLUMN 2 (STAGGERED) */}
      <div className="space-y-4 lg:space-y-6 md:pt-12">
        {/* TEXT CARD TOP RIGHT */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-md min-h-[200px]"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-foreground text-xl font-bold mb-3">
            {t("card_readiness_title") || "Excellence & Engagement"}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("card_readiness_text") || "Le CREDDA forme des leaders capables d'allier rigueur scientifique et résolution des défis du monde réel."}
          </p>
        </motion.div>

        {/* BOTTOM RIGHT IMAGE */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="relative aspect-square rounded-md overflow-hidden group border border-white/5"
        >
          <Image
            src="/images/recheche.webp"
            alt="Researchers"
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
        </motion.div>
      </div>
    </div>
  );
}
