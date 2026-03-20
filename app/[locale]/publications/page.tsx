// app/[locale]/publications/page.tsx
import { db } from "@/lib/db";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";

export default async function PublicationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // FETCH DATA
  const articles = await db.article.findMany({
    where: { published: true },
    include: {
      translations: {
        where: { language: locale }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 12
  }).catch(() => []);

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.5em] font-outfit font-bold text-[#C9A84C] block mb-6">Archive Ouverte</span>
            <h1 className="text-5xl md:text-7xl font-fraunces font-extrabold text-[#F5F2EC] leading-[0.9]">
              Bibliothèque <span className="text-[#C9A84C] italic-accent">Numérique</span>
            </h1>
          </div>
          <p className="text-[#F5F2EC]/40 font-outfit font-light max-w-xs">
            Publications scientifiques, rapports cliniques et études de cas en libre accès.
          </p>
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? articles.map((doc: any) => (
          <PublicationCard key={doc.id} doc={doc} locale={locale} />
        )) : (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10">
             <p className="text-[#F5F2EC]/30 uppercase font-outfit tracking-widest text-[10px] font-bold">Aucune publication disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}

function PublicationCard({ doc, locale }: { doc: any; locale: string }) {
  const t = doc.translations?.[0];
  const date = doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  }) : "Recent";

  return (
    <Link 
      href={`/publications/${doc.slug || doc.id}`}
      className="group block p-8 bg-[#111110] border border-white/5 hover:border-[#C9A84C]/40 transition-all duration-500 relative"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-[#0C0C0A] border border-white/10 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0C0C0A] transition-all duration-500">
          <FileText size={20} />
        </div>
        <span className="text-[9px] uppercase tracking-widest font-outfit font-bold text-[#F5F2EC]/20">
          {doc.category || "Research Paper"}
        </span>
      </div>

      <h3 className="text-2xl font-bricolage font-bold text-[#F5F2EC] mb-6 line-clamp-2 leading-tight group-hover:text-[#C9A84C] transition-colors">
        {t?.title || "Untitled Document"}
      </h3>
      
      <p className="text-sm text-[#F5F2EC]/40 font-outfit font-light line-clamp-3 mb-12 leading-relaxed">
        {t?.description || t?.excerpt || "Click to read the full report and access the detailed analysis of this case."}
      </p>

      <div className="flex items-center justify-between pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-[#F5F2EC]/20 uppercase font-outfit font-bold tracking-widest">
          <Calendar size={12} />
          {date}
        </div>
        <ArrowRight size={14} className="text-[#C9A84C] group-hover:translate-x-2 transition-transform" />
      </div>
    </Link>
  );
}