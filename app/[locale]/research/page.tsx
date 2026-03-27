// app/[locale]/research/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { 
  SearchX, 
  Calendar, 
  ArrowRight, 
  FileText,
  Clock,
  Filter,
  Download
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "research");
}

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={<ResearchLoading />}>
       <ResearchContent locale={locale} />
    </Suspense>
  );
}

async function ResearchContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'ResearchPage' });
  
  const articles: any = await sql`
    SELECT a.id, a.slug, a."mainImage" as image, a."createdAt", a.domain,
      (SELECT json_agg(tr) FROM "ArticleTranslation" tr WHERE tr."articleId" = a.id AND tr.language = ${locale}) as translations
    FROM "Article" a
    WHERE a.domain = 'RESEARCH' AND a.published = true
    ORDER BY a."createdAt" DESC
    LIMIT 20
  `.catch(() => []);

  return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12">
      {/* 1. AUTHORITATIVE HERO */}
      <section className="bg-indigo-950 text-white pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20 -skew-y-3 translate-y-24 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <FileText size={18} />
              <span>{t('header.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black leading-[1.05]">
              <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
            <p className="text-xl text-white/50 font-light leading-relaxed max-w-2xl">
              {t('header.description')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. RESEARCH STATUS BAR */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-card border border-border shadow-3xl">
           <div className="p-10 border-r border-border flex items-start gap-6 group hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
              <div className="p-4 bg-indigo-600/10 text-indigo-600">
                <FileText size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-indigo-800 dark:text-indigo-400 uppercase text-xs tracking-widest">Open Archive</h3>
                <p className="text-anthracite/50 text-sm font-light leading-snug">Accès libre aux publications et rapports scientifiques.</p>
              </div>
           </div>
           <div className="p-10 border-r border-border flex items-start gap-6 group hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
              <div className="p-4 bg-indigo-600/10 text-indigo-600">
                <Filter size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-indigo-800 dark:text-indigo-400 uppercase text-xs tracking-widest">Analyse Critique</h3>
                <p className="text-muted-foreground text-sm font-light leading-snug">Décryptage des enjeux de gouvernance en Afrique.</p>
              </div>
           </div>
           <div className="p-10 flex items-start gap-6 group hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
              <div className="p-4 bg-indigo-600/10 text-indigo-600">
                <Download size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-indigo-800 dark:text-indigo-400 uppercase text-xs tracking-widest">Ressources PDF</h3>
                <p className="text-anthracite/50 text-sm font-light leading-snug">Téléchargement gratuit des travaux de recherche.</p>
              </div>
           </div>
        </div>
      </div>

      {/* 2. RESEARCH GRID */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? articles.map((doc: any, i: number) => (
           <ScrollReveal key={doc.id} delay={i * 0.08}>
             <ResearchCard doc={doc} locale={locale} />
           </ScrollReveal>
        )) : (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-border">
             <SearchX size={64} className="mx-auto text-foreground/10 mb-8" />
             <h3 className="text-2xl font-serif font-black text-foreground mb-4">Foundations of Knowledge</h3>
             <p className="text-muted-foreground max-w-sm mx-auto font-light">Nos archives numériques sont en cours d'expansion. Revenez bientôt pour les derniers rapports.</p>
          </div>
        )}
      </section>

      {/* 3. SUBMISSION CTA */}
      <section className="mt-32 max-w-7xl mx-auto bg-gradient-to-r from-indigo-900 to-slate-900 p-12 lg:p-24 text-center rounded-[2rem] border border-indigo-500/20">
         <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-8">
            Contribute to the <span className="italic">Scholarly Body</span>
         </h2>
         <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto mb-12">
            Le CREDDA accueille les contributions de chercheurs externes. Soumettez vos travaux pour une parution dans nos prochaines éditions.
         </p>
         <Link href="/contact" className="inline-flex items-center gap-4 bg-indigo-600 text-white px-10 py-6 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-indigo-950 transition-all border border-indigo-500/20 shadow-xl shadow-indigo-900/20">
            Soumettre un Article <ArrowRight size={14} />
         </Link>
      </section>
    </main>
  );
}

function ResearchCard({ doc, locale }: { doc: any, locale: string }) {
  const t = doc.translations?.[0];
  return (
    <Link href={`/publications/${doc.slug || doc.id}`} className="group block bg-card border border-border hover:border-primary/50 transition-all duration-700">
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          {doc.image ? (
            <Image src={doc.image} alt="Research paper" fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/5 border-b border-border/5">
               <FileText size={100} strokeWidth={0.5} />
            </div>
          )}
          <div className="absolute top-8 left-8">
             <span className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest">
                {doc.type || "Research Paper"}
             </span>
          </div>
       </div>
       <div className="p-10">
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-6">
             <span>{new Date(doc.createdAt).getFullYear()} Edition</span>
             <span className="w-1 h-1 bg-indigo-600 rounded-md" />
             <span className="flex items-center gap-2"><Clock size={12} /> 12 Min Read</span>
          </div>
          <h3 className="text-2xl font-serif font-black text-foreground mb-6 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
             {t?.title || "Research Project"}
          </h3>
          <p className="text-muted-foreground text-sm font-light leading-relaxed line-clamp-3 mb-8">
             {t?.excerpt || t?.description || "Detailed analysis of legal frameworks and societal progress within the African Great Lakes Region."}
          </p>
          <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-6 transition-all">
             View Journal <ArrowRight size={14} />
          </div>
       </div>
    </Link>
  );
}

function ResearchLoading() {
   return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="h-[400px] w-full bg-border/20 animate-pulse mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-[600px] w-full bg-border/20 animate-pulse" />)}
        </div>
      </div>
    </main>
   );
}