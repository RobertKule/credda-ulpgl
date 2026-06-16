// app/[locale]/media-center/page.tsx
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import MediaCenterHero from "@/components/media/MediaCenterHero";
import MediaCenterExplorer from "@/components/media/MediaCenterExplorer";

interface EventTranslation {
  language: string;
  title: string;
  description: string;
  content: string | null;
  eventId: string;
}

interface Event {
  id: string;
  slug: string;
  date: Date;
  location: string;
  type: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: EventTranslation[] | null;
}

interface GalleryImageTranslation {
  language: string;
  title: string;
  description: string | null;
  galleryImageId: string;
}

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  order: number;
  featured: boolean;
  eventId: string | null;
  createdAt: Date;
  updatedAt: Date;
  translations: GalleryImageTranslation[] | null;
  files?: { url: string; fileType: string }[] | null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t_meta = await getTranslations({ locale, namespace: "MediaCenter.hero" });
  return {
    title: `${t_meta("title")} | CREDDA-ULPGL`,
    description: t_meta("subtitle")
  };
}

export default async function MediaCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // FETCH GALLERY IMAGES WITH TRANSLATIONS
  const galleryImagesData = await db.galleryImage.findMany({
    include: {
      translations: {
        where: { language: locale },
      },
      files: true,
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  const galleryImages = galleryImagesData as unknown as GalleryImage[];

  // MAPPING DATA FOR EXPLORER
  const mappedMedia = galleryImages.map(gi => ({
    id: gi.id,
    title: gi.translations?.[0]?.title || `Média ${gi.category}`,
    description: gi.translations?.[0]?.description || undefined,
    type: ((gi.src?.includes("youtube.com") || gi.src?.includes("youtu.be") || gi.src?.includes("vimeo.com")) ? "VIDEO" : "IMAGE") as "VIDEO" | "IMAGE",
    source: "LOCAL" as "LOCAL" | "EXTERNAL",
    url: gi.src,
    thumbnailUrl: gi.src,
    category: gi.category || "General",
    createdAt: gi.createdAt,
    files: gi.files || []
  }));

  const stats = {
    events: 0,
    media: galleryImages.length,
    videos: mappedMedia.filter(m => m.type === "VIDEO").length
  };

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground relative">
      {/* HERO SECTION - Premium Immersive */}
      <MediaCenterHero stats={stats} />

      {/* EXPLORER SECTION - Filters, Grid, Pagination */}
      <section className="relative py-24 bg-background">
        <MediaCenterExplorer media={mappedMedia} />
      </section>

      {/* INSTITUTIONAL FOOTER ACCENT */}
      <div className="py-24 border-t border-border/50 flex flex-col items-center gap-6 opacity-30">
         <div className="h-16 w-px bg-gradient-to-b from-primary to-transparent" />
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground">
           CREDDA Digital Heritage
         </p>
      </div>
    </main>
  );
}
