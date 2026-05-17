"use client";

import dynamic from "next/dynamic";
import { m as motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { ArrowUpRight, Star, ArrowRight, ArrowLeft, BookOpen, ShieldCheck, Award } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useTranslations, useLocale } from "next-intl";

const AfricaGlobe = dynamic(() => import("@/components/home/AfricaGlobe"), {
  ssr: false,
  loading: () => null,
});

const Typewriter = ({ text }: { text: string }) => {
  const [currentText, setCurrentText] = useState("");
  
  useEffect(() => {
    let index = 0;
    setCurrentText("");
    const timer = setInterval(() => {
      setCurrentText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {currentText}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ WebkitTextFillColor: 'var(--primary)' }} // Ensure visibility inside clipped parent
        className="inline-block w-[4px] h-[0.8em] bg-primary ml-1 align-middle"
      />
    </>
  );
};

export default function Hero({ testimonials = [], team = [] }: { testimonials?: any[], team?: any[] }) {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const { theme } = useTheme();
  // Dynamic Title Words
  const titleWords = ["l'Excellence", "l'Innovation", "le Développement", "la Justice", "le Savoir Africain"];
  const [titleWordIndex, setTitleWordIndex] = useState(0);

  // Institutional Partners State
  const partners = [
    { 
      id: 'credda', 
      logo: '/logocredda.png',
      subtitle: t('hero.subtitle_credda') 
    },
    { 
      id: 'ulpgl', 
      logo: '/logoulpgl.webp',
      subtitle: t('hero.subtitle_ulpgl')
    }
  ];
  // Carousel States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);

  // Raw items from translation files
  const leftItems = t.raw('hero.carousel') || [];

  const [activePartnerIndex, setActivePartnerIndex] = useState(0);

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleWordIndex((prev) => (prev + 1) % titleWords.length);
    }, 4500);
    const partnerInterval = setInterval(() => {
      setActivePartnerIndex((prev) => (prev + 1) % partners.length);
    }, 6000);
    return () => {
      clearInterval(titleInterval);
      clearInterval(partnerInterval);
    };
  }, []);

  useEffect(() => {
    const leftInterval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % leftItems.length);
    }, 5000);
    return () => clearInterval(leftInterval);
  }, []);

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  useEffect(() => {
    if (!team || team.length <= 1) return;
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % team.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [team]);

  return (
    <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-start overflow-hidden pt-32 lg:pt-36 pb-0 transition-colors duration-500 bg-transparent">
      {/* GRID FRAME BACKGROUND - Adaptive */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 w-full mb-16 flex flex-col items-center flex-1">
        
        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-primary/5 rounded-full px-5 py-2 mb-4 inline-block shadow-sm border border-primary/20 mt-2"
        >
          <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
            {t('hero.badge')}
          </span>
        </motion.div>

        {/* TITLE - DYNAMIC CAROUSEL - LOCALIZED */}
        <h1 className="text-center font-serif text-5xl md:text-7xl lg:text-[75px] xl:text-[85px] 2xl:text-[100px] font-black leading-[1.05] tracking-tight max-w-6xl mb-4 relative z-20 flex flex-wrap justify-center gap-x-6 md:gap-x-12">
          <span className="text-foreground">{t('hero.title_prefix')}</span>
          <div className="relative inline-block min-w-[320px] md:min-w-[450px] text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={titleWordIndex}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1, 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 0.5 },
                  backgroundPosition: { 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }
                }}
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--primary) 0%, var(--foreground) 50%, var(--primary) 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                className="inline-block"
              >
                {/* TYPEWRITER EFFECT */}
                <Typewriter text={t.raw('hero.title_carousel')?.[titleWordIndex] || "Excellence"} />
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>

        {/* SUBTITLE - DYNAMIC TOGGLE */}
        <div className="min-h-[60px] flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={activePartnerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl font-medium relative z-20"
            >
              {partners[activePartnerIndex].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* INSTITUTIONAL LOGO SWITCHER */}
        <div className="flex items-center justify-center gap-10 md:gap-16 mb-8 mt-4 relative z-30">
          {partners.map((partner, idx) => {
            const isActive = idx === activePartnerIndex;
            return (
              <motion.div
                key={partner.id}
                animate={{ 
                  scale: isActive ? 1.25 : 0.85,
                  opacity: isActive ? 1 : 0.35,
                  filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
                }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center cursor-pointer "
                onClick={() => setActivePartnerIndex(idx)}
              >
                <Image 
                  src={partner.logo} 
                  alt={partner.id} 
                  fill 
                  className="object-contain"
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-6 relative z-30"
        >
          <Link 
            href="/publications"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-black tracking-tight text-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
          >
            {t('hero.discover')}
          </Link>
          <Link 
            href="/publications"
            className="w-14 h-14 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <ArrowUpRight strokeWidth={2.5} size={20} />
          </Link>
        </motion.div>

        {/* MIDDLE SECTION: FLOATING ELEMENTS + HALF CIRCLE HERO IMAGE */}
        <div className="relative w-full flex-1 flex items-end justify-center mt-16 lg:mt-4 min-h-[400px]">
           {/* LEFT FLOATING TEXT - STATS CAROUSEL */}
           <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden xl:flex flex-col absolute left-10 top-[18%] text-left w-64 z-20"
           >
              <div className="text-primary font-serif text-5xl mb-2 font-black">"</div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={leftIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 opacity-90 min-h-[80px]">
                    {leftItems[leftIndex].text}
                  </p>
                  <div className="mb-6">
                    <h3 className="text-foreground text-4xl font-bold mb-1 tracking-tighter">{leftItems[leftIndex].number}</h3>
                    <p className="text-muted-foreground/80 text-xs font-semibold">{leftItems[leftIndex].label}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* OWL DOTS FOR LEFT CAROUSEL */}
              <div className="flex gap-2">
                {leftItems.map((_: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setLeftIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${leftIndex === i ? 'bg-primary w-6' : 'bg-primary/20'}`}
                  />
                ))}
              </div>
           </motion.div>

           {/* RIGHT FLOATING TEXT - TESTIMONIALS CAROUSEL */}
           {testimonials && testimonials.length > 0 ? (
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="hidden xl:flex flex-col absolute right-10 top-[18%] text-left w-72 z-20"
             >
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentIndex}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.5 }}
                 >
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 opacity-90 line-clamp-5 border-l-2 border-primary/20 pl-4 py-1 italic">
                      "{testimonials[currentIndex]?.text}"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full overflow-hidden relative grayscale">
                       <Image 
                         src={testimonials[currentIndex]?.image || "/images/testimonials/Peyton.webp"} 
                         alt={testimonials[currentIndex]?.name} 
                         fill 
                         className="object-cover" 
                       />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-foreground text-xs font-bold line-clamp-1">{testimonials[currentIndex]?.name}</span>
                       <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest line-clamp-1">{testimonials[currentIndex]?.role}</span>
                     </div>
                   </div>
                 </motion.div>
               </AnimatePresence>

               {/* OWL DOTS FOR RIGHT CAROUSEL */}
               <div className="flex gap-2 mt-8">
                 {testimonials.map((_: any, i: number) => (
                   <button 
                     key={i}
                     onClick={() => setCurrentIndex(i)}
                     className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-primary w-6' : 'bg-primary/20'}`}
                   />
                 ))}
               </div>
             </motion.div>
           ) : null}

            {/* FLOATING LOGOS -> COMPLETELY REMOVED FOR MINIMALISM AS REQUESTED */}


           <motion.div 
             initial={{ y: 200, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className={`relative z-10 rounded-t-full w-[350px] md:w-[450px] h-[400px] md:h-[480px] flex items-end justify-center overflow-hidden transition-colors duration-500 pb-0 shadow-sm border-t border-l border-r border-border bg-card`}
           >
              {/* PERSON IMAGE CAROUSEL */}
              <div className="relative w-full h-[95%] z-20 flex items-end justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={centerIndex}
                    initial={{ opacity: 0, scale: 1.1, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image 
                      src={team[centerIndex]?.image || "/images/director3.webp"} 
                      alt={team[centerIndex]?.name || "Hero Person"} 
                      fill 
                      sizes="(max-width: 768px) 350px, (max-width: 1200px) 450px, 450px"
                      className="object-cover object-top drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* OWL DOTS FOR CENTER CAROUSEL */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                  {team.length > 0 && team.map((_: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setCenterIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${centerIndex === i ? 'bg-primary w-6' : 'bg-primary/20 hover:bg-primary/40'}`}
                    />
                  ))}
                </div>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}

