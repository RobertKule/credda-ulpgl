// app/[locale]/gallery/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import GalleryClient from "./GalleryClient";
import { Badge } from "@/components/ui/badge";

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: "GalleryPage" });

  const images = await db.galleryImage.findMany({
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  const stats = {
    total: images.length,
    categories: [...new Set(images.map(img => img.category))].length,
    featured: images.filter(img => img.featured).length
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-[#050a15] text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                {t('back')}
              </Link>
            </div>
            <Badge className="bg-blue-600 text-white rounded-none px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-bold">
              {t('badge')}
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
              {t('description')}
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="bg-slate-50 border-b border-slate-100 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{t('stats.total')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{t('stats.categories')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{t('stats.featured')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Component avec la galerie interactive */}
      <GalleryClient images={images} locale={locale} />
    </main>
  );
}