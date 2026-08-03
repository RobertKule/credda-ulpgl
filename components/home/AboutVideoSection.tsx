"use client";

import React, { useState, useRef, useEffect } from "react";
import { m as motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Link } from "@/navigation";

export default function AboutVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('HomePage');
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax / Scroll Interaction with "Sticky Plateau" (Desktop only)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Scale: 0.8 -> 1 (at 25%), Hold 1 until the end
  const scale = useTransform(scrollYProgress, [0, 0.25], [0.8, 1]);
  // Opacity: Always 1 (or fast fade in if you want a entry effect, but user said 'toujours visible')
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0.8, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 0.9], [0, 1, 1, 0]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative md:h-[150vh] h-auto bg-background flex flex-col items-center py-12 md:py-0"
    >
      {/* MOBILE HEADER (Always Visible on mobile, Hidden on desktop absolute overlay) */}
      <div className="md:hidden w-full px-6 text-center mb-8 space-y-4">
        <h2 className="text-4xl font-serif font-black leading-tight tracking-tighter text-foreground">
          {t.rich('video.title_alt', {
            line1: (chunks) => <span className="block">{chunks}</span>,
            line2: (chunks) => <span className="block text-primary italic font-light">{chunks}</span>,
            default: "EXCELLENCE ACADÉMIQUE"
          })}
        </h2>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-md mx-auto">
          {t('video.description')}
        </p>
      </div>

      {/* STICKY / FLOW WRAPPER */}
      <div className="md:sticky top-0 h-auto w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* 1. LAYER: VIDEO CONTAINER */}
        <motion.div 
          style={mounted ? { scale, opacity } : { scale: 1, opacity: 1 }}
          className="relative w-full aspect-video mx-auto overflow-hidden md:group cursor-pointer bg-black flex items-center justify-center"
          onClick={() => togglePlay()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* STATIC OVERRIDE FOR MOBILE (No transform scaling) */}
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted={isMuted}
            playsInline
            className={`w-full h-full object-contain transition-transform duration-1000 ${isHovered ? 'md:scale-105' : 'scale-100'}`}
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
            <track kind="captions" srcLang="fr" label="Français" />
          </video>
          
          {/* Dynamic Overlay */}
          <div className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-700 ${isHovered ? 'md:opacity-0' : 'opacity-100'}`} />
          
          {/* Play/Pause Center Indicator */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              >
                <div className="bg-white/20 backdrop-blur-md p-6 md:p-8 rounded-full">
                  <Play className="text-white fill-white" size={32} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 2. LAYER: TEXT CONTENT (Desktop Overlay only) */}
        <AnimatePresence>
          {(!isHovered && mounted) && (
            <motion.div 
              style={mounted ? { opacity: contentOpacity } : { opacity: 0 }}
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="hidden md:flex absolute inset-0 z-20 flex-col items-center justify-center text-center pointer-events-none px-6"
            >
              <div className="max-w-4xl space-y-4 md:space-y-6">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-black leading-tight tracking-tighter text-white drop-shadow-2xl">
                  {t.rich('video.title_alt', {
                    line1: (chunks) => <span className="block">{chunks}</span>,
                    line2: (chunks) => <span className="block text-primary italic font-light">{chunks}</span>,
                    default: "EXCELLENCE ACADÉMIQUE"
                  })}
                </h2>
                
                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                  {t('video.description')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. LAYER: CONTROLS BAR (Mobile: Below Video, Desktop: Bottom Overlay) */}
        <div className="relative md:absolute md:bottom-12 w-full z-40 flex justify-center px-6 mt-6 md:mt-0">
          <motion.div 
            style={mounted ? { opacity: contentOpacity } : { opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-8 bg-card/60 md:bg-slate-950/40 backdrop-blur-2xl px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-sm border border-border md:border-white/10"
          >
            {/* MUTE TOGGLE */}
            <button 
              onClick={toggleMute} 
              aria-label={isMuted ? "Activer le son" : "Mettre en sourdine"}
              className="flex items-center gap-3 text-foreground md:text-white hover:text-primary transition-colors uppercase text-[9px] md:text-[10px] font-black tracking-widest"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span className="hidden sm:inline">{isMuted ? "Sourdine" : "Activé"}</span>
            </button>

            <div className="w-[1px] h-6 bg-border md:bg-white/10 mx-1 md:mx-2" />

            {/* READ MORE BUTTON */}
            <Link 
              href="/about" 
              className="group flex items-center gap-2 md:gap-4 bg-primary text-white border-none py-2 px-4 md:py-3 md:px-8 rounded-lg md:rounded-sm hover:translate-y-[-2px] transition-all duration-300 whitespace-nowrap shadow-lg shadow-primary/20"
            >
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                {t('research.read_more')}
              </span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="w-[1px] h-6 bg-border md:bg-white/10 mx-1 md:mx-2" />

            {/* PLAY/PAUSE TOGGLE */}
            <button 
              onClick={togglePlay} 
              aria-label={isPlaying ? "Mettre en pause" : "Lancer la lecture"}
              className="flex items-center gap-3 text-foreground md:text-white hover:text-primary transition-colors uppercase text-[9px] md:text-[10px] font-black tracking-widest"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span className="hidden sm:inline">{isPlaying ? "Pause" : "Lecture"}</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
