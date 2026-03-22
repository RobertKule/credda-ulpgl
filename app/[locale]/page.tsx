// app/[locale]/page.tsx
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { localePageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "home");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let featuredResearch: any[] = [];
  let latestReports: any[] = [];
  let team: any[] = [];
  let galleryImages: any[] = [];
  let stats = {
    totalResources: 0,
    publications: 0,
    members: 0,
    researchArticles: 0,
    clinicalArticles: 0,
  };

  const [
    dbFeaturedResearch,
    dbLatestReports,
    dbTeam,
    dbGalleryImages,
    totalArticles,
    totalPubs,
    totalMembers,
    researchCount,
    clinicalCount,
    clinicalCaseCount
  ] = await Promise.all([
    safeQuery(
      () =>
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
      [],
      "home:featuredResearch"
    ),
    safeQuery(
      () =>
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
      [],
      "home:latestReports"
    ),
    safeQuery(
      () =>
        db.member.findMany({
          select: {
            id: true,
            image: true,
            translations: { where: { language: locale }, select: { name: true, role: true } }
          },
          orderBy: { order: "asc" }
        }),
      [],
      "home:team"
    ),
    safeQuery(
      () =>
        db.galleryImage.findMany({
          where: { featured: true },
          take: 8,
          orderBy: { order: "asc" },
          select: {
            id: true,
            src: true,
            category: true,
            translations: {
              where: { language: locale },
              select: { title: true, description: true }
            }
          }
        }),
      [],
      "home:gallery"
    ),
    safeQuery(() => db.article.count({ where: { published: true } }), 0, "home:countArticles"),
    safeQuery(() => db.publication.count(), 0, "home:countPubs"),
    safeQuery(() => db.member.count(), 0, "home:countMembers"),
    safeQuery(
      () => db.article.count({ where: { domain: "RESEARCH", published: true } }),
      0,
      "home:countResearch"
    ),
    safeQuery(
      () => db.article.count({ where: { domain: "CLINICAL", published: true } }),
      0,
      "home:countClinical"
    ),
    safeQuery(() => db.clinicalCase.count(), 0, "home:countClinicalCases")
  ]);

  featuredResearch = dbFeaturedResearch;
  latestReports = dbLatestReports;
  team = dbTeam;
  galleryImages = dbGalleryImages;
  stats = {
    totalResources: totalArticles + totalPubs,
    publications: totalPubs,
    members: totalMembers,
    researchArticles: researchCount,
    clinicalArticles: clinicalCount,
    clinicalCases: clinicalCaseCount
  } as any;

  const sanitizedTeam = team.map(member => ({
    ...member,
    image: member.image ? member.image.replace(/\\/g, '/').replace(/^public\//, '/') : null
  }));

  const sanitizedGalleryImages = galleryImages.map(img => ({
    ...img,
    src: img.src ? img.src.replace(/\\/g, '/').replace(/^public\//, '/') : '',
    title: img.translations?.[0]?.title || "",
    description: img.translations?.[0]?.description || img.description || ""
  }));

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