// app/[locale]/HomeClient.tsx
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
import { Quote, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@/navigation";
import GSAPReveal from "@/components/shared/GSAPReveal";


export default function HomeClient({
  locale,
  featuredResearch = [],
  latestReports = [],
  team = [],
  galleryImages = [],
  testimonials = [],
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0, clinicalCases: 0 }
}: any) {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col w-full bg-[#0C0C0A] overflow-hidden text-[#F5F2EC]">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. STATS SECTION */}
      <Stats 
        years={new Date().getFullYear() - 2008} 
        totalResources={dbStats?.totalResources || 150} 
        partners={(t.raw('partners.items') || []).length} 
        clinicalCases={dbStats?.clinicalCases || 120}
      />

      {/* 3. ABOUT / STORYTELLING SECTION */}
      <section className="py-40 bg-[#111110] relative overflow-hidden">
        {/* DECORATIVE NUMBER */}
        <div className="absolute top-20 left-10 lg:left-20 pointer-events-none select-none opacity-5">
           <span className="text-[20rem] lg:text-[25rem] font-fraunces font-extrabold italic text-[#C9A84C] leading-none">01</span>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C9A84C]/5 skew-x-12 translate-x-1/2 pointer-events-none blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 relative">
               <GSAPReveal direction="right">
                 <div className="relative z-10 aspect-[4/5] bg-[#161614] overflow-hidden rounded-sm ring-1 ring-white/5 shadow-2xl">
                   <Image 
                     src="/images/director3.webp" 
                     alt="About CREDDA" 
                     fill 
                     className="object-cover grayscale transition-all duration-1000 hover:grayscale-0 hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0A] via-transparent to-transparent opacity-60" />
                 </div>
               </GSAPReveal>
               <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#C9A84C]/10 blur-[80px] -z-0" />
            </div>

            <div className="lg:w-1/2 space-y-12">
              <GSAPReveal direction="left" delay={0.2}>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-[#C9A84C]" />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-[#C9A84C]">{t('about.badge')}</span>
                </div>
                
                <h2 className="text-5xl lg:text-8xl font-fraunces font-extrabold text-[#F5F2EC] leading-[0.9] mt-8 mb-10">
                  {t.rich('about.title', { 
                    span: (chunks) => <span className="italic-accent">{chunks}</span>,
                    br: () => <br />
                  })}
                </h2>
                
                <div className="space-y-8 text-[#F5F2EC]/60 text-xl font-outfit font-light leading-relaxed max-w-xl">
                  <p>
                    {t('about.description_p1') || "The Center for Research on Democracy and Development in Africa (CREDDA) is an institution of excellence dedicated to the rigorous analysis of legal and social challenges."}
                  </p>
                  <p>
                    {t('about.description_p2') || "Affiliated with ULPGL-Goma, we combine academic expertise and field action to promote fair and sustainable justice across the continent."}
                  </p>
                </div>

                <div className="pt-10">
                  <Link href="/about" className="group flex items-center gap-6">
                    <div className="relative">
                       <span className="text-[11px] font-outfit font-bold uppercase tracking-[0.2em] text-[#F5F2EC] group-hover:text-[#C9A84C] transition-colors duration-500">
                         {t('cta.mission')}
                       </span>
                       <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#C9A84C]/30 origin-right transition-transform duration-700 scale-x-0 group-hover:scale-x-100 group-hover:origin-left" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-700">
                      <ArrowRight size={18} />
                    </div>
                  </Link>
                </div>
              </GSAPReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESEARCH SECTION */}
      <div className="bg-[#0C0C0A]">
        <FeaturedResearch research={featuredResearch} />
      </div>

      {/* 5. CLINICAL SECTION */}
      <div className="bg-[#111110]">
        <ClinicalSection />
      </div>

      {/* 5. TEAM SECTION */}
      <TeamSection team={team} />

      {/* 6. TESTIMONIALS SECTION */}
      <TestimonialSection testimonials={testimonials} />

      {/* 7. PARTNERS LOGOS */}
      <section className="py-32 bg-[#111110] overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/4">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F5F2EC]/20 leading-loose">
                 {t('cta.collaboration') || "Trusted by global leaders"}
               </span>
            </div>
            <div className="lg:w-3/4 overflow-hidden relative group">
              <div className="flex gap-20 animate-infinite-scroll group-hover:[animation-play-state:paused] grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                {[...(t.raw('partners.items') || []), ...(t.raw('partners.items') || [])].map((partner: string, i: number) => (
                  <div key={i} className="flex-shrink-0 w-36 h-20 relative">
                    <Image src={`/images/partenaires/${partner}`} alt="Partner" fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="py-52 bg-[#0C0C0A] text-[#F5F2EC] relative overflow-hidden">
        {/* ANIMATED BG FOR CTA */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-poster.webp" alt="CTA BG" fill className="object-cover grayscale opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A] via-transparent to-[#0C0C0A]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-6 mb-16">
             <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#C9A84C]" />
             <span className="text-[11px] uppercase tracking-[0.6em] font-black text-[#C9A84C]">{t('cta.badge') || "Join the Movement"}</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-fraunces font-extrabold leading-[0.85] tracking-tighter mb-20">
            {t.rich('cta.title', {
              span: (chunks) => <span className="italic text-[#C9A84C]">{chunks}</span>,
              br: () => <br />
            })}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link href="/contact" className="group px-14 py-7 bg-[#C9A84C] text-[#0C0C0A] font-outfit font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 hover:bg-white shadow-2xl shadow-[#C9A84C]/10">
              {t('cta.partner')}
            </Link>
            <Link href="/login" className="group px-14 py-7 border border-white/10 hover:border-[#C9A84C] text-[#F5F2EC] font-outfit font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4">
              {t('cta.portal')} <ExternalLink size={16} className="text-[#C9A84C] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 50s linear infinite;
        }
        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .animate-scroll-line {
          animation: scroll-line 3s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}