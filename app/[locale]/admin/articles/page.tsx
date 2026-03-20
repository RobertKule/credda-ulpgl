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

  // ✅ LES DONNÉES SONT RÉCUPÉRÉES CÔTÉ SERVEUR
  const articles = await db.article.findMany({
    include: { 
      category: { include: { translations: { where: { language: locale } } } },
      translations: { where: { language: locale } } 
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ ON PASSE LES DONNÉES AU COMPOSANT CLIENT
  return (
    <div className="space-y-10 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600/10 p-1.5 rounded-lg">
              <Newspaper size={18} className="text-blue-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Scientific Journalism
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Research <span className="text-slate-400 font-light italic">Articles</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your latest research findings, news articles, and clinical updates.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-none shadow-xl transition-all">
            <Link href="/admin/articles/new" className="flex items-center gap-2">
              <Plus size={18} /> New Article
            </Link>
          </Button>
        </div>
      </div>

      <ArticlesClient articles={articles as any} locale={locale} />
    </div>
  );
}