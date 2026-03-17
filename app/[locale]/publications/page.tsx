// app/[locale]/publications/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Download, Filter, SearchX, Calendar, 
  User2, ArrowRight, BookOpen, Clock, Eye 
} from "lucide-react";
import ClientPdfPreview from "@/components/public/ClientPdfPreview";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxWrapper from "@/components/shared/ParallaxWrapper";

export const metadata: Metadata = {
  title: "Publications | CREDDA-ULPGL",
  description: "Bibliothèque numérique des publications scientifiques et rapports cliniques du CREDDA-ULPGL",
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string; domain?: string }>;
}

export default async function PublicationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { year, domain } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'PublicationsPage' });

  // ✅ Récupérer toutes les années disponibles
  const availableYears = await db.publication.findMany({
    select: { year: true },
    distinct: ['year'],
    orderBy: { year: 'desc' }
  });

  const years = availableYears.map(y => y.year);

  // ✅ Construire la requête avec filtres
  const whereClause: any = {};
  if (year) whereClause.year = parseInt(year);
  if (domain) whereClause.domain = domain;

  // ✅ Récupérer les publications avec leurs traductions
  const allPublications = await db.publication.findMany({
    where: whereClause,
    include: { 
      translations: { 
        where: { language: locale },
        select: {
          title: true,
          authors: true,
          description: true,
          content: true
        }
      } 
    },
    orderBy: [
      { year: "desc" },
      { createdAt: "desc" }
    ]
  });

  const featuredPublication = allPublications[0];
  const publications = allPublications.slice(1);

  // ✅ Statistiques pour l'en-tête
  const totalPublications = await db.publication.count();
  const totalDownloads = 15420; // À remplacer par des stats réelles si disponibles
  const totalAuthors = await db.publicationTranslation.groupBy({
    by: ['authors'],
    _count: true
  }).then(res => res.length);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      
      {/* --- HERO SECTION AVEC STATISTIQUES --- */}
      <section className="relative bg-[#050a15] text-white py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/4" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-blue-600 text-white rounded-none px-4 py-1.5 uppercase tracking-[0.3em] text-[10px] font-black border-none">
              {t('header.badge')}
            </Badge>
            
            <h1 className="text-5xl lg:text-8xl font-serif font-bold leading-tight">
               <span className="italic font-light block text-blue-400 text-3xl lg:text-4xl mb-4">Scientific</span> 
               <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
            
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              {t('header.description')}
            </p>

            {/* Statistiques Minimalistes */}
            <div className="flex flex-wrap justify-center gap-12 pt-12 border-t border-white/10 mt-16">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-serif font-bold text-white">{totalPublications}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-blue-500 font-black mt-2">{t('header.stats.publications')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-serif font-bold text-white">{years.length}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-blue-500 font-black mt-2">{t('header.stats.years')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-serif font-bold text-white">{totalAuthors}+</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-blue-500 font-black mt-2">{t('header.stats.researchers')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PUBLICATION HERO --- */}
      {featuredPublication && !year && !domain && (
        <section className="bg-white py-24 border-b border-slate-100">
           <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                 <div className="lg:col-span-5 bg-slate-50 p-12 border border-slate-100 relative group">
                    <ParallaxWrapper speed={0.1}>
                      <div className="aspect-[3/4] shadow-2xl overflow-hidden relative">
                         <ClientPdfPreview url={featuredPublication.pdfUrl} />
                         <div className="absolute inset-0 bg-blue-900/5 group-hover:opacity-0 transition-opacity" />
                      </div>
                    </ParallaxWrapper>
                    <div className="absolute -top-4 -left-4 bg-blue-600 text-white p-4 font-black uppercase text-[10px] tracking-widest">
                       Latest Paper
                    </div>
                 </div>
                 <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-600" /> {featuredPublication.year}</span>
                       <span className="w-1 h-1 bg-blue-600 rounded-full" />
                       <span className="flex items-center gap-2"><Clock size={14} className="text-blue-600" /> 15 MIN READ</span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
                       {featuredPublication.translations[0]?.title}
                    </h2>
                    <p className="text-slate-500 text-xl font-light leading-relaxed">
                       {featuredPublication.translations[0]?.description}
                    </p>
                    <div className="flex items-center gap-3 pt-4">
                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <User2 size={24} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-900">{featuredPublication.translations[0]?.authors}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Principal Researcher</p>
                       </div>
                    </div>
                    <div className="pt-8 flex gap-6">
                       <Link 
                         href={`/publications/${featuredPublication.slug || featuredPublication.id}`}
                         className="px-10 py-5 bg-blue-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all"
                       >
                         Access Full Journal
                       </Link>
                       <a 
                         href={featuredPublication.pdfUrl}
                         target="_blank"
                         className="px-10 py-5 border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center gap-3"
                       >
                         <Download size={16} /> PDF Preview
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* --- BARRE DE FILTRES AVANCÉE --- */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filtres par année */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <div className="flex gap-2">
                <Link 
                  href="/publications" 
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                    !year && !domain 
                      ? 'bg-blue-900 text-white border-blue-900' 
                      : 'text-slate-500 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                  }`}
                >
                  {t('filters.all')}
                </Link>
                
                {years.map(y => (
                  <Link 
                    key={y} 
                    href={`/publications?year=${y}`} 
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                      year === y.toString() 
                        ? 'bg-blue-900 text-white border-blue-900' 
                        : 'text-slate-500 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filtres par domaine */}
            <div className="flex items-center gap-3">
              <BookOpen size={14} className="text-slate-400 shrink-0" />
              <div className="flex gap-2">
                {['RESEARCH', 'CLINICAL'].map(d => (
                  <Link
                    key={d}
                    href={`/publications?${year ? `year=${year}&` : ''}domain=${d}`}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      domain === d
                        ? d === 'RESEARCH' 
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'text-slate-500 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                    }`}
                  >
                    {d === 'RESEARCH' ? t('filters.domain.research') : t('filters.domain.clinical')}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DES PUBLICATIONS --- */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        {publications.length > 0 ? (
          <div className="space-y-12">
            
            {/* Indicateur de résultats */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">
                {t('filters.results', { count: publications.length })}
                {year && <span className="italic"> {t('filters.filteredBy.year', { year })}</span>}
                {domain && <span className="italic"> {t('filters.filteredBy.domain', { domain: domain === 'RESEARCH' ? t('filters.domain.research') : t('filters.domain.clinical') })}</span>}
              </p>
              
              {(year || domain) && (
                <Link 
                  href="/publications" 
                  className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('filters.reset')}
                </Link>
              )}
            </div>

            {/* Grille des cartes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {publications.map((pub, index) => {
                const content = pub.translations[0];
                if (!content) return null;

                return (
                  <div 
                    key={pub.id} 
                    className="group bg-white border border-slate-200 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Aperçu PDF */}
                    <div className="w-full md:w-56 h-72 shrink-0 bg-slate-50 border-r border-slate-200">
                      <ClientPdfPreview url={pub.pdfUrl} />
                    </div>

                    {/* Contenu */}
                    <div className="p-6 lg:p-8 flex flex-col justify-between flex-1">
                      <div className="space-y-4">
                        {/* En-tête avec badge et année */}
                        <div className="flex justify-between items-start">
                          <Badge 
                            className={`
                              rounded-none uppercase text-[8px] font-black tracking-widest px-2 py-1
                              ${pub.domain === 'RESEARCH' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }
                            `}
                          >
                            {pub.domain === 'RESEARCH' ? t('article.badge.research') : t('article.badge.clinical')}
                          </Badge>
                          <span className="text-xs font-serif italic text-slate-400">
                            {pub.year}
                          </span>
                        </div>

                        {/* Titre avec lien */}
                        <Link 
                          href={`/publications/${pub.slug || pub.id}`}
                          className="block group/link"
                        >
                          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                            {content.title || t('article.noTitle')}
                          </h2>
                        </Link>

                        {/* Auteurs */}
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <User2 size={14} className="text-blue-600 shrink-0" />
                          <span className="font-medium line-clamp-1">{content.authors || t('article.authors')}</span>
                        </div>

                        {/* Résumé */}
                        <p className="text-sm text-slate-500 font-light line-clamp-2 leading-relaxed">
                          {content.description || t('article.noDescription')}
                        </p>

                        {/* Métadonnées supplémentaires */}
                        <div className="flex items-center gap-4 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {t('article.readingTime', { time: '12' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {t('article.views', { count: '1.2k' })}
                          </span>
                          {pub.doi && (
                            <span className="font-mono">{t('article.doi', { doi: pub.doi })}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-6 mt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Bouton téléchargement */}
                            <a 
                              href={pub.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-900 hover:text-blue-700 transition-all group/btn"
                            >
                              <Download size={14} className="group-hover/btn:animate-bounce" />
                              <span>{t('article.pdf')}</span>
                            </a>

                            {/* Lien détails */}
                            <Link 
                              href={`/publications/${pub.slug || pub.id}`}
                              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-all group/link"
                            >
                              <span>{t('article.details')}</span>
                              <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>

                          {/* Métriques */}
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-slate-300">
                              {pub.id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- ÉTAT VIDE --- */
          <div className="max-w-2xl mx-auto py-24 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
              <SearchX size={80} className="mx-auto text-slate-300 relative z-10" strokeWidth={1} />
            </div>
            
            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-8 mb-4">
              {t('empty.title')}
            </h3>
            
            <p className="text-slate-500 font-light leading-relaxed mb-8 max-w-md mx-auto">
              {year && domain 
                ? t('empty.description.yearDomain', { 
                    domain: domain === 'RESEARCH' ? t('filters.domain.research') : t('filters.domain.clinical'),
                    year 
                  })
                : year 
                ? t('empty.description.year', { year })
                : domain
                ? t('empty.description.domain', { 
                    domain: domain === 'RESEARCH' ? t('filters.domain.research') : t('filters.domain.clinical')
                  })
                : t('empty.description.default')
              }
            </p>
            
            <div className="flex justify-center gap-4">
              <Link 
                href="/publications" 
                className="px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                {t('empty.button1')}
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                {t('empty.button2')}
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}