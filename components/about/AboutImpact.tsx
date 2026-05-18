"use client";

import { m as motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (isInView && !shouldReduce) {
      animate(motionVal, value, { duration: 1.8, ease: "easeOut" });
    } else if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal, shouldReduce]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(v)}${suffix}`;
      }
    });
    return unsub;
  }, [springVal, suffix]);

  return (
    <span ref={ref} className="tabular-nums will-change-transform">
      {shouldReduce ? `${value}${suffix}` : "0"}
    </span>
  );
}

export default function AboutImpact() {
  const t = useTranslations("AboutPage.impact");
  const stats = t.raw("stats") as { value: string; label: string }[];

  // Parse numeric value and trailing suffix (e.g. "200+" → 200, "+")
  function parseStat(raw: string): { num: number; suffix: string } {
    const match = raw.match(/^(\d+)(.*)$/);
    if (match) return { num: parseInt(match[1], 10), suffix: match[2] ?? "" };
    return { num: 0, suffix: raw };
  }

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-card/20 border-y border-border/50">
      {/* BACKGROUND GLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(22,163,74,0.07),transparent_70%)] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16 lg:mb-20 max-w-2xl mx-auto will-change-transform"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => {
            const { num, suffix } = parseStat(stat.value);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="group text-center px-4 relative will-change-transform"
              >
                {/* DIVIDER EXCEPT FIRST */}
                {i > 0 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-border/40 origin-center hidden lg:block will-change-transform"
                  />
                )}

                <div className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-primary mb-3 tracking-tighter">
                  <AnimatedNumber value={num} suffix={suffix} />
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/70 leading-relaxed max-w-[120px] mx-auto">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
