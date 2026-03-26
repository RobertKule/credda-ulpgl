// components/home/Stats.tsx
"use client";

import { motion } from "framer-motion";
import { Landmark, Globe, Scale, Newspaper } from "lucide-react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";
import GSAPReveal from "@/components/shared/GSAPReveal";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

interface StatsProps {
  years: number;
  totalResources: number;
  partners: number;
  clinicalCases?: number;
}

export default function Stats({ years, totalResources, partners, clinicalCases = 0 }: StatsProps) {
  const t = useTranslations('HomePage.stats');
  
  const stats = [
    { label: t('years'), value: years, suffix: "", icon: Landmark },
    { label: t('pubs'), value: totalResources || 150, suffix: "+", icon: Newspaper },
    { label: t('partners'), value: partners || 15, suffix: "", icon: Globe },
    { label: t('cases'), value: clinicalCases || 120, suffix: "+", icon: Scale },
  ];

  return (
    <section className="relative overflow-visible border-y border-border/50 bg-background/90 backdrop-blur-sm py-12 sm:py-16 lg:py-24 [clip-path:url(#statsWavyClip)]">

      {/* ── TOP ROPE CORD ── */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none translate-y-[-50%]">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[100px] block overflow-visible">
          <defs>
            <filter id="ropeShadowStatsBold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowStatsBold)" />
          <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
          <path d="M0,45 C200,-5 400,95 600,45 C800,-5 1000,95 1200,45 C1300,30 1380,60 1440,45" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" className="text-primary" />
        </svg>
      </div>

      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-0">
          {stats.map((stat, idx) => (
            <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
              <div className="relative flex flex-col items-center text-center lg:border-r last:border-0 border-border px-10 group">
                <div className="mb-8 p-6 bg-muted border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-700 relative overflow-hidden rounded-2xl">
                  <stat.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors relative z-10" />
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-700 -z-0 blur-xl" />
                </div>
                
                <div className="text-6xl md:text-7xl font-serif font-black text-foreground mb-6 tracking-tighter tabular-nums leading-none">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                
                <p className="text-[10px] uppercase tracking-[0.5em] font-medium text-muted-foreground group-hover:text-primary transition-colors duration-500 max-w-[150px] leading-relaxed">
                  {stat.label}
                </p>
                
                {/* Visual Accent */}
                <div className="w-1 h-8 bg-gradient-to-b from-primary/50 to-transparent mt-10 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
              </div>
            </GSAPReveal>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROPE CORD ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-[50%]">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[100px] block overflow-visible">
          <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowStatsBold)" />
          <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
          <path d="M0,45 C200,-5 400,95 600,45 C800,-5 1000,95 1200,45 C1300,30 1380,60 1440,45" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" className="text-primary" />
        </svg>
      </div>

      {/* ── CLIP PATH DEFINITION ── */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="statsWavyClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.1 C 0.14,0 0.28,0.2 0.42,0.1 C 0.56,0 0.7,0.2 0.84,0.1 C 0.9,0.07 0.96,0.13 1,0.1 L 1,0.9 C 0.96,0.87 0.9,0.93 0.84,0.9 C 0.7,0.8 0.56,1 0.42,0.9 C 0.28,0.8 0.14,1 0,0.9 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
