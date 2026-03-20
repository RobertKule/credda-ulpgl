// components/home/FeaturedResearch.tsx
"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Clock, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

interface FeaturedResearchProps {
  research: any[];
}

export default function FeaturedResearch({ research }: FeaturedResearchProps) {
  const t = useTranslations('HomePage');
  
  return (
    <section className="py-40 bg-[#0C0C0A] relative overflow-hidden">
      {/* DECORATIVE NUMBER */}
      <div className="absolute top-20 right-10 lg:right-20 pointer-events-none select-none opacity-5">
         <span className="text-[20rem] lg:text-[25rem] font-fraunces font-extrabold italic text-[#C9A84C] leading-none">02</span>
      </div>

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-grid-move opacity-[0.02] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
          <div className="max-w-3xl">
            <GSAPReveal direction="right">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-[#C9A84C]">{t('research.badge')}</span>
              </div>
            </GSAPReveal>
            <GSAPReveal direction="up" delay={0.2}>
              <h2 className="text-6xl md:text-8xl font-fraunces font-extrabold text-[#F5F2EC] leading-[0.9] tracking-tighter">
                {t('research.title')} <br /> 
                <span className="italic-accent block mt-4">{t('research.subtitle')}</span>
              </h2>
            </GSAPReveal>
          </div>
          <GSAPReveal direction="left" delay={0.4}>
            <Link 
              href="/research" 
              className="group flex items-center gap-4 text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-[#F5F2EC] hover:text-[#C9A84C] transition-all duration-500"
            >
              <span className="relative">
                {t('research.cta')}
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#C9A84C]/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-500">
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
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-[#161614] border border-white/5 overflow-hidden transition-all duration-700 hover:border-[#C9A84C]/30 hover:translate-y-[-10px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image 
                  src={item.mainImage || "/images/hero-poster.webp"} 
                  alt={item.translations?.[0]?.title || "Research"} 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0A] via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#C9A84C] text-[#0C0C0A] text-[9px] font-black uppercase tracking-widest px-4 py-2 shadow-2xl">
                    {item.category?.translations?.[0]?.name || t('research.journal')}
                  </span>
                </div>
              </div>

              <div className="p-12 flex flex-col flex-grow relative">
                <div className="flex items-center gap-6 text-[9px] font-outfit font-bold uppercase tracking-widest text-[#F5F2EC]/30 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-[#C9A84C]" />
                    <span>March 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-[#C9A84C]" />
                    <span>{t('research.lab')}</span>
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bricolage font-bold text-[#F5F2EC] mb-8 leading-tight group-hover:text-[#C9A84C] transition-colors duration-500 line-clamp-2">
                  {item.translations?.[0]?.title}
                </h3>

                <p className="text-[#F5F2EC]/50 text-base font-outfit font-light leading-relaxed mb-12 line-clamp-3">
                  {item.translations?.[0]?.excerpt || "Detailed analysis of legal frameworks and environmental challenges in the Great Lakes region..."}
                </p>

                <div className="mt-auto pt-10 border-t border-white/5">
                  <Link 
                    href={`/research/${item.slug}`} 
                    className="flex items-center justify-between group/link"
                  >
                    <span className="text-[11px] font-outfit font-bold uppercase tracking-[0.2em] text-[#F5F2EC]/40 group-hover/link:text-[#C9A84C] transition-colors">{t('research.read_more')}</span>
                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover/link:bg-[#C9A84C] group-hover/link:border-[#C9A84C] group-hover/link:text-[#0C0C0A] transition-all duration-700">
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
