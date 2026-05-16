"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/home/Hero"), { ssr: false });
import Stats from "@/components/home/Stats";
import FeaturedResearch from "@/components/home/FeaturedResearch";
import ClinicalSection from "@/components/home/ClinicalSection";
import TeamSection from "@/components/home/TeamSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Link } from "@/navigation";
import GSAPReveal from "@/components/shared/GSAPReveal";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import AboutVideoSection from "@/components/home/AboutVideoSection";
import PartnerSection from "@/components/home/PartnerSection";
import PersistentGlobeBackground from "@/components/home/PersistentGlobeBackground";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";
import StatsSection from "@/components/home/StatsSection";
import VisionSection from "@/components/home/VisionSection";
import FAQSection from "@/components/home/FAQSection";
import ConnectedGallerySection from "@/components/home/ConnectedGallerySection";

const SECTION_PAD = "w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16";

export default function HomeClient({
  featuredResearch = [],
  team = [],
  partners = [],
  testimonials = [],
  galleryImages = [],
  totalGalleryImages = 0,
  dbStats = { totalResources: 0, clinicalCases: 0 }
}: any) {
  const t = useTranslations('HomePage');

  return (
    <div className="relative min-h-screen text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground">

      <PersistentGlobeBackground />

      <main className="relative z-10 w-full overflow-hidden">
        {/* HERO & TRUST BAR */}
        <section className="relative z-20">
          <Hero testimonials={testimonials} team={team} />
          <div className="w-full">
            <PartnerSection partners={partners} />
          </div>
        </section>

        <div className="relative z-30 border-b border-border/10">
          <StatsSection
            data={[
              { label: t('stats.years'), value: new Date().getFullYear() - 2008, suffix: "" },
              { label: t('stats.pubs'), value: dbStats?.totalResources || 150, suffix: "+" },
              { label: t('stats.partners'), value: (partners ?? []).length || 15, suffix: "" },
              { label: t('stats.cases'), value: dbStats?.clinicalCases || 120, suffix: "+" },
            ]}
          />
        </div>

        {/* VISION & EXPERTISE (Bento Grid) */}
        <VisionSection />

        {/* VIDEO SECTION */}
        <section className="border-y border-border/10">
          <AboutVideoSection />
        </section>

        {/* RESEARCH */}
        <section id="research" className="relative z-20 w-full py-24 lg:py-32 bg-background">
          <FeaturedResearch research={featuredResearch} />
        </section>

        {/* GALLERY */}
        <ConnectedGallerySection images={galleryImages} totalCount={totalGalleryImages} />



        {/* CLINICAL */}
        <section id="clinical" className="relative z-20 py-24 lg:py-40 bg-card/10 border-y border-border/40">
          <div className={SECTION_PAD}>
            <ClinicalSection />
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="relative z-20 bg-background p-4 lg:p-10">
          <div className={SECTION_PAD}>
            <TeamSection team={team} />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="relative z-20">
          <TestimonialSection testimonials={testimonials} />
        </section>

        {/* FAQ */}
        <section id="faq" className="relative z-20 py-24 lg:py-40 border-t border-border/10">
          <div className={SECTION_PAD}>
            <FAQSection />
          </div>
        </section>



        {/* CTA FINAL - Modern Pill Redesign */}
        <section className="relative z-20 py-4 md:py-8 lg:py-12 bg-[#16256B] dark:bg-[#0D1645]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-background rounded-[3rem] md:rounded-full p-4 md:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 text-center md:text-left transition-all shadow-2xl border border-primary/20 selection:bg-primary selection:text-white"
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-fraunces font-black tracking-tighter text-foreground leading-[1.1] max-w-2xl">
                {t.rich('cta.title', {
                  span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>,
                  br: () => <br />
                }) || (
                    <>
                      Rejoignez notre réseau de <span className="text-primary italic font-light">Partenariat</span>
                    </>
                  )}
              </h2>

              <Link
                href="/contact"
                className="group flex items-center gap-4 px-8 py-5 bg-primary text-primary-foreground rounded-full transition-all duration-500 hover:scale-105 hover:shadow-primary/20 hover:shadow-xl"
              >
                <span className="text-md font-black uppercase tracking-widest">
                  {t('cta.partner') || "Book a Demo"}
                </span>
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </div>
              </Link>
            </motion.div>
          </div>
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