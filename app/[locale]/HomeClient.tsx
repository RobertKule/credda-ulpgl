"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/home/Hero"), { 
  ssr: false, 
  loading: () => <HeroSkeleton />
});
import HeroSkeleton from "@/components/home/HeroSkeleton";
import Stats from "@/components/home/Stats";
import FeaturedResearch from "@/components/home/FeaturedResearch";
import Timeline from "@/components/home/Timeline";
import TeamSection from "@/components/home/TeamSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
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
import GalleryGrid from "@/components/home/GalleryGrid";
import CtaSection from "@/components/home/CtaSection";

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


      <main className="relative z-10 w-full overflow-x-clip">

        {/* ═══════════════════════════════════════════
            1. HERO + PARTNERS
            Background: transparent / full color
        ════════════════════════════════════════════ */}
        <section className="relative z-20">
          <Hero testimonials={testimonials} team={team} />
          <div className="w-full">
            <PartnerSection partners={partners} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. STATS — Tinted Institutional Green Band
            Distinct from Hero. Draws attention to numbers.
        ════════════════════════════════════════════ */}
        <div className="relative z-30 bg-primary/5 dark:bg-primary/10 border-y border-primary/30 dark:border-primary/15">
          <StatsSection
            data={[
              { label: t('stats.years'), value: new Date().getFullYear() - 2008, suffix: "" },
              { label: t('stats.pubs'), value: dbStats?.totalResources || 150, suffix: "+" },
              { label: t('stats.partners'), value: (partners ?? []).length || 15, suffix: "" },
              { label: t('stats.cases'), value: dbStats?.clinicalCases || 120, suffix: "+" },
            ]}
          />
        </div>

        {/* ═══════════════════════════════════════════
            3. VISION — Glassmorphism Layer 1
            Semi-transparent, subtle blur, clean top border.
        ════════════════════════════════════════════ */}
        <div className="relative z-20 bg-background/70 dark:bg-background/60 backdrop-blur-sm border-y border-border dark:border-border/15">
          <VisionSection />
        </div>

        {/* ═══════════════════════════════════════════
            4. VIDEO — Darker Glass Strip
            Slightly more opaque to transition forward.
        ════════════════════════════════════════════ */}
        <section className="relative z-20 bg-card/60 dark:bg-card/50 backdrop-blur-md border-y border-border dark:border-border/15">
          <AboutVideoSection />
        </section>

        {/* ═══════════════════════════════════════════
            5. RESEARCH — Glassmorphism Layer 2
            Light surface, warm backdrop.
        ════════════════════════════════════════════ */}
        <section
          id="research"
          className="relative z-20 w-full py-24 lg:py-32 bg-background/80 dark:bg-background/70 backdrop-blur-sm border-b border-border dark:border-border/15"
        >
          <FeaturedResearch research={featuredResearch} />
        </section>

        {/* ═══════════════════════════════════════════
            6. GALLERY — Asymmetric Grid (10 images sample)
        ════════════════════════════════════════════ */}
        <div className="relative z-20 bg-muted/40 dark:bg-muted/20 backdrop-blur-sm border-y border-border dark:border-border/15">
          <GalleryGrid images={galleryImages.slice(0, 10)} totalCount={totalGalleryImages} />
        </div>

        {/* ═══════════════════════════════════════════
            7. HISTORY — Timeline Workflow
            Replaces old Clinical / Mention section.
        ════════════════════════════════════════════ */}
        <section
          id="history"
          className="relative z-20 py-24 lg:py-40 bg-primary/[0.04] dark:bg-primary/[0.08] border-y border-primary/30 dark:border-primary/15 backdrop-blur-sm"
        >
          <div className={SECTION_PAD}>
            <Timeline />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            8. TEAM — Solid Background
            Full bg for portrait-heavy section.
        ════════════════════════════════════════════ */}
        <section id="team" className="relative z-20 bg-background border-t border-border dark:border-border/15 p-4 lg:p-10">
          <div className={SECTION_PAD}>
            <TeamSection team={team} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            9. TESTIMONIALS — Glass
        ════════════════════════════════════════════ */}
        <section
          id="testimonials"
          className="relative z-20 bg-card/50 dark:bg-card/30 backdrop-blur-md border-y border-border dark:border-border/15"
        >
          <TestimonialSection testimonials={testimonials} />
        </section>

        {/* ═══════════════════════════════════════════
            10. FAQ — Muted Glass
        ════════════════════════════════════════════ */}
        <section
          id="faq"
          className="relative z-20 py-24 lg:py-40 bg-background/90 dark:bg-background/80 backdrop-blur-sm border-t border-border dark:border-border/15"
        >
          <div className={SECTION_PAD}>
            <FAQSection />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            11. CTA FINAL — Premium Immersive
        ════════════════════════════════════════════ */}
        <CtaSection />

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
      `}</style>
    </div>
  );
}