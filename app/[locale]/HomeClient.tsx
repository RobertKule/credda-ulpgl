"use client";

import React from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ResearchSection from "@/components/home/ResearchSection";
import ClinicalImpactSection from "@/components/home/ClinicalImpactSection";
import ConnectedGallerySection from "@/components/home/ConnectedGallerySection";
import TeamSection from "@/components/home/TeamSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import DigitalLibrarySection from "@/components/home/DigitalLibrarySection";

export default function HomeClient({
  locale,
  featuredResearch = [],
  latestReports = [],
  team = [],
  galleryImages = [],
  dbStats = { totalResources: 0, publications: 0, clinicalArticles: 0, researchArticles: 0 }
}: any) {
  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden mt-16 sm:mt-20 lg:mt-24">
      <HeroSection />
      <StatsSection stats={dbStats} />
      <ResearchSection articles={featuredResearch} />
      <ClinicalImpactSection />
      {galleryImages.length > 0 && (
        <ConnectedGallerySection images={galleryImages} />
      )}
      {team.length > 0 && (
        <TeamSection team={team} />
      )}
      <TestimonialSection />
      <DigitalLibrarySection />
    </div>
  );
}