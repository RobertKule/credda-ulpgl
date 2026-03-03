// app/[locale]/HomeClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, Variants } from "framer-motion";
import {
  ArrowRight, Quote, BookOpen, Users, Globe, FileText,
  Landmark, Volume2, VolumeX, Play, Pause, ChevronRight,
  ShieldCheck, MapPin, TreePine, Calendar, Download, User,
  Award, Sparkles, BookMarked, Layers, GraduationCap, Target,
  Heart, Star, Camera
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";

// --- COMPOSANT TYPEWRITER ---
const TypewriterText = ({ texts, delay = 3000 }: { texts: string[]; delay?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      // Ajouter une lettre
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
    } else if (isDeleting && displayText.length > 0) {
      // Supprimer une lettre
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 50);
    } else if (!isDeleting && displayText.length === currentText.length) {
      // Pause avant de supprimer
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && displayText.length === 0) {
      // Passer au texte suivant
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, delay]);

  return (
    <span className="relative inline-block">
      {displayText}
      <span className="absolute -right-2 top-0 w-0.5 h-full bg-blue-400 animate-pulse" />
    </span>
  );
};

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

// --- COMPOSANT COMPTEUR AVEC ANIMATION ---
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

// --- VARIANTS D'ANIMATION ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } }
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function HomeClient({
  locale,
  featuredResearch = [],
  latestReports = [],
  team = [],
  galleryImages = [],
  testimonials = TESTIMONIALS,
  partners = PARTNERS,
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0 }
}: any) {
  const t = useTranslations('HomePage');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Slides et données
  const slides = t.raw('hero.slides');

  // Parallax pour la vidéo
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

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

  const currentYear = new Date().getFullYear();
  const yearsOfExpertise = currentYear - 2008;

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      {/* ========== SECTION 1: HERO AVEC PARALLAX ET SLIDES ========== */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover">
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-blue-600/20 text-blue-300 border-0 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide mb-6">
                  {t('hero.badge')}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6"
              >
                <span dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.title }} />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed mb-10"
              >
                {slides[currentSlide]?.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/publications" className="group relative px-8 py-4 bg-white text-slate-900 font-medium hover:bg-blue-600 hover:text-white transition-all rounded-full text-sm shadow-lg overflow-hidden">
                    <span className="relative z-10">{t('hero.cta_publications')}</span>
                    <span className="absolute inset-0 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact" className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-all rounded-full text-sm backdrop-blur-sm">
                    {t('hero.cta_contact')}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Indicateurs de slide animés */}
          <div className="absolute bottom-24 left-6 z-20 flex gap-6">
            {[0, 1, 2].map((i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSlide(i)}
                className="flex items-center group"
              >
                <span className={`text-[10px] font-black mr-3 ${currentSlide === i ? 'text-blue-400' : 'text-slate-500'}`}>0{i + 1}</span>
                <div className="h-[2px] w-12 bg-white/20 relative overflow-hidden">
                  {currentSlide === i && (
                    <motion.div layoutId="progress" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 8, ease: "linear" }} className="absolute inset-0 bg-blue-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contrôles vidéo animés */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8 z-30 flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 99, 235, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all rounded-full"
          >
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 99, 235, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all rounded-full"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </motion.button>
        </motion.div>

        {/* Indicateur de défilement animé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xs uppercase tracking-widest font-light"
          >
            Scroll
          </motion.span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronRight size={16} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SECTION 2: STATISTIQUES AVEC STAGGER ========== */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: yearsOfExpertise, label: t('stats.years'), icon: Landmark },
              { value: dbStats?.totalResources || 45, label: t('stats.pubs'), icon: FileText },
              { value: 15, label: t('stats.partners'), icon: Globe },
              { value: "12K+", label: t('stats.cases'), icon: Users }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </motion.div>
                <motion.div className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">
                  {typeof stat.value === 'number' ? <Counter value={stat.value} /> : stat.value}
                </motion.div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ========== SECTION 3: RECHERCHE ========== */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-600/10 text-blue-700 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t('research.badge')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              <span dangerouslySetInnerHTML={{ __html: t.raw('research.title') }} />
            </h2>
            <p className="text-lg text-slate-500">
              {t('research.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredResearch?.slice(0, 4).map((article: any, idx: number) => {
              const trans = article?.translations?.[0];
              const category = article?.category?.translations?.[0]?.name || "Recherche";
              return (
                <motion.div
                  key={article?.id || idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    {!imageErrors[`research-${article?.id}`] ? (
                      <Image
                        src={article?.mainImage || "/images/hero-poster.webp"}
                        alt={trans?.title || ""}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => handleImageError(`research-${article?.id}`)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                        <FileText className="w-12 h-12 text-slate-300 mb-2" />
                        <span className="text-xs text-slate-400">Image non disponible</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full text-xs font-medium px-3 py-1 mb-3">
                        {category}
                      </Badge>
                    </motion.div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {trans?.title || "Titre de recherche"}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {trans?.excerpt || "Description..."}
                    </p>
                    <motion.div whileHover={{ x: 5 }} className="inline-flex items-center gap-1">
                      <Link href={`/research/${article?.slug || '#'}`} className="text-blue-700 font-medium text-sm">
                        {t('research.cta')}
                      </Link>
                      <ArrowRight size={14} className="text-blue-700" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/research" className="inline-flex items-center gap-2 text-blue-700 font-medium border border-blue-200 rounded-full px-8 py-3 hover:bg-blue-50 transition-all">
                {t('research.cta')} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== SECTION 4: CLINIQUE JURIDIQUE ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-[#062c24] text-white"
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeInLeft}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Badge className="bg-emerald-500/20 text-emerald-300 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
                {t('clinical.badge')}
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6"
            >
              {t('clinical.title')}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-emerald-100/80 font-light leading-relaxed mb-8"
            >
              {t('clinical.description')}
            </motion.p>

            <motion.div variants={staggerContainer} className="space-y-4 mb-8">
              {['legal', 'land'].map((key, i) => (
                <motion.div
                  key={key}
                  variants={fadeInRight}
                  whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/10 transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-emerald-500/20 rounded-lg"
                  >
                    {key === 'legal' ? <ShieldCheck className="text-emerald-400 w-6 h-6" /> : <TreePine className="text-emerald-400 w-6 h-6" />}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-base">{t(`clinical.actions.${key}.title`)}</h4>
                    <p className="text-sm text-emerald-200/70">{t(`clinical.actions.${key}.desc`)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ x: 5 }}
            >
              <Link href="/clinical" className="group inline-flex items-center gap-2 text-emerald-400 font-medium border-b-2 border-emerald-400/30 pb-1 hover:border-emerald-400 transition-all">
                {t('clinical.cta')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2"
          >
            <Image src="/images/director3.webp" alt="Clinique terrain" fill className="object-cover" />
          </motion.div>
        </div>
      </motion.section>

      {/* ========== SECTION 5: ÉQUIPE (Carrousel) ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-600/10 text-blue-700 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t('team.badge')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {t('team.title')}
            </h2>
            <p className="text-lg text-slate-500">
              {t('team.subtitle')}
            </p>
          </motion.div>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {team?.slice(0, 8).map((member: any, idx: number) => {
                const trans = member?.translations?.[0];
                return (
                  <CarouselItem key={member?.id} className="md:basis-1/3 lg:basis-1/4 pl-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group text-center"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-md">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full"
                        >
                          <Image 
                            src={member?.image || "/images/hero-poster.webp"} 
                            alt={trans?.name || ""} 
                            fill 
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                          />
                        </motion.div>
                      </div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-serif font-bold text-slate-900 mb-1"
                      >
                        {trans?.name || "Nom"}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-blue-600 font-medium"
                      >
                        {trans?.role || "Chercheur"}
                      </motion.p>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8">
              <CarouselPrevious className="static translate-y-0 rounded-full border-slate-200" />
              <CarouselNext className="static translate-y-0 rounded-full border-slate-200" />
            </div>
          </Carousel>
        </div>
      </motion.section>

      {/* ========== SECTION 6: GALERIE AVEC ANIMATIONS ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-600/10 text-blue-700 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t('Gallery.badge') || "En Images"}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              <span dangerouslySetInnerHTML={{ __html: t.raw('Gallery.title') || "Le CREDDA en <span>Action</span>" }} />
            </h2>
            <p className="text-lg text-slate-500">
              {t('Gallery.description') || "Découvrez nos activités de recherche, cliniques et partenariats à travers une sélection d'images."}
            </p>
          </motion.div>

          {/* Grille de galerie avec données réelles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {galleryImages.slice(0, 8).map((image: any, idx: number) => (
              <motion.div
                key={image.id || idx}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 cursor-pointer"
              >
                {!imageErrors[`gallery-${image.id}`] ? (
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(`gallery-${image.id}`)}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                    <Camera className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                
                {/* Overlay au survol */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4"
                >
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Badge className="bg-blue-600 text-white border-0 mb-2 text-[8px] px-2 py-0.5">
                      {image.category}
                    </Badge>
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {image.title}
                    </p>
                  </div>
                </motion.div>

                {/* Badge "À la une" si featured */}
                {image.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="absolute top-2 left-2"
                  >
                    <Badge className="bg-amber-500 text-white border-0 text-[8px] px-2 py-0.5 flex items-center gap-1">
                      <Star size={10} className="fill-white" /> À la une
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Lien vers la galerie complète */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 text-blue-700 font-medium border border-blue-200 rounded-full px-8 py-3 hover:bg-blue-50 transition-all"
              >
                {t('Gallery.cta') || "Voir toute la galerie"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== SECTION 7: TÉMOIGNAGES AVEC ANIMATIONS AMÉLIORÉES ========== */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-600/10 text-blue-700 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t('testimonials.badge')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {t('testimonials.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test: any, idx: number) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200">
                    <Image src={test.image} alt={test.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{test.name}</h4>
                    <p className="text-sm text-blue-600">{test.role}</p>
                  </div>
                </motion.div>
                
                <Quote className="text-blue-300 w-8 h-8 mb-4" />
                <p className="text-slate-600 leading-relaxed italic">"{test.text}"</p>
                
                {/* Animations de coeur au survol */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="flex justify-end mt-4"
                >
                  <Heart size={16} className="text-red-400" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ========== SECTION 8: BIBLIOTHÈQUE NUMÉRIQUE ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
            <motion.div variants={fadeInLeft} className="max-w-xl">
              <Badge className="bg-blue-600/10 text-blue-700 border-0 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
                {t('library.badge')}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                <span dangerouslySetInnerHTML={{ __html: t.raw('library.title') }} />
              </h2>
              <p className="text-lg text-slate-500 mt-4">
                {t('library.description')}
              </p>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <motion.div whileHover={{ x: 5 }}>
                <Link href="/publications" className="group inline-flex items-center gap-2 text-blue-700 font-medium border-b-2 border-blue-200 pb-1 hover:border-blue-700 transition-all">
                  {t('library.cta')} <ArrowRight size={16} className="group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
            {latestReports?.slice(0, 3).map((pub: any, idx: number) => {
              const trans = pub?.translations?.[0];
              return (
                <motion.div
                  key={pub?.id || idx}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`${pub?.domain === 'RESEARCH' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'} rounded-full text-xs px-3 py-1 font-medium`}
                    >
                      {pub?.domain === 'RESEARCH' ? 'Recherche' : 'Clinique'}
                    </motion.div>
                    <span className="text-sm text-slate-400">{pub?.year || '2025'}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {trans?.title || 'Rapport'}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{trans?.description || trans?.excerpt || ''}</p>
                  <div className="flex justify-between items-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href={pub?.pdfUrl || '#'} download className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white text-xs rounded-full hover:bg-blue-700 transition">
                        <Download size={12} /> PDF
                      </a>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link href={`/publications/${pub?.slug || '#'}`} className="text-blue-700 p-2 hover:bg-blue-50 rounded-full transition">
                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats animées */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200"
          >
            {[
              { value: dbStats?.publications || 0, label: t('library.stats.publications') },
              { value: dbStats?.clinicalArticles || 0, label: t('library.stats.clinical') },
              { value: dbStats?.researchArticles || 0, label: t('library.stats.research') },
              { value: dbStats?.totalResources || 0, label: t('library.stats.total') }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl font-bold text-blue-700"
                >
                  <Counter value={stat.value} />
                </motion.div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== SECTION 9: PARTENAIRES AVEC TYPEWRITER ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
              <Globe className="text-blue-600" size={24} />
              <TypewriterText 
                texts={[
                  t('partners.title') || "International Academic Network",
                  "Partenaires Mondiaux",
                  "Global Partners",
                  "Washirika wa Kimataifa"
                ]} 
              />
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </motion.div>
          
          <div className="relative flex overflow-hidden">
            <motion.div
              variants={staggerContainer}
              className="flex animate-infinite-scroll gap-12 items-center whitespace-nowrap"
            >
              {[...partners, ...partners].map((logo: string, i: number) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, opacity: 1, filter: "grayscale(0)" }}
                  className="relative w-20 h-12 md:w-24 md:h-16 grayscale opacity-40 transition-all"
                >
                  <Image src={`/images/partenaires/${logo}`} alt="Partenaire" fill className="object-contain" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========== SECTION 10: CTA FINAL ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-32 bg-blue-900 text-white text-center relative overflow-hidden"
      >
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold max-w-4xl mx-auto leading-tight mb-10"
          >
            <span dangerouslySetInnerHTML={{ __html: t.raw('cta.title') }} />
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/contact" className="px-8 py-4 bg-white text-blue-900 font-medium rounded-full hover:bg-blue-50 transition-all shadow-xl">
                {t('cta.partner')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/about" className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all">
                {t('cta.about')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Particules animées en arrière-plan */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2"
        />
      </motion.section>

      {/* Styles pour les animations */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        
        @media (max-width: 640px) {
          .animate-infinite-scroll {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
}