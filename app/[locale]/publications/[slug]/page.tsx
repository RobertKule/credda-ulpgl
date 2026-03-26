import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Download, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const [article] = (await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE a.slug = ${slug}
    `) as any[];

    if (!article) return { title: "Publication - CREDDA" };
    const t = article.translations?.[0];

    return {
      title: `${t?.title || "Recherche"} | CREDDA-ULPGL`,
      description: t?.excerpt || "Rapport de recherche scientifique du CREDDA.",
    };
  } catch (error) {
    return { title: "Publication - CREDDA" };
  }
}

export default async function PublicationDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const [articleResult] = (await sql`
    SELECT a.*, 
      (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
      (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
    FROM "Article" a
    WHERE a.slug = ${slug}
  `.catch(() => [null])) as any[];

  const article = articleResult;
  if (article) {
    article.category = {
      translations: article.category_translations || []
    };
  }

  if (!article) notFound();
  
  const t = article.translations?.[0];
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "Recent";

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
       <div className="max-w-4xl mx-auto">
          {/* BACK LINK */}
          <Link href="/publications" className="inline-flex items-center gap-2 text-[#C9A84C] text-xs uppercase tracking-widest font-black mb-16 hover:gap-4 transition-all">
            <ArrowLeft size={14} /> Back to Library
          </Link>

          {/* HEADER */}
          <header className="mb-20">
             <div className="flex items-center gap-4 mb-8">
                <span className="px-3 py-1 border border-[#C9A84C]/20 text-[#C9A84C] text-[9px] uppercase tracking-widest font-bold">
                  {(article as any).category?.translations?.[0]?.name || "Research Paper"}
                </span>
                <div className="h-[1px] flex-1 bg-white/5" />
             </div>
             
             <h1 className="text-5xl md:text-7xl font-serif font-black text-[#F5F2EC] leading-[1.1] mb-12">
                {t?.title}
             </h1>

             <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-md bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                      <User size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">Auteur</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">Equipe de Recherche CREDDA</p>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-white/40">
                      <Calendar size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">Publication</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">{date}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-white/40">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">Lecture</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">12 Min</p>
                   </div>
                </div>
             </div>
          </header>

          {/* CONTENT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
             {/* MAIN BODY */}
             <div className="lg:col-span-3">
                <div className="prose prose-invert prose-gold max-w-none">
                   <p className="text-xl text-[#F5F2EC]/60 font-serif italic mb-12 leading-relaxed">
                      {t?.excerpt}
                   </p>
                   
                   <div className="h-[1px] w-full bg-white/5 mb-12" />
                   
                   <div className="text-[#F5F2EC]/80 font-sans font-light leading-loose space-y-8 text-lg">
                      {t?.content ? (
                        <div dangerouslySetInnerHTML={{ __html: t.content }} />
                      ) : (
                        <p>No extended content available for this report at the moment. Please consult the physical library at ULPGL for the full manuscript.</p>
                      )}
                   </div>
                </div>
             </div>

             {/* SIDEBAR */}
             <aside className="lg:col-span-1 space-y-12">
                <div className="bg-[#111110] border border-white/5 p-8">
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-[#C9A84C] mb-8">Actions</h4>
                   <div className="space-y-4">
                      <Button className="w-full bg-[#C9A84C] text-[#0C0C0A] rounded-none py-6 font-black uppercase tracking-widest text-[10px] flex gap-3">
                         <Download size={16} /> PDF Open Archive
                      </Button>
                      <Button variant="outline" className="w-full border-white/10 text-white rounded-none py-6 font-black uppercase tracking-widest text-[10px] flex gap-3 hover:bg-white hover:text-black">
                         <Share2 size={16} /> Share Research
                      </Button>
                   </div>
                </div>

                <div className="p-8 border-l border-[#C9A84C]/20">
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-6">Keywords</h4>
                   <div className="flex flex-wrap gap-2">
                      {["Droit", "Environnement", "RDC", "Justice"].map(tag => (
                        <span key={tag} className="text-[10px] text-[#F5F2EC]/40 hover:text-[#C9A84C] transition-colors cursor-pointer">#{tag}</span>
                      ))}
                   </div>
                </div>
             </aside>
          </div>
       </div>
    </main>
  );
}