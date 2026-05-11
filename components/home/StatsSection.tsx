"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

interface StatsSectionProps {
  data?: StatItem[];
}

const CountUp = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  useEffect(() => {
    return rounded.onChange((latest) => setDisplayValue(latest));
  }, [rounded]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

export default function StatsSection({ data }: StatsSectionProps) {
  const t = useTranslations('HomePage.stats');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // fallback data if none provided
  const stats = data || [
    { label: t('years'), value: 18, suffix: "" },
    { label: t('pubs'), value: 7, suffix: "+" },
    { label: t('partners'), value: 15, suffix: "" },
    { label: t('cases'), value: 120, suffix: "+" },
  ];

  return (
    <section className={`relative shadow-2xl py-24 lg:py-32 m-10 lg:m-20 rounded-xl overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0D1645]' : 'bg-white'
    }`}>
      {/* SUBTLE DOT GLODE BACKGROUND */}
      <div className={`absolute right-[-10%] top-[-10%] w-[800px] h-[800px] transition-opacity duration-500 pointer-events-none select-none ${
        isDark ? 'opacity-[0.07] text-white' : 'opacity-[0.03] text-slate-900'
      }`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.5 1" />
          <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.5 1" />
          <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.5 1" />
          <path d="M2,50 L98,50" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.5 1" />
          <path d="M50,2 L50,98" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.5 1" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mb-20 lg:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`font-bold tracking-widest uppercase text-xs mb-4 ${
              isDark ? 'text-[#E1F247]' : 'text-primary'
            }`}
          >
            {t('badge') || "Impact & Excellence"}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t('titleLine1') || "L'impact du CREDDA"} <br /> {t('titleLine2') || "en chiffres"}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="relative pl-8 border-l-[3px] border-[#C4A45C]"
            >
              <div className={`text-5xl lg:text-6xl font-bold mb-3 tracking-tighter ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className={`text-sm font-medium leading-relaxed max-w-[180px] ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
