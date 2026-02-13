// app/[locale]/page.tsx
import { db } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Récupération des données en parallèle pour la performance
  const [featuredResearch, latestReports, team, totalArticles, totalPubs, totalMembers, researchCount, clinicalCount] = await Promise.all([
    // 1. Articles Featured
    db.article.findMany({
      where: { domain: "RESEARCH", published: true },
      take: 4,
      include: { 
        translations: { where: { language: locale } },
        category: { include: { translations: { where: { language: locale } } } }
      },
      orderBy: { createdAt: "desc" }
    }),
    // 2. Dernières Publications PDF
    db.publication.findMany({
      take: 3,
      include: { translations: { where: { language: locale } } },
      orderBy: { year: "desc" }
    }),
    // 3. Équipe
    db.member.findMany({
      include: { translations: { where: { language: locale } } },
      orderBy: { order: "asc" }
    }),
    // 4. Statistiques détaillées
    db.article.count({ where: { published: true } }),
    db.publication.count(),
    db.member.count(),
    db.article.count({ where: { domain: "RESEARCH", published: true } }),
    db.article.count({ where: { domain: "CLINICAL", published: true } }),
  ]);

  const stats = {
    totalResources: totalArticles + totalPubs, // Somme totale des documents
    publications: totalPubs,
    members: totalMembers,
    researchArticles: researchCount,
    clinicalArticles: clinicalCount,
  };

  return (
    <HomeClient 
      locale={locale}
      featuredResearch={featuredResearch}
      latestReports={latestReports}
      team={team}
      dbStats={stats}
    />
  );
}