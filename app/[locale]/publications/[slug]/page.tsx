// app/[locale]/publications/[slug]/page.tsx
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Download, Clock, BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { m as motion } from "framer-motion";
import { ArticleWithTranslations } from "@/types/content";
import WordReveal from "@/components/about/WordReveal";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const [article] = (await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE a.slug = ${slug}
    `) as ArticleWithTranslations[];

    if (!article) return { title: "Publication - CREDDA" };
    const t = article.translations?.[0];

    return {
      title: `${t?.title || "Recherche"} | CREDDA-ULPGL`,
      description: t?.excerpt || "Rapport de recherche scientifique du CREDDA.",
    };
  } catch (error) {
    return { title: "Publication - CREDDA" };
  }
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default async function PublicationDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  type PublicationSqlResult = ArticleWithTranslations & { category_translations: any[] };

  const [articleResult] = (await sql`
    SELECT a.*, 
      (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
      (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
    FROM "Article" a
    WHERE a.slug = ${slug}
  `.catch(() => [null])) as PublicationSqlResult[];

  const article = articleResult;
  if (!article) notFound();
  
  const translations = article.translations || [];
  const t = translations[0];
  const categoryName = (article.category_translations as any[])?.[0]?.name || "Research Paper";
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "Recent";

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* EDITORIAL HERO */}
      <section className="relative pt-44 pb-32 overflow-hidden border-b border-border/50">
        {/* PARALLAX GLOW BLOB */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-[2/1] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
             {/* BREADCRUMB / BACK */}
             <Link href="/publications" className="group inline-flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-16 hover:text-primary/70 transition-colors">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Bibliothèque
             </Link>

             {/* META ROW TOP */}
             <div className="flex items-center gap-6 mb-10">
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {categoryName}
                </span>
                <div className="h-px flex-1 bg-border/40" />
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Clock size={14} className="opacity-40" />
                  12 Min Read
                </div>
             </div>

             {/* ARTICLE TITLE */}
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.05] tracking-tight mb-16">
               <WordReveal text={t?.title || ""} as="span" className="text-foreground" stagger={0.05} />
             </h1>

             {/* AUTHOR & DATE */}
             <div className="flex flex-wrap items-center gap-x-12 gap-y-6 py-10 border-t border-border/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-primary shadow-sm">
                      <User size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Auteur Institutionnel</p>
                      <p className="text-sm font-bold text-foreground">Equipe de Recherche CREDDA</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground/40">
                      <Calendar size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Date de Publication</p>
                      <p className="text-sm font-bold text-foreground">{date}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground/40">
                      <BookOpen size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Secteur</p>
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
            
            {/* MAIN COLUMN (8/12) */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="max-w-[720px] w-full">
                {/* ABSTRACT / EXCERPT */}
                <div className="relative mb-20">
                  <span className="absolute -left-12 -top-4 text-7xl font-serif text-primary/10 select-none hidden md:block">“</span>
                  <p className="text-xl md:text-2xl text-foreground/80 font-serif italic leading-relaxed pl-2 border-l-2 border-primary/20">
                    {t?.excerpt}
                  </p>
                </div>

                {/* CONTENT */}
                <div className="prose prose-lg prose-fraunces prose-gold max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                                prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:font-light prose-p:text-lg
                                prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-primary
                                prose-strong:text-foreground prose-a:text-primary">
                  {t?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: t.content }} />
                  ) : (
                    <p className="text-muted-foreground italic">Aucun contenu détaillé n'est disponible pour cette publication pour le moment. Veuillez consulter la bibliothèque physique à l'ULPGL pour accéder au manuscrit complet.</p>
                  )}
                </div>

                {/* TAGS FOOTER */}
                <div className="mt-20 pt-10 border-t border-border/50 flex flex-wrap gap-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2 mr-4">
                     <Tag size={14} /> Mots-clés:
                   </span>
                   {["Droit", "Environnement", "RDC", "Justice", "Recherche"].map(tag => (
                     <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors px-3 py-1 bg-muted rounded-full">
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
                <div className="bg-card/30 backdrop-blur-md border border-border/50 p-10 rounded-[2rem] shadow-xl shadow-black/5">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/20 pb-4">Actions</h4>
                  <div className="space-y-4">
                    <Button className="w-full bg-primary text-primary-foreground rounded-xl py-7 font-bold uppercase tracking-widest text-[11px] flex gap-3 shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:shadow-[0_15px_40px_rgba(201,168,76,0.3)] transition-all">
                      <Download size={18} /> Open Archive PDF
                    </Button>
                    <Button variant="outline" className="w-full border-border rounded-xl py-7 font-bold uppercase tracking-widest text-[11px] flex gap-3 hover:bg-foreground hover:text-background transition-all">
                      <Share2 size={18} /> Share Research
                    </Button>
                  </div>
                </div>

                {/* RELATED / INSTITUTIONAL BOX */}
                <div className="p-8 border-l-2 border-primary/20 bg-primary/3 rounded-r-2xl">
                  <h5 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">CREDDA Research Hub</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light mb-6">
                    Cette publication fait partie de la collection permanente du centre de recherche interdisciplinaire de l'ULPGL.
                  </p>
                  <Link href="/about" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                    Learn about our ethics →
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