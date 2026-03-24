import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { Link } from "@/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, MapPin, Tag } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const [event] = await sql`
      SELECT e.*, 
        (SELECT json_agg(t) FROM "EventTranslation" t WHERE t."eventId" = e.id AND t.language = ${locale}) as translations
      FROM "Event" e
      WHERE e.slug = ${slug}
    `;
    
    if (!event || !event.isPublished) {
      return { title: "Événement | CREDDA-ULPGL" };
    }
    const title = event.translations?.[0]?.title ?? "";
    return {
      title: `${title} | CREDDA-ULPGL`,
      description: event.translations?.[0]?.description?.slice(0, 160) ?? ""
    };
  } catch (error) {
    return { title: "Événement | CREDDA-ULPGL" };
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  let event: any = null;
  try {
    const [eventResult] = await sql`
      SELECT e.*, 
        (SELECT json_agg(t) FROM "EventTranslation" t WHERE t."eventId" = e.id AND t.language = ${locale}) as translations
      FROM "Event" e
      WHERE e.slug = ${slug}
    `;

    if (!eventResult) {
      notFound(); // Or handle as per your application's error strategy
    }

    const galleryImages = await sql`
      SELECT gi.*, 
        (SELECT json_agg(t) FROM "GalleryImageTranslation" t WHERE t."galleryImageId" = gi.id AND t.language = ${locale}) as translations
      FROM "GalleryImage" gi
      WHERE gi."eventId" = ${eventResult.id}
      ORDER BY gi."order" ASC
    `.catch(() => []);

    event = {
        ...eventResult,
        translations: eventResult.translations || [],
        galleryImages: galleryImages || []
    };
  } catch (error) {
    console.error("⚠️ Database connection failed in EventDetailPage", error);
  }

  if (!event || !event.isPublished) {
    notFound();
  }

  const t = event.translations[0];
  const date = new Date(event.date);
  const htmlContent = t?.content;

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[10px] font-outfit font-bold uppercase tracking-[0.2em] text-[#C9A84C] hover:text-[#E8C97A] mb-12"
        >
          <ArrowLeft size={14} />
          Agenda
        </Link>

        {event.coverImageUrl && (
          <div className="relative aspect-[21/9] w-full overflow-hidden border border-white/5 mb-12 bg-[#111110]">
            <Image
              src={event.coverImageUrl}
              alt={t?.title ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-4 text-[11px] font-outfit text-[#F5F2EC]/60">
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} className="text-[#C9A84C]" />
              {date.toLocaleDateString(locale, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={14} className="text-[#C9A84C]" />
              {date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} className="text-[#C9A84C]" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Tag size={14} className="text-[#C9A84C]" />
              {event.type}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-fraunces font-bold text-[#F5F2EC] leading-tight">
            {t?.title ?? ""}
          </h1>
          {t?.description && (
            <p className="text-lg text-[#F5F2EC]/55 font-outfit leading-relaxed">{t.description}</p>
          )}
        </header>

        {htmlContent &&
          (htmlContent.includes("<") ? (
            <article
              className="max-w-none font-outfit text-[#F5F2EC]/85 mb-16 [&_a]:text-[#C9A84C] [&_h1]:font-fraunces [&_h2]:font-fraunces"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <p className="whitespace-pre-wrap font-outfit text-[#F5F2EC]/80 leading-relaxed mb-16">
              {htmlContent}
            </p>
          ))}

        {event.galleryImages.length > 0 && (
          <section className="border-t border-white/5 pt-12">
            <h2 className="text-sm font-fraunces text-[#C9A84C] mb-6 uppercase tracking-[0.2em]">
              Galerie
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.galleryImages.map((img: any) => {
                const caption = img.translations[0]?.title ?? "";
                return (
                  <figure key={img.id} className="space-y-2">
                    <div className="relative aspect-square overflow-hidden border border-white/5 bg-[#111110]">
                      <Image
                        src={img.src}
                        alt={caption || "CREDDA"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    {caption && (
                      <figcaption className="text-[10px] text-[#F5F2EC]/45 font-outfit">{caption}</figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
