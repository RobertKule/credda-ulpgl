"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import HeroSkeleton from "@/components/home/HeroSkeleton";
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection"));
const StatsSection = dynamic(() => import("@/components/home/StatsSection"));
const PiliersSection = dynamic(() => import("@/components/home/PiliersSection"));
const FeaturedResearch = dynamic(() => import("@/components/home/FeaturedResearch"));
const AboutVideoSection = dynamic(() => import("@/components/home/AboutVideoSection"));
const GalleryGrid = dynamic(() => import("@/components/home/GalleryGrid"));
const Timeline = dynamic(() => import("@/components/home/Timeline"));
const TeamSection = dynamic(() => import("@/components/home/TeamSection"));
const TestimonialSection = dynamic(() => import("@/components/home/TestimonialSection"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));
const CtaSection = dynamic(() => import("@/components/home/CtaSection"));

const Hero = dynamic(() => import("@/components/home/Hero"), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

const SECTION_PAD = "w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16";

export default function HomeClient({
  featuredResearch = [],
  team = [],
  partners = [],
  testimonials = [],
  galleryImages = [],
  totalGalleryImages = 0,
  dbStats = { totalResources: 0, clinicalCases: 0 },
}: {
  locale?: string;
  featuredResearch?: import("@/components/home/ResearchSection").ResearchArticle[];
  team?: import("@/components/home/TeamSection").TeamMember[];
  partners?: string[];
  testimonials?: { name: string; role: string; image: string; text: string; location?: string }[];
  galleryImages?: import("@/components/home/GalleryGrid").GalleryImage[];
  totalGalleryImages?: number;
  dbStats?: { totalResources: number; clinicalCases: number };
}) {
  const t = useTranslations("HomePage");

  return (
    <div className="relative min-h-screen text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground">
      <main className="relative z-10 w-full overflow-x-clip">

        {/* 1. HERO + PARTENAIRES (Accroche + Confiance) */}
        <section className="relative z-20">
          <Hero testimonials={testimonials} team={team} />
          <div className="w-full">
            <PartnerSection partners={partners} />
          </div>
        </section>

        {/* 2. CHIFFRES CLÉS / IMPACT */}
        <div className="relative z-30 bg-gradient-to-b from-primary/5 via-background/10 to-transparent dark:from-primary/10 dark:via-background/5 dark:to-transparent border-y border-primary/20 dark:border-primary/10 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.08)_1px,_transparent_0)] bg-[size:24px_24px]" />
          </div>
          <StatsSection
            data={[
              { label: t("stats.years"), value: new Date().getFullYear() - 2008, suffix: "" },
              { label: t("stats.pubs"), value: dbStats?.totalResources || 150, suffix: "+" },
              { label: t("stats.partners"), value: (partners ?? []).length || 15, suffix: "" },
              { label: t("stats.cases"), value: dbStats?.clinicalCases || 120, suffix: "+" },
            ]}
          />
        </div>

        

        {/* 4. NOS 4 PILIERS D'ACTION */}
        <section className="relative z-20">
          <PiliersSection />
        </section>

        {/* 5. PUBLICATIONS & TRAVAUX DE RECHERCHE */}
        <section
          id="publications"
          className="relative z-20 w-full py-20 lg:py-28 bg-background/80 dark:bg-background/70 backdrop-blur-sm border-y border-border dark:border-border/15"
        >
          <FeaturedResearch research={featuredResearch} />
        </section>

        {/* 6. IMMERSION VIDÉO / CLINIQUE DE DROIT */}
        <section className="relative z-20 bg-card/60 dark:bg-card/50 backdrop-blur-md border-b border-border dark:border-border/15">
          <AboutVideoSection />
        </section>

        {/* 7. GALERIE D'IMAGES DU TERRAIN */}
        <div className="relative z-20 bg-muted/40 dark:bg-muted/20 backdrop-blur-sm border-b border-border dark:border-border/15">
          <GalleryGrid images={galleryImages.slice(0, 10)} totalCount={totalGalleryImages} />
        </div>

        {/* 8. HISTOIRE & PARCOURS (TIMELINE) */}
        <section
          id="history"
          className="relative z-20 py-20 lg:py-32 bg-primary/[0.04] dark:bg-primary/[0.08] border-b border-primary/30 dark:border-primary/15 backdrop-blur-sm"
        >
          <div className={SECTION_PAD}>
            <Timeline />
          </div>
        </section>

        {/* 9. NOTRE ÉQUIPE */}
        <section id="team" className="relative z-20 bg-background border-b border-border dark:border-border/15 p-4 lg:p-10">
          <div className={SECTION_PAD}>
            <TeamSection team={team} />
          </div>
        </section>

        {/* 10. TÉMOIGNAGES */}
        <section
          id="testimonials"
          className="relative z-20 bg-card/50 dark:bg-card/30 backdrop-blur-md border-b border-border dark:border-border/15"
        >
          <TestimonialSection testimonials={testimonials} />
        </section>

        {/* 11. FAQ SECTION */}
        <section
          id="faq"
          className="relative z-20 py-20 lg:py-32 bg-background/90 dark:bg-background/80 backdrop-blur-sm border-b border-border dark:border-border/15"
        >
          <div className={SECTION_PAD}>
            <FAQSection />
          </div>
        </section>

        {/* 12. CTA FINAL */}
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