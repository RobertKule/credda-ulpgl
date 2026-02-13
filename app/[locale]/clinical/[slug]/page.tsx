import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Calendar, MapPin, Share2, 
  Download, PlayCircle, ShieldCheck, Info 
} from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { translations: { where: { language: locale } } }
  });
  return { title: `${article?.translations[0]?.title || "Clinique"} | CREDDA-ULPGL` };
}

export default async function ClinicalArticlePage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } },
      category: { include: { translations: { where: { language: locale } } } },
      medias: true
    }
  });

  if (!article || article.domain !== "CLINICAL" || article.translations.length === 0) return notFound();
  const content = article.translations[0];

  return (
    <main className="min-h-screen bg-white mt-3">
      {/* Barre de navigation secondaire */}
      <div className="bg-slate-50 border-b border-slate-100 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/clinical" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-all">
            <ArrowLeft size={14} /> Retour aux actions cliniques
          </Link>
          <div className="flex gap-4">
            <Share2 size={16} className="text-slate-400 cursor-pointer hover:text-emerald-600" />
          </div>
        </div>
      </div>

      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header de l'Expertise */}
            <header className="space-y-6 text-center">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 rounded-none px-4 py-1 uppercase text-[10px] font-black border-none">
                {article.category.translations[0]?.name}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                {content.title}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 font-medium italic">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-emerald-600" /> {new Date(article.createdAt).toLocaleDateString(locale)}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-emerald-600" /> Nord-Kivu, RDC</span>
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-600" /> Rapport Certifié</span>
              </div>
            </header>

            {/* Image ou Vidéo Principale */}
            {article.videoUrl ? (
              <div className="aspect-video bg-slate-900 shadow-2xl relative group">
                <iframe src={article.videoUrl.replace("watch?v=", "embed/")} className="w-full h-full border-none" allowFullScreen />
              </div>
            ) : article.mainImage && (
              <div className="relative h-[500px] w-full shadow-2xl">
                <Image src={article.mainImage} alt={content.title} fill className="object-cover" priority />
              </div>
            )}

            {/* Corps du texte - Typographie Académique */}
            <div className="prose prose-emerald prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900
                            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-light
                            prose-blockquote:border-l-emerald-600 prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-8
                            whitespace-pre-wrap">
              {content.content}
            </div>

            {/* Galerie & Documents Annexes */}
            {article.medias.length > 0 && (
              <section className="pt-12 border-t border-slate-100">
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <Info size={20} className="text-emerald-600" /> Pièces jointes et média
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.medias.map((media) => (
                    <div key={media.id} className="group relative bg-slate-50 border border-slate-100 p-4 transition-all hover:shadow-lg">
                      {media.type === "IMAGE" && (
                        <div className="space-y-3">
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image src={media.url} alt="Gallery" fill className="object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{media.title || "Illustration terrain"}</p>
                        </div>
                      )}
                      {media.type === "DOCUMENT" && (
                        <a href={media.url} target="_blank" className="flex items-center justify-between p-4 bg-white border border-emerald-100 text-emerald-700">
                          <div className="flex items-center gap-3">
                            <Download size={20} />
                            <span className="text-sm font-bold uppercase tracking-tighter">{media.title || "Télécharger l'annexe"}</span>
                          </div>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}