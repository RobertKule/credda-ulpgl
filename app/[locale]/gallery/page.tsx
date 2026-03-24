// app/[locale]/gallery/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import { Camera, Image as ImageIcon, Filter, Maximize2 } from "lucide-react";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "gallery");
}

export default async function GalleryPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  const images = await sql`
    SELECT gi.*, 
      (SELECT json_agg(t) FROM "GalleryImageTranslation" t WHERE t."galleryImageId" = gi.id AND t.language = ${locale}) as translations
    FROM "GalleryImage" gi
    ORDER BY gi."order" ASC
  `.catch(() => []);

  return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12">
       <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 mb-20 pb-12 border-b border-border/40">
             <div className="max-w-xl">
                <span className="text-[10px] uppercase tracking-[0.6em] font-outfit font-bold text-primary block mb-6">Photothèque</span>
                <h1 className="text-6xl md:text-8xl font-fraunces font-extrabold text-foreground leading-[0.85]">
                   Le CREDDA en <span className="text-primary italic-accent">Action</span>
                </h1>
             </div>
             <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                Archives visuelles de nos recherches, cliniques juridiques et collaborations internationales.
             </p>
          </div>

          {/* MASONRY-LIKE GRID */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {images.length > 0 ? images.map((img: any) => (
               <GalleryItem key={img.id} img={img} />
             )) : (
               <div className="col-span-full py-40 text-center border border-dashed border-border">
                  <p className="text-muted-foreground/30 uppercase font-outfit font-bold tracking-widest text-xs">Galerie en cours de synchronisation</p>
               </div>
             )}
          </div>
       </div>
    </main>
  );
}

function GalleryItem({ img }: { img: any }) {
  const t = img.translations?.[0];
  
  return (
    <div className="relative group overflow-hidden break-inside-avoid bg-card border border-border shadow-xl">
       <img 
          src={img.src} 
          alt={t?.title || "Gallery Image"} 
          className="w-full h-auto grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
          loading="lazy"
       />
       
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                   <ImageIcon size={14} />
                </div>
                <span className="text-[9px] font-outfit font-bold uppercase tracking-widest text-primary">
                  {img.category || "Action"}
                </span>
             </div>
             <h3 className="text-xl font-bricolage font-bold text-white mb-2">
                {t?.title || "CREDDA Action"}
             </h3>
             <p className="text-xs text-white/40 font-outfit font-light line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                {t?.description || "Visual record of institucional activities"}
             </p>
          </div>
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="w-10 h-10 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors cursor-pointer border border-border/10">
                <Maximize2 size={16} />
             </div>
          </div>
       </div>
    </div>
  );
}