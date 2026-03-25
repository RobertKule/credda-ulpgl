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
    <section className="relative overflow-hidden border-y border-border/50 bg-[#0D0D0B]/85 py-12 sm:py-16 lg:py-24 light:bg-background/96 light:backdrop-blur-sm">
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-0">
          {stats.map((stat, idx) => (
            <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
              <div className="relative flex flex-col items-center text-center lg:border-r last:border-0 border-border px-10 group">
                <div className="mb-8 p-6 bg-muted border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-700 relative overflow-hidden rounded-2xl">
                  <stat.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors relative z-10" />
                  <div className="absolute inset-0 bg-[#C9A84C]/20 scale-0 group-hover:scale-150 transition-transform duration-700 -z-0 blur-xl" />
                </div>
                
                <div className="text-6xl md:text-7xl font-serif font-black text-foreground mb-6 tracking-tighter tabular-nums leading-none">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                
                <p className="text-[10px] uppercase tracking-[0.5em] font-medium text-muted-foreground group-hover:text-primary transition-colors duration-500 max-w-[150px] leading-relaxed">
                  {stat.label}
                </p>
                
                {/* Visual Accent */}
                <div className="w-1 h-8 bg-gradient-to-b from-[#C9A84C]/50 to-transparent mt-10 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
              </div>
            </GSAPReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
