'use client'
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";

export default function Hero() {
  const t = useTranslations('HomePage');
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -100]);
  const descY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -50]);
  const videoOpacity = useTransform(scrollY, [0, 500], [0.6, reduceMotion ? 0.6 : 0.2]);

  useEffect(() => {
    // Détection du mouvement réduit
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);
  
    // Vidéo et Loader
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  
    // Force le passage à "Loaded" une fois le client prêt
    setIsLoaded(true); 
  }, []);
  
  // 3D TILT EFFECT
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="relative min-h-[110vh] w-full overflow-hidden bg-background flex items-center perspective-[2000px]"
    >
      {/* LOADING INDICATOR */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[50] bg-[#0C0C0A] flex flex-col items-center justify-center gap-8 overflow-hidden"
          >
            {/* SKELETON ANIMATION */}
            <div className="w-full h-full absolute inset-0 bg-[#111110]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-20 h-20 border border-[#C9A84C]/20 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-t-[#C9A84C] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#C9A84C]/40 animate-pulse">Chargement Expérience</span>
            </div>

            <style jsx>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND SIMULATION: FLOATING NODES */}
<div
  className={cn(
    "pointer-events-none absolute inset-0 z-[5] overflow-hidden",
    isLight ? "opacity-15" : "opacity-40"
  )}
>
  {/* On ne rend les nodes que si le composant est monté pour éviter le mismatch SSR */}
  {isLoaded && [...Array(6)].map((_, i) => (
    <motion.div
      key={i}
      initial={{ 
        x: `${(i * 15 + 10)}%`, 
        y: `${(i * 10 + 20)}%` 
      }}
      animate={reduceMotion ? undefined : {
        x: [
          `${(Math.sin(i) * 30 + 50)}%`, 
          `${(Math.cos(i) * 30 + 50)}%`, 
          `${(Math.sin(i + 1) * 30 + 50)}%`
        ],
        y: [
          `${(Math.cos(i) * 30 + 50)}%`, 
          `${(Math.sin(i) * 30 + 50)}%`, 
          `${(Math.cos(i + 1) * 30 + 50)}%`
        ],
      }}
      transition={{ 
        duration: 25 + (i * 5), 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]"
    />
  ))}
</div>

      {/* BACKGROUND VIDEO */}
      <motion.div
        style={{ opacity: videoOpacity }}
        className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          poster="/images/hero-poster.webp"
          className="w-full h-full object-cover"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* VIDEO CONTROLS */}
      <div
        className={cn(
          "absolute bottom-20 left-5 z-40 flex items-center gap-4 sm:left-12 sm:gap-6",
          isLight && "text-foreground"
        )}
      >
        <button
          onClick={toggleMute}
          className={cn(
            "group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border backdrop-blur-xl transition-all sm:h-16 sm:w-16",
            isLight
              ? "border-border bg-background/70 text-foreground/80 hover:border-primary/50 hover:text-primary"
              : "border-white/10 bg-black/20 text-white/70 hover:border-primary/50 hover:text-primary"
          )}
        >
          <motion.div 
             className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform"
          />
          {isMuted ? <VolumeX size={18} className="relative z-10" /> : <Volume2 size={18} className="relative z-10 animate-pulse" />}
        </button>
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em]",
              isLight ? "text-muted-foreground" : "text-white/40"
            )}
          >
            Cinematic Audio
          </span>
          <div className="flex gap-0.5 items-end h-3">
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i}
                 animate={{ height: isMuted ? 2 : [2, 12, 4, 10, 2] }}
                 transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                 className="w-[2px] bg-primary/40"
               />
             ))}
          </div>
        </div>
      </div>
      
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[4]",
          isLight
            ? "bg-gradient-to-r from-[#f8f6f1]/97 via-[#f8f6f1]/88 to-[#f8f6f1]/45"
            : "bg-gradient-to-r from-[#0D0D0B]/94 via-[#0D0D0B]/72 to-[#0D0D0B]/55"
        )}
      />

      {/* GRID BACKGROUND */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[5] bg-grid-move",
          isLight ? "opacity-[0.08]" : "opacity-20"
        )}
      />
      
      <div className="relative z-30 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex w-full flex-col items-start justify-center py-24 lg:py-32">
          <motion.div
            style={{ 
              rotateX: reduceMotion ? 0 : mousePos.y * -15,
              rotateY: reduceMotion ? 0 : mousePos.x * 15,
              transformStyle: "preserve-3d"
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="w-full max-w-4xl xl:max-w-5xl z-10"
          >
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* BADGE */}
            <div className="flex items-center gap-6 mb-12" style={{ transform: "translateZ(50px)" }}>
              <div className="h-[1px] w-16 bg-primary/50" />
              <span className="text-[10px] uppercase tracking-[0.8em] font-black text-primary">
                 Pôle d'Excellence Scientifique
              </span>
            </div>

            {/* MAIN TITLE WITH PARALLAX */}
            <motion.h1 
              style={{ y: titleY, transform: "translateZ(100px)" }}
              className={cn(
                "mb-10 font-fraunces text-[clamp(2.25rem,8vw,10rem)] font-extrabold leading-[0.88] tracking-tighter text-foreground sm:mb-14 md:mb-16",
                isLight
                  ? "[text-shadow:0_2px_0_rgba(255,255,255,0.85),0_1px_3px_rgba(26,24,20,0.12)]"
                  : "[text-shadow:0_2px_24px_rgba(12,12,10,0.55)]"
              )}
            >
              <span className={cn("block italic", isLight ? "opacity-55" : "opacity-40")}>
                {t('hero.title_part1')}
              </span>
              <span className="block text-primary relative mt-4">
                {t('hero.title_part2')}
                <motion.span 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="absolute -bottom-6 left-0 w-1/3 h-[2px] bg-primary shadow-[0_0_15px_rgba(201,168,76,0.6)]" 
                />
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p 
              style={{ y: descY, transform: "translateZ(60px)" }}
              className={cn(
                "mb-14 max-w-2xl border-l-2 border-primary/30 pl-6 font-outfit text-base font-light leading-relaxed text-muted-foreground sm:mb-16 sm:pl-8 sm:text-lg md:mb-20 md:text-xl lg:text-2xl",
                isLight
                  ? "[text-shadow:0_1px_2px_rgba(255,255,255,0.9)]"
                  : "[text-shadow:0_1px_12px_rgba(12,12,10,0.35)]"
              )}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* ACTIONS */}
            <div className="flex flex-col flex-wrap items-stretch gap-6 sm:flex-row sm:items-center sm:gap-10" style={{ transform: "translateZ(80px)" }}>
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
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Introduction</span>
                  <span className="text-[12px] font-outfit font-bold uppercase tracking-[0.1em] opacity-40 group-hover:opacity-100 transition-opacity">Découvrir le CREDDA</span>
                </div>
              </Link>
            </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* DECORATIVE ELEMENTS */}
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
    </section>
  );
}
