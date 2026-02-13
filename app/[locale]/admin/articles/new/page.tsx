import { ArticleForm } from "@/components/admin/ArticleForm";
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
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la liste
      </Link>

      <div className="bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        {/* Barre décorative discrète */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
        
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Nouvelle Publication</h1>
          <p className="text-slate-500 font-light mt-2 italic">
            Remplissez les champs ci-dessous pour publier un contenu multilingue.
          </p>
        </div>
        
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}