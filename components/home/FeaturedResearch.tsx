"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, BookOpen, Clock, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

interface FeaturedResearchProps {
  research: any[];
}

export default function FeaturedResearch({ research }: FeaturedResearchProps) {
  const t = useTranslations('HomePage');
  
  return (
    <section className="py-32 bg-soft-cream">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <GSAPReveal direction="right">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">{t('research.badge')}</span>
              </div>
            </GSAPReveal>
            <GSAPReveal direction="up" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-serif font-black text-primary leading-tight">
                {t('research.title')} <br /> <span className="italic text-accent">{t('research.subtitle')}</span>
              </h2>
            </GSAPReveal>
          </div>
          <GSAPReveal direction="left" delay={0.4}>
            <Link 
              href="/research" 
              className="group flex items-center gap-3 text-[11px] font-heading font-black uppercase tracking-widest border-b-2 border-primary/20 pb-2 hover:border-accent transition-all duration-500"
            >
              {t('research.cta')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </GSAPReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {research?.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-white border border-light-gray overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={item.mainImage || "/images/hero-poster.webp"} 
                  alt={item.translations?.[0]?.title || "Research"} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                    {item.category?.translations?.[0]?.name || t('research.journal')}
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-anthracite/40 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-secondary" />
                    <span>March 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-secondary" />
                    <span>{t('research.lab')}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-primary mb-6 leading-tight group-hover:text-accent transition-colors duration-500 line-clamp-2">
                  {item.translations?.[0]?.title}
                </h3>

                <p className="text-anthracite/60 text-sm leading-relaxed mb-10 line-clamp-3">
                  {item.translations?.[0]?.excerpt || "Detailed analysis of legal frameworks and environmental challenges in the Great Lakes region..."}
                </p>

                <div className="mt-auto pt-8 border-t border-light-gray">
                  <Link 
                    href={`/research/${item.slug}`} 
                    className="flex items-center justify-between group/link"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover/link:text-accent transition-colors">{t('research.read_more')}</span>
                    <div className="w-8 h-8 rounded-full border border-light-gray flex items-center justify-center group-hover/link:border-accent group-hover/link:bg-accent group-hover/link:text-white transition-all duration-500">
                      <ArrowRight size={14} />
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
