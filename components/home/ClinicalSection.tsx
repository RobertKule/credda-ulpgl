"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { TreePine, Scale, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ParallaxWrapper from "@/components/shared/ParallaxWrapper";
import GSAPReveal from "@/components/shared/GSAPReveal";

export default function ClinicalSection() {
  const t = useTranslations('HomePage');
  
  return (
    <section className="py-32 bg-secondary text-white relative overflow-hidden">
      {/* Abstract Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <GSAPReveal direction="right">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">{t('clinical.badge')}</span>
              </div>
            </GSAPReveal>
            <GSAPReveal direction="up" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-serif font-black mb-8 leading-tight">
                {t('clinical.title')} <br /> <span className="italic text-emerald-300">{t('clinical.subtitle')}</span>
              </h2>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.4}>
              <p className="text-emerald-50/70 text-lg font-light leading-relaxed mb-12 border-l border-white/10 pl-8 ml-1">
                {t('clinical.description')}
              </p>
            </GSAPReveal>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <GSAPReveal direction="up" delay={0.6}>
                <div className="space-y-4 group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                    <TreePine size={24} />
                  </div>
                  <h4 className="font-heading font-bold text-lg uppercase tracking-wider">{t('clinical.actions.land.title')}</h4>
                  <p className="text-sm text-emerald-100/60 leading-relaxed italic border-t border-white/10 pt-4">{t('clinical.actions.land.desc')}</p>
                </div>
              </GSAPReveal>
              <GSAPReveal direction="up" delay={0.8}>
                <div className="space-y-4 group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                    <Scale size={24} />
                  </div>
                  <h4 className="font-heading font-bold text-lg uppercase tracking-wider">{t('clinical.actions.mobile.title')}</h4>
                  <p className="text-sm text-emerald-100/60 leading-relaxed italic border-t border-white/10 pt-4">{t('clinical.actions.mobile.desc')}</p>
                </div>
              </GSAPReveal>
            </div>

            <GSAPReveal direction="up" delay={1.0}>
              <Link 
                href="/clinical" 
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-primary font-heading font-black uppercase tracking-widest text-[10px] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('clinical.cta')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </GSAPReveal>
          </motion.div>

          <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden order-1 lg:order-2">
            <ParallaxWrapper speed={0.2} className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 border-[20px] border-white/5 z-20 pointer-events-none translate-x-10 translate-y-10" />
              <Image 
                src="/images/clinical-hero.webp" 
                alt="Clinical Field Work" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
              />
            </ParallaxWrapper>
            
            {/* Overlay stats/badge */}
            <GSAPReveal direction="left" delay={0.5} className="absolute bottom-10 left-0 bg-accent p-8 z-30 max-w-[240px]">
              <div className="flex items-center gap-4 mb-4">
                <MapPin size={24} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('clinical.impact')}</span>
              </div>
              <p className="text-2xl font-serif font-black text-primary leading-tight">{t('clinical.families', { count: 2400 })}</p>
            </GSAPReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
