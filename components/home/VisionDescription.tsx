"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BookOpen, Scale } from "lucide-react";

export default function VisionDescription() {
  const t = useTranslations("HomePage.vision");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="flex flex-col justify-center h-full"
    >
      {/* BADGE */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <div className="h-[1px] w-12 bg-[#C4A45C]" />
        <span className="text-[#C4A45C] font-bold text-xs uppercase tracking-[0.3em]">
          {t("badge") || "URITHI WA KIAKADEMIA"}
        </span>
      </motion.div>

      {/* TITLE */}
      <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1] mb-8 tracking-tighter">
        {t.rich("title", {
          highlight: (chunks) => <span className="text-primary">{chunks}</span>
        }) || (
          <>
            Redéfinir l'Avenir de la <span className="text-primary">Recherche</span> et de la <span className="text-primary">Justice</span> en RDC.
          </>
        )}
      </motion.h2>

      {/* DESCRIPTION */}
      <motion.p variants={itemVariants} className="text-muted-foreground text-lg font-light leading-relaxed mb-10 max-w-2xl">
        {t("main_description") || "Laboratoire d'idées et catalyseur de réformes, alliant excellence scientifique et engagement social."}
      </motion.p>

      {/* PILLARS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        {/* PILLAR 1 */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <BookOpen size={28} />
          </div>
          <div>
            <h4 className="text-foreground text-xl font-bold mb-3">
              {t("pillar1_title") || "Recherche Juridique"}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("pillar1_text") || "Production de connaissances de haut niveau et de publications scientifiques influentes."}
            </p>
          </div>
        </motion.div>

        {/* PILLAR 2 */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <Scale size={28} />
          </div>
          <div>
            <h4 className="text-foreground text-xl font-bold mb-3">
              {t("pillar2_title") || "Clinique de Droit"}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("pillar2_text") || "Défense des droits humains et accès direct à la justice pour les communautés vulnérables."}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
