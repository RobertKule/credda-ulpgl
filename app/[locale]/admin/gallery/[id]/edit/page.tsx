// app/[locale]/admin/gallery/[id]/edit/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { GalleryForm } from "@/components/admin/gallery/GalleryForm";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryImagePage({ params }: Props) {
  const { id } = await params;
  
  const image = await db.galleryImage.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!image) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/admin/gallery" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la Galerie
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Modifier l'image</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-2 italic">
            Mettez à jour les informations et le contenu multilingue de cette ressource.
          </p>
        </div>
        
        <GalleryForm initialData={image} isEditing={true} />
      </div>
    </div>
  );
}