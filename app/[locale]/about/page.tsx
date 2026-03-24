"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, EyeOff, Eye,
  ArrowRight, Landmark, Target, Globe2, ShieldCheck, MapPin, 
  ChevronDown, Scale, BookOpen, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionNumber } from "@/components/home/SectionNumber";

export default function PremiumAboutPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* --- 1. HISTOIRE (HERO IMMERSIF) --- */}
      <div className="container mx-auto px-6 pt-32 relative z-50 pointer-events-none">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="01" />
        </div>
      </div>
      <section className="relative h-[110vh] w-full overflow-hidden flex items-center justify-center -mt-32">
        
        {/* BACKGROUND VIDEO LAYER */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
              ${isCinemaMode ? 'scale-100' : 'scale-110 opacity-60'}`}
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          
          <div className={`absolute inset-0 transition-all duration-1000 z-10 
            ${isCinemaMode ? 'bg-black/10' : 'bg-background/70 backdrop-blur-[2px]'}`} 
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        {/* CUSTOM PLAY/PAUSE OVERLAY */}
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center group cursor-pointer"
          onClick={togglePlay}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-full border border-white/20 bg-black/20 backdrop-blur-xl flex items-center justify-center text-white transition-all group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-black"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </motion.div>
        </div>

        {/* CONTENT LAYER */}
        <AnimatePresence>
          {!isCinemaMode && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-30 container mx-auto px-6 text-center pointer-events-none"
            >
              <Badge className="bg-transparent border border-[#C9A84C]/30 text-[#C9A84C] rounded-none px-8 py-2 text-[10px] tracking-[0.5em] uppercase mb-12">
                Fondé en 2008 • Excellence Académique
              </Badge>
              
              <h1 className="text-7xl md:text-[10rem] font-serif font-light leading-none mb-12 tracking-tighter">
                Penser le <span className="italic text-[#C9A84C]">Droit</span>,<br />
                Bâtir l&apos;<span className="font-bold">Avenir</span>.
              </h1>
              
              <div className="max-w-2xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent my-12" />
              
              <p className="max-w-xl mx-auto text-lg text-muted-foreground font-light leading-relaxed">
                Le CREDDA est l&apos;épicentre de la recherche juridique en RDC, fusionnant rigueur scientifique et engagement social.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING CONTROLS (Glassmorphism) */}
        <div className="absolute bottom-12 right-12 z-50 flex items-center gap-2 p-2 bg-muted/20 backdrop-blur-2xl border border-border">
          <ControlButton 
            active={isCinemaMode}
            onClick={() => setIsCinemaMode(!isCinemaMode)} 
            icon={isCinemaMode ? <Eye size={18} /> : <EyeOff size={18} />} 
            label={isCinemaMode ? "Infos" : "Cinéma"}
          />
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <ControlButton onClick={() => setIsMuted(!isMuted)} icon={isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />} />
        </div>
      </section>

      {/* --- 2. MISSION (PHILOSOPHIE) --- */}
      <div className="container mx-auto px-6 py-40">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="02" />
          <ScrollReveal className="w-full">
            <section>
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-8">
                  <span className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase">Notre Manifeste</span>
                  <h2 className="text-5xl font-serif leading-tight">
                    Une vision <br /><span className="italic">transformatrice</span> du droit.
                  </h2>
                  <p className="text-muted-foreground leading-loose font-light">
                    Au-delà des textes, nous croyons en un droit vivant. Un droit qui protège les écosystèmes du Bassin du Congo et garantit la dignité des peuples autochtones. 
                    Le CREDDA n&apos;est pas seulement un laboratoire, c&apos;est un bouclier juridique.
                  </p>
                  <div className="pt-8">
                     <Button variant="outline" className="rounded-none border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black px-10 py-6 transition-all">
                        Découvrir nos publications <ArrowRight className="ml-4" size={16} />
                     </Button>
                  </div>
                </div>
                
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                   <StatCard icon={<Scale size={32}/>} number="15+" label="Années de recherche" />
                   <StatCard icon={<BookOpen size={32}/>} number="200+" label="Articles publiés" />
                   <StatCard icon={<Globe2 size={32}/>} number="12" label="Partenariats globaux" />
                   <StatCard icon={<ShieldCheck size={32}/>} number="100%" label="Engagement local" />
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>

      {/* --- 3. FONDEMENTS (PILIERS) --- */}
      <div className="container mx-auto px-6 py-40 bg-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="03" />
          <ScrollReveal className="w-full">
            <section className="bg-card">
              <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <h2 className="text-6xl font-serif italic">Les Piliers <br /><span className="not-italic font-bold">Légaux</span></h2>
                <p className="max-w-md text-muted-foreground border-l border-primary pl-6">
                  Nos actions s&apos;inscrivent dans le respect strict des cadres normatifs nationaux et internationaux.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/5">
                {["Constitution RDC", "Loi 22/030 (Autochtones)", "Charte Africaine", "Convention Diversité Bio", "Déclaration ONU", "Droit de l'Environnement"].map((title, i) => (
                  <div key={i} className="group p-16 border border-border hover:bg-primary transition-all duration-500 cursor-default">
                    <Landmark size={24} className="mb-8 text-primary group-hover:text-primary-foreground transition-colors" />
                    <h3 className="text-xl font-bold group-hover:text-primary-foreground transition-colors">{title}</h3>
                    <p className="mt-4 text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors">Référence fondamentale de nos analyses juridiques et cliniques.</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>

      {/* --- 4. EQUIPE/CITATION (BREAK) --- */}
      <div className="container mx-auto px-6 py-40">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="04" />
          <ScrollReveal className="w-full">
            <section className="flex justify-center text-center">
               <div className="max-w-4xl px-6">
                  <Quote size={60} className="mx-auto mb-12 text-primary/10" />
                  <h3 className="text-3xl md:text-5xl font-serif italic leading-relaxed text-foreground/80">
                    &quot;Le droit ne doit pas seulement être dit, il doit être vécu au service de la justice climatique et sociale.&quot;
                  </h3>
               </div>
            </section>
          </ScrollReveal>
        </div>
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
    <div className="p-12 bg-muted border border-border flex flex-col items-start gap-6 hover:border-primary/40 transition-all">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-4xl font-bold mb-1">{number}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">{label}</div>
      </div>
    </div>
  );
}