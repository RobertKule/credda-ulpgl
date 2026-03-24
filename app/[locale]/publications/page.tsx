// app/[locale]/publications/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import { ArrowRight, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

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
  category?: string;
  publishedAt?: Date;
}

export default async function PublicationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // FETCH DATA
  const articles = (await sql`
    SELECT a.*, 
      (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
    FROM "Article" a
    WHERE a.published = true
    ORDER BY a."createdAt" DESC LIMIT 12
  `.catch(() => [])) as RawArticle[];

  return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12">
      {/* HEADER */}
      <section style={{ padding: '80px 40px 64px', borderBottom: '1px solid rgba(245,242,236,0.07)', marginBottom: '80px' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12">
          <ScrollReveal>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '9px', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
              CREDDA · Archive Ouverte
            </p>
            <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>
              Bibliothèque <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Numérique</em>
            </h1>
          </ScrollReveal>
          <p className="text-muted-foreground font-outfit font-light max-w-xs">
            Publications scientifiques, rapports cliniques et études de cas en libre accès.
          </p>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {articles.length > 0 ? articles.map((doc: RawArticle, i: number) => (
          <ScrollReveal key={doc.id} delay={i * 0.08}>
            <PublicationCard doc={doc} locale={locale} />
          </ScrollReveal>
        )) : (
          <div className="col-span-full py-32 text-center border border-dashed border-border">
             <p className="text-muted-foreground uppercase font-outfit tracking-widest text-[10px] font-bold">Aucune publication disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}

function PublicationCard({ doc, locale }: { doc: RawArticle; locale: string }) {
  const t = doc.translations?.[0];
  const date = doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  }) : "Recent";

  return (
    <Link 
      href={`/publications/${doc.slug || doc.id}`}
      className="group block p-8 bg-card border border-border hover:border-[#C9A84C]/40 transition-all duration-500 relative"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-muted border border-border flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-500">
          <FileText size={20} />
        </div>
        <span className="text-[9px] uppercase tracking-widest font-outfit font-bold text-muted-foreground/40">
          {doc.category || "Research Paper"}
        </span>
      </div>

      <h3 className="text-2xl font-bricolage font-bold text-foreground mb-6 line-clamp-2 leading-tight group-hover:text-[#C9A84C] transition-colors">
        {t?.title || "Untitled Document"}
      </h3>
      
      <p className="text-sm text-muted-foreground font-outfit font-light line-clamp-3 mb-12 leading-relaxed">
        {t?.description || t?.excerpt || "Click to read the full report and access the detailed analysis of this case."}
      </p>

      <div className="flex items-center justify-between pt-8 border-t border-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 uppercase font-outfit font-bold tracking-widest">
          <Calendar size={12} />
          {date}
        </div>
        <ArrowRight size={14} className="text-[#C9A84C] group-hover:translate-x-2 transition-transform" />
      </div>
    </Link>
  );
}