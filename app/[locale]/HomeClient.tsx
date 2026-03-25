"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FeaturedResearch from "@/components/home/FeaturedResearch";
import ClinicalSection from "@/components/home/ClinicalSection";
import TeamSection from "@/components/home/TeamSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "@/navigation";
import GSAPReveal from "@/components/shared/GSAPReveal";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import HomePageBackdrop from "@/components/home/HomePageBackdrop";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";

const SECTION_PAD = "w-full px-5 sm:px-8 lg:px-12 xl:px-16";

export default function HomeClient({
  featuredResearch = [],
  team = [],
  partners = [],
  testimonials = [],
  dbStats = { totalResources: 0, clinicalCases: 0 }
}: any) {
  const t = useTranslations('HomePage');
  const { scrollYProgress } = useScroll();

  // --- ANIMATIONS DE SCROLL ---
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.85]);
  
  // --- OPACITÉ DU GLOBE AUGMENTÉE ---
  // [Intro: 80%, Hero/Stats: 40%, About: 70%, Research: 40%, Fin: 30%]
  const globeOpacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.25, 0.5, 0.8, 1], 
    [0.8, 0.4, 0.7, 0.4, 0.6, 0.3]
  );
  
  const imageZoom = useTransform(scrollYProgress, [0.05, 0.25], [0.6, 1.1]);

  // --- TYPEWRITER ---
  const [displayText, setDisplayText] = useState("");
  const fullText = "CREDDA";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground">
      
      {/* GLOBE FIXE - VISIBILITÉ RENFORCÉE */}
      <motion.div 
        style={{ opacity: globeOpacity }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <HomePageBackdrop />
      </motion.div>

      <main className="relative z-10 w-full">
        
        {/* INTRO TYPEWRITER */}
        <section className="relative h-[110vh] w-full flex items-center justify-center bg-transparent">
          <motion.div style={{ opacity: introOpacity, scale: introScale }} className="text-center">
            <motion.h1 className="font-bricolage text-[18vw] font-black leading-none tracking-tighter text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {displayText}<span className="animate-pulse text-primary">_</span>
            </motion.h1>
            <p className="mt-6 text-[10px] sm:text-xs uppercase tracking-[1.2em] text-primary font-bold">
              {t('intro_subtitle')}
            </p>
          </motion.div>
        </section>

        {/* HERO & STATS (Semi-transparents pour voir le globe) */}
        <div className="relative z-20 bg-background/10 backdrop-blur-[1px]">
          <Hero />
        </div>

        <div className="relative z-30 -mt-12 sm:-mt-20">
          <ScrollReveal>
            <Stats 
              years={new Date().getFullYear() - 2008} 
              totalResources={dbStats?.totalResources || 150} 
              partners={(partners ?? []).length} 
              clinicalCases={dbStats?.clinicalCases || 120}
            />
          </ScrollReveal>
        </div>

        {/* ABOUT (Image 3D + Zoom) */}
        <div className="px-4 py-4">
          <section id="about" className="relative z-20 py-24 lg:py-40 bg-background/40 dark:bg-black/20 backdrop-blur-sm border border-border/10 rounded-3xl overflow-hidden">
            <SectionDecorNumber value="01" className="right-10 top-10 opacity-20" />
          <div className={SECTION_PAD}>
            <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
              <div className="relative group lg:w-5/12 perspective-[2000px]">
                <ScrollReveal direction="right">
                 <motion.div 
                   style={{ scale: imageZoom, transformStyle: "preserve-3d" }}
                   initial={{ rotateY: -15, rotateX: 5 }}
                   whileHover={{ rotateY: 0, rotateX: 0, scale: 1.1, z: 50 }}
                   className="relative z-10 border border-border/50 bg-card/30 p-4 shadow-3xl backdrop-blur-xl transition-all duration-700"
                 >
                   <div className="relative aspect-[3/4] overflow-hidden grayscale transition-all duration-1000 group-hover:grayscale-0">
                     <Image src="/images/director3.webp" alt="Director" fill className="object-cover" />
                   </div>
                   <div className="absolute -bottom-6 -right-6 bg-primary p-6 font-serif italic text-primary-foreground shadow-2xl">
                      {t('about_caption')}
                   </div>
                 </motion.div>
                </ScrollReveal>
              </div>

              <div className="lg:w-7/12 space-y-12">
                <GSAPReveal direction="left">
                  <div className="flex items-center gap-6">
                    <div className="h-[1px] w-20 bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">{t('about.badge')}</span>
                  </div>
                  <h2 className="font-fraunces text-5xl md:text-7xl lg:text-9xl font-black leading-[0.9] tracking-tighter">
                    {t.rich('about.title', { 
                      span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>,
                      br: () => <br />
                    })}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-10 text-foreground/90 font-light leading-relaxed border-l border-primary/30 pl-8">
                    <p>{t('about.description_p1')}</p>
                    <p>{t('about.description_p2')}</p>
                  </div>
                </GSAPReveal>
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* RESEARCH (Transparent pour globe max) */}
        <section id="research" className="relative z-20 py-24 bg-transparent">
          <div className={SECTION_PAD}>
            <FeaturedResearch research={featuredResearch} />
          </div>
        </section>

        <div className="px-4 py-4">
          <section id="clinical" className="relative z-20 py-24 border border-border/10 rounded-3xl bg-background/20 backdrop-blur-[2px] overflow-hidden">
            <div className={SECTION_PAD}>
              <ClinicalSection />
            </div>
          </section>
        </div>

        <section id="team" className="relative z-20 py-24 bg-transparent">
          <div className={SECTION_PAD}>
            <TeamSection team={team} />
          </div>
        </section>

        <div className="px-4 py-4">
          <section id="publications" className="relative z-20 py-24 bg-background/30 backdrop-blur-sm border border-border/10 rounded-3xl overflow-hidden">
            <div className={SECTION_PAD}>
              <TestimonialSection testimonials={testimonials} />
            </div>
          </section>
        </div>

        {/* GALLERY / PARTNERS */}
        <section id="gallery" className="relative z-20 py-32 bg-transparent">
          <div className={SECTION_PAD}>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 lg:mb-6">
              {t('cta.collaboration')}
            </p>
            <p className="text-center text-muted-foreground text-sm lg:text-base font-outfit max-w-2xl mx-auto mb-16">
              Nous collaborons avec des institutions académiques et des organisations internationales de premier plan pour mener à bien nos missions de recherche et d'action.
            </p>
            <div className="flex gap-16 md:gap-24 animate-infinite-scroll py-10 lg:py-16 border-y border-border/20 items-center">
              {[...(partners ?? []), ...(partners ?? [])].map((p, i) => (
                <div key={i} className="relative w-40 h-16 md:w-56 md:h-24 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500 shrink-0 cursor-pointer">
                  <Image src={`/images/partenaires/${p}`} alt="Partner" fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative z-20 py-32 flex flex-col items-center justify-center text-center bg-background/60 backdrop-blur-md">
          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="relative z-10 px-6">
            <ShieldCheck size={50} className="mx-auto mb-10 text-primary" />
            <h2 className="text-5xl md:text-8xl font-fraunces font-black tracking-tighter mb-16 max-w-5xl mx-auto">
               {t.rich('cta.title', {
                span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>,
                br: () => <br />
              })}
            </h2>
            <Link href="/contact" className="px-14 py-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-transform rounded-md">
              {t('cta.partner')}
            </Link>
          </motion.div>
        </section>

      </main>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: infinite-scroll 40s linear infinite;
        }
        .font-fraunces { font-family: var(--font-fraunces), serif; }
        .font-bricolage { font-family: var(--font-bricolage), sans-serif; }
      `}</style>
    </div>
  );
}