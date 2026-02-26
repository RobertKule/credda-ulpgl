"use client";

import React from "react";
// Import the new redesigned section components
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ClinicalSection from "@/components/sections/ClinicalSection";
import ResearchSection from "@/components/sections/ResearchSection";
import TeamSection from "@/components/sections/TeamSection";
import LibrarySection from "@/components/sections/LibrarySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PartnersSection from "@/components/sections/PartnersSection";
import CTASection from "@/components/sections/CTASection";

// Existing Types (Assumed based on page.tsx and user prompt)
export interface HomeClientProps {
  locale: string;
  featuredResearch?: any[];
  latestReports?: any[];
  team?: any[];
  galleryImages?: any[];
  testimonials?: any[];
  partners?: string[];
  dbStats?: {
    totalResources: number;
    publications: number;
    clinicalArticles: number;
    researchArticles: number;
    members?: number;
  };
}

export default function HomeClient({
  locale,
  featuredResearch = [],
  latestReports = [],
  team = [],
  galleryImages = [],
  testimonials = [],
  partners = [],
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0 }
}: HomeClientProps) {
  return (
    <div className="flex flex-col w-full bg-slate-50 overflow-x-hidden p-0 m-0">
      {/* 1. Hero with Video Background (Animated) */}
      <HeroSection />

      {/* 2. Statistics Cards (Animated Grid) */}
      <StatsSection stats={dbStats} />

      {/* 3. Clinical Impact (Split Screen) */}
      <ClinicalSection />

      {/* 4. Featured Research (Carousel/Grid) */}
      {featuredResearch.length > 0 && (
        <ResearchSection articles={featuredResearch} />
      )}

      {/* 5. Team Showcase (Carousel) */}
      {team.length > 0 && (
        <TeamSection team={team} />
      )}

      {/* 6. Digital Library (Cards) */}
      <LibrarySection reports={latestReports} stats={dbStats} />

      {/* 7. Testimonials (Trusted By Section) */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* 8. Partners (Infinite Scroll) & Final CTA */}
      <PartnersSection partners={partners} />
      <CTASection />
    </div>
  );
}