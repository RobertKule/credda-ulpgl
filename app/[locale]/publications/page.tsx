// app/[locale]/publications/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Download, Filter, SearchX, Calendar, 
  User2, ArrowRight, BookOpen, Clock, Eye,
  Sparkles, TrendingUp, Layers
} from "lucide-react";
import ClientPdfPreview from "@/components/public/ClientPdfPreview";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxWrapper from "@/components/shared/ParallaxWrapper";
import * as motion from "framer-motion/client";

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

  const availableYears = await db.publication.findMany({
    select: { year: true },
    distinct: ['year'],
    orderBy: { year: 'desc' }
  });

  const years = availableYears.map(y => y.year);

  const whereClause: any = {};
  if (year) whereClause.year = parseInt(year);
  if (domain) whereClause.domain = domain;

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

  const totalPublications = await db.publication.count();
  const totalAuthors = await db.publicationTranslation.groupBy({
    by: ['authors'],
    _count: true
  }).then(res => res.length);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative min-h-[60vh] flex items-center bg-[#050a15] text-white overflow-hidden py-24 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] -ml-64 -mb-64" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-6 py-2 uppercase tracking-[0.3em] text-[10px] font-black shadow-lg backdrop-blur-md mb-8">
                {t('header.badge')}
              </Badge>
              
              <h1 className="text-6xl lg:text-8xl font-serif font-bold leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic font-light block text-3xl lg:text-4xl mb-6">Scientific</span> 
                <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-slate-400 font-light max-w-2xl leading-relaxed"
            >
              {t('header.description')}
            </motion.p>

            {/* Premium Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <BookOpen size={16} />
                  <span className="text-3xl font-serif font-bold text-white">{totalPublications}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{t('header.stats.publications')}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Calendar size={16} />
                  <span className="text-3xl font-serif font-bold text-white">{years.length}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{t('header.stats.years')}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <User2 size={16} />
                  <span className="text-3xl font-serif font-bold text-white">{totalAuthors}+</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{t('header.stats.researchers')}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp size={16} />
                  <span className="text-3xl font-serif font-bold text-white">15k+</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Downloads</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PUBLICATION SECTION --- */}
      {featuredPublication && !year && !domain && (
        <section className="relative -mt-24 z-20 pb-24">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-slate-100"
            >
              <div className="grid lg:grid-cols-12">
                {/* Visual side */}
                <div className="lg:col-span-5 bg-slate-50 p-12 lg:p-20 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-emerald-600/5" />
                  <div className="relative z-10 w-full max-w-sm">
                    <ParallaxWrapper speed={0.05}>
                      <div className="aspect-[3/4] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden bg-white">
                        <ClientPdfPreview url={featuredPublication.pdfUrl} />
                      </div>
                    </ParallaxWrapper>
                    <Badge className="absolute -top-6 -left-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30 border-none">
                      <Sparkles size={14} className="mr-2 inline" /> {t('header.latest')}
                    </Badge>
                  </div>
                </div>
                
                {/* Content side */}
                <div className="lg:col-span-7 p-12 lg:p-20 flex flex-col justify-center space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                      <Calendar size={14} />
                      {featuredPublication.year}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                      <Clock size={14} />
                      15 MIN READ
                    </div>
                  </div>
                  
                  <h2 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.2]">
                    {featuredPublication.translations[0]?.title}
                  </h2>
                  
                  <p className="text-slate-500 text-xl font-light leading-relaxed line-clamp-3">
                    {featuredPublication.translations[0]?.description}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <User2 size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{featuredPublication.translations[0]?.authors}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Lead Researcher</p>
                    </div>
                  </div>
                  
                  <div className="pt-10 flex flex-wrap gap-4">
                    <Link 
                      href={`/publications/${featuredPublication.slug || featuredPublication.id}`}
                      className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group/btn"
                    >
                      Access Full Publication
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <a 
                      href={featuredPublication.pdfUrl}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border border-slate-200 text-slate-900 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3"
                    >
                      <Download size={18} /> PDF Preview
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- REFINED FILTER BAR --- */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Year Filters */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                <Filter size={18} />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                <Link 
                  href="/publications" 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                    !year && !domain 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/10' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {t('filters.all')}
                </Link>
                
                {years.map(y => (
                  <Link 
                    key={y} 
                    href={`/publications?year=${y}`} 
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                      year === y.toString() 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/10' 
                        : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            {/* Domain Filters */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                <Layers size={18} />
              </div>
              <div className="flex gap-2">
                {['RESEARCH', 'CLINICAL'].map(d => (
                  <Link
                    key={d}
                    href={`/publications?${year ? `year=${year}&` : ''}domain=${d}`}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm border ${
                      domain === d
                        ? d === 'RESEARCH' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/10'
                          : 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/10'
                        : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
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

      {/* --- PUBLICATIONS GRID --- */}
      <section className="container mx-auto px-6 py-24">
        {publications.length > 0 ? (
          <div className="space-y-16">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Archive Explorer</p>
                <h3 className="text-2xl font-serif font-bold text-slate-900">
                  {t('filters.results', { count: publications.length })}
                  {year && <span className="text-slate-400"> for {year}</span>}
                </h3>
              </div>
              
              {(year || domain) && (
                <Link 
                  href="/publications" 
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all bg-slate-50 px-4 py-2 rounded-full"
                >
                  <SearchX size={14} />
                  {t('filters.reset')}
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {publications.map((pub, index) => {
                const content = pub.translations[0];
                if (!content) return null;

                return (
                  <motion.div 
                    key={pub.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1 }}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="space-y-6">
                      {/* PDF Preview Container */}
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                        <ClientPdfPreview url={pub.pdfUrl} />
                        <div className="absolute inset-0 bg-blue-900/5 group-hover:opacity-0 transition-opacity" />
                        
                        {/* Domain Badge */}
                        <Badge className={`
                          absolute top-4 left-4 rounded-xl uppercase text-[8px] font-black tracking-widest px-4 py-1.5 border-none shadow-lg
                          ${pub.domain === 'RESEARCH' 
                            ? 'bg-blue-600 text-white shadow-blue-600/20' 
                            : 'bg-emerald-600 text-white shadow-emerald-600/20'
                          }
                        `}>
                          {pub.domain === 'RESEARCH' ? "Research" : "Clinical"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="space-y-4 px-2">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-600" /> {pub.year}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-600" /> 12 MIN</span>
                        </div>

                        <Link href={`/publications/${pub.slug || pub.id}`}>
                          <h4 className="text-xl font-serif font-bold text-slate-900 leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                            {content.title || t('article.noTitle')}
                          </h4>
                        </Link>

                        <div className="flex items-center gap-3 py-3 border-y border-slate-50">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <User2 size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 line-clamp-1">{content.authors}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link 
                            href={`/publications/${pub.slug || pub.id}`}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 group/link"
                          >
                            Details
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                          
                          <a 
                            href={pub.pdfUrl} 
                            target="_blank" 
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all overflow-hidden relative group/dl"
                          >
                            <Download size={16} className="relative z-10" />
                            <motion.div 
                              className="absolute inset-0 bg-blue-600"
                              initial={{ y: "100%" }}
                              whileHover={{ y: 0 }}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- REFINED EMPTY STATE --- */
          <div className="max-w-xl mx-auto py-32 text-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-150" />
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-slate-50 flex items-center justify-center mx-auto relative z-10">
                <SearchX size={48} className="text-slate-200" strokeWidth={1.5} />
              </div>
            </div>
            
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">
              {t('empty.title')}
            </h3>
            
            <p className="text-slate-500 font-light leading-relaxed mb-10">
              No publications match your current filters. Try resetting the filters to explore our full library.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link 
                href="/publications" 
                className="px-10 py-4 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Reset Filters
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}