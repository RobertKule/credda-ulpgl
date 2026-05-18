"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GraduationCap, Milestone, Globe, Cpu, Rocket, History, CheckCircle2 } from "lucide-react";
import React from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: any;
}

const Timeline = () => {
  const t = useTranslations("HomePage.Timeline");

  const events: TimelineEvent[] = [
    {
      year: "2008",
      title: t("items.2008.title") ?? "Création du centre",
      description: t("items.2008.description") ?? "Fondation du Centre de Recherche et d’Études pour le Développement (CREDDA).",
      icon: GraduationCap,
    },
    {
      year: "2012",
      title: t("items.2012.title") ?? "Structuration académique",
      description: t("items.2012.description") ?? "Renforcement des axes de recherche et programmes scientifiques structurés.",
      icon: Milestone,
    },
    {
      year: "2016",
      title: t("items.2016.title") ?? "Expansion des activités",
      description: t("items.2016.description") ?? "Extension des domaines de recherche et partenariats académiques régionaux.",
      icon: Globe,
    },
    {
      year: "2020",
      title: t("items.2020.title") ?? "Digitalisation du centre",
      description: t("items.2020.description") ?? "Introduction des outils numériques et archivage digital des publications.",
      icon: Cpu,
    },
    {
      year: "2023",
      title: t("items.2023.title") ?? "Transformation moderne",
      description: t("items.2023.description") ?? "Modernisation de l’infrastructure et structuration plateforme digitale.",
      icon: Rocket,
    },
    {
      year: "2026",
      title: t("items.2026.title") ?? "CREDDA ULPGL",
      description: t("items.2026.description") ?? "Lancement de la plateforme actuelle et digitalisation complète des services.",
      icon: History,
    },
  ];

  return (
    <div className="py-12 md:py-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-20 px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
            {t("badge") ?? "Notre Parcours"}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground mb-6 tracking-tighter">
            {t("title") ?? "Historique & Évolution"}
          </h2>
          <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full" />
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Vertical Line (Central) */}
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent transform md:-translate-x-1/2 hidden sm:block" />

        <div className="space-y-16">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            const Icon = event.icon;

            return (
              <div 
                key={event.year} 
                className={`relative flex items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot & Icon */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10 sm:scale-100 scale-75 origin-left">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-16 h-16 rounded-2xl bg-background border border-primary/20 shadow-xl flex items-center justify-center group hover:border-primary transition-colors duration-500"
                  >
                    <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="p-8 rounded-3xl bg-card border border-border/50 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500"
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-black tracking-widest mb-4">
                      {event.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-black text-foreground mb-3 leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                      {event.description}
                    </p>
                    
                    {index === events.length - 1 && (
                       <div className={`mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter ${isEven ? 'justify-end' : 'justify-start'}`}>
                         <CheckCircle2 size={14} />
                         <span>Phase Actuelle</span>
                       </div>
                    )}
                  </motion.div>
                </div>

                {/* Date for Mobile Spacer */}
                <div className="hidden md:block w-[10%]" />
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll Indicator Bottom */}
      <div className="mt-20 flex justify-center opacity-30">
        <motion.div
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-1 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
        />
      </div>
    </div>
  );
};

export default Timeline;
