// app/[locale]/page.tsx
import { db } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [featuredResearch, latestReports, team, galleryImages, totalArticles, totalPubs, totalMembers, researchCount, clinicalCount] = await Promise.all([
    // 1. Articles Featured
    db.article.findMany({
      where: { domain: "RESEARCH", published: true },
      take: 4,
      select: {
        id: true,
        slug: true,
        mainImage: true,
        createdAt: true,
        translations: { where: { language: locale }, select: { title: true, excerpt: true } },
        category: { select: { translations: { where: { language: locale }, select: { name: true } } } }
      },
      orderBy: { createdAt: "desc" }
    }),
    // 2. Dernières Publications PDF
    db.publication.findMany({
      take: 3,
      select: {
        id: true,
        slug: true,
        year: true,
        domain: true,
        pdfUrl: true,
        createdAt: true,
        translations: { where: { language: locale }, select: { title: true } }
      },
      orderBy: { year: "desc" }
    }),
    // 3. Équipe
    db.member.findMany({
      select: {
        id: true,
        image: true,
        translations: { where: { language: locale }, select: { name: true, role: true } }
      },
      orderBy: { order: "asc" }
    }),
    // 4. Galerie Images
    db.galleryImage.findMany({
      where: { featured: true },
      take: 10,
      orderBy: { order: 'asc' },
      select: { id: true, src: true, title: true, category: true, description: true }
    }),
    // 5. Statistiques détaillées
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