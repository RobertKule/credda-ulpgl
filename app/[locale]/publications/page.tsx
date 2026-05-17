// app/[locale]/publications/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import PublicationExplorer from "@/components/about/PublicationExplorer";
import WordReveal from "@/components/about/WordReveal";
import { m as motion } from "framer-motion";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "publications");
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
  translations: any[] | null;
  categoryName?: string;
  publishedAt?: Date;
}

export default async function PublicationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // FETCH ARTICLES & CATEGORIES IN PARALLEL
  const [articles, categories] = await Promise.all([
    sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT ct.name FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale} LIMIT 1) as "categoryName"
      FROM "Article" a
      WHERE a.published = true
      ORDER BY a."createdAt" DESC
    `.catch(() => []),
    sql`
      SELECT c.id, 
        (SELECT ct.name FROM "CategoryTranslation" ct WHERE ct."categoryId" = c.id AND ct.language = ${locale} LIMIT 1) as name
      FROM "Category" c
      ORDER BY name ASC
    `.catch(() => [])
  ]);

  // Clean data
  const filteredCategories = (categories as any[]).filter(c => c.name);

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* HERO SECTION - 50vh Editorial */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        {/* BACKGROUND ACCENTS */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.08),transparent_65%)]" />
        <div className="absolute inset-0 bg-[url('/images/texture-paper.png')] opacity-[0.02] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="flex flex-col items-center">
            {/* BADGE */}
            <div className="mb-8 px-5 py-2 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-primary">
                Digital Open Archive
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              <WordReveal
                text="Bibliothèque Numérique"
                as="span"
                className="text-foreground"
                stagger={0.08}
              />
            </h1>

            {/* SUBTITLE */}
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-light leading-relaxed tracking-wide">
              Accédez aux recherches, rapports cliniques et publications scientifiques <br className="hidden md:block"/> 
              du centre de recherche CREDDA.
            </p>

            {/* DECORATIVE ELEMENT */}
            <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </div>

        {/* BOTTOM DIVIDER */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </section>

      {/* EXPLORER SECTION */}
      <section className="py-24 px-6 lg:px-12 bg-background/50">
        <div className="container mx-auto">
          <PublicationExplorer
            initialArticles={articles as any[]}
            categories={filteredCategories}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}