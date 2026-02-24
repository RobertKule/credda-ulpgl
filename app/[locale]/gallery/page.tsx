import Image from "next/image";
import { getFeaturedGalleryImages } from "@/services/gallery-actions";
import { getTranslations } from "next-intl/server";

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const images = await getFeaturedGalleryImages(50);
  const locale = (await params).locale;
  const t = await getTranslations({ locale: locale, namespace: "HomePage" });

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-4xl font-serif font-bold mb-8 text-slate-900 border-b pb-4">
        {t("Gallery.title").replace(/<[^>]*>?/gm, '') || "Galerie"}
      </h1>

      {images.length === 0 ? (
        <p className="text-slate-500 italic">Aucune image pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider bg-black/50 px-2 py-1 rounded-full">{img.category}</span>
                <p className="text-white text-sm font-semibold mt-2 line-clamp-2">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}