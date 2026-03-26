'use client'
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";

import DecodeText from "@/components/shared/DecodeText";

export default function Hero() {
  const t = useTranslations('HomePage');
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isLoaded, setIsLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -100]);
  const descY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -50]);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);

    // Force hide loading screen after 1.5s
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // OPTIMIZED 3D TILT EFFECT using MotionValues
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);

    // Force hide loading screen after 1.5s
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || reduceMotion) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[110vh] w-full overflow-hidden bg-background flex items-center justify-center perspective-[2000px] [clip-path:url(#heroWavyClip)]"
    >
      {/* ... (Loading and Background sections remain the same) */}
      
      {/* MAIN CONTENT - CENTERED */}
      <div className="relative z-30 w-full px-5 sm:px-8 lg:px-12 xl:px-16 container mx-auto">
        <div className="flex w-full flex-col items-center justify-center py-24 lg:py-32 text-center">
          <motion.div
            style={{ 
              rotateX: reduceMotion ? 0 : rotateX,
              rotateY: reduceMotion ? 0 : rotateY,
              transformStyle: "preserve-3d"
            }}
            className="w-full max-w-4xl xl:max-w-5xl z-10 flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col items-center w-full"
            >
              {/* BADGE - CENTERED */}
              <div className="flex items-center gap-6 mb-12 lg:mb-16 justify-center" style={{ transform: "translateZ(50px)" }}>
                <div className="h-[1px] w-12 bg-primary/50" />
                <span className="text-[10px] uppercase tracking-[0.8em] font-black text-primary">
                  {t('hero.badge')}
                </span>
                <div className="h-[1px] w-12 bg-primary/50" />
              </div>

              {/* MAIN TITLE - CENTERED WITH DECODE */}
              <motion.h1 
                style={{ y: titleY, z: 100 }}
                className={cn(
                  "mb-10 font-fraunces text-[clamp(2.5rem,8vw,9rem)] xl:text-8xl font-black leading-[1.05] tracking-tighter text-foreground sm:mb-14 md:mb-16",
                  isLight
                    ? "[text-shadow:0_2px_4px_rgba(0,0,0,0.1)]"
                    : "[text-shadow:0_4px_32px_rgba(0,0,0,0.8)]"
                )}
              >
                <span className={cn("block italic mb-4", isLight ? "opacity-80 text-foreground/80" : "opacity-70 text-primary/70")}>
                  <DecodeText text={t('hero.title_part1')} delay={1.7} duration={1.2} />
                </span>
                <span className="block text-primary relative filter drop-shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  {t('hero.title_part2')}
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 2.2, duration: 1.5 }}
                    className="absolute -bottom-6 left-1/4 w-1/2 h-[2px] bg-primary shadow-[0_0_15px_rgba(201,168,76,0.6)]" 
                  />
                </span>
              </motion.h1>

              {/* DESCRIPTION - CENTERED WITH DECODE */}
              <motion.p 
                style={{ y: descY, z: 60 }}
                className={cn(
                  "mb-14 max-w-4xl font-outfit text-base font-medium leading-relaxed text-foreground sm:mb-16 sm:text-lg md:mb-20 md:text-xl lg:text-2xl glass-card py-8 px-12 border border-primary/20 bg-background/60 backdrop-blur-xl shadow-2xl",
                  isLight
                    ? "[text-shadow:0_1px_2px_rgba(255,255,255,0.8)]"
                    : "[text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
                )}
              >
                <DecodeText text={t('hero.subtitle')} delay={2.5} duration={2} />
              </motion.p>

              {/* ACTIONS - CENTERED */}
              <div className="flex flex-col flex-wrap items-center justify-center gap-6 sm:flex-row sm:gap-10" style={{ transform: "translateZ(80px)" }}>
                <Link 
                  href="/publications" 
                  className="group relative inline-flex justify-center px-10 py-6 font-outfit text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-2xl transition-all hover:scale-[1.03] active:scale-95 sm:px-14 sm:py-7 md:px-16 md:py-8 bg-primary overflow-hidden rounded-md"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {t('hero.cta_publications')} 
                    <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform duration-700" />
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 opacity-20" />
                </Link>
                
                <Link 
                  href="/about" 
                  className="group flex items-center gap-6 text-foreground hover:text-primary transition-all duration-700"
                >
                  <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-1000 relative">
                    <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/20 group-hover:scale-150 transition-all duration-1000" />
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Introduction</span>
                    <span className="text-[12px] font-outfit font-bold uppercase tracking-[0.1em] opacity-40 group-hover:opacity-100 transition-opacity">Découvrir le CREDDA</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* DECORATIVE LOCATION */}
      <div className="absolute bottom-16 right-16 z-20 hidden lg:block">
        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] font-outfit font-medium text-foreground/20">Location</p>
          <p className="text-xs font-fraunces italic text-[#C9A84C]">ULPGL University, Goma, DRC</p>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#C9A84C]/50 to-[#C9A84C] animate-scroll-line" />
      </div>

      {/* ── BOTTOM ROPE CORD ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-[50%]">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[50px] md:h-[100px] block overflow-visible">
          <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadow)" />
          <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
          <path d="M0,45 C200,-5 400,95 600,45 C800,-5 1000,95 1200,45 C1300,30 1380,60 1440,45" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" className="text-primary" />
        </svg>
      </div>

      {/* ── CLIP PATH DEFINITION ── */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heroWavyClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.05 C 0.14,0 0.28,0.1 0.42,0.05 C 0.56,0 0.7,0.1 0.84,0.05 C 0.9,0.035 0.96,0.065 1,0.05 L 1,0.95 C 0.96,0.935 0.9,0.965 0.84,0.95 C 0.7,0.9 0.56,1 0.42,0.95 C 0.28,0.9 0.14,1 0,0.95 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
