// app/[locale]/page.tsx
import { sql } from "@/lib/db";
import { localePageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import fs from "fs";
import path from "path";

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

  let PARTNERS: string[] = [];
  try {
    const partnersDir = path.join(process.cwd(), 'public', 'images', 'partenaires');
    PARTNERS = fs.readdirSync(partnersDir).filter(file => /\.(png|webp|jpe?g|svg)$/i.test(file));
  } catch (e) {
    PARTNERS = [
      "Amnesty.webp", "McCain.webp", "Northwestern.webp", "TWB.webp",
      "worldbank.webp", "Ceni.webp", "Monusco.webp", "Oxford.webp",
      "Uhaki.webp", "Harvard.webp", "Morehouse.webp", "PNUD.webp", "ulpgl.webp"
    ];
  }

  try {
    const [
      featuredResearch,
      latestReports,
      team,
      galleryImages,
      totalArticlesResult,
      totalPubsResult,
      totalMembersResult,
      researchCountResult,
      clinicalCountResult,
      clinicalCaseCountResult
    ] = (await Promise.all([
      // featuredResearch
      sql`
        SELECT a.id, a.slug, a."mainImage", a."createdAt", a."categoryId",
          (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
          (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
        FROM "Article" a
        WHERE a.domain = 'RESEARCH' AND a.published = true
        ORDER BY a."createdAt" DESC LIMIT 4
      `,
      // latestReports
      sql`
        SELECT p.id, p.slug, p.year, p.domain, p."pdfUrl", p."createdAt",
          (SELECT json_agg(t) FROM "PublicationTranslation" t WHERE t."publicationId" = p.id AND t.language = ${locale}) as translations
        FROM "Publication" p
        ORDER BY p.year DESC LIMIT 3
      `,
      // team
      sql`
        SELECT m.id, m.name, m.slug, m.image, m."order",
          (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
        FROM "Member" m
        ORDER BY m."order" ASC
      `,
      // gallery
      sql`
        SELECT gi.id, gi.src, gi.category, gi.featured, gi."order",
          (SELECT json_agg(t) FROM "GalleryImageTranslation" t WHERE t."galleryImageId" = gi.id AND t.language = ${locale}) as translations
        FROM "GalleryImage" gi
        WHERE gi.featured = true
        ORDER BY gi."order" ASC LIMIT 8
      `,
      // counts
      sql`SELECT count(*) FROM "Article" WHERE published = true`,
      sql`SELECT count(*) FROM "Publication"`,
      sql`SELECT count(*) FROM "Member"`,
      sql`SELECT count(*) FROM "Article" WHERE domain = 'RESEARCH' AND published = true`,
      sql`SELECT count(*) FROM "Article" WHERE domain = 'CLINICAL' AND published = true`,
      sql`SELECT count(*) FROM "ClinicalCase"`
    ])) as any[];

    const totalArticles = parseInt(totalArticlesResult[0].count, 10);
    const totalPubs = parseInt(totalPubsResult[0].count, 10);
    const totalMembers = parseInt(totalMembersResult[0].count, 10);
    const researchCount = parseInt(researchCountResult[0].count, 10);
    const clinicalCount = parseInt(clinicalCountResult[0].count, 10);
    const clinicalCaseCount = parseInt(clinicalCaseCountResult[0].count, 10);

    const stats = {
      totalResources: totalArticles + totalPubs,
      publications: totalPubs,
      members: totalMembers,
      researchArticles: researchCount,
      clinicalArticles: clinicalCount,
      clinicalCases: clinicalCaseCount
    };

    const sanitizedTeam = team.map((member: any) => ({
      ...member,
      image: member.image ? member.image.replace(/\\/g, '/').replace(/^public\//, '/') : null,
      translations: member.translations || []
    }));

    const sanitizedGalleryImages = galleryImages.map((img: any) => ({
      ...img,
      src: img.src ? img.src.replace(/\\/g, '/').replace(/^public\//, '/') : '',
      title: img.translations?.[0]?.title || "",
      description: img.translations?.[0]?.description || ""
    }));

    const formattedFeaturedResearch = featuredResearch.map((item: any) => ({
      ...item,
      translations: item.translations || [],
      category: {
        translations: item.category_translations || []
      }
    }));

    const formattedLatestReports = latestReports.map((p: any) => ({
      ...p,
      translations: p.translations || []
    }));

    return (
      <HomeClient
        locale={locale}
        featuredResearch={formattedFeaturedResearch}
        latestReports={formattedLatestReports}
        team={sanitizedTeam}
        galleryImages={sanitizedGalleryImages}
        testimonials={TESTIMONIALS}
        partners={PARTNERS}
        dbStats={stats}
      />
    );
  } catch (error: any) {
    console.error("[HOME] error:", error.message);
    return (
      <HomeClient
        locale={locale}
        featuredResearch={[]}
        latestReports={[]}
        team={[]}
        galleryImages={[]}
        testimonials={TESTIMONIALS}
        partners={PARTNERS}
        dbStats={{}}
      />
    );
  }
}