import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";
import { UnifiedContentForm } from "@/components/admin/UnifiedContentForm";
  
interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { locale, id } = await params;

  // ✅ RÉCUPÉRATION DU CONTENU (ARTICLE OU PUBLICATION)
  const [article, publication] = await Promise.all([
    db.article.findUnique({
      where: { id },
      include: { translations: true, category: { include: { translations: { where: { language: locale } } } } }
    }),
    db.publication.findUnique({
      where: { id },
      include: { translations: true }
    })
  ]);

  const data = article || publication;

  if (!data) {
    notFound();
  }

  const type = article ? "ARTICLE" : "PUBLICATION";

  // ✅ FORMATAGE UNIFIÉ
  const formattedData = {
    id: data.id,
    slug: data.slug,
    domain: data.domain,
    categoryId: (data as any).categoryId || "",
    videoUrl: (data as any).videoUrl || "",
    mainImage: (data as any).mainImage || "",
    published: (data as any).published ?? true,
    year: (data as any).year || new Date().getFullYear(),
    doi: (data as any).doi || "",
    pdfUrl: (data as any).pdfUrl || "",
    translations: data.translations.map((t: any) => ({
      language: t.language,
      title: t.title || "",
      excerpt: t.excerpt || t.description || "",
      content: t.content || ""
    }))
  };

  // Récupérer toutes les catégories pour le formulaire
  const categories = await db.category.findMany({
    include: { translations: { where: { language: locale } } }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/admin/articles" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#C9A84C] uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la liste
      </Link>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-12 shadow-2xl relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A84C]" />
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-black text-slate-900 dark:text-white">Modifier le Contenu</h1>
          <p className="text-slate-500 font-light mt-3 italic text-sm">
            Mise à jour des informations et des traductions.
          </p>
        </div>
        
        <UnifiedContentForm 
          categories={categories} 
          initialData={formattedData}
          isEditing={true}
          initialType={type}
        />
      </div>
    </div>
  );
}