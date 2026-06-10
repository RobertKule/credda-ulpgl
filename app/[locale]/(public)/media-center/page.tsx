// app/[locale]/media-center/page.tsx
import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import MediaCenterHero from "@/components/media/MediaCenterHero";
import MediaCenterExplorer from "@/components/media/MediaCenterExplorer";

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

  // FETCH EVENTS WITH TRANSLATIONS
  const events = (await sql`
    SELECT e.*, 
      (SELECT json_agg(et) FROM "EventTranslation" et WHERE et."eventId" = e.id AND et.language = ${locale}) as translations
    FROM "Event" e
    ORDER BY e.date DESC
  `.catch(() => [])) as any[];

  // FETCH GALLERY IMAGES WITH TRANSLATIONS
  const galleryImages = (await sql`
    SELECT gi.*, 
      (SELECT json_agg(git) FROM "GalleryImageTranslation" git WHERE git."galleryImageId" = gi.id AND git.language = ${locale}) as translations
    FROM "GalleryImage" gi
    ORDER BY gi.order ASC, gi."createdAt" DESC
  `.catch(() => [])) as any[];

  // MAPPING DATA FOR EXPLORER
  const mappedEvents = events.map(e => ({
    ...e,
    title: e.translations?.[0]?.title || e.slug,
    description: e.translations?.[0]?.description,
  }));

  const mappedMedia = galleryImages.map(gi => ({
    ...gi,
    title: gi.translations?.[0]?.title || `Média ${gi.category}`,
    description: gi.translations?.[0]?.description,
    type: (gi.src?.includes("youtube.com") || gi.src?.includes("vimeo.com")) ? "VIDEO" : "IMAGE"
  }));

  const stats = {
    events: events.length,
    media: galleryImages.length,
    videos: mappedMedia.filter(m => m.type === "VIDEO").length
  };

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground relative">
      {/* HERO SECTION - Premium Immersive */}
      <MediaCenterHero stats={stats} />

      {/* EXPLORER SECTION - Filters, Grid, Pagination */}
      <section className="relative py-24 bg-background">
        <MediaCenterExplorer events={mappedEvents} media={mappedMedia} />
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
