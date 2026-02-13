"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  Microscope, Scale, Users, FileText, Globe, ArrowRight, Quote, 
  Landmark, Mail, Volume2, VolumeX, Play, Pause, ChevronRight, 
  Linkedin, Calendar, Clock, BookOpen, Download, User, ShieldCheck, MapPin,
  User2,
  Eye
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// --- CONSTANTES ---

const TESTIMONIALS = [
  {
    name: "David MICHAEL PEYTON",
    role: "PhD Candidate, Northwestern University",
    image: "/images/testimonials/Peyton.webp",
    text: "I could not have asked for more ideal research partners than the faculty and staff at CREDDA-ULPGL. They were not only able to support multiple types of data collection but also provided opportunities for feedback from Congolese academics."
  },
  {
    name: "Heather LYNNE ZIMMERMAN",
    role: "Masters student, London School of Economics (LSE)",
    image: "/images/testimonials/heather.webp",
    text: "Dear Professor Kennedy Kihangi, thank you very much for generously welcoming me into the community! I am grateful for the ideas and feedback offered on my research. I am eager to return to Goma."
  },
  {
    name: "Britta Sjöstedt",
    role: "PhD candidate, Lund University",
    image: "/images/testimonials/britta.webp",
    text: "I visited ULPGL in 2015 to conduct research for my PhD. Professor Kennedy KIHANGI BINDU was an excellent host that helped to get in contact with other researchers and organisations."
  }
];
const renderIcon = (Icon: React.ElementType, className: string = "w-7 h-7 sm:w-8 sm:h-8") => {
    return <Icon className={className} strokeWidth={1.2} />;
  };
const PARTNERS = [
  "Amnesty.webp", "McCain.webp", "Northwestern.webp", "TWB.webp",
  "worldbank.webp", "Ceni.webp", "Monusco.webp", "Oxford.webp",
  "Uhaki.webp", "Harvard.webp", "Morehouse.webp", "PNUD.webp", "ulpgl.webp"
];

