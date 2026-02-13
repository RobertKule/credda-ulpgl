import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, User, Share, Bookmark } from "lucide-react";
import Image from "next/image";

export default async function ResearchDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } },
      category: { include: { translations: { where: { language: locale } } } },
      medias: true
    }
  });

  if (!article || article.domain !== "RESEARCH" || article.translations.length === 0) return notFound();
  const content = article.translations[0];

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Minimaliste Académique */}
      <div className="bg-[#050a15] text-white py-20 lg:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            <Link href="/research" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all">
              <ArrowLeft size={14} /> Back to Research Portal
            </Link>
            <Badge className="bg-blue-600 rounded-none text-[9px] uppercase tracking-[0.3em] font-black py-1">Paper No. {article.id.substring(0, 5)}</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              {content.title}
            </h1>
            <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={14} /> CREDDA Faculty Staff</div>
              <div className="flex items-center gap-2"><Clock size={14} /> 15 Min Reading</div>
              <div className="flex items-center gap-2"><BookOpen size={14} /> {article.category.translations[0]?.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Article */}
      <div className="container mx-auto px-6 -mt-12">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-2xl border border-slate-100">
          <div className="prose prose-slate prose-xl max-w-none font-serif
                          prose-p:text-slate-800 prose-p:leading-relaxed
                          prose-headings:text-slate-950 prose-headings:font-bold
                          prose-strong:text-blue-900
                          whitespace-pre-wrap">
            {content.content}
          </div>

          {/* Share Section */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© CREDDA-ULPGL Research Journal</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-xs font-bold uppercase p-2 border border-slate-100 hover:bg-slate-50 transition-all">
                <Share size={14} /> Share
              </button>
              <button className="flex items-center gap-2 text-xs font-bold uppercase p-2 border border-slate-100 hover:bg-slate-50 transition-all">
                <Bookmark size={14} /> Cite
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}