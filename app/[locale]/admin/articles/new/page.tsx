import { UnifiedContentForm } from "@/components/admin/UnifiedContentForm";
import { db } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/navigation";

export default async function NewArticlePage() {
  const categories = await db.category.findMany({
    include: { translations: true }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Fil d'ariane / Retour */}
      <Link 
        href="/admin/articles" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#C9A84C] uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la liste
      </Link>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-12 shadow-2xl relative overflow-hidden rounded-[3rem]">
        {/* Barre décorative discrète */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A84C]" />
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-black text-slate-900 dark:text-white">Nouveau Contenu Scientifique</h1>
          <p className="text-slate-500 font-light mt-3 italic text-sm">
            Créez un article de recherche ou uploadez une publication PDF multilingue.
          </p>
        </div>
        
        <UnifiedContentForm categories={categories} />
      </div>
    </div>
  );
}