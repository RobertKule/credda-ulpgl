// components/home/FeaturedResearch.tsx
"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Clock, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";

interface FeaturedResearchProps {
  research: any[];
}

export default function FeaturedResearch({ research }: FeaturedResearchProps) {
  const t = useTranslations('HomePage');
  
  return (
    <section className="relative overflow-hidden bg-transparent py-12 lg:py-20">
      <SectionDecorNumber value="02" className="-top-6 right-0 sm:-right-2 md:top-0" />
      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-grid-move opacity-[0.02]" />
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12 mb-16 lg:mb-24">
          <div className="max-w-3xl w-full">
            <GSAPReveal direction="right">
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="h-[1px] w-12 bg-primary/50" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-primary">{t('research.badge')}</span>
              </div>
            </GSAPReveal>
            <GSAPReveal direction="up" delay={0.2}>
              <h2 className="text-5xl md:text-6xl xl:text-7xl font-fraunces font-extrabold text-foreground leading-[1.05] tracking-tighter break-words hyphens-auto">
                {t('research.title')} <br /> 
                <span className="italic-accent block mt-3 lg:mt-4 text-primary">{t('research.subtitle')}</span>
              </h2>
            </GSAPReveal>
          </div>
          <GSAPReveal direction="left" delay={0.4}>
            <Link 
              href="/research" 
              className="group flex items-center gap-4 text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-foreground hover:text-primary transition-all duration-500"
            >
              <span className="relative">
                {t('research.cta')}
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#C9A84C]/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </span>
              <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-500">
                <ArrowRight size={16} />
              </div>
            </Link>
          </GSAPReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {research?.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ 
                rotateY: 5, 
                rotateX: -5, 
                scale: 1.02,
                transition: { duration: 0.4 }
              }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-card/40 backdrop-blur-md border border-border/50 overflow-hidden transition-all duration-700 hover:border-primary/40 rounded-[2.5rem] shadow-sm hover:shadow-[0_30px_60px_-12px_rgba(201,168,76,0.12)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image 
                  src={item.mainImage || "/images/hero-poster.webp"} 
                  alt={item.translations?.[0]?.title || "Research"} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[9px] font-black uppercase tracking-widest px-5 py-2.5 shadow-2xl rounded-md">
                    {item.category?.translations?.[0]?.name || t('research.journal')}
                  </span>
                </div>
              </div>

              <div className="p-12 flex flex-col flex-grow relative">
                <div className="flex items-center gap-6 text-[9px] font-outfit font-bold uppercase tracking-widest text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-[#C9A84C]" />
                    <span>March 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-[#C9A84C]" />
                    <span>{t('research.lab')}</span>
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-fraunces font-bold text-foreground mb-6 leading-tight group-hover:text-primary transition-colors duration-500 line-clamp-2">
                  {item.translations?.[0]?.title}
                </h3>

                <p className="text-muted-foreground text-sm lg:text-base font-outfit font-light leading-relaxed mb-10 line-clamp-3 opacity-80">
                  {item.translations?.[0]?.excerpt || "Detailed analysis of legal frameworks and environmental challenges in the Great Lakes region..."}
                </p>

                <div className="mt-auto pt-8 border-t border-border/40">
                  <Link 
                    href={`/research/${item.slug}`} 
                    className="flex items-center justify-between group/link"
                  >
                    <span className="text-[11px] font-outfit font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover/link:text-primary transition-colors">{t('research.read_more')}</span>
                    <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center group-hover/link:bg-primary group-hover/link:border-primary group-hover/link:text-primary-foreground transition-all duration-700">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
