import React from "react";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutMission from "@/components/about/AboutMission";
import AboutImpact from "@/components/about/AboutImpact";
import AboutVision from "@/components/about/AboutVision";
import CliniqueCDESection from "@/components/about/CliniqueCDESection";
import StandardGlobalCTA from "@/components/shared/StandardGlobalCTA";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export default async function PremiumAboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_cta = await getTranslations({ locale, namespace: 'GlobalCTA' });

  // 1. Fetch DB Stats
  const [articlesCount, clinicalCasesCount, researchersCount] = await Promise.all([
    db.article.count({ where: { published: true } }),
    db.clinicalCase.count(),
    db.member.count()
  ]);

  // 2. Count Partners from Directory
  let partnersCount = 0;
  try {
    const partenairesDir = path.join(process.cwd(), "public/images/partenaires");
    const files = fs.readdirSync(partenairesDir);
    // Count only actual files (filter out hidden files if any)
    partnersCount = files.filter(file => !file.startsWith('.')).length;
  } catch (error) {
    console.error("Erreur lors de la lecture des partenaires:", error);
    partnersCount = 12; // Fallback
  }

  const realStats = {
    partners: partnersCount,
    articles: articlesCount,
    cases: clinicalCasesCount,
    researchers: researchersCount,
  };

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <AboutHero />

      {/* 2. QUI SOMMES-NOUS ? */}
      <AboutStory />

      {/* 3. MISSION & DOMAINES D'EXPERTISE */}
      <AboutMission />

      {/* 4. CLINIQUE DE DROIT DE L'ENVIRONNEMENT — 4 AXES STRATÉGIQUES */}
      <CliniqueCDESection />

      {/* 5. IMPACT & CHIFFRES */}
      <AboutImpact statsData={realStats} />

      {/* 6. VISION AFRICAINE */}
      <AboutVision />

      {/* 9. CTA FINAL */}
      <StandardGlobalCTA 
        title={t_cta.rich("title", {
          span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
        })}
        subtitle={t_cta("collaboration")}
        buttonText={t_cta("partner")}
        href="/contact"
        bgImage="/images/arbres/arbresl.jpg"
      />
    </main>
  );
}