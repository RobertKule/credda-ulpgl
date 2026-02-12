// app/[locale]/research/page.tsx
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { 
  Microscope, 
  SearchX, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  FileText,
  User2,
  Clock,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

// --- SEO DYNAMIQUE ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    fr: "Recherches & Publications | CREDDA-ULPGL",
    en: "Research & Publications | CREDDA-ULPGL",
    sw: "Utafiti na Machapisho | CREDDA-ULPGL"
  };
  
  const descriptions: Record<string, string> = {
    fr: "Découvrez les publications scientifiques du CREDDA-ULPGL sur la démocratie, la gouvernance et le développement en Afrique. Recherches académiques et études de cas.",
    en: "Discover CREDDA-ULPGL scientific publications on democracy, governance and development in Africa. Academic research and case studies.",
    sw: "Gundua machapisho ya kisayansi ya CREDDA-ULPGL kuhusu demokrasia, utawala na maendeleo barani Afrika. Utafiti wa kitaaluma na tafiti za kesi."
  };
  
  return { 
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: 'website',
    }
  };
}

// Fonction pour calculer le temps de lecture estimé
function calculateReadTime(content: string = ''): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ResearchPage' });
  
  // Récupération des articles RESEARCH avec leurs relations
  const articles = await db.article.findMany({
    where: { 
      domain: "RESEARCH",
      published: true 
    },
    include: { 
      category: { 
        include: { 
          translations: { 
            where: { language: locale } 
          } 
        } 
      },
      translations: { 
        where: { language: locale } 
      } 
    },
    orderBy: { createdAt: "desc" },
  });

  // Extraction des catégories uniques pour les filtres (optionnel)
  const categories = articles
    .map(a => a.category)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    .map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.translations[0]?.name || c.slug
    }));

  return (
    <main className="min-h-screen bg-white">
      
      {/* --- HEADER INSTITUTIONNEL (DARK) --- */}
      <header className="relative bg-[#050a15] text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-blue-600 text-white rounded-none px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-bold">
              {t('header.badge')}
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              {t('header.description')}
            </p>
          </div>
        </div>
      </header>

      {/* --- BARRE DE STATUT / FILTRES --- */}
      <nav className="border-b border-slate-100 bg-slate-50/50 sticky top-16 z-30 hidden md:block">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <div className="flex gap-8">
            <Link 
              href="/research" 
              className="text-blue-600 border-b-2 border-blue-600 py-4 hover:text-blue-700 transition-colors"
            >
              {t('filters.all')}
            </Link>
            
            {/* ✅ FILTRES PAR CATÉGORIE - DYNAMIQUES */}
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                href={`/research?category=${cat.slug}`}
                className="hover:text-slate-900 cursor-pointer py-4 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 italic normal-case font-medium text-slate-400">
            <BookOpen size={14} />
            {t('filters.count', { count: articles.length })} {articles.length > 1 ? t('filters.available') : ''}
          </div>
        </div>
      </nav>

      {/* --- GRILLE DES PUBLICATIONS --- */}
      <section className="container mx-auto px-6 py-20">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {articles.map((article) => {
              const translation = article.translations[0];
              const category = article.category.translations[0]?.name || t('article.badge');
              const readTime = calculateReadTime(translation?.content);
              const publishDate = new Date(article.createdAt);
              const year = publishDate.getFullYear();
              const formattedDate = publishDate.toLocaleDateString(locale, { 
                year: 'numeric', 
                month: 'long' 
              });

              return (
                <article key={article.id} className="group flex flex-col h-full">
                  {/* ✅ IMAGE - LIEN VERS L'ARTICLE */}
                  <Link 
                    href={`/research/${article.slug}`} 
                    className="block relative aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-100"
                  >
                    {article.mainImage ? (
                      <Image 
                        src={article.mainImage} 
                        alt={translation?.title || "Research article"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FileText size={40} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>

                  {/* ✅ BADGE CATÉGORIE */}
                  <div className="mt-4 mb-3">
                    <Link href={`/research?category=${article.category.slug}`}>
                      <Badge className="bg-blue-900/90 hover:bg-blue-800 text-white rounded-none text-[9px] uppercase tracking-widest border-none transition-colors cursor-pointer">
                        {category}
                      </Badge>
                    </Link>
                  </div>

                  {/* ✅ DATE AVEC LIEN */}
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <Link 
                      href={`/research?year=${year}`}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <Calendar size={12} className="text-blue-600" />
                      {formattedDate}
                    </Link>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-slate-500">{t('article.paper')}</span>
                  </div>

                  {/* ✅ TITRE */}
                  <Link 
                    href={`/research/${article.slug}`}
                    className="group/title"
                  >
                    <h2 className="text-2xl font-serif font-bold text-slate-950 leading-snug hover:text-blue-700 transition-colors hover:underline decoration-blue-700/30 underline-offset-4">
                      {translation?.title || t('article.noTitle')}
                    </h2>
                  </Link>

                  {/* Auteurs */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                    <User2 size={12} className="text-slate-400" />
                    <span className="font-medium line-clamp-1">{t('article.authors')}</span>
                  </div>

                  {/* Résumé */}
                  {translation?.excerpt ? (
                    <p className="text-slate-500 font-light text-sm line-clamp-3 leading-relaxed mt-3">
                      {translation.excerpt}
                    </p>
                  ) : (
                    <p className="text-slate-400 font-light text-sm italic mt-3">
                      {t('article.noExcerpt')}
                    </p>
                  )}

                  {/* ✅ BOUTON "LIRE LA SUITE" */}
                  <div className="pt-5 mt-auto">
                    <Link 
                      href={`/research/${article.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-blue-900 hover:text-blue-700 transition-all group/btn"
                    >
                      <span>{t('article.readMore')}</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                    
                    {/* ✅ TEMPS DE LECTURE ESTIMÉ */}
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                      <Clock size={12} className="text-slate-300" />
                      <span>{t('article.readingTime', { time: readTime })}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <Link 
                        href={`/api/publications/${article.id}/pdf`}
                        className="text-blue-600 hover:underline"
                      >
                        {t('article.pdf')}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* --- ÉTAT VIDE (EMPTY STATE) AVEC LIENS --- */
          <div className="max-w-2xl mx-auto py-24 text-center border-2 border-dashed border-slate-100 rounded-none">
            <SearchX className="mx-auto text-slate-200 mb-6" size={64} strokeWidth={1} />
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('empty.title')}</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-8">
              {t('empty.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-blue-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all">
                {t('empty.subscribe')}
              </button>
              <Link 
                href="/" 
                className="px-8 py-3 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                {t('empty.backHome')}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* --- FOOTER DE SECTION (CTA) AVEC LIEN --- */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-3xl font-serif font-bold mb-4">{t('cta.title')}</h3>
            <p className="text-slate-400 font-light">
              {t('cta.description')}
            </p>
          </div>
          <Link 
            href="/contact?subject=demande-rendezvous-bibliotheque"
            className="px-10 py-5 bg-blue-600 font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shrink-0 inline-flex items-center gap-2 group"
          >
            <span>{t('cta.button')}</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </main>
  );
}