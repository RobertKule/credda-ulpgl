import React from "react";
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink, 
  Filter,
  Grid,
  List,
  Search
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";

export default async function GalleryAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Gallery");
  // Though "Gallery" section exists for public, we use its keys and custom ones for admin
  
  // Fetch gallery images from DB
  const galleryImages = await db.galleryImage.findMany({
    include: {
      translations: {
        where: { language: locale }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic flex items-center gap-4 text-balance">
             {t("title_highlight") || "Médiathèque"}
             <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1 hidden md:block" />
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 font-medium">{t("description")}</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {locale === "fr" ? "Ajouter une Image" : locale === "en" ? "Add Image" : "Ongeza Picha"}
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={locale === "fr" ? "Rechercher une image..." : locale === "en" ? "Search image..." : "Tafuta picha..."}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-transparent focus:border-indigo-500 outline-none transition-all text-sm"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
               <Filter className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-2" />
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
               <button className="p-2 bg-white dark:bg-zinc-700 shadow-sm rounded-lg text-indigo-600">
                  <Grid className="w-4 h-4" />
               </button>
               <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                  <List className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {galleryImages.length > 0 ? (
          galleryImages.map((image) => (
            <div key={image.id} className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={image.src.startsWith('http') ? image.src : `/api/images?path=${image.src}`} 
                  alt={image.translations?.[0]?.title || "Gallery Image"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button className="p-4 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
                      <ExternalLink className="w-6 h-6" />
                   </button>
                   <button className="p-4 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-2xl text-red-400 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-150">
                      <Trash2 className="w-6 h-6" />
                   </button>
                </div>
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white rounded-full">
                      {image.category}
                   </span>
                </div>
              </div>
              <div className="p-6 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">
                  {image.translations?.[0]?.title || "Sans titre"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-1">
                  {image.translations?.[0]?.description || "Aucune description"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-6 bg-slate-50 dark:bg-zinc-900/50 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
             <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                <ImageIcon className="w-10 h-10 text-slate-300" />
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{locale === "fr" ? "Galerie Vide" : locale === "en" ? "Empty Gallery" : "Matunzio Matupu"}</h2>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">{t("description")}</p>
             </div>
             <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                {locale === "fr" ? "Charger ma première image" : locale === "en" ? "Upload first image" : "Pakia picha ya kwanza"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
