// app/[locale]/HomeClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Microscope, Scale, Users, FileText, Globe, ArrowRight, Quote, 
  Landmark, Mail, Volume2, VolumeX, Play, Pause, ChevronRight, 
  Linkedin, Calendar, Clock, BookOpen, Download, User, ShieldCheck, MapPin,
  User2, Eye, LucideIcon, Image as ImageIcon, Video, Camera
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
import { useTranslations } from "next-intl";

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

const PARTNERS = [
  "Amnesty.webp", "McCain.webp", "Northwestern.webp", "TWB.webp",
  "worldbank.webp", "Ceni.webp", "Monusco.webp", "Oxford.webp",
  "Uhaki.webp", "Harvard.webp", "Morehouse.webp", "PNUD.webp", "ulpgl.webp"
];

const GALLERY_IMAGES = [
  { 
    src: "/images/gallery/conference.webp", 
    title: "Conférence Internationale 2024", 
    category: "Événement",
    description: "Chercheurs et partenaires réunis pour la conférence annuelle"
  },
  { 
    src: "/images/gallery/clinic.webp", 
    title: "Clinique Juridique Mobile", 
    category: "Terrain",
    description: "Accompagnement des communautés à Rutshuru"
  },
  { 
    src: "/images/gallery/research.webp", 
    title: "Atelier de Recherche", 
    category: "Académique",
    description: "Séminaire méthodologique avec les doctorants"
  },
  { 
    src: "/images/gallery/partners.webp", 
    title: "Rencontre Partenaires", 
    category: "Collaboration",
    description: "Signature de partenariat avec Northwestern University"
  },
  { 
    src: "/images/gallery/field.webp", 
    title: "Mission Terrain", 
    category: "Clinique",
    description: "Observation participante dans les communautés"
  },
  { 
    src: "/images/gallery/library.webp", 
    title: "Bibliothèque", 
    category: "Ressources",
    description: "Centre de documentation du CREDDA"
  },
  { 
    src: "/images/gallery/workshop.webp", 
    title: "Formation des Cliniciens", 
    category: "Formation",
    description: "Atelier sur les droits fonciers"
  },
  { 
    src: "/images/gallery/signing.webp", 
    title: "Signature de Convention", 
    category: "Partenariat",
    description: "Avec le PNUD et la MONUSCO"
  }
];

