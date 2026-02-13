import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { 
  FileText, Download, User2, Layers, 
  ExternalLink, ArrowLeft, Globe 
} from "lucide-react";
import PdfPreview from "@/components/public/PdfPreview";
import { Badge } from "@/components/ui/badge";

export default async function PublicationDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const pub = await db.publication.findUnique({
    where: { id },
    include: { translations: { where: { language: locale } } }
  });

  if (!pub || pub.translations.length === 0) return notFound();
  const content = pub.translations[0];

  return (
    <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          <Link href="/publications" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-10 transition-all">
            <ArrowLeft size={14} /> Back to Repository
          </Link>

          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Colonne Gauche : Preview & Actions */}
            <div className="lg:col-span-4 space-y-8">
              <div className="aspect-[3/4] bg-white shadow-2xl border border-slate-200 sticky top-32 overflow-hidden">
                <PdfPreview url={pub.pdfUrl} />
              </div>
              <a href={pub.pdfUrl} target="_blank" className="w-full flex items-center justify-center gap-3 bg-blue-900 text-white py-5 font-black uppercase text-xs tracking-widest hover:bg-blue-800 transition-all shadow-xl">
                <Download size={18} /> Download Full PDF
              </a>
            </div>

            {/* Colonne Droite : Metadata & Abstract */}
            <div className="lg:col-span-8 bg-white p-8 md:p-16 shadow-sm border border-slate-100 space-y-10">
              <div className="space-y-4">
                <Badge className="bg-slate-100 text-slate-600 rounded-none uppercase text-[9px] font-black border-none">Scientific Publication</Badge>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 leading-tight">
                  {content.title}
                </h1>
                <div className="pt-4 flex flex-col gap-4 border-t border-slate-50 mt-6">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-900">
                    <User2 size={16} className="text-blue-600" /> {content.authors}
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Layers size={14} /> Published {pub.year}</span>
                    <span className="flex items-center gap-2"><Globe size={14} /> Open Access</span>
                    {pub.doi && <span className="flex items-center gap-2">DOI: {pub.doi}</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 pb-2 border-b-2 border-blue-600 inline-block">Abstract</h3>
                <p className="text-lg text-slate-700 leading-relaxed font-light italic bg-slate-50/50 p-6 border-l-4 border-slate-200">
                  {content.description}
                </p>
              </div>

              <div className="bg-slate-50 p-8 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <FileText size={14} /> How to cite
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  {content.authors} ({pub.year}). {content.title}. CREDDA-ULPGL Scientific Repository. {pub.doi ? `doi:${pub.doi}` : ''}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}