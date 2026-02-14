import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { 
  Download, User2, ExternalLink, ArrowLeft, Globe, Quote,
  Calendar, Landmark,ArrowRight
} from "lucide-react";
import ClientPdfPreview from "@/components/public/ClientPdfPreview";
import { Badge } from "@/components/ui/badge";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import ShareButtons from "@/components/public/ShareButtons";
import CitationButton from "@/components/public/CitationButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const pub = await db.publication.findUnique({
    where: { slug },
    include: { translations: { where: { language: locale } } }
  });

  if (!pub || pub.translations.length === 0) return { title: 'Publication | CREDDA' };
  const content = pub.translations[0];
  
  return {
    title: `${content.title} | CREDDA-ULPGL`,
    description: content.description.substring(0, 160),
  };
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  
  const pub = await db.publication.findUnique({
    where: { slug },
    include: { translations: { where: { language: locale } } }
  });

  if (!pub || pub.translations.length === 0) notFound();
  
  const content = pub.translations[0];
  const pdfUrl = pub.pdfUrl.startsWith('http') ? pub.pdfUrl : (pub.pdfUrl.startsWith('/') ? pub.pdfUrl : `/${pub.pdfUrl}`);
  const citation = `${content.authors} (${pub.year}). « ${content.title} ». CREDDA-ULPGL Scientific Repository.`;

  // Recommandations
  const recommendations = await db.publication.findMany({
    where: { id: { not: pub.id }, domain: pub.domain },
    include: { translations: { where: { language: locale } } },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-white">
      {/* --- 1. TOP NAVIGATION BAR --- */}
      <div className="bg-slate-50 border-b border-slate-100 py-4 sticky top-16 z-40 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/publications" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Retour à la bibliothèque
          </Link>
          <div className="flex items-center gap-6">
            <ShareButtons title={content.title} url={""} description={content.description} />
            <Badge variant="outline" className="rounded-none border-blue-200 text-blue-700 text-[9px] font-black uppercase tracking-tighter">
              {pub.domain} PAPER
            </Badge>
          </div>
        </div>
      </div>

      <article className="py-12 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* --- 2. COLONNE GAUCHE : ACTIONS & PREVIEW (STICKY) --- */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-32 space-y-8">
                {/* Preview Box */}
                <div className="sticky top-2  aspect-[3/4] bg-slate-900 shadow-2xl overflow-hidden group">
                  <ClientPdfPreview url={pdfUrl} />
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Actions Buttons */}
                <div className="space-y-3">
                  <a 
                    href={pdfUrl} 
                    target="_blank" 
                    className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-5 px-6 font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Download size={18} /> Télécharger le PDF
                  </a>
                  
                  
                </div>

                {/* Citation Box (Styled) */}
                <div className="p-6 bg-slate-50 border-l-4 border-blue-600">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <Quote size={12} /> Référence Bibliographique
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono italic mb-4">
                    {citation}
                  </p>
                  <CitationButton citation={citation} />
                </div>
              </div>
            </aside>

            {/* --- 3. COLONNE DROITE : CONTENU SCIENTIFIQUE --- */}
            <div className="lg:col-span-8">
              <header className="space-y-8 mb-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                    <Calendar size={14} />
                    <span>Publication : {pub.year}</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <Globe size={14} />
                    <span>Open Access</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 leading-tight tracking-tight">
                    {content.title}
                  </h1>
                </div>

                {/* Auteurs - Style Academic Listing */}
                <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-6 border-y border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-blue-600">
                      <User2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Chercheur(s) Principal(aux)</p>
                      <p className="text-sm font-bold text-slate-900">{content.authors}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-blue-600">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Affiliation</p>
                      <p className="text-sm font-bold text-slate-900">CREDDA - ULPGL Hub</p>
                    </div>
                  </div>
                </div>
              </header>

              {/* Abstract / Résumé */}
              <section className="mb-16">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-6 flex items-center gap-3">
                   <div className="h-px w-8 bg-blue-600" /> Abstract
                </h3>
                <div className="text-xl font-light leading-relaxed text-slate-700 italic font-serif bg-slate-50 p-8 border-l-4 border-slate-200">
                   {content.description}
                </div>
              </section>

              {/* Contenu Markdown Intégral */}
              {content.content && (
                <section className="prose prose-slate prose-lg max-w-none 
                                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-950
                                    prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-light
                                    prose-strong:text-blue-900 prose-strong:font-bold
                                    border-t border-slate-100 pt-12">
                  <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {content.content}
                  </Markdown>
                </section>
              )}

              {/* Tags / Metadata Footer */}
              <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
                 <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400 px-4 py-1 uppercase text-[10px]">#Démocratie</Badge>
                 <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400 px-4 py-1 uppercase text-[10px]">#RDC</Badge>
                 <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400 px-4 py-1 uppercase text-[10px]">#Gouvernance</Badge>
              </footer>
            </div>
          </div>

          {/* --- 4. SECTION RECOMMANDATIONS --- */}
          {recommendations.length > 0 && (
            <section className="mt-32 pt-20 border-t border-slate-100">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Lectures Complémentaires</h2>
                  <p className="text-3xl font-serif font-bold text-slate-950">Publications Similaires</p>
                </div>
                <Link href="/publications" className="text-[10px] font-black uppercase border-b-2 border-slate-900 pb-1">
                  Explorer la bibliothèque
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {recommendations.map(rec => (
                  <Link 
                    key={rec.id} 
                    href={`/publications/${rec.slug || rec.id}`}
                    className="group bg-slate-50 p-8 hover:bg-blue-600 transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 mb-4 uppercase">{rec.year}</span>
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-white leading-tight mb-4 line-clamp-2">
                        {rec.translations[0]?.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase group-hover:text-white">
                        <span>Consulter</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}