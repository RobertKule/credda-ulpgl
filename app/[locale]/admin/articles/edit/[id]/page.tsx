import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/ArticleForm";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { locale, id } = await params;

  // Récupérer l'article avec ses traductions
  const article = await db.article.findUnique({
    where: { id },
    include: {
      translations: true,
      category: {
        include: {
          translations: { where: { language: locale } }
        }
      }
    }
  });

  if (!article) {
    notFound();
  }

  // ✅ FORMATER LES DONNÉES pour qu'elles correspondent à ce qu'attend ArticleForm
  const formattedArticle = {
    id: article.id,
    slug: article.slug,
    domain: article.domain,
    categoryId: article.categoryId,
    videoUrl: article.videoUrl || "",
    mainImage: article.mainImage || "",
    published: article.published,
    translations: article.translations.map(t => ({
      language: t.language,
      title: t.title || "",
      excerpt: t.excerpt || "",
      content: t.content || ""
    }))
  };

  // Récupérer toutes les catégories pour le formulaire
  const categories = await db.category.findMany({
    include: { 
      translations: { 
        where: { language: locale }
      } 
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/admin/articles" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la liste
      </Link>

      <div className="bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
        
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Modifier l'article</h1>
          <p className="text-slate-500 font-light mt-2 italic">
            Modifiez le contenu de l'article.
          </p>
        </div>
        
        <ArticleForm 
          categories={categories} 
          initialData={formattedArticle} // ✅ Utiliser les données formatées
          isEditing={true}
        />
      </div>
    </div>
  );
}