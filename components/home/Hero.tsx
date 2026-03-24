import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('HomePage');
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background flex items-center">
      {/* LOADING INDICATOR */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[5] bg-[#0C0C0A] flex flex-col items-center justify-center gap-8 overflow-hidden"
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

            {/* CSS for shimmer if not in globals */}
            <style jsx>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        poster="/images/hero-poster.webp"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${isLoaded ? 'opacity-60' : 'opacity-0'}`}
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* VIDEO CONTROLS (MUTE/UNMUTE) */}
      <div className="absolute bottom-12 left-12 z-30 flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-all group"
          title={isMuted ? "Activer le son" : "Désactiver le son"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors hidden md:block">
          {isMuted ? "Audio Off" : "Audio On"}
        </span>
      </div>
      
      {/* Overlay: darkens video in dark mode, lifts to light paper in light mode */}
      <div className="absolute inset-0 bg-black/55 z-[1] light:bg-white/60" />

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
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-fraunces font-extrabold text-foreground leading-[0.9] tracking-tighter mb-12">
              <span className="block italic">
                {t('hero.title_part1')}
              </span>
              {t('hero.title_part2')?.trim() ? (
                <span className="block text-[#C9A84C] relative mt-2">
                  {t('hero.title_part2')}
                  <span className="absolute -bottom-4 left-0 w-24 h-1 bg-[#C9A84C]/20" />
                </span>
              ) : null}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-lg md:text-xl text-muted-foreground font-outfit font-light max-w-2xl leading-relaxed mb-16 border-l border-border pl-10 ml-1">
              {t('hero.subtitle')}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-8 items-center">
              <Link 
                href="/publications" 
                className="group relative px-12 py-6 bg-primary text-primary-foreground font-outfit font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t('hero.cta_publications') || "Our Publications"} 
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
              
              <Link 
                href="/about" 
                className="group flex items-center gap-5 text-foreground hover:text-primary transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-700 relative">
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
