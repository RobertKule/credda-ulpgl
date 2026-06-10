import React from "react";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutMission from "@/components/about/AboutMission";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutValues from "@/components/about/AboutValues";
import AboutImpact from "@/components/about/AboutImpact";
import AboutVision from "@/components/about/AboutVision";
import StandardGlobalCTA from "@/components/shared/StandardGlobalCTA";
import { getTranslations } from "next-intl/server";

export default async function PremiumAboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_cta = await getTranslations({ locale, namespace: 'GlobalCTA' });

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <AboutHero />

      {/* 2. QUI SOMMES-NOUS ? */}
      <AboutStory />

      {/* 3. MISSION & AXES */}
      <AboutMission />

      {/* 4. NOTRE HISTOIRE (TIMELINE) */}
      <AboutTimeline />

      {/* 5. NOS VALEURS */}
      <AboutValues />

      {/* 6. IMPACT & CHIFFRES */}
      <AboutImpact />

      {/* 7. VISION AFRICAINE */}
      <AboutVision />

      {/* 8. CTA FINAL */}
      <StandardGlobalCTA 
        title={t_cta.rich("title", {
          span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
        })}
        subtitle={t_cta("collaboration")}
        buttonText={t_cta("partner")}
        href="/contact"
      />
    </main>
  );
}