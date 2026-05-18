"use client";

import { m as motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
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
  const t = useTranslations("HomePage.stats");

  const stats = data || [
    { label: t("years"), value: 18, suffix: "" },
    { label: t("pubs"), value: 7, suffix: "+" },
    { label: t("partners"), value: 15, suffix: "" },
    { label: t("cases"), value: 120, suffix: "+" },
  ];

  return (
    <section className="
  relative py-20 lg:py-28 mx-4 lg:mx-16 my-10
  rounded-3xl overflow-hidden
  bg-background/60 backdrop-blur-xl
  border border-border/10
  shadow-[0_20px_80px_-30px_rgba(0,0,0,0.25)]
">
     {/* BACKGROUND SVG */}
<div className="absolute right-[-15%] top-[-20%] w-[900px] h-[900px] opacity-[0.05] pointer-events-none">  
  <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
    
    {/* cercle principal */}
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-primary/30"
    />

    {/* grille radiale */}
    <path
      d="M50 2 L50 98"
      stroke="currentColor"
      strokeWidth="0.2"
      className="text-foreground/20"
    />
    <path
      d="M2 50 L98 50"
      stroke="currentColor"
      strokeWidth="0.2"
      className="text-foreground/20"
    />

    {/* diagonales subtiles */}
    <path
      d="M15 15 L85 85"
      stroke="currentColor"
      strokeWidth="0.15"
      className="text-primary/10"
    />
    <path
      d="M85 15 L15 85"
      stroke="currentColor"
      strokeWidth="0.15"
      className="text-primary/10"
    />

    {/* cercle secondaire flottant */}
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.2"
      className="text-primary/10"
      opacity="0.6"
    />

  </svg>
</div>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* HEADER */}
        <div className="max-w-3xl mb-16 lg:mb-20 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-4"
          >
            {t("badge") || "Impact & Excellence"}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-black leading-tight text-foreground"
          >
            {t("titleLine1") || "L'impact du CREDDA"} <br />
            {t("titleLine2") || "en chiffres"}
          </motion.h2>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className="
    group relative flex flex-col items-center lg:items-start
    text-center lg:text-left
    p-6 rounded-2xl
    border border-transparent
    transition-all duration-300 ease-out
    hover:bg-muted/40
    hover:-translate-y-2
    hover:border-primary/20
    hover:shadow-lg hover:shadow-black/5
  "
            >
              {/* NUMBER */}
              <div
                className="
      text-5xl lg:text-6xl font-serif font-black tracking-tight
      text-foreground tabular-nums mb-2
      transition-all duration-300
      group-hover:scale-[1.03]
      group-hover:text-primary
      drop-shadow-sm
    "
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>

              {/* LABEL */}
              <p className="
    text-[11px] font-semibold uppercase tracking-widest
    text-muted-foreground max-w-[180px] leading-relaxed
    transition-colors duration-300
    group-hover:text-foreground
  ">
                {stat.label}
              </p>

              {/* underline */}
              <div className="
    mt-4 w-10 h-[2px] bg-primary/30
    transition-all duration-300 ease-out
    group-hover:w-16 group-hover:bg-primary
  " />
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}