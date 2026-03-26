// app/[locale]/admin/gallery/new/page.tsx
import { GalleryForm } from "@/components/admin/gallery/GalleryForm";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/navigation";

export default async function NewGalleryImagePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/admin/gallery" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={14} className="mr-1" /> Retour à la Galerie
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
        
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Ajouter à la Galerie</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-2 italic">
            Téléchargez une image ou utilisez un lien externe pour enrichir la photothèque du CREDDA.
          </p>
        </div>
        
        <GalleryForm />
      </div>
    </div>
  );
}