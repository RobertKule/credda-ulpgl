// app/[locale]/admin/articles/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Newspaper } from "lucide-react";
import ArticlesClient from "./ArticlesClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;

  // ✅ RÉCUPÉRATION CONSOLIDÉE
  const [articles, publications] = await Promise.all([
    db.article.findMany({
      include: { 
        category: { include: { translations: { where: { language: locale } } } },
        translations: { where: { language: locale } } 
      },
      orderBy: { createdAt: "desc" },
    }),
    db.publication.findMany({
      include: { 
        translations: { where: { language: locale } } 
      },
      orderBy: { createdAt: "desc" },
    })
  ]);

  // Normaliser pour le client
  const unifiedContent = [
    ...articles.map(a => ({ ...a, __type: 'ARTICLE' })),
    ...publications.map(p => ({ ...p, __type: 'PUBLICATION', published: true })) // Publications considered always live for now or add flag
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ✅ ON PASSE LES DONNÉES AU COMPOSANT CLIENT
  return (
    <div className="space-y-10 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#C9A84C]/10 p-1.5 rounded-lg">
              <Newspaper size={18} className="text-[#C9A84C]" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Scientific Repository
            </span>
          </div>
          <h1 className="text-4xl font-serif font-black text-slate-900 dark:text-white">
            Repository <span className="text-slate-400 font-light italic">Management</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium italic">
            Centralized management for research papers, clinical cases, and PDF publications.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0C0C0A] text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl shadow-xl transition-all active:scale-95">
            <Link href="/admin/articles/new" className="flex items-center gap-2">
              <Plus size={18} /> Nouveau Contenu
            </Link>
          </Button>
        </div>
      </div>

      <ArticlesClient content={unifiedContent as any} locale={locale} />
    </div>
  );
}