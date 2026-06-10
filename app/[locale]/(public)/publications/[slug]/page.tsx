// app/[locale]/publications/[slug]/page.tsx
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Download, Clock, BookOpen, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArticleWithTranslations } from "@/types/content";
import WordReveal from "@/components/about/WordReveal";
import { getTranslations } from "next-intl/server";
import ShareButton from "@/components/ui/ShareButton";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
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
  } catch (error) {
    return { title: t_meta("title") };
  }
}

export default async function PublicationDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t_ui = await getTranslations("PublicationDetailPage");
  const t_res = await getTranslations("ResearchDetailPage");
  const t_common = await getTranslations("Navigation");

  type PublicationSqlResult = ArticleWithTranslations & { 
    category_translations: any[];
    medias: any[];
  };

  const [articleResult] = (await sql`
    SELECT a.*, 
      (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
      (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations,
      (SELECT json_agg(m) FROM "Media" m WHERE m."articleId" = a.id AND m.type = 'DOCUMENT') as medias
    FROM "Article" a
    WHERE a.slug = ${slug}
  `.catch(() => [null])) as PublicationSqlResult[];

  const article = articleResult;
  if (!article) notFound();
  
  const translations = article.translations || [];
  const content = translations[0];
  const categoryName = (article.category_translations as any[])?.[0]?.name || t_ui("badge.research");
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "Recent";

  const pdfFile = article.medias?.find(m => m.type === 'DOCUMENT')?.url || "#";

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* EDITORIAL HERO */}
      <section className="relative pt-44 pb-32 overflow-hidden border-b border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-[2/1] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
             {/* BREADCRUMB / BACK */}
             <Link href="/publications" className="group inline-flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-16 hover:text-primary/70 transition-colors">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                {t_ui("back")}
             </Link>

             {/* META ROW TOP */}
             <div className="flex items-center gap-6 mb-10">
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
                  {categoryName}
                </span>
                <div className="h-px flex-1 bg-border/40" />
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Clock size={14} className="opacity-40" />
                  {t_res("readingTime", { time: 10 })}
                </div>
             </div>

             {/* ARTICLE TITLE */}
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.05] tracking-tight mb-16">
               <WordReveal text={content?.title || ""} as="span" className="text-foreground" stagger={0.05} />
             </h1>

             {/* AUTHOR & DATE */}
             <div className="flex flex-wrap items-center gap-x-12 gap-y-6 py-10 border-t border-border/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-md bg-muted border border-border/50 flex items-center justify-center text-primary shadow-sm">
                      <User size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{t_ui("metadata.authors")}</p>
                      <p className="text-sm font-bold text-foreground">Equipe de Recherche CREDDA</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-md bg-muted border border-border/50 flex items-center justify-center text-muted-foreground/40">
                      <Calendar size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Date</p>
                      <p className="text-sm font-bold text-foreground">{date}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-md bg-muted border border-border/50 flex items-center justify-center text-muted-foreground/40">
                      <BookOpen size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{t_common("research")}</p>
                      <p className="text-sm font-bold text-foreground">{article.domain}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT BODY */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="max-w-[720px] w-full">
                {/* ABSTRACT / EXCERPT */}
                <div className="relative mb-20">
                  <span className="absolute -left-12 -top-4 text-7xl font-serif text-primary/10 select-none hidden md:block">“</span>
                  <p className="text-xl md:text-2xl text-foreground/80 font-serif italic leading-relaxed pl-2 border-l-2 border-primary/20">
                    {content?.excerpt}
                  </p>
                </div>

                {/* CONTENT */}
                <div className="prose prose-lg prose-fraunces prose-gold max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                                prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:font-light prose-p:text-lg
                                prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-primary
                                prose-strong:text-foreground prose-a:text-primary">
                  {content?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: content.content }} />
                  ) : (
                    <p className="text-muted-foreground italic">Aucun contenu détaillé disponible.</p>
                  )}
                </div>

                {/* TAGS FOOTER */}
                <div className="mt-20 pt-10 border-t border-border/50 flex flex-wrap gap-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2 mr-4">
                     <Tag size={14} /> Mots-clés:
                   </span>
                   {["Droit", "Environnement", "RDC"].map(tag => (
                     <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors px-3 py-1 bg-muted rounded-md">
                        #{tag}
                     </span>
                   ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR COLUMN (4/12) */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="sticky top-32 space-y-10">
                
                {/* ACTIONS CARD */}
                <div className="bg-card/30 backdrop-blur-md border border-border/50 p-10 rounded-md shadow-xl shadow-black/5">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/20 pb-4">Actions</h4>
                  <div className="space-y-4">
                    <Button asChild className="w-full bg-primary text-primary-foreground rounded-md py-7 font-bold uppercase tracking-widest text-[11px] flex gap-3 shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:shadow-[0_15px_40px_rgba(201,168,76,0.3)] transition-all">
                      <a href={pdfFile} target="_blank" rel="noopener noreferrer">
                        <Download size={18} /> {t_ui("actions.download")}
                      </a>
                    </Button>
                    <ShareButton 
                      title={content?.title || ""} 
                      label={t_res("actions.share")} 
                      copiedLabel={t_res("actions.copied")} 
                    />
                  </div>
                </div>

                {/* RELATED / INSTITUTIONAL BOX */}
                <div className="p-8 border-l-2 border-primary/20 bg-primary/3 rounded-r-md">
                  <h5 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{t_ui("hub.title")}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light mb-6">
                    {t_ui("hub.description")}
                  </p>
                  <Link href="/about" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                    {t_ui("hub.link")} →
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}