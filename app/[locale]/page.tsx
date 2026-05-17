// app/[locale]/page.tsx
import { sql } from "@/lib/db";
import { localePageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import fs from "fs";
import path from "path";

import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations('HomePage');

  const TESTIMONIALS = t.raw('testimonials.items') || [];

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
      clinicalCaseCountResult,
      totalGalleryImagesResult
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
      // gallery (Institutional Hero Carousel)
      sql`
        SELECT gi.id, gi.src, gi.category, gi.featured, gi."order", gi."createdAt",
          (SELECT json_agg(t) FROM "GalleryImageTranslation" t WHERE t."galleryImageId" = gi.id AND t.language = ${locale}) as translations
        FROM "GalleryImage" gi
        ORDER BY gi."createdAt" DESC LIMIT 15
      `,
      // counts
      sql`SELECT count(*) FROM "Article" WHERE published = true`,
      sql`SELECT count(*) FROM "Publication"`,
      sql`SELECT count(*) FROM "Member"`,
      sql`SELECT count(*) FROM "Article" WHERE domain = 'RESEARCH' AND published = true`,
      sql`SELECT count(*) FROM "Article" WHERE domain = 'CLINICAL' AND published = true`,
      sql`SELECT count(*) FROM "ClinicalCase"`,
      sql`SELECT count(*) FROM "GalleryImage"`
    ])) as [any[], any[], any[], any[], { count: string }[], { count: string }[], { count: string }[], { count: string }[], { count: string }[], { count: string }[], { count: string }[]];

    const totalArticles = parseInt(totalArticlesResult[0].count, 10);
    const totalPubs = parseInt(totalPubsResult[0].count, 10);
    const totalMembers = parseInt(totalMembersResult[0].count, 10);
    const researchCount = parseInt(researchCountResult[0].count, 10);
    const clinicalCount = parseInt(clinicalCountResult[0].count, 10);
    const clinicalCaseCount = parseInt(clinicalCaseCountResult[0].count, 10);
    const totalGalleryImages = parseInt(totalGalleryImagesResult[0].count, 10);

    const stats = {
      totalResources: totalArticles + totalPubs,
      publications: totalPubs,
      members: totalMembers,
      researchArticles: researchCount,
      clinicalArticles: clinicalCount,
      clinicalCases: clinicalCaseCount
    };

    const sanitizedTeam = team.map((member: any) => {
      let image = member.image ? member.image.replace(/\\/g, '/') : null;
      if (image && !image.startsWith('http')) {
        image = image.replace(/^\/?public\//, '/').replace(/^\/?/, '/');
      }
      return {
        ...member,
        image,
        translations: member.translations || []
      };
    });

    let sanitizedGalleryImages = galleryImages.map((img: any) => {
      let src = img.src ? img.src.replace(/\\/g, '/') : '';
      if (src && !src.startsWith('http')) {
        src = src.replace(/^\/?public\//, '/').replace(/^\/?/, '/');
      }
      return {
        ...img,
        src,
        title: img.translations?.[0]?.title || "",
        description: img.translations?.[0]?.description || "",
        category: img.category || "Gallery"
      };
    }).filter((img: any) => img.src !== '');

    // Fallback to local filesystem images if DB is empty (Real images from public/images/gallery)
    if (sanitizedGalleryImages.length === 0) {
      try {
        const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
        if (fs.existsSync(galleryDir)) {
          const files = fs.readdirSync(galleryDir).filter(file => /\.(png|webp|jpe?g|svg)$/i.test(file));
          sanitizedGalleryImages = files.map((file, idx) => ({
            id: `fs-${idx}`,
            src: `/images/gallery/${file}`,
            title: file.split('.')[0].charAt(0).toUpperCase() + file.split('.')[0].slice(1),
            description: "Archive CREDDA-ULPGL",
            category: "Archive"
          }));
        }
      } catch (err) {
        console.error("Error reading gallery directory:", err);
      }
    }

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

    let totalCountToDisplay = totalGalleryImages;
    if (totalGalleryImages === 0 && sanitizedGalleryImages.length > 0) {
      totalCountToDisplay = sanitizedGalleryImages.length;
    }

    return (
      <HomeClient
        locale={locale}
        featuredResearch={formattedFeaturedResearch}
        latestReports={formattedLatestReports}
        team={sanitizedTeam}
        galleryImages={sanitizedGalleryImages}
        totalGalleryImages={totalCountToDisplay}
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