// --- COMPOSANT COMPTEUR ---
const Counter = ({ value, duration = 2 }: { value: number | string; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
      const hasPlus = value.toString().includes("+");
      
      let start = 0;
      const increment = numericValue / (duration * 60);
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

// --- COMPOSANT ICÔNE ---
const StatIcon = ({ icon: Icon, className = "w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" }: { icon: LucideIcon; className?: string }) => {
  return <Icon className={className} strokeWidth={1.2} />;
};

// --- COMPOSANT PRINCIPAL ---
export default function HomeClient({ 
  locale, 
  featuredResearch = [], 
  latestReports = [], 
  team = [], 
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0 } 
}: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const t = useTranslations('HomePage');
  const slides = t.raw('hero.slides');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const galleryInterval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(galleryInterval);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPaused) videoRef.current.play();
      else videoRef.current.pause();
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden mt-16 sm:mt-20 lg:mt-24">
      
      {/* --- SECTION 1: HERO OWL VIDEO --- */}
      <section className="relative h-[80vh] sm:h-[85vh] lg:h-[90vh] xl:h-[95vh] w-full overflow-hidden bg-slate-950">
        <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 sm:opacity-40">
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />

        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-30 flex gap-2 sm:gap-3 lg:gap-4">
          <button 
            onClick={togglePlay}
            className="p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
          >
            {isPaused ? <Play size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" /> : <Pause size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" />}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
          >
            {isMuted ? <VolumeX size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <Volume2 size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
          </button>
        </div>

        <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8"
            >
              <Badge className="bg-blue-600 text-white rounded-none px-3 sm:px-4 py-1 sm:py-1.5 uppercase tracking-widest text-[8px] sm:text-[9px] lg:text-[10px] font-black border-none shadow-lg">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif font-bold text-white leading-[1.1] sm:leading-[1.08] lg:leading-[1.05]">
                {slides[currentSlide]?.title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 font-light max-w-lg sm:max-w-xl lg:max-w-2xl leading-relaxed">
                {slides[currentSlide]?.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 pt-2 sm:pt-3 lg:pt-4">
                <Link href="/publications" className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-slate-950 font-black hover:bg-blue-600 hover:text-white transition-all rounded-none text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-widest shadow-2xl text-center">
                  {t('hero.cta_publications')}
                </Link>
                <Link href="/contact" className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border-2 border-white/30 text-white font-black hover:bg-white/10 transition-all rounded-none text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-widest text-center">
                  {t('hero.cta_contact')}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-4 sm:left-6 z-20 flex gap-3 sm:gap-4 lg:gap-6">
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="flex items-center group">
                <span className={`text-[8px] sm:text-[9px] lg:text-[10px] font-black mr-2 sm:mr-3 ${currentSlide === i ? 'text-blue-500' : 'text-slate-500'}`}>0{i + 1}</span>
                <div className="h-[2px] w-8 sm:w-12 lg:w-16 bg-white/20 relative overflow-hidden">
                  {currentSlide === i && (
                    <motion.div layoutId="progress" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 8, ease: "linear" }} className="absolute inset-0 bg-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: STATISTIQUES --- */}
      <section className="bg-slate-50/50 py-8 sm:py-12 lg:py-16 xl:py-20 border-y border-slate-100 relative z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {[
              { 
                v: new Date().getFullYear() - 2008, 
                l: t('stats.years'), 
                icon: Landmark 
              },
              { 
                v: dbStats?.totalResources || 0, 
                l: t('stats.pubs'), 
                icon: FileText 
              },
              { 
                v: 15, 
                l: t('stats.partners'), 
                icon: Globe 
              },
              { 
                v: 12000, 
                l: t('stats.cases'), 
                icon: Users 
              },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left"
              >
                <div className="text-blue-600 transition-transform duration-500 group-hover:scale-110 shrink-0 mb-2 sm:mb-0">
                  <StatIcon icon={s.icon} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>

                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 leading-none mb-1 sm:mb-2">
                    <Counter value={s.v} />
                  </div>
                  <div className="text-[10px] sm:text-[11px] lg:text-xs font-medium text-slate-500 leading-snug max-w-[120px] sm:max-w-[140px] lg:max-w-[150px]">
                    {s.l}
                  </div>
                </div>
              </motion.div>
            ))}
            
          </div>
        </div>
      </section>

      {/* --- SECTION 3: RECHERCHE --- */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              x: [0, 20, 0] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-[300px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[300px] lg:h-[400px] bg-blue-600/5 rounded-[100%] blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
              y: [0, 30, 0] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-[-10%] w-[400px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[500px] bg-emerald-600/5 rounded-[100%] blur-[80px] sm:blur-[100px] lg:blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 lg:mb-16 xl:mb-20 gap-6 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4 lg:space-y-6"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="h-[2px] w-8 sm:w-10 lg:w-12 bg-blue-600" />
                <Badge className="bg-blue-600/10 text-blue-700 border-none rounded-none uppercase text-[8px] sm:text-[9px] lg:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] px-2 sm:px-3 py-1">
                  {t('research.badge')}
                </Badge>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">
                <span dangerouslySetInnerHTML={{ __html: t.raw('research.title') }} />
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-light max-w-md sm:max-w-lg lg:max-w-xl">
                {t('research.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/research" 
                className="group flex items-center gap-3 sm:gap-4 lg:gap-6 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] lg:tracking-[0.4em] text-slate-900 hover:text-blue-600 transition-all"
              >
                <span className="border-b-2 border-slate-200 group-hover:border-blue-600 pb-1 sm:pb-2 transition-all">{t('research.cta')}</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight size={12} className="sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredResearch?.slice(0, 4).map((article: any, idx: number) => (
              <motion.div 
                key={article?.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white border border-slate-100 p-2 flex flex-col h-full hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <Image 
                    src={article?.mainImage || "/images/director3.webp"} 
                    fill 
                    alt={article?.translations?.[0]?.title || "Research"} 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all duration-500" />
                  
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                    <div className="bg-white/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 text-[6px] sm:text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                      {article?.category?.translations?.[0]?.name || "Général"}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                  <h4 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-slate-950 mb-2 sm:mb-3 lg:mb-4 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article?.translations?.[0]?.title || "Titre de recherche"}
                  </h4>
                  
                  <p className="text-[10px] sm:text-xs lg:text-xs text-slate-500 line-clamp-2 sm:line-clamp-3 font-light leading-relaxed mb-4 sm:mb-6 lg:mb-8 italic">
                    "{article?.translations?.[0]?.excerpt?.substring(0, 80) || "Résumé non disponible"}"
                  </p>

                  <div className="mt-auto pt-4 sm:pt-5 lg:pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-blue-600 rounded-full" />
                      <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {article?.createdAt ? new Date(article.createdAt).getFullYear() : "2025"}
                      </span>
                    </div>
                    <Link 
                      href={`/research/${article?.slug || article?.id || '#'}`} 
                      className="text-[7px] sm:text-[8px] lg:text-[9px] font-black uppercase tracking-tighter text-slate-900 overflow-hidden relative group/link"
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

        <div className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16 lg:mt-20">
          <div className="flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] sm:tracking-[0.45em] lg:tracking-[0.5em]">
            <div className="h-px w-12 sm:w-16 lg:w-20 bg-slate-200" />
            <span>Scientific Excellence</span>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: IMPACT CLINIQUE --- */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#062c24] text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="relative aspect-video border-[8px] sm:border-[10px] lg:border-[15px] border-white/5 shadow-2xl overflow-hidden group order-2 lg:order-1">
            <Image src="/images/director3.webp" alt="Impact Terrain" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-emerald-900/20" />
          </div>
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
            <Badge className="bg-emerald-500 rounded-none uppercase text-[8px] sm:text-[9px] tracking-widest px-2 sm:px-3 py-1 border-none font-black">{t('clinical.badge')}</Badge>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold leading-tight">{t('clinical.title')}</h3>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-100/80 font-light leading-relaxed">
              {t('clinical.description')}
            </p>
            <div className="space-y-3 sm:space-y-4">
              {[
                { key: 'legal', icon: ShieldCheck },
                { key: 'land', icon: MapPin }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 bg-white/5 border-l-2 border-emerald-500">
                  <item.icon className="text-emerald-400 shrink-0" size={16} />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest">{t(`clinical.actions.${item.key}.title`)}</h4>
                    <p className="text-[10px] sm:text-xs text-emerald-200/60 mt-1">{t(`clinical.actions.${item.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/clinical" className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-400 pb-1 sm:pb-2 hover:gap-4 sm:hover:gap-5 lg:hover:gap-6 transition-all">
              {t('clinical.cta')} <ArrowRight size={12} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: GALLERIE INTERACTIVE --- */}
<section className="py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      <Badge className="bg-blue-600/10 text-blue-700 rounded-none mb-3 sm:mb-4 uppercase text-[8px] sm:text-[9px] lg:text-[10px] font-black px-3 py-1 border-none">
        {t('Gallery.badge')}
      </Badge>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-900 leading-tight">
        <span dangerouslySetInnerHTML={{ __html: t.raw('Gallery.title') }} />
      </h2>
      <p className="text-sm sm:text-base text-slate-500 font-light max-w-2xl mx-auto mt-3 sm:mt-4">
        {t('Gallery.description')}
      </p>
    </div>
  </div>

  {/* Carrousel plein écran */}
  <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
    <Carousel
      opts={{
        align: "center",
        loop: true,
        skipSnaps: false,
        dragFree: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {GALLERY_IMAGES.map((image, idx) => (
          <CarouselItem 
            key={idx} 
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Contenu au survol */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="space-y-2">
                  <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-400">
                    {image.category}
                  </p>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white line-clamp-1">
                    {image.title}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-white/70 line-clamp-2">
                    {image.description}
                  </p>
                </div>
              </div>

              {/* Badge catégorie (visible sans survol) */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[6px] sm:text-[7px] lg:text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                  {image.category}
                </Badge>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Flèches de navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
        <CarouselPrevious className="static translate-y-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-600 hover:text-white border-0 shadow-xl pointer-events-auto" />
        <CarouselNext className="static translate-y-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-600 hover:text-white border-0 shadow-xl pointer-events-auto" />
      </div>

      {/* Indicateurs de slide */}
      <div className="flex justify-center gap-2 mt-6">
        {GALLERY_IMAGES.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              idx === currentGalleryIndex 
                ? 'bg-blue-600 w-4 sm:w-6' 
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => setCurrentGalleryIndex(idx)}
          />
        ))}
      </div>
    </Carousel>
  </div>

  {/* Lien vers la galerie complète */}
  <div className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-10 lg:mt-12">
    <div className="flex justify-center">
      <Link 
        href="/gallery" 
        className="group inline-flex items-center gap-2 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600/30 pb-1 hover:border-blue-600 transition-all"
      >
        <span>{t('Gallery.cta')}</span>
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
</section>
      
      {/* --- SECTION 6: ÉQUIPE EN CARROUSEL --- */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-12 lg:mb-16 xl:mb-20 text-center">
           <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] lg:tracking-[0.4em] text-[8px] sm:text-[9px] lg:text-[10px] mb-2 sm:mb-3 lg:mb-4">{t('team.title')}</h2>
           <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-950">{t('team.subtitle')}</h3>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {team?.slice(0, 8).map((member: any) => (
                <CarouselItem key={member?.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-slate-100 relative mb-3 sm:mb-4 lg:mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden shadow-lg sm:shadow-xl">
                      <Image 
                        src={member?.image || "/images/director3.webp"} 
                        alt={member?.translations?.[0]?.name || "Membre"} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="font-serif font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-slate-900 tracking-tight line-clamp-1">
                      {member?.translations?.[0]?.name || "Nom"}
                    </h4>
                    <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-blue-700 font-black uppercase tracking-widest mt-1 line-clamp-1">
                      {member?.translations?.[0]?.role || "Chercheur"}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-6 sm:mt-8 lg:mt-10">
              <CarouselPrevious className="static translate-y-0 rounded-none border-slate-200 w-8 h-8 sm:w-10 sm:h-10" />
              <CarouselNext className="static translate-y-0 rounded-none border-slate-200 w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* --- SECTION 7: TÉMOIGNAGES --- */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#121820] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 -left-20 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-blue-900 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-slate-800 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-10 sm:mb-12 lg:mb-16 xl:mb-20 text-center">
          <Badge className="bg-blue-600 rounded-none mb-4 sm:mb-5 lg:mb-6 uppercase text-[8px] sm:text-[9px] lg:text-[10px] font-black px-3 sm:px-4 py-1 sm:py-2 border-none">{t('testimonials.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-serif font-bold italic text-white tracking-tight">{t('testimonials.title')}</h2>
        </div>
        <div className="relative flex flex-col gap-6 sm:gap-8 lg:gap-10 overflow-hidden group">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 animate-marquee hover:[animation-play-state:paused] w-max px-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[480px] bg-[#1a222c] border border-slate-700/50 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between hover:border-blue-500/50 transition-all group/card">
                <Quote className="text-blue-600 opacity-30 group-hover/card:opacity-100 transition-opacity mb-4 sm:mb-5 lg:mb-6 xl:mb-8" size={24} />
                <p className="text-sm sm:text-base lg:text-lg font-serif italic text-slate-300 leading-relaxed line-clamp-4">"{t.text}"</p>
                <div className="mt-6 sm:mt-8 lg:mt-10 xl:mt-12 flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6 border-t border-slate-700/50 pt-4 sm:pt-5 lg:pt-6 xl:pt-8">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full overflow-hidden border-2 border-blue-500/20 shadow-xl bg-slate-800 shrink-0">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">{t.name}</h4>
                    <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-blue-400 font-black uppercase mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-20 sm:w-30 lg:w-40 h-full bg-gradient-to-r from-[#121820] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 sm:w-30 lg:w-40 h-full bg-gradient-to-l from-[#121820] to-transparent z-20 pointer-events-none" />
      </section>

      {/* --- SECTION 8: BIBLIOTHÈQUE NUMÉRIQUE --- */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-blue-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-emerald-600/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-10 h-[2px] bg-blue-600" />
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-blue-600">
                  {t('library.badge')}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-900 leading-tight">
                <span dangerouslySetInnerHTML={{ __html: t.raw('library.title') }} />
              </h3>
              <p className="text-sm sm:text-base text-slate-500 font-light max-w-xl lg:max-w-2xl">
                {t('library.description')}
              </p>
            </div>
            <Link 
              href="/publications" 
              className="group inline-flex items-center gap-2 text-blue-600 font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest border-b-2 border-blue-600/30 pb-1 hover:border-blue-600 transition-all whitespace-nowrap"
            >
              <span>{t('library.cta')}</span>
              <ArrowRight size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            {latestReports?.slice(0, 3).map((pub: any, index: number) => (
              <motion.div
                key={pub?.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_30px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      pub?.domain === 'RESEARCH' 
                        ? 'from-blue-600 to-blue-400' 
                        : pub?.domain === 'CLINICAL'
                        ? 'from-emerald-600 to-emerald-400'
                        : 'from-amber-600 to-amber-400'
                    }`} 
                  />

                  {pub?.createdAt && new Date(pub.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 z-20">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[6px] sm:text-[7px] lg:text-[8px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                        Nouveau
                      </Badge>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
                    <div className="relative mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                      <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg sm:rounded-xl flex items-center justify-center ${
                        pub?.domain === 'RESEARCH'
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
                          : pub?.domain === 'CLINICAL'
                          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600'
                          : 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600'
                      } group-hover:scale-110 transition-transform duration-500`}>
                        <FileText size={14} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1 sm:gap-2 text-[7px] sm:text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">
                        <Calendar size={8} className="sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 text-slate-400" />
                        <span className="text-slate-600">{pub?.year || '2025'}</span>
                      </div>
                      <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                      <Badge 
                        variant="outline" 
                        className={`
                          rounded-full px-1.5 sm:px-2 py-0.5 text-[5px] sm:text-[6px] lg:text-[7px] font-black uppercase tracking-widest border
                          ${pub?.domain === 'RESEARCH' 
                            ? 'border-blue-200 text-blue-700 bg-blue-50/50' 
                            : pub?.domain === 'CLINICAL'
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                            : 'border-amber-200 text-amber-700 bg-amber-50/50'
                          }
                        `}
                      >
                        {pub?.domain === 'RESEARCH' ? 'Recherche' : pub?.domain === 'CLINICAL' ? 'Clinique' : 'Rapport'}
                      </Badge>
                    </div>

                    <h4 className="text-sm sm:text-base lg:text-lg xl:text-xl font-serif font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {pub?.translations?.[0]?.title || 'Rapport de recherche CREDDA'}
                    </h4>

                    <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-blue-600/60 to-transparent mb-3 group-hover:w-12 sm:group-hover:w-14 transition-all duration-500" />

                    <div className="flex items-center justify-between">
                      <motion.a
                        href={pub?.pdfUrl || '#'}
                        download
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-slate-900 hover:bg-blue-600 text-white text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-wider rounded-md sm:rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                      >
                        <Download size={8} className="sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 group-hover/btn:animate-bounce" />
                        <span>PDF</span>
                      </motion.a>

                      <Link
                        href={`/publications/${pub?.slug || pub?.id || '#'}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-1 sm:p-1.5"
                      >
                        <ArrowRight size={12} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 lg:mt-16 xl:mt-20 pt-8 sm:pt-10 lg:pt-12 xl:pt-16 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  <Counter value={dbStats?.publications || 0} />
                </div>
                <div className="text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 sm:mt-2">
                  {t('library.stats.publications')}
                </div>
              </div>

              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  <Counter value={dbStats?.clinicalArticles || 0} />
                </div>
                <div className="text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 sm:mt-2">
                  {t('library.stats.clinical')}
                </div>
              </div>

              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  <Counter value={dbStats?.researchArticles || 0} />
                </div>
                <div className="text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 sm:mt-2">
                  {t('library.stats.research')}
                </div>
              </div>

              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  <Counter value={dbStats?.totalResources || 0} />
                </div>
                <div className="text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 sm:mt-2">
                  {t('library.stats.total')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 bg-white rounded-full shadow-sm border border-slate-200">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-black uppercase tracking-wider text-slate-600">
                {t('library.badge')} mise à jour le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 9: PARTENAIRES --- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <p className="text-center text-[8px] sm:text-[9px] lg:text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] sm:tracking-[0.45em] lg:tracking-[0.5em] mb-8 sm:mb-10 lg:mb-12">{t('partners.title')}</p>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-infinite-scroll gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((logo, i) => (
              <div key={i} className="relative w-24 sm:w-32 lg:w-36 xl:w-44 h-8 sm:h-10 lg:h-12 xl:h-16 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer">
                <Image src={`/images/partenaires/${logo}`} alt="Partner" fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 10: CTA FINAL --- */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-blue-900 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-serif font-bold max-w-4xl lg:max-w-5xl mx-auto tracking-tighter uppercase leading-none">
              <span dangerouslySetInnerHTML={{ __html: t.raw('cta.title') }} />
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-5 xl:gap-8 pt-4 sm:pt-5 lg:pt-6 xl:pt-8">
              <Link href="/contact" className="px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 bg-slate-950 text-white font-black uppercase text-[9px] sm:text-[10px] lg:text-[11px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-2xl rounded-none">{t('cta.partner')}</Link>
              <Link href="/about" className="px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 border-2 border-white/40 text-white font-black uppercase text-[9px] sm:text-[10px] lg:text-[11px] tracking-widest hover:bg-white/10 transition-all rounded-none text-center">{t('cta.about')}</Link>
            </div>
         </div>
      </section>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        @keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-infinite-scroll { animation: infinite-scroll 45s linear infinite; }
        
        @media (max-width: 640px) {
          .animate-marquee { animation-duration: 45s; }
          .animate-infinite-scroll { animation-duration: 35s; }
        }
      `}</style>
    </div>
  );
}