// app/[locale]/publications/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import {
  Download, User2, ExternalLink, ArrowLeft, Globe, Quote,
  Calendar, Landmark, ArrowRight, Share2, Clock, BookOpen,
  FileText, Award
} from "lucide-react";
import ClientPdfPreview from "@/components/public/ClientPdfPreview";
import { Badge } from "@/components/ui/badge";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import ShareButtons from "@/components/public/ShareButtons";
import CitationButton from "@/components/public/CitationButton";
import { getTranslations } from "next-intl/server";
import * as motion from "framer-motion/client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const pub = await db.publication.findUnique({
      where: { slug: decodeURIComponent(slug) },
      include: { translations: { where: { language: locale } } }
    });

    if (!pub || pub.translations.length === 0) return { title: 'Publication | CREDDA' };
    const content = pub.translations[0];

    return {
      title: `${content.title} | CREDDA-ULPGL`,
      description: content.description.substring(0, 160),
    };
  } catch (error) {
    return { title: 'Publication | CREDDA' };
  }
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'PublicationDetailPage' });

  let pub = null;
  try {
    pub = await db.publication.findUnique({
      where: { slug: decodeURIComponent(slug) },
      include: { 
        translations: { where: { language: locale } } 
      }
    });
  } catch (error) {
    console.error("⚠️ Database connection failed in PublicationDetailPage", error);
  }

  if (!pub || pub.translations.length === 0) notFound();

  const content = pub.translations[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://credda-ulpgl.org';
  const pageUrl = `${baseUrl}/${locale}/publications/${slug}`;

  const rawPdfUrl = pub.pdfUrl
    ? pub.pdfUrl.startsWith("http")
      ? pub.pdfUrl
      : pub.pdfUrl.startsWith("/")
        ? pub.pdfUrl
        : `/${pub.pdfUrl}`
    : "";
  const pdfUrl = rawPdfUrl && !rawPdfUrl.endsWith(".pdf") ? `${rawPdfUrl}.pdf` : rawPdfUrl;

  const citation = t('citation.format', {
    authors: content.authors,
    year: pub.year,
    title: content.title
  });

  let recommendations: any[] = [];
  try {
    recommendations = await db.publication.findMany({
      where: { id: { not: pub.id }, domain: pub.domain },
      include: { translations: { where: { language: locale } } },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("⚠️ Recommendations fetch failed in PublicationDetailPage", error);
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      
      {/* --- 1. PREMIUM DARK HERO --- */}
      <section className="relative bg-[#050a15] text-white pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[120px] -ml-64 -mb-64" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <Link href="/publications" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Archive
              </Link>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-4 py-1.5 uppercase tracking-widest text-[9px] font-black">
                {pub.domain === 'RESEARCH' ? "Research Paper" : "Clinical Report"}
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Published</p>
                    <p className="text-sm font-bold text-slate-200">{pub.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Read Time</p>
                    <p className="text-sm font-bold text-slate-200">15 Minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Impact</p>
                    <p className="text-sm font-bold text-slate-200">Peer Reviewed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. MAIN CONTENT & STICKY SIDEBAR --- */}
      <section className="relative -mt-32 z-20 pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* --- LEFT COL: CONTENT --- */}
            <div className="lg:col-span-8 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-2xl shadow-blue-900/10 border border-slate-100"
              >
                {/* Abstract Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Executive Abstract</h3>
                  </div>
                  
                  <div className="text-2xl font-serif font-light leading-relaxed text-slate-700 italic border-l-4 border-blue-50 px-8 py-4 bg-slate-50 rounded-2xl">
                    {content.description}
                  </div>
                </div>

                {/* Authors Section */}
                <div className="mt-16 pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                      <User2 size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lead Researchers</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{content.authors}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <Landmark size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Affiliation</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">CREDDA - ULPGL Research Hub</p>
                    </div>
                  </div>
                </div>

                {/* Main Content (Markdown) */}
                {content.content && (
                  <div className="mt-20 pt-16 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-12">
                      <div className="h-px w-12 bg-blue-600" />
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Full Publication</h3>
                    </div>
                    
                    <div className="prose prose-slate prose-lg max-w-none 
                                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-950
                                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-light
                                    prose-strong:text-blue-900 prose-strong:font-bold
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-100 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                    prose-img:rounded-[2rem] prose-img:shadow-xl">
                      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {content.content}
                      </Markdown>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* --- RIGHT COL: STICKY ACTIONS --- */}
            <aside className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                
                {/* PDF Preview Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden group"
                >
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 mb-8 relative">
                    <ClientPdfPreview url={pdfUrl} />
                    <div className="absolute inset-0 bg-blue-900/5 group-hover:opacity-0 transition-opacity" />
                  </div>
                  
                  <div className="space-y-4">
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-5 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-600/20 group/dl"
                      >
                        <Download size={18} className="group-hover/dl:animate-bounce" /> 
                        {t('actions.download')}
                      </a>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 px-4 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all">
                        <Share2 size={16} /> Share Now
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 px-4 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all">
                        <FileText size={16} /> Reference
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Citation Box */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-blue-900/5 border border-slate-100 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <Quote size={20} className="text-blue-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {t('citation.title')}
                    </h4>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-600 italic">
                    <p className="text-sm text-slate-600 leading-relaxed font-mono">
                      {citation}
                    </p>
                  </div>
                  
                  <CitationButton citation={citation} />
                </motion.div>

                {/* Share Box */}
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 1, duration: 0.8 }}
                   className="bg-white rounded-[2rem] p-6 border border-slate-100"
                >
                   <ShareButtons title={content.title} url={pageUrl} description={content.description} />
                </motion.div>
              </div>
            </aside>
          </div>

          {/* --- 3. RECOMMENDATIONS SECTION --- */}
          {recommendations.length > 0 && (
            <section className="mt-32 pt-24 border-t border-slate-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Scientific Context</h3>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-950">
                    Related Research
                  </h2>
                </div>
                
                <Link href="/publications" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
                  Explore Full Archive
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recommendations.map((rec, index) => {
                  const recContent = rec.translations[0];
                  if (!recContent) return null;

                  return (
                    <motion.div 
                      key={rec.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="space-y-6">
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                          <ClientPdfPreview url={rec.pdfUrl} />
                          <div className="absolute inset-0 bg-blue-900/5 group-hover:opacity-0 transition-opacity" />
                          
                          <Badge className={`
                            absolute top-4 left-4 rounded-xl uppercase text-[8px] font-black tracking-widest px-4 py-1.5 border-none shadow-lg
                            ${rec.domain === 'RESEARCH' 
                              ? 'bg-blue-600 text-white shadow-blue-600/20' 
                              : 'bg-emerald-600 text-white shadow-emerald-600/20'
                            }
                          `}>
                            {rec.domain === 'RESEARCH' ? "Research" : "Clinical"}
                          </Badge>
                        </div>

                        <div className="space-y-4 px-2">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-600" /> {rec.year}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-600" /> 12 MIN</span>
                          </div>

                          <Link href={`/publications/${rec.slug || rec.id}`}>
                            <h4 className="text-xl font-serif font-bold text-slate-900 leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                              {recContent.title}
                            </h4>
                          </Link>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <Link 
                              href={`/publications/${rec.slug || rec.id}`}
                              className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 group/link"
                            >
                              Read Full Paper
                              <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}