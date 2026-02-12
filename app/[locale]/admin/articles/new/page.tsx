// app/[locale]/admin/articles/new/page.tsx
import { ArticleForm } from "@/components/admin/ArticleForm";
import { db } from "@/lib/db";

export default async function NewArticlePage() {
  // On récupère les catégories depuis la DB pour le select
  const categories = await db.category.findMany();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto">
        <div className="mb-8 px-6">
          <h1 className="text-3xl font-serif font-extrabold text-slate-900">Nouvelle Publication</h1>
          <p className="text-slate-500">Ajoutez un article scientifique ou clinique multilingue.</p>
        </div>
        
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}