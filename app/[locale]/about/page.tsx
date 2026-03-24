"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, EyeOff, Eye,
  ArrowRight, Landmark, Target, Globe2, ShieldCheck, MapPin, 
  ChevronDown, Scale, BookOpen, Quote
} from "lucide-react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PremiumAboutPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gestion du scroll pour l'élégance du header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-[#080807] text-[#F5F2EC] selection:bg-[#C9A84C] selection:text-black">
      
      {/* --- 1. HERO IMMERSIF (CINEMATIC) --- */}
      <section className="relative h-[110vh] w-full overflow-hidden flex items-center justify-center">
        
        {/* BACKGROUND VIDEO LAYER */}
        <div className="absolute inset-0 z-0">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=V-MVLqjQMIc"
            playing={isPlaying}
            muted={isMuted}
            loop
            width="100%"
            height="115%" // Un peu plus haut pour cacher les bords YouTube
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.2)' }}
            config={{ youtube: { playerVars: { controls: 0, showinfo: 0, rel: 0, start: 12 } } }}
          />
          
          {/* Overlay de texture & Gradient */}
          <div className={`absolute inset-0 transition-all duration-1000 z-10 
            ${isCinemaMode ? 'bg-black/20' : 'bg-[#080807]/60 backdrop-blur-[2px]'}`} 
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-[#080807]" />
          
          {/* Effet de grain argentique (Overlay CSS) */}
          <div className="absolute inset-0 z-25 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* CONTENT LAYER */}
        <AnimatePresence>
          {!isCinemaMode && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-30 container mx-auto px-6 text-center"
            >
              <Badge className="bg-transparent border border-[#C9A84C]/30 text-[#C9A84C] rounded-none px-8 py-2 text-[10px] tracking-[0.5em] uppercase mb-12">
                Fondé en 2008 • Excellence Académique
              </Badge>
              
              <h1 className="text-7xl md:text-9xl font-serif font-light leading-none mb-12">
                Penser le <span className="italic text-[#C9A84C]">Droit</span>,<br />
                Bâtir l&apos;<span className="font-bold">Avenir</span>.
              </h1>
              
              <div className="max-w-2xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent my-12" />
              
              <p className="max-w-xl mx-auto text-lg text-[#F5F2EC]/50 font-light leading-relaxed">
                Le CREDDA est l&apos;épicentre de la recherche juridique en RDC, fusionnant rigueur scientifique et engagement social.
              </p>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-[-15vh] left-1/2 -translate-x-1/2 text-[#C9A84C]/40"
              >
                <ChevronDown size={32} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING CONTROLS (Glassmorphism) */}
        <div className="absolute bottom-12 right-12 z-50 flex items-center gap-2 p-2 bg-white/5 backdrop-blur-2xl border border-white/10">
          <ControlButton 
            active={isCinemaMode}
            onClick={() => setIsCinemaMode(!isCinemaMode)} 
            icon={isCinemaMode ? <Eye size={18} /> : <EyeOff size={18} />} 
            label={isCinemaMode ? "Infos" : "Cinéma"}
          />
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <ControlButton onClick={() => setIsPlaying(!isPlaying)} icon={isPlaying ? <Pause size={18} /> : <Play size={18} />} />
          <ControlButton onClick={() => setIsMuted(!isMuted)} icon={isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />} />
        </div>
      </section>

      {/* --- 2. PHILOSOPHIE SECTION --- */}
      <section className="py-40 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <span className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase">Notre Manifeste</span>
            <h2 className="text-5xl font-serif leading-tight">
              Une vision <br /><span className="italic">transformatrice</span> du droit.
            </h2>
            <p className="text-[#F5F2EC]/50 leading-loose font-light">
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

      {/* --- 3. FONDEMENTS (GRID BRUTALISTE) --- */}
      <section className="py-40 bg-[#111110]">
        <div className="container mx-auto px-6">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-6xl font-serif italic">Les Piliers <br /><span className="not-italic font-bold">Légaux</span></h2>
            <p className="max-w-md text-[#F5F2EC]/40 border-l border-[#C9A84C] pl-6">
              Nos actions s&apos;inscrivent dans le respect strict des cadres normatifs nationaux et internationaux.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/5">
            {["Constitution RDC", "Loi 22/030 (Autochtones)", "Charte Africaine", "Convention Diversité Bio", "Déclaration ONU", "Droit de l'Environnement"].map((title, i) => (
              <div key={i} className="group p-16 border border-white/5 hover:bg-[#C9A84C] transition-all duration-500 cursor-default">
                <Landmark size={24} className="mb-8 text-[#C9A84C] group-hover:text-black transition-colors" />
                <h3 className="text-xl font-bold group-hover:text-black transition-colors">{title}</h3>
                <p className="mt-4 text-sm text-[#F5F2EC]/40 group-hover:text-black/60 transition-colors">Référence fondamentale de nos analyses juridiques et cliniques.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CITATION (BREAK) --- */}
      <section className="py-40 flex justify-center text-center">
         <div className="max-w-4xl px-6">
            <Quote size={60} className="mx-auto mb-12 text-[#C9A84C]/20" />
            <h3 className="text-3xl md:text-5xl font-serif italic leading-relaxed text-[#F5F2EC]/80">
              &quot;Le droit ne doit pas seulement être dit, il doit être vécu au service de la justice climatique et sociale.&quot;
            </h3>
         </div>
      </section>

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
    <div className="p-12 bg-[#111110] border border-white/5 flex flex-col items-start gap-6 hover:border-[#C9A84C]/40 transition-all">
      <div className="text-[#C9A84C]">{icon}</div>
      <div>
        <div className="text-4xl font-bold mb-1">{number}</div>
        <div className="text-[10px] uppercase tracking-widest text-[#F5F2EC]/30 font-bold">{label}</div>
      </div>
    </div>
  );
}