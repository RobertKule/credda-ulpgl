"use client";

import React from "react";
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
import { SectionNumber } from "@/components/home/SectionNumber";

export default function HomeClient({
  locale,
  featuredResearch = [],
  team = [],
  partners = [],
  testimonials = [],
  dbStats = { totalResources: 0, clinicalCases: 0 }
}: any) {
  const t = useTranslations('HomePage');
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const aboutRotateY = useTransform(scrollYProgress, [0.1, 0.3], [0, 15]);
  const aboutSkewY = useTransform(scrollYProgress, [0.1, 0.3], [0, -5]);
  const ctaRotateY = useTransform(scrollYProgress, [0.8, 1], [-10, 10]);
  const ctaSkewY = useTransform(scrollYProgress, [0.8, 1], [-5, 5]);

  return (
    <main className="flex flex-col w-full bg-background overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* 1. HERO SECTION (L'entrée magistrale) */}
      <Hero />

      {/* 2. STATS SECTION (Preuve sociale) */}
      <div className="relative z-20 -mt-10">
        <ScrollReveal>
          <Stats 
            years={new Date().getFullYear() - 2008} 
            totalResources={dbStats?.totalResources || 150} 
            partners={(partners ?? []).length} 
            clinicalCases={dbStats?.clinicalCases || 120}
          />
        </ScrollReveal>
      </div>

      {/* 3. ABOUT / MANIFESTO (L'âme du CREDDA) */}
      <section id="about" className="py-60 relative overflow-hidden bg-background">
        {/* Background Decorative Element */}
        <motion.div 
          style={{ y: yParallax }}
          className="absolute top-40 right-[-10%] opacity-[0.02] pointer-events-none select-none"
        >
           <span className="text-[40rem] font-serif font-black italic text-[#C9A84C]">CREDDA</span>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <SectionNumber number="01" />
            <ScrollReveal className="w-full">
              <div className="flex flex-col lg:flex-row gap-32 items-center">
                
                {/* Image avec cadre "Gallery" et effet Oblique */}
                <div className="lg:w-5/12 relative group">
               <GSAPReveal direction="right">
                 <motion.div 
                   style={{ 
                     rotateY: aboutRotateY,
                     skewY: aboutSkewY,
                   }}
                   whileHover={{ scale: 1.02, rotateY: 20, skewY: -8 }}
                   transition={{ type: "spring", stiffness: 100, damping: 20 }}
                   className="relative z-10 p-4 border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl transition-all duration-700 group-hover:border-[#C9A84C]/30"
                 >
                   <div className="relative aspect-[3/4] overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000 origin-bottom">
                     <Image 
                       src="/images/director3.webp" 
                       alt="About CREDDA" 
                       fill 
                       className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                     />
                   </div>
                   {/* Signature / Légende flottante */}
                   <div className="absolute -bottom-6 -right-6 bg-[#C9A84C] text-black p-6 font-serif italic text-sm shadow-2xl">
                      Penser l&apos;État de Droit.
                   </div>
                 </motion.div>
               </GSAPReveal>
            </div>

            {/* Texte Manifeste */}
            <div className="lg:w-7/12 space-y-16">
              <GSAPReveal direction="left">
                <div className="flex items-center gap-6">
                  <div className="h-[1px] w-20 bg-[#C9A84C]" />
                  <span className="text-xs uppercase tracking-[0.6em] font-bold text-[#C9A84C]">{t('about.badge')}</span>
                </div>
                
                <h2 className="text-6xl lg:text-9xl font-serif font-extrabold text-foreground leading-[0.85] tracking-tighter">
                   {t.rich('about.title', { 
                    span: (chunks) => <span className="text-[#C9A84C] italic font-light">{chunks}</span>,
                    br: () => <br />
                  })}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-12 text-muted-foreground text-lg font-light leading-relaxed">
                  <p className="border-l border-white/10 pl-8">
                    {t('about.description_p1')}
                  </p>
                  <p className="border-l border-white/10 pl-8">
                    {t('about.description_p2')}
                  </p>
                </div>

                <div className="pt-12">
                  <Link href="/about" className="inline-flex items-center gap-8 group">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">
                      {t('cta.mission')}
                    </span>
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-black transition-all duration-500 transform group-hover:rotate-45">
                      <ArrowRight size={24} />
                    </div>
                  </Link>
                </div>
              </GSAPReveal>
            </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. SECTIONS FONCTIONNELLES (Research & Clinical) */}
      <section className="relative z-10 bg-card border-y border-border">
        <div id="research" className="container mx-auto px-6 pt-20 pb-10">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <SectionNumber number="02" />
            <ScrollReveal className="w-full">
              <FeaturedResearch research={featuredResearch} />
            </ScrollReveal>
          </div>
        </div>
        <div id="clinical" className="container mx-auto px-6 pb-20">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <SectionNumber number="03" />
            <ScrollReveal className="w-full">
              <ClinicalSection />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. TEAM & SOCIAL PROOF */}
      <div id="team" className="container mx-auto px-6 py-20">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="04" />
          <ScrollReveal className="w-full">
            <TeamSection team={team} />
          </ScrollReveal>
        </div>
      </div>
      <div id="publications" className="container mx-auto px-6 py-20">
         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
           <SectionNumber number="05" />
           <ScrollReveal className="w-full">
             <TestimonialSection testimonials={testimonials} />
           </ScrollReveal>
         </div>
      </div>

      {/* 6. PARTNERS (Le ruban cinétique) */}
      <div id="gallery" className="container mx-auto px-6 py-20">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <SectionNumber number="06" />
          <ScrollReveal className="w-full overflow-hidden">
            <section className="py-20 bg-background w-full">
              <div className="container mx-auto px-6 mb-20 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C9A84C]">{t('cta.collaboration')}</span>
              </div>
              <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(245,242,236,0.07)', borderBottom: '1px solid rgba(245,242,236,0.07)', padding: '32px 0' }}>
                <div style={{ display: 'flex', gap: '64px', animation: 'ticker 35s linear infinite', width: 'max-content' }}>
                  {[...(partners ?? []), ...(partners ?? [])].map((p, i) => (
                    <div key={i} style={{ width: 120, height: 48, position: 'relative', filter: 'grayscale(1)', opacity: 0.3, transition: 'all 0.3s' }}
                         onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.opacity = '1' }}
                         onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(1)'; e.currentTarget.style.opacity = '0.3' }}>
                      <Image src={`/images/partenaires/${p}`} alt="Partner" fill style={{ objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              </div>
              <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
            </section>
          </ScrollReveal>
        </div>
      </div>

      {/* 7. FINAL CALL TO ACTION (Monumental) */}
      <div className="container mx-auto px-6 pt-20">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative', zIndex: 50 }}>
          <SectionNumber number="07" />
        </div>
      </div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-40">
        {/* Background cinématique */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            style={{ 
              rotateY: ctaRotateY,
              skewY: ctaSkewY,
              scale: 1.1
            }}
            className="h-full w-full"
          >
            <Image src="/images/hero-poster.webp" alt="CTA BG" fill className="object-cover opacity-10" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <ShieldCheck size={48} className="text-[#C9A84C] mb-12 opacity-50" />
            <h2 className="text-6xl md:text-9xl font-serif font-bold leading-none tracking-tighter mb-20">
              {t.rich('cta.title', {
                span: (chunks) => <span className="italic text-[#C9A84C] font-light">{chunks}</span>,
                br: () => <br />
              })}
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <Link href="/contact" className="group relative px-16 py-8 bg-[#C9A84C] text-black font-bold uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:scale-105">
                <span className="relative z-10">{t('cta.partner')}</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              <Link href="/login" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] hover:text-[#C9A84C] transition-colors">
                {t('cta.portal')} 
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A84C]">
                  <ExternalLink size={14} />
                </div>
              </Link>
            </div>
          </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* STYLES LOCAUX */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .italic-accent {
          font-family: var(--font-serif);
          font-style: italic;
          color: #C9A84C;
        }
      `}</style>
    </main>
  );
}