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

  const sanitizedTeam = team.map(member => ({
    ...member,
    image: member.image ? member.image.replace(/\\/g, '/').replace(/^public\//, '/') : null
  }));

  const sanitizedGalleryImages = galleryImages.map(img => ({
    ...img,
    src: img.src ? img.src.replace(/\\/g, '/').replace(/^public\//, '/') : ''
  }));

  const stats = {
    totalResources: totalArticles + totalPubs, // Somme totale des documents
    publications: totalPubs,
    members: totalMembers,
    researchArticles: researchCount,
    clinicalArticles: clinicalCount,
  };

  const TESTIMONIALS = [
    {
      name: "David MICHAEL PEYTON",
      role: "PhD Candidate, Northwestern University",
      image: "/images/testimonials/Peyton.webp",
      text: "I could not have asked for more ideal research partners than the faculty and staff at CREDDA-ULPGL. They were not only able to support multiple types of data collection but also provided opportunities for feedback from Congolese academics."
    },
    {
      name: "Heather LYNNE ZIMMERMAN",
      role: "Masters student, London School of Economics (LSE)",
      image: "/images/testimonials/heather.webp",
      text: "Dear Professor Kennedy Kihangi, thank you very much for generously welcoming me into the community! I am grateful for the ideas and feedback offered on my research. I am eager to return to Goma."
    },
    {
      name: "Britta Sjöstedt",
      role: "PhD candidate, Lund University",
      image: "/images/testimonials/britta.webp",
      text: "I visited ULPGL in 2015 to conduct research for my PhD. Professor Kennedy KIHANGI BINDU was an excellent host that helped to get in contact with other researchers and organisations."
    }
  ];

  const PARTNERS = [
    "Amnesty.webp", "McCain.webp", "Northwestern.webp", "TWB.webp",
    "worldbank.webp", "Ceni.webp", "Monusco.webp", "Oxford.webp",
    "Uhaki.webp", "Harvard.webp", "Morehouse.webp", "PNUD.webp", "ulpgl.webp"
  ];

  return (
    <HomeClient
      locale={locale}
      featuredResearch={featuredResearch}
      latestReports={latestReports}
      team={sanitizedTeam}
      galleryImages={sanitizedGalleryImages}
      testimonials={TESTIMONIALS}
      partners={PARTNERS}
      dbStats={stats}
    />
  );
}