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
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "@/navigation";
import GSAPReveal from "@/components/shared/GSAPReveal";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import HomePageBackdrop from "@/components/home/HomePageBackdrop";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";

const SECTION_PAD = "w-full px-5 sm:px-8 lg:px-12 xl:px-16";

export default function HomeClient({
  locale,
  featuredResearch = [],
  team = [],
  partners = [],
  testimonials = [],
  dbStats = { totalResources: 0, clinicalCases: 0 }
}: any) {
  const t = useTranslations('HomePage');

  return (
    <div className="relative isolate min-h-screen bg-background">
      <HomePageBackdrop />
      <main className="relative z-10 flex flex-col w-full overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      
      <Hero />

      <div className="relative z-20 -mt-6 sm:-mt-8">
        <ScrollReveal>
          <Stats 
            years={new Date().getFullYear() - 2008} 
            totalResources={dbStats?.totalResources || 150} 
            partners={(partners ?? []).length} 
            clinicalCases={dbStats?.clinicalCases || 120}
          />
        </ScrollReveal>
      </div>

      <section
        id="about"
        className="relative w-full overflow-hidden bg-[#0D0D0B]/88 py-20 sm:py-24 lg:py-32 xl:py-40 light:bg-background/96 light:backdrop-blur-sm"
      >
        <SectionDecorNumber value="01" className="-top-4 right-0 sm:right-4 md:top-8" />
        <div className="pointer-events-none absolute top-40 right-[-10%] z-0 select-none opacity-[0.02]">
           <span className="text-[40rem] font-serif font-black italic text-[#C9A84C]">CREDDA</span>
        </div>

        <div className={`${SECTION_PAD} relative z-10`}>
          <ScrollReveal className="w-full">
            <div className="flex flex-col items-center gap-32 lg:flex-row">
              <div className="relative group lg:w-5/12">
                <GSAPReveal direction="right">
                 <motion.div 
                   whileHover={{ scale: 1.02, rotateY: 12, skewY: -4 }}
                   transition={{ type: "spring", stiffness: 100, damping: 20 }}
                   className="relative z-10 border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm transition-all duration-700 group-hover:border-[#C9A84C]/30"
                 >
                   <div className="relative aspect-[3/4] origin-bottom overflow-hidden grayscale contrast-125 transition-all duration-1000 group-hover:grayscale-0">
                     <Image 
                       src="/images/director3.webp" 
                       alt="About CREDDA" 
                       fill 
                       className="scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                     />
                   </div>
                   <div className="absolute -bottom-6 -right-6 bg-[#C9A84C] p-6 font-serif text-sm italic text-black shadow-2xl">
                      Penser l&apos;État de Droit.
                   </div>
                 </motion.div>
               </GSAPReveal>
            </div>

            <div className="space-y-16 lg:w-7/12">
              <GSAPReveal direction="left">
                <div className="flex items-center gap-6">
                  <div className="h-[1px] w-20 bg-[#C9A84C]" />
                  <span className="text-xs font-bold uppercase tracking-[0.6em] text-[#C9A84C]">{t('about.badge')}</span>
                </div>
                
                <h2 className="font-serif text-4xl font-extrabold leading-[0.9] tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
                   {t.rich('about.title', { 
                    span: (chunks) => <span className="text-[#C9A84C] italic font-light">{chunks}</span>,
                    br: () => <br />
                  })}
                </h2>
                
                <div className="grid gap-10 text-base font-light leading-relaxed text-muted-foreground sm:text-lg md:grid-cols-2 md:gap-12">
                  <p className="border-l border-border pl-6 sm:pl-8">
                    {t('about.description_p1')}
                  </p>
                  <p className="border-l border-border pl-6 sm:pl-8">
                    {t('about.description_p2')}
                  </p>
                </div>

                <div className="pt-12">
                  <Link href="/about" className="group inline-flex items-center gap-8">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-[#C9A84C]">
                      {t('cta.mission')}
                    </span>
                    <div className="flex h-16 w-16 transform items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black">
                      <ArrowRight size={24} />
                    </div>
                  </Link>
                </div>
              </GSAPReveal>
            </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 w-full border-y border-border/50 bg-[#121211]/85 light:bg-card/95 light:backdrop-blur-sm">
        <div id="research" className={`${SECTION_PAD} pb-8 pt-16 lg:pb-10 lg:pt-20`}>
          <ScrollReveal className="w-full">
            <FeaturedResearch research={featuredResearch} />
          </ScrollReveal>
        </div>
        <div id="clinical" className={`${SECTION_PAD} pb-16 lg:pb-20`}>
          <ScrollReveal className="w-full">
            <ClinicalSection />
          </ScrollReveal>
        </div>
      </section>

      <div
        id="team"
        className={`relative ${SECTION_PAD} bg-[#0D0D0B]/82 py-14 sm:py-16 lg:py-24 light:bg-background/96 light:backdrop-blur-sm`}
      >
        <ScrollReveal className="w-full">
          <TeamSection team={team} />
        </ScrollReveal>
      </div>
      <div
        id="publications"
        className={`relative ${SECTION_PAD} bg-[#0D0D0B]/86 py-14 sm:py-16 lg:py-24 light:bg-background/96 light:backdrop-blur-sm`}
      >
        <ScrollReveal className="w-full">
          <TestimonialSection testimonials={testimonials} />
        </ScrollReveal>
      </div>

      <div
        id="gallery"
        className={`relative ${SECTION_PAD} bg-[#121211]/80 py-14 sm:py-16 lg:py-24 light:bg-card/95 light:backdrop-blur-sm`}
      >
        <SectionDecorNumber value="06" className="left-2 top-8 sm:left-6" />
        <ScrollReveal className="relative z-10 w-full overflow-hidden">
          <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-[#C9A84C] lg:mb-14">
            {t('cta.collaboration')}
          </p>
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
        </ScrollReveal>
      </div>

      <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="h-full w-full scale-110">
            <Image src="/images/hero-poster.webp" alt="CTA BG" fill className="object-cover opacity-10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>
        
        <div className={`${SECTION_PAD} relative z-10 flex w-full justify-center`}>
          <ScrollReveal className="w-full max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <ShieldCheck size={48} className="mb-12 text-[#C9A84C] opacity-50" />
            <h2 className="mb-12 max-w-[min(100%,42rem)] font-serif text-4xl font-bold leading-[1.05] tracking-tighter text-foreground sm:mb-16 sm:text-5xl md:mb-20 md:text-7xl lg:text-8xl xl:text-9xl">
              {t.rich('cta.title', {
                span: (chunks) => <span className="font-light italic text-[#C9A84C]">{chunks}</span>,
                br: () => <br />
              })}
            </h2>
            
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <Link href="/contact" className="group relative overflow-hidden bg-[#C9A84C] px-16 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:scale-105">
                <span className="relative z-10">{t('cta.partner')}</span>
                <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 group-hover:translate-y-0" />
              </Link>
              
              <Link href="/login" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-[#C9A84C]">
                {t('cta.portal')} 
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 group-hover:border-[#C9A84C]">
                  <ExternalLink size={14} />
                </div>
              </Link>
            </div>
          </motion.div>
          </ScrollReveal>
        </div>
      </section>

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
    </div>
  );
}
