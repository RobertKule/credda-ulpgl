// components/home/ClinicalSection.tsx
"use client";

import { m as motion } from "framer-motion";
import { Link } from "@/navigation";
import { Gavel, Scale, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";

export default function ClinicalSection() {
  const t = useTranslations('HomePage');
  
  return (
    <section className="relative w-full py-12 md:py-20 flex items-center justify-center overflow-hidden rounded bg-background group">
      {/* MINIMALIST BACKGROUND PATTERN */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-credda opacity-[0.2] dark:opacity-[0.1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      </div>

      {/* CENTERED CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <GSAPReveal direction="up" delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1645]/5 dark:bg-primary/10 border border-[#0D1645]/10 dark:border-primary/20 mb-10 transition-colors">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0D1645] dark:text-primary">
              {t('clinical.badge')}
            </span>
          </div>
        </GSAPReveal>

        <GSAPReveal direction="up" delay={0}>
          <div className="relative mb-12">
            <h2 className="text-6xl md:text-8xl lg:text-[110px] font-fraunces font-black leading-[0.85] tracking-tighter text-foreground relative z-10">
              {t('clinical.title')} <br />
              <span className="text-primary italic font-light mt-4">{t('clinical.subtitle')}</span>
            </h2>
            {/* Soft Branding Glow behind title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/[0.08] dark:bg-primary/[0.05] blur-[100px] -z-10" />
          </div>
          <p className="text-foreground/70 dark:text-white/50 text-xl font-light max-w-2xl mb-20 leading-relaxed italic">
            {t('clinical.description')}
          </p>
        </GSAPReveal>

        {/* HORIZONTAL ACTION BAR (Minimalist Style) */}
        <GSAPReveal direction="up" delay={0}>
          <div className="bg-secondary rounded-3xl md:rounded-full p-2 md:pl-10 md:pr-3 md:py-3 flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-0 shadow-[0_40px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-5xl border border-slate-100 dark:border-white/10 transition-all">
            
            {/* Field 1: Land Rights */}
            <div className="flex-1 flex items-center gap-5 py-4 md:py-0 px-6 md:px-0 group/item cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary shrink-0 transition-all group-hover/item:bg-primary group-hover/item:text-white group-hover/item:scale-110">
                <Gavel size={26} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0D1645] dark:text-white mb-1">
                  {t('clinical.actions.land.title')}
                </span>
                <span className="text-xs text-[#0D1645]/50 dark:text-white/40 font-medium line-clamp-1 italic">
                  {t('clinical.actions.land.desc')}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-white/10 mx-8" />

            {/* Field 2: Mobile Justice */}
            <div className="flex-1 flex items-center gap-5 py-4 md:py-0 px-6 md:px-0 group/item cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary shrink-0 transition-all group-hover/item:bg-primary group-hover/item:text-white group-hover/item:scale-110">
                <Scale size={26} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0D1645] dark:text-white mb-1">
                  {t('clinical.actions.mobile.title')}
                </span>
                <span className="text-xs text-[#0D1645]/50 dark:text-white/40 font-medium line-clamp-1 italic">
                  {t('clinical.actions.mobile.desc')}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-white/10 mx-8" />

            {/* Field 3: Impact Stat */}
            <div className="flex-1 flex items-center gap-5 py-4 md:py-0 px-6 md:px-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left pr-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0D1645] dark:text-white mb-1">
                  {t('clinical.impact')}
                </span>
                <span className="text-xl font-fraunces font-black text-primary leading-none">
                  {t('clinical.families', { count: 2400 })}
                </span>
              </div>
            </div>

            {/* Final Action Button */}
            <Link 
              href="/publications" 
              className="bg-primary hover:bg-[#B4934B] text-primary-foreground px-12 py-5 rounded-2xl md:rounded-full font-black uppercase tracking-[0.3em] text-[11px] transition-all hover:scale-[1.02] flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
            >
              <span>{t('clinical.cta')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </GSAPReveal>
      </div>

      {/* Subtle Background Glow Lower */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-t from-primary/[0.05] dark:from-primary/[0.02] to-transparent -z-10" />
    </section>
  );
}
