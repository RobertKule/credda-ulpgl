"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Images, Loader2, Play, ZoomIn } from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import MediaLightbox from "@/components/media/MediaLightbox";

const PAGE_SIZE = 6;

export interface GalleryImage {
  id?: string | number;
  src?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  type?: "IMAGE" | "VIDEO";
  files?: { url: string; fileType: string; thumbnailUrl?: string; }[];
}

export default function GalleryGrid({
  images = [],
  totalCount = 0,
}: {
  images?: GalleryImage[];
  totalCount?: number;
}) {
  const t = useTranslations("HomePage");
  const [page, setPage] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // Normalize images from backend (no hardcoded fallbacks)
  const allImages = (images as GalleryImage[])
    .filter((img) => img.src || img.imageUrl) // only real images
    .map((img, idx) => {
      const url = img.src || img.imageUrl || "";
      return {
        id: String(img.id ?? idx),
        url: url,
        thumbnailUrl: url,
        source: "LOCAL" as "LOCAL" | "EXTERNAL",
        createdAt: new Date().toISOString(),
        title: img.title || "",
        description: img.description || undefined,
        category: img.category || "",
        type: img.type || "IMAGE",
        files: img.files || []
      };
    });

  const totalPages = Math.ceil(allImages.length / PAGE_SIZE);

  // Auto-rotate every 5s if multiple pages
  useEffect(() => {
    if (totalPages <= 1 || selectedMediaIndex !== null) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages, selectedMediaIndex]);

  // Reset page if images change
  useEffect(() => {
    setPage(0);
  }, [images.length]);

  // Reset page if images change
  useEffect(() => {
    setPage(0);
  }, [images.length]);

  const current = allImages.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const displayTotal = totalCount || allImages.length;

  // Empty state — no data from DB yet
  if (allImages.length === 0) {
    return (
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <Loader2 size={28} className="animate-spin opacity-40" />
          <p className="text-sm font-medium opacity-60">Galerie en cours de chargement…</p>
        </div>
      </div>
    );
  }

  const getThumbnailUrl = (url: string) => {
    if (!url) return "";
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return url;
  };

  return (
    <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10"
      >
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-primary mb-3">
            {t("Gallery.badge") ?? "Médiathèque"}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-foreground leading-tight tracking-tighter">
            {t("Gallery.title")}{" "}
            <span className="text-primary italic">{t("Gallery.title_highlight")}</span>
          </h2>
        </div>

        {/* Page indicators + count */}
        <div className="flex items-center gap-3">
          {totalPages > 1 && Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === page
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
          <span className="ml-2 flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Images size={14} className="text-primary" />
            {displayTotal}+
          </span>
        </div>
      </motion.div>

      {/* Grid — 6 images, 3 cols on desktop, 2 on tablet, 1 on mobile */}
      <div className="overflow-hidden relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {current.map((img, idx) => {
              const isAlbum = img.files && img.files.length > 1;
              const isVideo = img.type === "VIDEO";
              const globalIdx = page * PAGE_SIZE + idx;
              const thumbnailUrl = !isVideo ? img.thumbnailUrl || getThumbnailUrl(img.url) : "";
              return (
              <motion.div
                key={img.id}
                onClick={() => setSelectedMediaIndex(globalIdx)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.05 + idx * 0.06,
                  duration: 0.7,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.04,
                  zIndex: 10,
                  boxShadow: "0 24px 56px -8px rgba(0,0,0,0.3)",
                  transition: { duration: 0.3 },
                }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer
                           border border-border/20 dark:border-border/10 bg-card"
              >
                {isVideo ? (
                  <div className="w-full h-full bg-gradient-to-br from-violet-950 via-slate-900 to-zinc-900 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center shadow-2xl shadow-black/40">
                      <Play size={28} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={thumbnailUrl}
                    alt={img.title || "Galerie CREDDA"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {img.type === "VIDEO" ? (
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                        <Play size={20} className="text-white fill-white ml-1" />
                      </div>
                    ) : isAlbum ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20">
                          <Images size={20} className="text-white" />
                        </div>
                        <span className="text-[9px] font-black uppercase text-white tracking-widest bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">
                          Voir l'album
                        </span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                        <ZoomIn size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Always visible overlay bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Category badge */}
                {img.category && (
                  <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm border border-white/10">
                    {img.category}
                  </span>
                )}

                {/* Indicators (Small) */}
                {isAlbum && (
                  <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md flex items-center gap-1.5 text-white border border-white/10 group-hover:opacity-0 transition-all duration-500">
                    <Images size={12} />
                    <span className="text-[9px] font-bold">{img.files?.length}</span>
                  </div>
                )}

                {/* Title on hover */}
                <motion.p
                  className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-bold uppercase tracking-widest line-clamp-1 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  {img.title}
                </motion.p>
              </motion.div>
            )})}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <Link
          href="/media-center"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          <span>{t("Gallery.cta_view_all") ?? "Voir toute la galerie"}</span>
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </div>
        </Link>
      </motion.div>

      {/* LIGHTBOX */}
      <MediaLightbox 
        isOpen={selectedMediaIndex !== null}
        onClose={() => setSelectedMediaIndex(null)}
        media={selectedMediaIndex !== null ? allImages[selectedMediaIndex] : null}
        onNext={() => setSelectedMediaIndex(prev => prev !== null ? (prev + 1) % allImages.length : null)}
        onPrev={() => setSelectedMediaIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null)}
      />
    </div>
  );
}
