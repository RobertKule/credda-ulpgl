// app/[locale]/HomeClient.tsx
"use client";

import React from "react";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FeaturedResearch from "@/components/home/FeaturedResearch";
import ClinicalSection from "@/components/home/ClinicalSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@/navigation";
import GSAPReveal from "@/components/shared/GSAPReveal";


export default function HomeClient({
  locale,
  featuredResearch = [],
  latestReports = [],
  team = [],
  galleryImages = [],
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0 }
}: any) {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col w-full bg-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <Hero slides={t.raw('hero.slides')} />

      {/* 2. STATS SECTION */}
      <Stats 
        years={new Date().getFullYear() - 2008} 
        totalResources={dbStats?.totalResources || 150} 
        partners={(t.raw('partners.items') || []).length} 
        clinicalCases={dbStats?.clinicalCases || 120}
      />

      {/* 3. ABOUT / STORYTELLING SECTION */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 relative">
               <GSAPReveal direction="right">
                 <div className="relative z-10 aspect-[4/5] bg-soft-cream group overflow-hidden">
                   <Image 
                     src="/images/director3.webp" 
                     alt="About CREDDA" 
                     fill 
                     className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                   />
                 </div>
               </GSAPReveal>
              <div className="absolute top-1/2 -right-12 lg:-right-24 -translate-y-1/2 w-48 lg:w-64 aspect-square bg-accent/10 glass -z-0" />
            </div>

            <div className="lg:w-1/2 space-y-10">
              <GSAPReveal direction="left" delay={0.2}>
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-primary" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">{t('about.badge')}</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black text-primary leading-[1.1] mt-6 mb-8 hyphens-auto break-words">
                  {t.rich('about.title', { 
                    span: (chunks) => <span className="italic text-accent">{chunks}</span>,
                    br: () => <br />
                  })}
                </h2>
                <div className="space-y-6 text-anthracite/70 text-lg font-light leading-relaxed">
                  <p>
                    {t('about.description_p1') || "Le Centre de Recherche sur la Démocratie et le Développement en Afrique (CREDDA) est une institution d'excellence dédiée à l'analyse rigoureuse des défis juridiques et sociaux."}
                  </p>
                  <p>
                    {t('about.description_p2') || "Affilié à l'ULPGL-Goma, nous combinons expertise académique et action de terrain pour promouvoir une justice équitable et durable à travers le continent."}
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/about" className="group flex items-center gap-4 text-[11px] font-heading font-black uppercase tracking-widest text-primary">
                    <span className="border-b-2 border-accent group-hover:border-primary transition-all pb-2">{t('cta.mission')}</span>
                    <div className="w-10 h-10 rounded-full border border-light-gray flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              </GSAPReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESEARCH SECTION */}
      <FeaturedResearch research={featuredResearch} />

      {/* 5. CLINICAL SECTION */}
      <ClinicalSection />

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-32 bg-white border-y border-light-gray">
        <div className="container mx-auto px-6">
          <GSAPReveal direction="up">
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">{t('testimonials.badge')}</span>
                <div className="h-[1px] w-8 bg-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-primary italic leading-tight">
                {t('testimonials.title_alt')}
              </h2>
            </div>
          </GSAPReveal>

          <div className="grid md:grid-cols-3 gap-12">
            {(t.raw('testimonials.items') || []).map((test: any, idx: number) => (
              <GSAPReveal key={idx} direction="up" delay={idx * 0.2}>
                <div className="group relative h-full flex flex-col p-12 bg-soft-cream border border-transparent hover:border-accent/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <Quote size={40} className="text-accent/20 mb-8 self-start" />
                  <p className="text-anthracite text-lg italic leading-relaxed mb-10 flex-grow">
                    &ldquo;{test.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-5 pt-8 border-t border-light-gray">
                    <div className="relative w-14 h-14 rounded-none overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Image src={test.image || `/images/testimonials/default.webp`} alt={test.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h5 className="font-heading font-black text-[10px] uppercase tracking-[0.15em] text-primary">{test.name}</h5>
                      <p className="text-[9px] font-black uppercase tracking-widest text-anthracite/40 mt-1">{test.role}</p>
                    </div>
                  </div>
                </div>
              </GSAPReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PARTNERS LOGOS */}
      <section className="py-24 bg-white overflow-hidden border-b border-light-gray">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/4">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-anthracite/40">{t('cta.collaboration')}</span>
            </div>
            <div className="lg:w-3/4 overflow-hidden relative group">
              <div className="flex gap-16 animate-infinite-scroll group-hover:[animation-play-state:paused] grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                {[...(t.raw('partners.items') || []), ...(t.raw('partners.items') || [])].map((partner: string, i: number) => (
                  <div key={i} className="flex-shrink-0 w-32 h-16 relative">
                    <Image src={`/images/partenaires/${partner}`} alt="Partner" fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="py-40 bg-primary text-white relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0"
        >
          <Image src="/images/hero-poster.webp" alt="CTA BG" fill className="object-cover grayscale" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="flex flex-col items-center gap-3">
             <div className="w-[1px] h-20 bg-accent animate-pulse" />
             <span className="text-[11px] uppercase tracking-[0.5em] font-black text-accent mt-4">{t('cta.badge') || "Join the Movement"}</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-serif font-black leading-[1.1] sm:leading-[0.9] tracking-tighter break-words hyphens-auto px-4">
            {t.rich('cta.title', {
              span: (chunks) => <span className="italic">{chunks}</span>
            })}
          </h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 pt-8">
            <Link href="/contact" className="group px-8 sm:px-12 py-5 sm:py-6 bg-accent text-primary font-heading font-black uppercase tracking-widest text-xs hover:bg-white transition-all text-center">
              {t('cta.partner')}
            </Link>
            <Link href="/login" className="group px-8 sm:px-12 py-5 sm:py-6 border border-white/20 hover:border-accent text-white font-heading font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3">
              {t('cta.portal')} <ExternalLink size={14} className="text-accent" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </main>
  );
}