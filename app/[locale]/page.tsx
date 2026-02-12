"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  Microscope, Scale, Users, Calendar, FileText, 
  Globe, Award, ArrowRight, ChevronLeft, ChevronRight,
  Quote, Landmark, Mail, BookOpen, ShieldCheck, ExternalLink
} from "lucide-react";
import Image from "next/image";
import { Badge } from "./../../components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "./../../components/ui/carousel";

// --- COMPOSANT COMPTEUR ANIMÉ ---
const Counter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ""));
      const controls = animate(count, numericValue, { duration });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  useEffect(() => {
    return rounded.onChange((v) => setDisplayValue(v.toString() + (value.includes("+") ? "+" : "")));
  }, [rounded, value]);

  return <span ref={ref}>{displayValue}</span>;
};

// --- COMPOSANT SKELETON ---
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-none ${className}`} />
);

// --- DONNÉES ---
const HERO_SLIDES = [
  {
    id: 1,
    title: "L'excellence au service de la Démocratie.",
    desc: "Le CREDDA produit une recherche-action de pointe pour transformer les institutions africaines.",
    image: "/images/director3.webp",
  },
  {
    id: 2,
    title: "Clinique Juridique Environnementale.",
    desc: "Nous protégeons les droits des communautés et la biodiversité du bassin du Congo par le droit.",
    image: "/images/director3.webp",
  },
  {
    id: 3,
    title: "Un Hub de Coopération Internationale.",
    desc: "Partenaire des plus grandes universités mondiales pour un impact local durable.",
    image: "/images/director3.webp",
  }
];

const PARTNERS = [
  "Amnesty.webp", "McCain.webp", "Northwestern.webp", "TWB.webp",
  "worldbank.webp", "Ceni.webp", "Monusco.webp", "Oxford.webp",
  "Uhaki.webp", "Harvard.webp", "Morehouse.webp", "PNUD.webp", "ulpgl.webp"
];

const TESTIMONIALS = [
  {
    name: "David MICHAEL PEYTON",
    role: "PhD Candidate, Northwestern University",
    image: "/images/testimonials/Peyton.webp",
    text: "I could not have asked for more ideal research partners than the faculty and staff at CREDDA-ULPGL. They were not only able to support multiple types of data collection—from in-depth interviews to focus groups to a large survey—but also provided opportunities for me to present my research findings and receive feedback from Congolese academics..."
  },
  {
    name: "Heather LYNNE ZIMMERMAN",
    role: "Masters student at London School of Economics and Political Science",
    image: "/images/testimonials/heather.webp",
    text: "Dear Professor Kennedy Kihangi, Thank you very much for generously welcoming me into the ULPGL/CREDDA community! I am grateful for the ideas and feedback that you offered on my research and am humbled by the opportunity to present my research to your colleagues..."
  },
  {
    name: "Britta Sjöstedt",
    role: "PhD candidate from Lund University",
    image: "/images/testimonials/britta.webp",
    text: "I visited Université Libre des Pays des Grands Lacs, Goma in 2015 to conduct research for my PhD thesis... Professor Kennedy KIHANGI BINDU was an excellent host that helped to get in contact with other researchers, practitioners and organisations working with the issues that I'm interested in."
  }
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="p-10 space-y-10 container mx-auto">
        <Skeleton className="h-[70vh] w-full" />
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900">
      
      {/* --- SECTION 1: HERO OWL CAROUSEL --- */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image 
              src={HERO_SLIDES[currentSlide].image} 
              alt="CREDDA Background" 
              fill 
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-4xl space-y-6"
              >
                <Badge className="bg-blue-600 text-white rounded-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
                  CREDDA - ULPGL Institutional
                </Badge>
                <h1 className="text-5xl lg:text-8xl font-serif font-bold text-white leading-[1.1]">
                  {HERO_SLIDES[currentSlide].title}
                </h1>
                <p className="text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
                  {HERO_SLIDES[currentSlide].desc}
                </p>
                <div className="flex gap-4 pt-6">
                  <button className="px-10 py-5 bg-white text-slate-950 font-bold hover:bg-blue-600 hover:text-white transition-all rounded-none text-sm uppercase tracking-widest">
                    Explorer nos axes
                  </button>
                  <button className="px-10 py-5 border border-white/30 text-white font-bold hover:bg-white/10 transition-all rounded-none text-sm uppercase tracking-widest">
                    Rapport Annuel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-6 z-20 flex gap-4">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 ${currentSlide === i ? 'w-16 bg-blue-600' : 'w-8 bg-white/20'}`}
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 2: STATISTIQUES ANIMÉES --- */}
      <div className="bg-white py-16 border-b border-slate-100 relative z-20">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { v: "25+", l: "Années d'Expertise", i: <Landmark className="text-blue-600" /> },
            { v: "450+", l: "Publications Scientifiques", i: <FileText className="text-blue-600" /> },
            { v: "15", l: "Partenaires Internationaux", i: <Globe className="text-blue-600" /> },
            { v: "12000+", l: "Bénéficiaires Clinique", i: <Users className="text-blue-600" /> },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-6 border-l border-slate-100 pl-8">
              <div className="p-3 bg-slate-50 rounded-none">{s.i}</div>
              <div>
                <div className="text-4xl font-serif font-bold text-slate-950">
                  <Counter value={s.v} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: PARTENAIRES (INFINITE SCROLL) --- */}
      <section className="py-20 bg-white overflow-hidden border-b border-slate-50">
        <div className="container mx-auto px-6 mb-12 flex items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] whitespace-nowrap">
            Réseau Académique Global
          </p>
          <div className="h-[1px] w-full bg-slate-100" />
        </div>

        <div className="relative flex group">
          <div className="flex animate-[infinite-scroll_50s_linear_infinite] gap-20 items-center whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((logo, i) => (
              <div key={i} className="relative w-44 h-16 flex-shrink-0 grayscale hover:grayscale-0 opacity-30 hover:opacity-100 transition-all duration-700 cursor-pointer">
                <Image
                  src={`/images/partenaires/${logo}`}
                  alt="Partner Logo"
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: LES AXES DE RECHERCHE --- */}
      <section className="py-28 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-20">
            <div className="space-y-6">
              <Badge className="bg-blue-600 rounded-none px-4 py-1 uppercase tracking-widest text-[10px]">Domaines d'impact</Badge>
              <h2 className="text-5xl font-serif font-bold text-slate-950 leading-tight">
                Une approche interdisciplinaire pour des <span className="italic text-blue-700">solutions durables</span>.
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-light leading-relaxed border-l-4 border-blue-600 pl-8">
              Le CREDDA combine l'analyse théorique et l'engagement de terrain pour répondre aux défis complexes de la gouvernance et des droits en Afrique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {[
              { t: "Gouvernance & Démocratie", i: <Landmark size={40} />, d: "Analyse critique des processus électoraux et des réformes institutionnelles." },
              { t: "Paix & Résolution de Conflits", i: <ShieldCheck size={40} />, d: "Médiation communautaire et étude des dynamiques sécuritaires régionales." },
              { t: "Droit Environnemental", i: <BookOpen size={40} />, d: "Clinique juridique mobile pour la protection des droits fonciers." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white p-16 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500">{item.i}</div>
                <h4 className="text-2xl font-serif font-bold mb-4">{item.t}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{item.d}</p>
                <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 flex items-center gap-3 group-hover:gap-5 transition-all">
                  Découvrir l'axe <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    {/* --- SECTION 5: TÉMOIGNAGES (INFINITY CARDS WALL) --- */}
<section className="py-32 bg-[#121820] text-white relative overflow-hidden">
  {/* Effets de lumière de fond (Glow) */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[120px]" />
  </div>

  <div className="container mx-auto px-6 relative z-10 mb-16">
    <div className="max-w-3xl">
      <Badge className="bg-blue-600 rounded-none px-4 py-1 uppercase tracking-[0.3em] text-[10px] mb-6">
        Reconnaissance Internationale
      </Badge>
      <h2 className="text-5xl lg:text-6xl font-serif font-bold leading-tight">
        Ce que disent nos <span className="italic text-blue-500">partenaires académiques</span>.
      </h2>
    </div>
  </div>

  {/* Mur de cartes infini */}
  <div className="relative flex flex-col gap-10 overflow-hidden group">
    {/* Conteneur animée - On double les données pour le loop parfait */}
    <div className="flex gap-8 items-stretch animate-marquee whitespace-normal w-max px-4">
      {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -10 }}
          className="w-[450px] bg-[#1a222c]/80 backdrop-blur-sm border border-slate-700/50 p-10 flex flex-col justify-between transition-all duration-500 hover:border-blue-500/50 hover:bg-[#1a222c]"
        >
          {/* Haut de la carte : Citation */}
          <div className="space-y-6">
            <Quote className="text-blue-600 w-12 h-12 opacity-50" />
            <p className="text-lg font-light leading-relaxed text-slate-300 font-serif italic">
              "{t.text}"
            </p>
          </div>

          {/* Bas de la carte : Profil de l'expert */}
          <div className="mt-12 pt-8 border-t border-slate-700/50 flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600/30 shrink-0">
              <Image 
                src={t.image} 
                alt={t.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-md font-bold font-serif uppercase tracking-tight text-white">{t.name}</h4>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1 leading-tight">
                {t.role}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Optionnel : Deuxième ligne défilant en sens inverse pour plus de densité */}
    <div className="flex gap-8 items-stretch animate-marquee whitespace-normal w-max px-4 direction-reverse opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" style={{ animationDirection: 'reverse', animationDuration: '80s' }}>
      {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
        <div 
          key={i}
          className="w-[450px] bg-[#1a222c]/40 backdrop-blur-sm border border-slate-800 p-8 flex flex-col justify-between"
        >
          <p className="text-sm font-light leading-relaxed text-slate-400 font-serif italic">
             "{t.text.substring(0, 150)}..."
          </p>
          <div className="mt-6 flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden relative opacity-50">
                <Image src={t.image} alt={t.name} fill className="object-cover" />
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.name}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Gradient Overlay pour estomper les bords gauche/droite */}
  <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-[#121820] to-transparent z-20 pointer-events-none" />
  <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#121820] to-transparent z-20 pointer-events-none" />
</section>

      {/* --- SECTION 6: GOUVERNANCE --- */}
      <section className="py-28 bg-white container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <div className="space-y-4">
              <h2 className="text-blue-700 font-bold uppercase tracking-[0.3em] text-[10px]">Leadership Scientifique</h2>
              <h3 className="text-4xl font-serif font-bold text-slate-950">Une direction engagée pour l'excellence.</h3>
            </div>
            <p className="text-slate-500 leading-relaxed font-light">
              Le CREDDA s'appuie sur un conseil scientifique international garantissant la neutralité et la rigueur de chaque étude publiée par l'institution.
            </p>
            <button className="flex items-center gap-4 group text-slate-950 font-bold uppercase tracking-widest text-xs">
              <span className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </span>
              Voir toute l'équipe
            </button>
          </div>
          
          <div className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-slate-100 relative mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                   <Image src="/images/director3.webp" alt="Director" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="font-serif font-bold text-xl text-slate-900">Pr. Dr. Kennedy Kihangi</h4>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mt-2">Directeur du Centre</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 7: CTA FINAL --- */}
      <section className="py-28 bg-blue-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-serif font-bold max-w-5xl mx-auto leading-tight"
          >
            Contribuer à l'avenir par la <span className="italic underline underline-offset-8 decoration-white/30">Science</span>.
          </motion.h2>
          <div className="flex justify-center flex-wrap gap-6 pt-6">
            <button className="px-12 py-6 bg-slate-950 text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all rounded-none shadow-2xl">
              Collaborer avec nous
            </button>
            <button className="px-12 py-6 border-2 border-white/30 text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-none">
              Contacter le secrétariat
            </button>
          </div>
        </div>
      </section>

      {/* --- STYLES ADDITIONNELS (Tailwind v4 / CSS-in-JS) --- */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 50s linear infinite;
        }
      `}</style>

    </div>
  );
}