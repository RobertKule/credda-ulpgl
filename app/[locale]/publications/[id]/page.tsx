// app/[locale]/publications/[id]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { 
  FileText, Download, User2, Layers, 
  ExternalLink, ArrowLeft, Globe, Quote
} from "lucide-react";
import PdfPreview from "@/components/public/PdfPreview";
import { Badge } from "@/components/ui/badge";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import ShareButtons from "@/components/public/ShareButtons";
import CitationButton from "@/components/public/CitationButton";

// 📌 GÉNÉRATION DES MÉTADONNÉES SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const pub = await db.publication.findUnique({
    where: { id },
    include: { translations: { where: { language: locale } } }
  });

  if (!pub || pub.translations.length === 0) return { title: 'Publication non trouvée' };

  const content = pub.translations[0];
  
  return {
    title: `${content.title} | CREDDA-ULPGL`,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'article',
      publishedTime: pub.createdAt.toISOString(),
      authors: content.authors.split(','),
      tags: [pub.domain, pub.year.toString()],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    }
  };
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
    
  const publication = await db.publication.findUnique({
    where: { id }
  });

  if (!publication) {
    notFound(); // 👈 Redirige vers la page 404
  }
  const pub = await db.publication.findUnique({
    where: { id },
    include: { 
      translations: { where: { language: locale } }
    }
  });

  if (!pub || pub.translations.length === 0) return notFound();
  
  const content = pub.translations[0];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publicationUrl = `${baseUrl}/${locale}/publications/${pub.id}`;
  
  // ✅ URL CORRIGÉE pour les PDF
  const pdfUrl = pub.pdfUrl.startsWith('http') 
    ? pub.pdfUrl 
    : `/${pub.pdfUrl.replace(/^\//, '')}`;

  // ✅ Citation formatée
  const citation = `${content.authors} (${pub.year}). « ${content.title} ». CREDDA-ULPGL Scientific Repository.${pub.doi ? ` doi:${pub.doi}` : ''}`;

  return (
    <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* 🔙 Navigation avec boutons de partage */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <Link 
              href="/publications" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Retour aux publications
            </Link>
            
            {/* 📤 Boutons de partage - Client Component */}
            <ShareButtons 
              title={content.title}
              url={publicationUrl}
              description={content.description.substring(0, 160)}
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* 📘 Colonne Gauche : Preview & Actions */}
            <div className="lg:col-span-4 space-y-8">
              <div className="aspect-[3/4] bg-white shadow-2xl border border-slate-200 sticky top-32 overflow-hidden group">
                <PdfPreview url={pdfUrl} />
              </div>
              
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-blue-900 text-white py-5 font-black uppercase text-xs tracking-widest hover:bg-blue-800 transition-all shadow-xl group"
              >
                <Download size={18} className="group-hover:animate-bounce" />
                Télécharger le PDF
              </a>
              
              {pub.doi && (
                <a 
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-700 py-4 font-bold uppercase text-xs tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  <ExternalLink size={14} />
                  Voir sur DOI.org
                </a>
              )}
            </div>

            {/* 📄 Colonne Droite : Métadonnées & Contenu */}
            <div className="lg:col-span-8 bg-white p-8 md:p-16 shadow-sm border border-slate-100 space-y-10">
              
              {/* 🏷️ En-tête */}
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <Badge className="bg-slate-100 text-slate-600 rounded-none uppercase text-[9px] font-black border-none px-3 py-1.5">
                    Publication {pub.domain === 'RESEARCH' ? 'Scientifique' : 'Clinique'}
                  </Badge>
                  <span className="text-xs font-serif italic text-slate-400">
                    Version numérique
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 leading-tight">
                  {content.title}
                </h1>
                
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  {/* Auteurs */}
                  <div className="flex items-start gap-3 text-base text-slate-900">
                    <User2 size={18} className="text-blue-600 shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Auteur{content.authors.includes(',') ? 's' : ''}
                      </span>
                      <span className="font-medium">{content.authors}</span>
                    </div>
                  </div>
                  
                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5">
                      <Layers size={14} className="text-blue-600" />
                      Publié en {pub.year}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5">
                      <Globe size={14} className="text-green-600" />
                      Libre accès
                    </span>
                    {pub.doi && (
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 font-mono">
                        DOI: {pub.doi}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 📝 Résumé */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 pb-2 border-b-2 border-blue-600 inline-block">
                  Résumé
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-light italic bg-slate-50/80 p-6 border-l-4 border-blue-600/50">
                    {content.description}
                  </p>
                </div>
              </div>

              {/* 📖 Contenu Markdown */}
              {content.content && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 pb-2 border-b-2 border-slate-200 inline-block">
                    Texte intégral
                  </h3>
                  <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {content.content}
                    </Markdown>
                  </div>
                </div>
              )}

              {/* 📚 Citation académique */}
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 space-y-4 border border-slate-200 mt-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Quote size={14} className="text-blue-600" />
                  Comment citer cette publication
                </h4>
                <div className="relative">
                  <p className="text-sm text-slate-600 leading-relaxed font-mono bg-white p-4 border border-slate-100 italic">
                    {content.authors} ({pub.year}). <span className="font-bold not-italic">« {content.title} »</span>. 
                    CREDDA-ULPGL Scientific Repository. 
                    {pub.doi ? ` doi:${pub.doi}` : ''}
                  </p>
                  <CitationButton citation={citation} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}