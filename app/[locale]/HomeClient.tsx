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
import AboutVideoSection from "@/components/home/AboutVideoSection";
import DecodeText from "@/components/shared/DecodeText";

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
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.7]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  
  const sectionScale = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.85, 1, 1]);
  const sectionOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  // --- OPACITÉ DU GLOBE ---
  const globeOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.6, 0.9, 1],
    [0.9, 0.3, 0.8, 0.3, 0.7, 0.2]
  );

  const imageZoom = useTransform(scrollYProgress, [0.1, 0.35], [0.7, 1.15]);
  const textParallax = useTransform(scrollYProgress, [0.2, 0.5], [0, -80]);
  const clinicalScale = useTransform(scrollYProgress, [0.4, 0.7], [0.8, 1]);

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
        <section className="relative h-[100vh] w-full flex items-center justify-center bg-transparent">
          <motion.div style={{ opacity: introOpacity, scale: introScale, y: introY }} className="text-center">
            <motion.h1 
              animate={{ 
                opacity: [1, 0.9, 1],
                textShadow: [
                  "0 0 0px var(--primary)",
                  "2px 2px 0px rgba(255,0,0,0.3)",
                  "-2px -2px 0px rgba(0,0,255,0.3)",
                  "0 0 0px var(--primary)"
                ]
              }}
              transition={{ 
                duration: 0.2, 
                repeat: Infinity, 
                repeatDelay: 4,
                ease: "linear"
              }}
              className="font-bricolage text-[18vw] font-black leading-none tracking-tighter text-foreground"
            >
              <DecodeText text="CREDDA" />
              <span className="animate-pulse text-primary">_</span>
            </motion.h1>
            <p className="mt-10 text-[10px] sm:text-xs uppercase tracking-[1.2em] text-primary font-bold">
              {t('intro_subtitle')}
            </p>
          </motion.div>
        </section>

        {/* HERO & STATS */}
        <motion.div style={{ scale: sectionScale, opacity: sectionOpacity }} className="relative z-20 bg-background/10 backdrop-blur-[1px]">
          <Hero />
        </motion.div>

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
        <div id="about" className="relative z-20 mx-4 my-8 overflow-visible">
          {/* ── TOP ROPE CORD ── */}
          <div className="absolute top-0 left-0 w-full z-30 pointer-events-none translate-y-[-50%]">
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px] block overflow-visible">
              <defs>
                <filter id="ropeShadowAbout" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="4" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowAbout)" />
              <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
            </svg>
          </div>
          <section id="about" className="relative z-20 py-24 lg:py-40 bg-background/40 dark:bg-black/20 backdrop-blur-sm border border-border/10 rounded-3xl overflow-hidden [clip-path:url(#aboutWavyClip)]">
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
                        <Image src="/images/director3.webp" alt="Director" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-primary p-6 font-serif italic text-primary-foreground shadow-2xl">
                        {t('about_caption')}
                      </div>
                    </motion.div>
                  </ScrollReveal>
                </div>

                <motion.div style={{ y: textParallax }} className="lg:w-7/12 space-y-12">
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
                </motion.div>
              </div>
            </div>
          </section>
          
          <AboutVideoSection />

          {/* ── BOTTOM ROPE CORD ── */}
          <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none translate-y-[50%]">
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px] block overflow-visible">
              <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowAbout)" />
              <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
            </svg>
          </div>
        </div>

        {/* RESEARCH (Transparent pour globe max) */}
        <section id="research" className="relative z-20 py-24 bg-transparent">
          <div className={SECTION_PAD}>
            <FeaturedResearch research={featuredResearch} />
          </div>
        </section>

        <div id="clinical" className="relative z-20 mx-4 my-8 overflow-visible">
          {/* ── TOP ROPE CORD ── */}
          <div className="absolute top-0 left-0 w-full z-30 pointer-events-none translate-y-[-50%]">
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px] block overflow-visible">
              <defs>
                <filter id="ropeShadowClinical" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="4" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowClinical)" />
              <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
            </svg>
          </div>

          <motion.section style={{ scale: clinicalScale }} className="relative z-20 py-24 border border-border/10 rounded-3xl bg-background/20 backdrop-blur-[2px] overflow-hidden [clip-path:url(#clinicalWavyClip)]">
            <div className={SECTION_PAD}>
              <ClinicalSection />
            </div>
          </motion.section>

          {/* ── BOTTOM ROPE CORD ── */}
          <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none translate-y-[50%]">
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px] block overflow-visible">
              <path d="M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 C1300,35 1380,65 1440,50" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="4" className="text-primary" filter="url(#ropeShadowClinical)" />
              <path d="M0,55 C200,5 400,105 600,55 C800,5 1000,105 1200,55 C1300,40 1380,70 1440,55" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" className="text-primary" />
            </svg>
          </div>

          {/* ── CLIP PATH DEFINITIONS ── */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <clipPath id="aboutWavyClip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0.05 C 0.14,0 0.28,0.1 0.42,0.05 C 0.56,0 0.7,0.1 0.84,0.05 C 0.9,0.035 0.96,0.065 1,0.05 L 1,0.95 C 0.96,0.935 0.9,0.965 0.84,0.95 C 0.7,0.9 0.56,1 0.42,0.95 C 0.28,0.9 0.14,1 0,0.95 Z" />
              </clipPath>
              <clipPath id="clinicalWavyClip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0.1 C 0.14,0 0.28,0.2 0.42,0.1 C 0.56,0 0.7,0.2 0.84,0.1 C 0.9,0.07 0.96,0.13 1,0.1 L 1,0.9 C 0.96,0.87 0.9,0.93 0.84,0.9 C 0.7,0.8 0.56,1 0.42,0.9 C 0.28,0.8 0.14,1 0,0.9 Z" />
              </clipPath>
            </defs>
          </svg>
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
                  <Image src={`/images/partenaires/${p}`} alt="Partner" fill sizes="(max-width: 768px) 160px, 224px" className="object-contain" />
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