import { mapArticleToEditorial, mapPublicationToEditorial } from "@/lib/data-transformers";
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import PublicationExplorer from "@/components/about/PublicationExplorer";
import WordReveal from "@/components/about/WordReveal";
import { m as motion } from "framer-motion";
import { EditorialItem } from "@/types/editorial";
import EditorialPageHero from "@/components/shared/EditorialPageHero";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "publications");
}

interface ArticleTranslation {
  language: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: string;
}

interface RawArticle {
  id: string;
  slug: string;
  domain: string;
  published: boolean;
  featured: boolean;
  mainImage: string | null;
  videoUrl: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  translations: ArticleTranslation[] | null;
  categoryName?: string;
  publishedAt?: Date;
}

interface RawCategory {
  id: string;
  name: string | null;
}

export default async function PublicationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // FETCH ARTICLES & CATEGORIES IN PARALLEL
  const [articlesData, categoriesData] = await Promise.all([
    sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT ct.name FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale} LIMIT 1) as "categoryName"
      FROM "Article" a
      WHERE EXISTS (
        SELECT 1 FROM "ArticleTranslation" t 
        WHERE t."articleId" = a.id AND t.language = ${locale} AND t.status = 'PUBLISHED'
      )
      ORDER BY a."createdAt" DESC
    `.catch(() => []),
    sql`
      SELECT c.id, 
        (SELECT ct.name FROM "CategoryTranslation" ct WHERE ct."categoryId" = c.id AND ct.language = ${locale} LIMIT 1) as name
      FROM "Category" c
      ORDER BY name ASC
    `.catch(() => [])
  ]);

  // Transform data
  const mappedArticles: EditorialItem[] = (articlesData as RawArticle[]).map(mapArticleToEditorial);

  // Only use articles for the new architecture
  const allEditorials = [...mappedArticles].sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Clean data
  const filteredCategories = (categoriesData as RawCategory[])
    .filter(c => c.name)
    .map(c => ({ id: c.id, name: c.name as string }));

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* HERO SECTION - Premium Editorial */}
      <EditorialPageHero
        title="Bibliothèque Numérique" 
        subtitle="Accédez aux recherches, rapports cliniques et publications scientifiques du centre de recherche CREDDA."
        badge="Digital Open Archive"
      />

      {/* EXPLORER SECTION */}
      <section className="py-24 px-6 lg:px-12 bg-background/50">
        <div className="container mx-auto">
          <PublicationExplorer
            initialArticles={allEditorials}
            categories={filteredCategories}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}