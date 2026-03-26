"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX,
  ArrowRight, Landmark, Globe2, ShieldCheck, Scale, BookOpen, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useTranslations } from "next-intl";

const ABOUT_PAD = "w-full px-5 sm:px-8 lg:px-12 xl:px-16";

export default function PremiumAboutPage() {
  const t = useTranslations('about');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPaused) videoRef.current.play();
      else videoRef.current.pause();
      setIsPaused(!isPaused);
    }
  };

  // Auto-hide controls on cursor idle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* --- 1. HERO AVEC VIDÉO LOCALE --- */}
      <section className="relative min-h-[90vh] lg:min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        
        {/* LOCAL VIDEO BACKGROUND */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/90 z-10" />

        {/* ANIMATED GLOW ORBS driven by mouse */}
        <motion.div
          animate={{ x: mousePos.x * -2, y: mousePos.y * -2 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute top-[15%] left-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-10"
        />
        <motion.div
          animate={{ x: mousePos.x * 2.5, y: mousePos.y * 2.5 }}
          transition={{ type: "spring", stiffness: 35, damping: 25 }}
          className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-600/15 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-10"
        />

        {/* DYNAMIC CONTROLS — fade on idle */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute top-8 right-8 md:top-12 md:right-12 z-40 flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-2xl"
            >
              <button onClick={togglePlay} className="p-2 text-white/80 hover:text-white transition hover:scale-110">
                {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
              </button>
              <div className="w-px h-5 bg-white/20 mx-1" />
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white/80 hover:text-white transition hover:scale-110">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-20 container mx-auto px-6 text-center"
        >
          <motion.div animate={{ rotateX: mousePos.y * 0.05, rotateY: mousePos.x * -0.05 }} style={{ transformStyle: "preserve-3d" }}>
            <div className="inline-flex items-center gap-3 border border-primary/40 text-primary bg-black/30 backdrop-blur-md rounded-full px-6 py-2 mb-10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold">{t('hero.badge')}</span>
            </div>

            <h1 className="text-[clamp(3rem,7vw,8rem)] font-fraunces font-black text-white leading-[1.02] tracking-tighter mx-auto max-w-[1400px] mb-8 drop-shadow-2xl">
              {t.rich('hero.title', {
                italic: (chunks) => <span className="italic font-light text-primary pr-2">{chunks}</span>,
                bold: (chunks) => <span className="font-black">{chunks}</span>,
                br: () => <br />
              })}
            </h1>

            <div className="max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-10" />

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12">
              {t('hero.desc')}
            </p>

            <Button
              variant="default"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              {t('mission.cta')} <ArrowRight className="ml-3" size={18} />
            </Button>
          </motion.div>
        </motion.div>

        {/* ── BOTTOM WAVY SEPARATOR ── */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none overflow-hidden leading-none">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px] md:h-[100px] block">
            <path d="M0,40 C240,100 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* --- 2. MISSION (PHILOSOPHIE) --- */}
      <div className={`${ABOUT_PAD} py-24 lg:py-40`}>
        <ScrollReveal className="w-full">
            <section>
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-8">
                  <span className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase">{t('mission.badge')}</span>
                  <h2 className="text-5xl font-serif leading-tight">
                    {t.rich('mission.title', { 
                      italic: (chunks) => <span className="italic">{chunks}</span>,
                      br: () => <br />
                    })}
                  </h2>
                  <p className="text-muted-foreground leading-loose font-light">
                    {t('mission.desc')}
                  </p>
                  <div className="pt-8">
                     <Button variant="outline" className="rounded-md border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black px-10 py-6 transition-all">
                        {t('mission.cta')} <ArrowRight className="ml-4" size={16} />
                     </Button>
                  </div>
                </div>
                
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                   <StatCard icon={<Scale size={32}/>} number="15+" label={t('stats.y')} />
                   <StatCard icon={<BookOpen size={32}/>} number="200+" label={t('stats.p')} />
                   <StatCard icon={<Globe2 size={32}/>} number="12" label={t('stats.g')} />
                   <StatCard icon={<ShieldCheck size={32}/>} number="100%" label={t('stats.l')} />
                </div>
              </div>
            </section>
          </ScrollReveal>
      </div>

      {/* --- 3. EQUIPE/CITATION (BREAK) --- */}
      <div className={`${ABOUT_PAD} py-24 lg:py-40`}>
        <ScrollReveal className="w-full">
            <section className="flex justify-center text-center">
               <div className="max-w-4xl px-6">
                  <Quote size={60} className="mx-auto mb-12 text-primary/10" />
                  <h3 className="text-3xl md:text-5xl font-serif italic leading-relaxed text-foreground/80">
                    &quot;{t('quote')}&quot;
                  </h3>
               </div>
            </section>
          </ScrollReveal>
      </div>

      {/* --- 4. FONDEMENTS (PILIERS) --- */}
      <div className={`${ABOUT_PAD} bg-card py-24 lg:py-40`}>
        <ScrollReveal className="w-full">
            <section className="bg-card">
              <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <h2 className="text-6xl font-serif">
                  {t.rich('pillars.title', {
                    bold: (chunks) => <span className="not-italic font-bold">{chunks}</span>,
                    br: () => <br />
                  })}
                </h2>
                <p className="max-w-md text-muted-foreground border-l border-primary pl-6">
                  {t('pillars.desc')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/5 rounded-md overflow-hidden">
                {t.raw('pillars.items').map((item: any, i: number) => (
                  <div key={i} className="group p-16 border border-border hover:bg-primary transition-all duration-500 cursor-default">
                    <Landmark size={24} className="mb-8 text-primary group-hover:text-primary-foreground transition-colors" />
                    <h3 className="text-xl font-bold group-hover:text-primary-foreground transition-colors">{item.t}</h3>
                    <p className="mt-4 text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
      </div>

    </main>
  );
}

// COMPOSANTS LOCAUX
function ControlButton({ onClick, icon, label, active }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${active ? 'bg-[#C9A84C] text-black' : 'hover:bg-white/10'}`}
    >
      {icon}
      {label && <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>}
    </button>
  );
}

function StatCard({ icon, number, label }: any) {
  return (
    <div className="p-12 bg-muted border border-border flex flex-col items-start gap-6 hover:border-primary/40 transition-all rounded-md">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-4xl font-bold mb-1">{number}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">{label}</div>
      </div>
    </div>
  );
}