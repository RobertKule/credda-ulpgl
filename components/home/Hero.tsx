"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Hero({ testimonials = [], team = [] }: { testimonials?: any[], team?: any[] }) {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);

  // Raw items from translation files
  const leftItems = t.raw('hero.carousel') || [];

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
    <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-start overflow-hidden pt-32 lg:pt-40 pb-0 transition-colors duration-500 bg-transparent">
      {/* GRID FRAME BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 w-full mb-10 flex flex-col items-center flex-1">
        
        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#16256B] dark:bg-[#0D1645] rounded-full px-5 py-2 mb-8 inline-block shadow-lg border border-white/10"
        >
          <span className="text-white text-[11px] font-bold tracking-widest uppercase">
            {t('hero.badge')}
          </span>
        </motion.div>

        {/* TITLE - STAGGERED WORD REVEAL */}
        <motion.h1
          className="text-center font-bricolage text-5xl md:text-7xl lg:text-[85px] 2xl:text-[100px] font-bold text-white leading-[1.05] tracking-tight max-w-5xl mb-6 relative z-20"
        >
          {t('hero.title').split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 + (i * 0.1),
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-white/70 text-sm md:text-base lg:text-lg max-w-2xl font-medium mb-10 relative z-20"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA BUTTONS EXACTLY AS IN SCREENSHOT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 relative z-30"
        >
          <Link 
            href="/research"
            className="bg-[#E1F247] hover:bg-[#D4E53B] text-black px-8 py-4 rounded-full font-black tracking-tight text-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-2xl"
          >
            {t('hero.discover')}
          </Link>
          <Link 
            href="/research"
            className="w-14 h-14 bg-[#E1F247] hover:bg-[#D4E53B] rounded-full flex items-center justify-center text-black transition-transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            <ArrowUpRight strokeWidth={2.5} size={20} />
          </Link>
        </motion.div>

        {/* MIDDLE SECTION: FLOATING ELEMENTS + HALF CIRCLE HERO IMAGE */}
        <div className="relative w-full flex-1 flex items-end justify-center mt-12 lg:mt-0 min-h-[400px]">
           {/* LEFT FLOATING TEXT - STATS CAROUSEL */}
           <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden xl:flex flex-col absolute left-10 top-[18%] text-left w-64 z-20"
           >
              <div className="text-white font-serif text-5xl mb-2 font-black">"</div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={leftIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-white text-sm font-medium leading-relaxed mb-6 opacity-90 min-h-[80px]">
                    {leftItems[leftIndex].text}
                  </p>
                  <div className="mb-6">
                    <h3 className="text-white text-4xl font-bold mb-1 tracking-tighter">{leftItems[leftIndex].number}</h3>
                    <p className="text-white/70 text-xs font-semibold">{leftItems[leftIndex].label}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* OWL DOTS FOR LEFT CAROUSEL */}
              <div className="flex gap-2">
                {leftItems.map((_: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setLeftIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${leftIndex === i ? 'bg-[#E1F247] w-6' : 'bg-white/30'}`}
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
               <div className="flex gap-1 mb-4">
                 {[1,2,3,4,5].map((i) => (
                   <Star key={i} size={16} fill="#E1F247" className="text-[#E1F247]" />
                 ))}
               </div>
               
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentIndex}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.5 }}
                 >
                   <p className="text-white text-sm font-medium leading-relaxed mb-6 opacity-90 line-clamp-5">
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
                       <span className="text-white text-xs font-bold line-clamp-1">{testimonials[currentIndex]?.name}</span>
                       <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest line-clamp-1">{testimonials[currentIndex]?.role}</span>
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
                     className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-[#E1F247] w-6' : 'bg-white/30'}`}
                   />
                 ))}
               </div>
             </motion.div>
           ) : (
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="hidden xl:flex flex-col absolute right-0 top-[20%] text-left w-72 z-20"
             >
               <div className="flex gap-1 mb-4">
                 {[1,2,3,4,5].map((i) => (
                   <Star key={i} size={16} fill="#E1F247" className="text-[#E1F247]" />
                 ))}
               </div>
               <p className="text-white text-sm font-medium leading-relaxed mb-6 opacity-90">
                  "Moderne, élégant, et concentré sur les vrais défis. J'ai adoré l'approche des projets pratiques et le système d'experts."
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full overflow-hidden relative grayscale">
                   <Image src="/images/testimonials/Peyton.webp" alt="User" fill className="object-cover" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-white text-xs font-bold">Peyton Michael</span>
                   <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest">PhD Candidate</span>
                 </div>
               </div>
             </motion.div>
           )}

           {/* FLOATING LOGOS WITH ARROWS INWARD */}
           <div className="absolute inset-0 pointer-events-none z-10">
               {/* LEFT SIDE ULPGL LOGO -> ARROW */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ 
                   opacity: 1, 
                   scale: [1, 1.08, 1],
                 }}
                 transition={{ 
                    opacity: { duration: 0.8, delay: 0.7 },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                 }}
                 className="absolute left-[25%] top-[2%] flex items-center gap-4"
               >
                 <motion.div 
                    animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 35px rgba(225,242,71,0.2)", "0 0 20px rgba(255,255,255,0.1)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full p-2 flex items-center justify-center border border-white/20"
                 >
                   <Image src="/logoulpgl.webp" alt="ULPGL" width={40} height={40} className="object-contain" />
                 </motion.div>
                 <ArrowRight className="text-[#E1F247]" size={32} strokeWidth={2} />
               </motion.div>

               {/* RIGHT SIDE ARROW <- CREDDA LOGO */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ 
                   opacity: 1, 
                   scale: [1, 1.08, 1],
                 }}
                 transition={{ 
                    opacity: { duration: 0.8, delay: 0.8 },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                 }}
                 className="absolute right-[25%] top-[2%] flex items-center gap-4"
               >
                 <ArrowLeft className="text-[#E1F247]" size={32} strokeWidth={2} />
                 <motion.div 
                    animate={{ 
                      boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 35px rgba(225,242,71,0.2)", "0 0 20px rgba(255,255,255,0.1)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full p-2 flex items-center justify-center border border-white/20"
                 >
                   <Image src="/logocredda.png" alt="CREDDA" width={40} height={40} className="object-contain" />
                 </motion.div>
               </motion.div>
           </div>

           <motion.div 
             initial={{ y: 200, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className={`relative z-10 rounded-t-full w-[350px] md:w-[450px] h-[400px] md:h-[480px] flex items-end justify-center overflow-hidden transition-colors duration-500 pb-0 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] ${
               theme === 'dark' ? 'bg-[#0D1645]' : 'bg-[#16256B]'
             }`}
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
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${centerIndex === i ? 'bg-[#E1F247] w-6' : 'bg-white/20 hover:bg-white/40'}`}
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

