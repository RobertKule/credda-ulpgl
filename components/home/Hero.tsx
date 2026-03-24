import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from 'next/dynamic';

const AfricaGlobe = dynamic(() => import('@/components/home/AfricaGlobe'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', maxWidth: 560, aspectRatio: '1', background: '#111110', borderRadius: 4, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.15)', borderTop: '1px solid #C9A84C', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
});

export default function Hero() {
  const t = useTranslations('HomePage');
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);
  const descY = useTransform(scrollY, [0, 500], [0, -50]);
  const videoOpacity = useTransform(scrollY, [0, 500], [0.6, 0.2]);

  // Ensure video plays and handles loading state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Video autoplay failed:", err);
      });
    }

    // Fallback for loader
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
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
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden opacity-40">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
            animate={{ 
              x: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{ 
              duration: 20 + Math.random() * 20, 
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
      <div className="absolute bottom-20 left-12 z-40 flex items-center gap-6">
        <button
          onClick={toggleMute}
          className="w-16 h-16 flex items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-xl text-white/70 hover:text-primary hover:border-primary/50 transition-all group relative overflow-hidden"
        >
          <motion.div 
             className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform"
          />
          {isMuted ? <VolumeX size={18} className="relative z-10" /> : <Volume2 size={18} className="relative z-10 animate-pulse" />}
        </button>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cinematic Audio</span>
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
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1] light:bg-white/40" />

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-grid-move opacity-20 pointer-events-none z-[2]" />
      
      <div className="container mx-auto px-6 relative z-30 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full gap-12">
          {/* LEFT COLUMN (60%) */}
          <motion.div
            style={{ 
              rotateX: mousePos.y * -15, 
              rotateY: mousePos.x * 15,
              transformStyle: "preserve-3d"
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="w-full lg:w-[60%] z-10"
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
              className="text-6xl md:text-8xl lg:text-[10rem] font-fraunces font-extrabold text-foreground leading-[0.85] tracking-tighter mb-16"
            >
              <span className="block italic opacity-40">
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
              className="text-xl md:text-2xl text-muted-foreground font-outfit font-light max-w-2xl leading-relaxed mb-20 border-l-2 border-primary/20 pl-12"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-10 items-center" style={{ transform: "translateZ(80px)" }}>
              <Link 
                href="/publications" 
                className="group relative px-16 py-8 bg-primary text-primary-foreground font-outfit font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-2xl"
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

          {/* RIGHT COLUMN (40% GLOBE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="hidden lg:flex w-full lg:w-[40%] justify-center items-center z-10"
          >
            <AfricaGlobe />
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
