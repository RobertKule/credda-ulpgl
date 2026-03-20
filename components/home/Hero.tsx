// components/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0C0C0A] flex items-center">
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>
      
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55 z-[1]" />

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-grid-move opacity-20 pointer-events-none z-[2]" />
      
      {/* ANIMATED ORBS */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] animate-orb-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-[150px] animate-orb-pulse pointer-events-none delay-2000" />

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* BADGE */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-outfit font-bold text-[#C9A84C]">
                {t('hero.badge') || "Institutional Excellence"}
              </span>
            </div>

            {/* MAIN TITLE */}
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-fraunces font-extrabold text-[#F5F2EC] leading-[0.85] tracking-tighter mb-12">
              <span className="block italic">
                {t('hero.title_part1') || "Justice"}
              </span>
              <span className="block text-[#C9A84C] relative">
                {t('hero.title_part2') || "& Research"}
                <span className="absolute -bottom-4 left-0 w-24 h-1 bg-[#C9A84C]/20" />
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-lg md:text-xl text-[#F5F2EC]/60 font-outfit font-light max-w-2xl leading-relaxed mb-16 border-l border-white/10 pl-10 ml-1">
              {t('hero.slides.0.description') || "Leading legal research and clinical excellence in the Great Lakes region, dedicated to democracy and sustainable development."}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-8 items-center">
              <Link 
                href="/publications" 
                className="group relative px-12 py-6 bg-[#C9A84C] text-[#0C0C0A] font-outfit font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t('hero.cta_publications') || "Our Publications"} 
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
              
              <Link 
                href="/about" 
                className="group flex items-center gap-5 text-[#F5F2EC] hover:text-[#C9A84C] transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/10 transition-all duration-700 relative">
                   <div className="absolute inset-0 rounded-full border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/40 group-hover:scale-125 transition-all duration-700" />
                  <Play size={18} fill="currentColor" className="ml-1" />
                </div>
                <span className="text-[11px] font-outfit font-bold uppercase tracking-[0.2em]">{t('hero.cta_contact') || "Learn More"}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute bottom-16 right-16 z-20 hidden lg:block">
        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] font-outfit font-medium text-[#F5F2EC]/20">Location</p>
          <p className="text-xs font-fraunces italic text-[#C9A84C]">ULPGL University, Goma, DRC</p>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#C9A84C]/50 to-[#C9A84C] animate-scroll-line" />
      </div>
    </section>
  );
}
