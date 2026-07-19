// app/[locale]/publications/[slug]/page.tsx
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Download, Clock, BookOpen, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { ArticleWithTranslations } from "@/types/content";
import WordReveal from "@/components/about/WordReveal";
import { getTranslations } from "next-intl/server";
import ShareButton from "@/components/ui/ShareButton";
import ArticleMarkdown from "./ArticleMarkdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t_meta = await getTranslations({ locale, namespace: "metadata.publications" });

  try {
    const [article] = (await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE a.slug = ${slug}
    `) as ArticleWithTranslations[];

    if (!article) return { title: t_meta("title") };
    const content = article.translations?.[0];

    return {
      title: `${content?.title || "Recherche"} | CREDDA-ULPGL`,
      description: content?.excerpt || t_meta("description"),
    };
  } catch {
    return { title: t_meta("title") };
  }
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t_ui = await getTranslations("PublicationDetailPage");
  const t_res = await getTranslations("ResearchDetailPage");
  const t_common = await getTranslations("Navigation");

  interface CategoryTranslation {
    language: string;
    name: string;
    categoryId: string;
  }
  interface Media {
    id: string;
    type: string;
    url: string;
    title: string | null;
  }
  type PublicationSqlResult = ArticleWithTranslations & {
    category_translations: CategoryTranslation[];
    medias: Media[];
  };

  const [articleResult, recentArticlesRaw] = await Promise.all([
    sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations,
        (SELECT json_agg(m) FROM "Media" m WHERE m."articleId" = a.id AND m.type::text = 'DOCUMENT') as medias
      FROM "Article" a
      WHERE a.slug = ${slug} OR a.id = ${slug}
    `.catch(() => [null]),
    sql`
      SELECT a.id, a.slug, a."mainImage", a."createdAt",
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE (a.slug != ${slug} AND a.id != ${slug}) AND a.published = true
      ORDER BY a."createdAt" DESC
      LIMIT 3
    `.catch(() => [])
  ]);

  const article = (articleResult as any[])?.[0] as PublicationSqlResult;
  if (!article) notFound();

  const content = article.translations?.[0];
  const categoryName = article.category_translations?.[0]?.name || t_ui("badge.research");
  const date = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Récent";
  const pdfFile = article.medias?.find((m) => m.type === "DOCUMENT")?.url || "#";

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">

      {/* ── 1. HERO : TITRE ── */}
      <section className="relative pt-18 pb-2 border-b border-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(22,101,52,0.06),transparent)]" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          {/* Retour */}
          <Link
            href="/publications"
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-12 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t_ui("back")}
          </Link>

          {/* Badge + temps de lecture */}
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
              {categoryName}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              <Clock size={12} />
              {t_res("readingTime", { time: 10 })}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.08] tracking-tight">
            <WordReveal text={content?.title || ""} as="span" className="text-foreground" stagger={0.04} />
          </h1>
        </div>
      </section>

      {/* ── 2. MÉTADONNÉES + BOUTONS ACTIONS ── */}
      <section className="py-8 border-b border-border/30 bg-muted/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:justify-between">

            {/* Auteur / Date / Domaine */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{t_ui("metadata.authors")}</p>
                  <p className="text-xs font-bold text-foreground">Équipe CREDDA</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Date</p>
                  <p className="text-xs font-bold text-foreground">{date}</p>
                </div>
              </div>

              {article.domain && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{t_common("research")}</p>
                    <p className="text-xs font-bold text-foreground">{article.domain}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {pdfFile !== "#" && (
                <a
                  href={pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                >
                  <Download size={14} />
                  {t_ui("actions.download")}
                </a>
              )}
              <ShareButton
                title={content?.title || ""}
                label={t_res("actions.share")}
                copiedLabel={t_res("actions.copied")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE DE COUVERTURE ── */}
      {article.mainImage && (
        <section className="py-8">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="aspect-video w-full relative rounded-2xl overflow-hidden shadow-2xl border border-border/20">
              <img
                src={article.mainImage}
                alt={content?.title || "Image de couverture"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 3. RÉSUMÉ / EXCERPT ── */}
      {content?.excerpt && (
        <section className="py-12 border-b border-border/30">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="relative pl-6 border-l-2 border-primary/30">
              <span className="absolute -left-3 -top-2 text-5xl font-serif text-primary/15 select-none leading-none">"</span>
              <p className="text-lg md:text-xl text-foreground/75 font-serif italic leading-relaxed">
                {content.excerpt}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. CONTENU DE L'ARTICLE ET SIDEBAR ── */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Article Content */}
            <div className="lg:col-span-8">
              {content?.content ? (
                <ArticleMarkdown content={content.content} />
              ) : (
                <div className="text-center py-20">
                  <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground italic text-sm">
                    Aucun contenu détaillé disponible pour cet article.
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-border/40 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5 mr-2">
                  <Tag size={12} /> Mots-clés :
                </span>
                {["Droit", "Environnement", "RDC"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors px-3 py-1 bg-muted/60 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-10">
                <div className="bg-muted/30 border border-border/50 rounded-xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <BookOpen size={16} /> Articles récents
                  </h4>
                  <div className="space-y-6">
                    {(recentArticlesRaw as any[]).map((recentArticle) => {
                      const recentContent = recentArticle.translations?.[0];
                      if (!recentContent) return null;

                      return (
                        <Link 
                          key={recentArticle.id} 
                          href={`/${locale}/publications/${recentArticle.id}`}
                          className="group flex gap-4 items-start"
                        >
                          {recentArticle.mainImage && (
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                              <img 
                                src={recentArticle.mainImage} 
                                alt={recentContent.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div>
                            <h5 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-3">
                              {recentContent.title}
                            </h5>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                              {new Date(recentArticle.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                    {(!recentArticlesRaw || (recentArticlesRaw as any[]).length === 0) && (
                      <p className="text-sm text-muted-foreground italic">Aucun article récent.</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

    </main>
  );
}