// --- COMPOSANT COMPTEUR ---
const Counter = ({ value, duration = 2 }: { value: number | string, duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
      const hasPlus = value.toString().includes("+");
      
      let start = 0;
      const increment = numericValue / (duration * 60); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setDisplayValue(numericValue + (hasPlus ? "+" : ""));
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(start) + (hasPlus ? "+" : ""));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

// --- COMPOSANT PRINCIPAL ---
export default function HomeClient({ locale, featuredResearch, latestReports, team, dbStats }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPaused) videoRef.current.play();
      else videoRef.current.pause();
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      
      {/* --- SECTION 1: HERO OWL VIDEO --- */}
      <section className="relative h-[95vh] w-full overflow-hidden bg-slate-950">
        <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />

        {/* --- BOUTONS DE CONTRÔLE VIDÉO RESTAURÉS --- */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-4">
          <button 
            onClick={togglePlay}
            className="p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
          >
            {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl space-y-8"
            >
              <Badge className="bg-blue-600 rounded-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-black border-none shadow-lg">
                CREDDA - ULPGL Excellence
              </Badge>
              <h1 className="text-6xl lg:text-8xl font-serif font-bold text-white leading-[1.05]">
                {currentSlide === 0 && <>L'excellence au service de la <span className="text-blue-500 italic underline decoration-blue-500/30 underline-offset-8">Démocratie</span>.</>}
                {currentSlide === 1 && <>Clinique Juridique <span className="text-emerald-500 italic underline decoration-emerald-500/30 underline-offset-8">Environnementale</span>.</>}
                {currentSlide === 2 && <>Un Hub de <span className="text-blue-400 italic underline decoration-blue-400/30 underline-offset-8">Coopération</span> Globale.</>}
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
                Le pôle scientifique de l'ULPGL dédié à la recherche-action et à la protection des droits en Afrique Centrale.
              </p>
              <div className="flex gap-5 pt-4">
                <Link href="/publications" className="px-10 py-5 bg-white text-slate-950 font-black hover:bg-blue-600 hover:text-white transition-all rounded-none text-[11px] uppercase tracking-widest shadow-2xl">
                  Nos Publications
                </Link>
                <Link href="/contact" className="px-10 py-5 border-2 border-white/30 text-white font-black hover:bg-white/10 transition-all rounded-none text-[11px] uppercase tracking-widest">
                  Contact
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Owl Progress Indicators */}
          <div className="absolute bottom-12 left-6 z-20 flex gap-6">
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="flex items-center group">
                <span className={`text-[10px] font-black mr-3 ${currentSlide === i ? 'text-blue-500' : 'text-slate-500'}`}>0{i + 1}</span>
                <div className="h-[2px] w-16 bg-white/20 relative overflow-hidden">
                  {currentSlide === i && (
                    <motion.div layoutId="progress" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 8, ease: "linear" }} className="absolute inset-0 bg-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
{/* --- SECTION 2: STATISTIQUES RÉELLES (DESIGN INSPIRÉ) --- */}
<section className="bg-slate-50/50 py-12 sm:py-20 border-y border-slate-100 relative z-20">
  <div className="container mx-auto px-6">
    {/* La grille utilise divide-x pour créer les lignes de séparation entre les colonnes */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
      
      {[
        { 
          v: new Date().getFullYear() - 2008, 
          l: "Années d'Expertise en recherche-action", 
          i: <Landmark className="text-blue-600 w-7 h-7 sm:w-8 sm:h-8" /> 
        },
        
        { 
          v: dbStats.totalResources, 
          l: "Documents Scientifiques & Rapports", 
          i: <FileText /> 
        },
        { 
          v: 15, 
          l: "Partenaires Académiques Mondiaux", 
          i: <Globe /> 
        },
        { 
          v: 12000, 
          l: "Bénéficiaires de la Clinique Juridique", 
          i: <Users /> 
        },
      ].map((s, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-6 px-8 py-10 md:py-4 lg:py-0 group"
        >
          {/* Icône stylisée - On augmente la taille et on affine le trait (strokeWidth) */}
          <div className="text-blue-600 transition-transform duration-500 group-hover:scale-110 shrink-0">
                  {renderIcon(s.i)}
                </div>

          <div className="flex flex-col">
            {/* Chiffre large et bleu */}
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 leading-none mb-2">
              <Counter value={s.v} />
            </div>
            {/* Description grise et fine */}
            <div className="text-xs sm:text-sm font-medium text-slate-500 leading-snug max-w-[150px]">
              {s.l}
            </div>
          </div>
        </motion.div>
      ))}
      
    </div>
  </div>
</section>
      {/* --- SECTION 3: RECHERCHE (BACKEND) - VERSION PREMIUM --- */}
{/* --- SECTION 3: RECHERCHE (DESIGN SCIENTIFIQUE FLUIDE) --- */}
<section className="py-32 bg-slate-50 relative overflow-hidden">
  
  {/* --- 1. ÉLÉMENTS DE DESIGN OVALES (BG) --- */}
  {/* Ces formes bougent lentement pour briser la rigidité du site */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
        x: [0, 20, 0] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-24 -left-24 w-[600px] h-[400px] bg-blue-600/5 rounded-[100%] blur-3xl"
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, -10, 0],
        y: [0, 30, 0] 
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-0 right-[-10%] w-[800px] h-[500px] bg-emerald-600/5 rounded-[100%] blur-[120px]"
    />
  </div>

  <div className="container mx-auto px-6 relative z-10">
    
    {/* --- 2. EN-TÊTE DYNAMIQUE --- */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-12 bg-blue-600" />
          <Badge className="bg-blue-600/10 text-blue-700 border-none rounded-none uppercase text-[10px] font-black tracking-[0.3em] px-3 py-1">
            Recherche Active
          </Badge>
        </div>
        <h3 className="text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">
          Explorer les <span className="italic text-blue-600">Frontières</span> du Savoir.
        </h3>
        <p className="text-slate-500 font-light text-lg max-w-xl">
          Nos axes de recherche s'articulent autour des défis contemporains de la gouvernance en Afrique.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Link 
          href="/research" 
          className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 hover:text-blue-600 transition-all"
        >
          <span className="border-b-2 border-slate-200 group-hover:border-blue-600 pb-2 transition-all">Consulter tout le domaine</span>
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </Link>
      </motion.div>
    </div>

    {/* --- 3. GRILLE DE CARTES "FLOATING" --- */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {featuredResearch.map((article: any, idx: number) => (
        <motion.div 
          key={article.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1, duration: 0.7 }}
          whileHover={{ y: -15 }}
          className="group relative bg-white border border-slate-100 p-2 flex flex-col h-full hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
        >
          {/* Image avec Overlay Oval au survol */}
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
             <Image 
                src={article.mainImage || "/images/director3.webp"} 
                fill 
                alt="Research" 
                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all duration-500" />
              
              {/* Badge flottant type "tag" */}
              <div className="absolute top-6 left-6">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                  {article.category?.translations[0]?.name || "Général"}
                </div>
              </div>
          </div>

          <div className="p-8 flex flex-col flex-1">
             {/* Titre avec soulignement dynamique */}
             <h4 className="text-xl font-serif font-bold text-slate-950 mb-4 leading-snug group-hover:text-blue-600 transition-colors">
               {article.translations[0]?.title}
             </h4>
             
             <p className="text-xs text-slate-500 line-clamp-3 font-light leading-relaxed mb-8 italic">
               "{article.translations[0]?.excerpt}"
             </p>

             {/* Footer de carte minimaliste */}
             <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     Rapport {new Date(article.createdAt).getFullYear()}
                   </span>
                </div>
                <Link 
                  href={`/research/${article.slug}`} 
                  className="text-[9px] font-black uppercase tracking-tighter text-slate-900 overflow-hidden relative group/link"
                >
                  <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-full">Accéder</span>
                  <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover/link:translate-y-0 text-blue-600">Accéder</span>
                </Link>
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  {/* --- 4. PETIT DÉTAIL DÉCORATIF --- */}
  <div className="container mx-auto px-6 mt-20">
    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">
      <div className="h-px w-20 bg-slate-200" />
      <span>Scientific Excellence</span>
    </div>
  </div>
</section>

      {/* --- SECTION 4: IMPACT CLINIQUE (NOUVELLE) --- */}
      <section className="py-28 bg-[#062c24] text-white overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-video border-[15px] border-white/5 shadow-2xl overflow-hidden group">
            <Image src="/images/director3.webp" alt="Impact Terrain" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-emerald-900/20" />
          </div>
          <div className="space-y-8">
            <Badge className="bg-emerald-500 rounded-none uppercase text-[9px] tracking-widest px-3 py-1 border-none font-black">Impact de Terrain</Badge>
            <h3 className="text-5xl font-serif font-bold leading-tight">La Clinique Juridique & Environnementale.</h3>
            <p className="text-lg text-emerald-100/80 font-light leading-relaxed">
              Plus qu'un centre d'étude, le CREDDA agit. Nous accompagnons les communautés locales dans la sécurisation foncière et la protection des écosystèmes forestiers.
            </p>
            <div className="space-y-4">
              {[
                { t: "Assistance Juridique", d: "Médiation et défense des droits des vulnérables." },
                { t: "Protection Foncière", d: "Sécurisation des terres face aux pressions industrielles." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/5 border-l-2 border-emerald-500">
                  <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest">{item.t}</h4>
                    <p className="text-xs text-emerald-200/60 mt-1">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/clinical" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-400 pb-2 hover:gap-6 transition-all">
              Nos actions cliniques <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: ÉQUIPE EN CARROUSEL --- */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-20 text-center">
           <h2 className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Leadership Scientifique</h2>
           <h3 className="text-5xl font-serif font-bold text-slate-950">Le Corps de Recherche</h3>
        </div>

        <div className="container mx-auto px-6">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {team.map((member: any) => (
                <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/4 pl-8">
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-slate-100 relative mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden shadow-xl">
                      <Image src={member.image || "/images/director3.webp"} alt={member.translations[0]?.name} fill className="object-cover group-hover:scale-105" />
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent" />
                    </div>
                    <h4 className="font-serif font-bold text-2xl text-slate-900 tracking-tight">{member.translations[0]?.name}</h4>
                    <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest mt-1">{member.translations[0]?.role}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-10">
              <CarouselPrevious className="static translate-y-0 rounded-none border-slate-200" />
              <CarouselNext className="static translate-y-0 rounded-none border-slate-200" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* --- SECTION 6: TÉMOIGNAGES (INFINITY WALL) --- */}
      <section className="py-32 bg-[#121820] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-900 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-slate-800 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 mb-20 text-center">
          <Badge className="bg-blue-600 rounded-none mb-6 uppercase text-[10px] font-black px-4 py-2 border-none">Confiance Internationale</Badge>
          <h2 className="text-5xl lg:text-7xl font-serif font-bold italic text-white tracking-tight">Ils nous font confiance.</h2>
        </div>
        <div className="relative flex flex-col gap-10 overflow-hidden group">
          <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] w-max px-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-[480px] bg-[#1a222c] border border-slate-700/50 p-12 flex flex-col justify-between hover:border-blue-500/50 transition-all group/card">
                <Quote className="text-blue-600 opacity-30 group-hover/card:opacity-100 transition-opacity mb-8" size={40} />
                <p className="text-lg font-serif italic text-slate-300 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-12 flex items-center gap-6 border-t border-slate-700/50 pt-8">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/20 shadow-xl bg-slate-800">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">{t.name}</h4>
                    <p className="text-[10px] text-blue-400 font-black uppercase mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-[#121820] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#121820] to-transparent z-20 pointer-events-none" />
      </section>

      {/* --- SECTION 7: BIBLIOTHÈQUE NUMÉRIQUE - RAPPORTS PDF (DESIGN PREMIUM) --- */}
<section className="py-20 sm:py-24 lg:py-28 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
  
  {/* Éléments décoratifs de fond */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
  
  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    
    {/* En-tête de section amélioré */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0 mb-12 sm:mb-16">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-[2px] bg-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
            Ressources
          </span>
        </div>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
          Bibliothèque <span className="italic text-blue-600">Numérique</span>
        </h3>
        <p className="text-base text-slate-500 font-light max-w-2xl">
          Découvrez nos derniers rapports de recherche, analyses juridiques et études de cas.
        </p>
      </div>
      <Link 
        href="/publications" 
        className="group inline-flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest border-b-2 border-blue-600/30 pb-2 hover:border-blue-600 transition-all whitespace-nowrap"
      >
        <span>Explorer les archives</span>
        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>

    {/* Grille des rapports - Design Cards Premium */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {latestReports.map((pub: any, index: number) => (
        <motion.div
          key={pub.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative"
        >
          {/* Card principale avec effet de profondeur */}
          <div className="relative h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden">
            
            {/* Barre de statut colorée dynamique selon le domaine */}
            <div 
              className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                pub.domain === 'RESEARCH' 
                  ? 'from-blue-600 to-blue-400' 
                  : pub.domain === 'CLINICAL'
                  ? 'from-emerald-600 to-emerald-400'
                  : 'from-amber-600 to-amber-400'
              }`} 
            />

            {/* Badge flottant "Nouveau" si récent */}
            {new Date(pub.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full px-3 py-1.5 text-[8px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                  Nouveau
                </Badge>
              </div>
            )}

            {/* Contenu de la card */}
            <div className="p-6 sm:p-8 lg:p-10">
              
              {/* Icône avec effet de glow */}
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                  pub.domain === 'RESEARCH'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
                    : pub.domain === 'CLINICAL'
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600'
                    : 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600'
                } group-hover:scale-110 transition-transform duration-500`}>
                  <FileText size={28} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-slate-600">{pub.year || '2025'}</span>
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <Badge 
                  variant="outline" 
                  className={`
                    rounded-full px-3 py-1 text-[7px] sm:text-[8px] font-black uppercase tracking-widest border
                    ${pub.domain === 'RESEARCH' 
                      ? 'border-blue-200 text-blue-700 bg-blue-50/50' 
                      : pub.domain === 'CLINICAL'
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                      : 'border-amber-200 text-amber-700 bg-amber-50/50'
                    }
                  `}
                >
                  {pub.domain === 'RESEARCH' ? 'Recherche' : pub.domain === 'CLINICAL' ? 'Clinique' : 'Rapport'}
                </Badge>
              </div>

              {/* Titre */}
              <h4 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {pub.translations[0]?.title || 'Rapport de recherche CREDDA'}
              </h4>

              {/* Résumé / Excerpt */}
              {pub.translations[0]?.excerpt && (
                <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2 mb-6">
                  {pub.translations[0].excerpt}
                </p>
              )}

              {/* Auteur / Affiliation */}
              {pub.authors && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <User2 size={14} className="text-slate-400" />
                  <span className="font-medium line-clamp-1">{pub.authors}</span>
                </div>
              )}

              {/* Séparateur décoratif */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600/60 to-transparent mb-6 group-hover:w-20 transition-all duration-500" />

              {/* Actions - Boutons PDF et détails */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Bouton Téléchargement PDF */}
                  <motion.a
                    href={pub.pdfUrl || '#'}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                  >
                    <Download size={14} className="group-hover/btn:animate-bounce" />
                    <span>PDF</span>
                  </motion.a>

                  {/* Métriques de lecture
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {pub.views || '1.2k'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {pub.downloads || '342'}
                    </span>
                  </div> */}
                </div>

                {/* Lien détails */}
                <Link
                  href={`/publications/${pub.slug || pub.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors p-2"
                >
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Overlay de gradient au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </motion.div>
      ))}
    </div>

    {/* --- Section des statistiques de la bibliothèque (DYNAMIQUE) --- */}
<div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-slate-200">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
    
    {/* Statistiques 1: Total Publications PDF */}
    <div className="text-center group">
      <div className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        <Counter value={dbStats.publications} />
      </div>
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
        Rapports Archivés
      </div>
    </div>

    {/* Statistiques 2: Articles Cliniques */}
    <div className="text-center group">
      <div className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
        <Counter value={dbStats.clinicalArticles} />
      </div>
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
        Cas Cliniques
      </div>
    </div>

    {/* Statistiques 3: Articles de Recherche */}
    <div className="text-center group">
      <div className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        <Counter value={dbStats.researchArticles} />
      </div>
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
        Études Scientifiques
      </div>
    </div>

    {/* Statistiques 4: Total Global */}
    <div className="text-center group">
      <div className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
        <Counter value={dbStats.totalResources} />
      </div>
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
        Ressources Totales
      </div>
    </div>

  </div>
</div>

    {/* Badge de mise à jour */}
    <div className="flex justify-center mt-12 sm:mt-16">
      <div className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm border border-slate-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
          Bibliothèque mise à jour le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>
    </div>
  </div>
</section>

      {/* --- SECTION 8: PARTENAIRES --- */}
      <section className="py-20 bg-white">
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-12">Réseau Académique International</p>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-infinite-scroll gap-20 items-center whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((logo, i) => (
              <div key={i} className="relative w-44 h-16 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer">
                <Image src={`/images/partenaires/${logo}`} alt="Partner" fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 9: CTA FINAL --- */}
      <section className="py-32 bg-blue-700 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="container mx-auto px-6 relative z-10 space-y-12">
            <h2 className="text-5xl lg:text-8xl font-serif font-bold max-w-5xl mx-auto tracking-tighter uppercase leading-none">
              Bâtir l'avenir par la <span className="italic underline decoration-white/20 underline-offset-8">Science</span>.
            </h2>
            <div className="flex justify-center gap-8 pt-8">
              <Link href="/contact" className="px-14 py-6 bg-slate-950 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-2xl rounded-none">Devenir Partenaire</Link>
              <Link href="/about" className="px-14 py-6 border-2 border-white/40 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all rounded-none text-center">Le Projet CREDDA</Link>
            </div>
         </div>
      </section>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        @keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-infinite-scroll { animation: infinite-scroll 45s linear infinite; }
      `}</style>
    </div>
  );
}