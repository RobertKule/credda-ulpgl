// components/home/ClinicalSection.tsx
"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { TreePine, Scale, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

export default function ClinicalSection() {
  const t = useTranslations('HomePage');
  
  return (
    <section className="py-40 bg-[#111110] text-[#F5F2EC] relative overflow-hidden">
      {/* DECORATIVE NUMBER */}
      <div className="absolute top-20 left-10 lg:left-20 pointer-events-none select-none opacity-5">
         <span className="text-[20rem] lg:text-[25rem] font-fraunces font-extrabold italic text-[#C9A84C] leading-none">03</span>
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <GSAPReveal direction="right">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-[#C9A84C]">{t('clinical.badge')}</span>
              </div>
            </GSAPReveal>
            
            <GSAPReveal direction="up" delay={0.2}>
              <h2 className="text-6xl md:text-8xl font-fraunces font-extrabold mb-12 leading-[0.9] tracking-tighter">
                {t('clinical.title')} <br /> 
                <span className="italic-accent block mt-4">{t('clinical.subtitle')}</span>
              </h2>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.4}>
              <p className="text-[#F5F2EC]/60 text-xl font-outfit font-light leading-relaxed mb-16 border-l border-white/10 pl-10 ml-1">
                {t('clinical.description')}
              </p>
            </GSAPReveal>

            <div className="grid sm:grid-cols-2 gap-12 mb-16">
              <GSAPReveal direction="up" delay={0.6}>
                <div className="space-y-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-700">
                    <TreePine size={24} />
                  </div>
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-[0.3em] text-[#F5F2EC]">{t('clinical.actions.land.title')}</h4>
                  <p className="text-base text-[#F5F2EC]/40 leading-relaxed font-outfit italic border-t border-white/5 pt-6">{t('clinical.actions.land.desc')}</p>
                </div>
              </GSAPReveal>
              <GSAPReveal direction="up" delay={0.8}>
                <div className="space-y-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-700">
                    <Scale size={24} />
                  </div>
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-[0.3em] text-[#F5F2EC]">{t('clinical.actions.mobile.title')}</h4>
                  <p className="text-base text-[#F5F2EC]/40 leading-relaxed font-outfit italic border-t border-white/5 pt-6">{t('clinical.actions.mobile.desc')}</p>
                </div>
              </GSAPReveal>
            </div>

            <GSAPReveal direction="up" delay={1.0}>
              <Link 
                href="/clinical" 
                className="group relative inline-flex items-center gap-6 px-12 py-6 bg-[#C9A84C] text-[#0C0C0A] font-outfit font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t('clinical.cta')} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
            </GSAPReveal>
          </motion.div>

          <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden order-1 lg:order-2 rounded-sm ring-1 ring-white/5">
             <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0A] via-transparent to-transparent z-10 opacity-60" />
             <Image 
                src="/images/clinical-hero.webp" 
                alt="Clinical Field Work" 
                fill 
                className="object-cover grayscale transition-all duration-[2000ms] hover:grayscale-0 hover:scale-110"
              />
            
            {/* Impact Badge */}
            <GSAPReveal direction="left" delay={0.5} className="absolute bottom-12 left-0 bg-[#C9A84C] p-10 z-20 max-w-[280px] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <MapPin size={24} className="text-[#0C0C0A]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0C0C0A]">{t('clinical.impact')}</span>
              </div>
              <p className="text-3xl font-fraunces font-extrabold text-[#0C0C0A] leading-tight">{t('clinical.families', { count: 2400 })}</p>
            </GSAPReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
