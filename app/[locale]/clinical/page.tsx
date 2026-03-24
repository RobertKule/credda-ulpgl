// app/[locale]/clinical/page.tsx
import { sql } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  SearchX, 
  Leaf,
  Calendar,
  ChevronRight,
  Gavel,
  FileText,
  Clock
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ClinicalMap from "@/components/clinical/ClinicalMap";

export default async function ClinicalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ClinicalPage' });

  const [fetchedArticles, fetchedSessions]: [any, any] = await Promise.all([
    sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
      FROM "Article" a
      WHERE a.domain = 'CLINICAL' AND a.published = TRUE
      ORDER BY a."createdAt" DESC
    `.catch(() => []),
    sql`
      SELECT * FROM "ClinicSession"
      WHERE date >= ${new Date().toISOString()}
      ORDER BY date ASC
    `.catch(() => [])
  ]);

  const articles = fetchedArticles.map((a: any) => ({
    ...a,
    category: {
      translations: a.category_translations || []
    }
  }));
  const sessions = fetchedSessions;

  return (
    <main className="min-h-screen bg-background">
      
      {/* 1. AUTHORITATIVE HERO */}
      <section className="bg-primary text-white pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 -skew-y-3 translate-y-24 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.4em]">
              <Scale size={18} />
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

      {/* 2. REGISTRY STATUS BAR */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-card border border-border shadow-3xl">
           <div className="p-10 border-r border-border flex items-start gap-6 group hover:bg-muted transition-colors">
              <div className="p-4 bg-secondary/10 text-secondary">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-primary uppercase text-xs tracking-widest">Justice Clinique</h3>
                <p className="text-anthracite/50 text-sm font-light leading-snug">Accès gratuit aux conseils juridiques pour les vulnérables.</p>
              </div>
           </div>
           <div className="p-10 border-r border-border flex items-start gap-6 group hover:bg-muted transition-colors">
              <div className="p-4 bg-secondary/10 text-secondary">
                <Leaf size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-primary uppercase text-xs tracking-widest">Droit de l'Homme</h3>
                <p className="text-muted-foreground text-sm font-light leading-snug">Protection des droits fondamentaux en zones post-conflit.</p>
              </div>
           </div>
           <div className="p-10 flex items-start gap-6 group hover:bg-muted transition-colors">
              <div className="p-4 bg-secondary/10 text-secondary">
                <MapPin size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-primary uppercase text-xs tracking-widest">Cliniques Mobiles</h3>
                <p className="text-anthracite/50 text-sm font-light leading-snug">Intervention directe dans les territoires enclavés.</p>
              </div>
           </div>
        </div>
      </div>

      {/* 3. CASE REGISTRY GRID */}
      <section className="container mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 pb-8 border-b border-light-gray">
           <div className="space-y-4">
              <h2 className="text-4xl font-serif font-black text-primary">Dossiers & Interventions</h2>
              <p className="text-anthracite/40 font-light text-lg">Suivez l'impact de nos cliniques juridiques sur le terrain.</p>
           </div>
           <Button asChild className="bg-primary text-white rounded-none px-10 py-6 font-black uppercase tracking-widest text-[10px] hover:bg-secondary transition-all">
             <Link href="/clinical/environmental" className="flex items-center gap-3">
               Voir la CDE <ArrowRight size={14} />
             </Link>
           </Button>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => {
              const translation = article.translations[0];
              const category = article.category?.translations[0]?.name || "Case Study";
              
              return (
                <article key={article.id} className="group bg-card border border-border flex flex-col hover:border-secondary transition-all">
                  <div className="relative aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    {article.mainImage ? (
                      <Image src={article.mainImage} alt={translation?.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Gavel size={48} strokeWidth={1} />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-primary text-white rounded-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">
                      {category}
                    </Badge>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                       <span className="flex items-center gap-1.5"><Calendar size={12} className="text-secondary" /> {new Date(article.createdAt).toLocaleDateString(locale)}</span>
                    </div>

                    <Link href={`/clinical/${article.slug}`}>
                      <h3 className="text-2xl font-serif font-black text-primary mb-4 group-hover:text-secondary transition-colors leading-[1.2]">
                        {translation?.title}
                      </h3>
                    </Link>

                    <p className="text-anthracite/60 text-sm font-light leading-relaxed line-clamp-3 mb-8">
                       {translation?.excerpt || "Description synthétique de l'issue juridique et de l'impact social de cette intervention clinique."}
                    </p>

                    <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                       <Link 
                         href={`/clinical/${article.slug}`}
                         className="text-[9px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 group/link"
                       >
                         Analyser le cas <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                       </Link>
                       <FileText size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-border bg-card">
             <SearchX size={64} className="mx-auto text-muted-foreground mb-8" strokeWidth={1} />
             <h3 className="text-3xl font-serif font-black text-foreground mb-4">No Active Records</h3>
             <p className="text-muted-foreground font-light max-w-md mx-auto mb-12">
               Our legal registry is being digitalized. For immediate assistance or historical records, please visit our main office.
             </p>
             <Link href="/contact" className="px-12 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-secondary transition-all">
               Request Legal Help
             </Link>
          </div>
        )}
      </section>

      {/* 4. GEOGRAPHIC IMPACT MAP */}
      <section className="bg-background border-y border-border">
        <div className="container mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 space-y-8">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">
                  <MapPin size={14} />
                  <span>Geographic Access</span>
               </div>
               <h2 className="text-4xl font-serif font-black text-foreground leading-tight">
                 Présence sur le <span className="text-blue-600 italic">Terrain</span>.
               </h2>
               <p className="text-muted-foreground font-light text-lg leading-relaxed">
                 Le CREDDA déploie ses experts au plus près des communautés. Nos cliniques fixes et mobiles couvrent les points stratégiques de la région des Grands Lacs.
               </p>
               
               <div className="space-y-6 pt-8">
                  {sessions.length > 0 ? sessions.map((session: any) => (
                    <div key={session.id} className="p-6 border border-border bg-muted flex gap-4">
                       <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{session.location}</p>
                          <span className="text-[10px] font-black uppercase text-secondary tracking-widest">
                            {new Date(session.date).toLocaleDateString(locale)}
                          </span>
                       </div>
                    </div>
                  )) : (
                    <p className="text-sm italic text-anthracite/30">Aucune session mobile planifiée pour le moment.</p>
                  )}
               </div>
            </div>
            <div className="lg:col-span-8">
               <div className="bg-card p-2 border border-border shadow-2xl relative">
                  <ClinicalMap sessions={sessions} />
                  <div className="absolute bottom-6 right-6 z-20 bg-primary px-6 py-4 text-white">
                     <p className="text-[9px] font-black uppercase tracking-[0.3em]">Operational Centers</p>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-serif font-black">{sessions.length}</span>
                        <span className="text-[10px] uppercase text-white/50">Active Zones</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLINICAL CALL TO ACTION */}
      <section className="bg-muted py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="bg-primary p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16">
             <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -skew-x-12 translate-x-1/2 pointer-events-none" />
             <div className="max-w-xl space-y-8 relative z-10 text-center lg:text-left">
                <h3 className="text-4xl lg:text-5xl font-serif font-black text-white italic">
                  Vous avez besoin d'une <span className="text-secondary">assistance juridique ?</span>
                </h3>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                  Notre clinique mobile et nos experts sont à votre disposition pour analyser votre dossier et vous accompagner dans vos démarches.
                </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full lg:w-auto">
                <Button size="lg" className="bg-secondary text-primary rounded-none px-12 h-16 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all transform hover:-translate-y-1">
                  <Link href="/contact">Soumettre un cas</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-secondary/50 text-secondary rounded-none px-12 h-16 font-black uppercase tracking-widest text-[10px] hover:bg-secondary hover:text-primary transition-all">
                  <Link href="/clinical/track">Suivre mon cas</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 text-white rounded-none px-12 h-16 font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-all">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}