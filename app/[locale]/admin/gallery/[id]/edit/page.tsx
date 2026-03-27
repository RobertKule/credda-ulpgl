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
        className="inline-flex items-center text-[10px] font-black text-muted-foreground/40 hover:text-primary uppercase tracking-[0.2em] transition-all group"
      >
        <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à la Photothèque
      </Link>

      <div className="bg-card border border-border p-10 shadow-sm relative overflow-hidden rounded-[3rem] transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-serif font-black text-foreground tracking-tight">Modifier l'image</h1>
          <p className="text-muted-foreground/60 font-medium italic text-sm">
            Mettez à jour les informations et le contenu multilingue de cette ressource visuelle.
          </p>
        </div>
        
        <GalleryForm initialData={image} isEditing={true} />
      </div>
    </div>
  );
}