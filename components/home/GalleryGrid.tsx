"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const FALLBACK_IMAGES = [
  { id: "g1",  src: "/images/gallery/conference.webp",          title: "Conférence Régionale" },
  { id: "g2",  src: "/images/gallery/clinic.webp",              title: "Consultation Clinique" },
  { id: "g3",  src: "/images/gallery/library.webp",             title: "Médiathèque" },
  { id: "g4",  src: "/images/gallery/research.webp",            title: "Recherche Terrain" },
  { id: "g5",  src: "/images/gallery/workshop.webp",            title: "Atelier" },
  { id: "g6",  src: "/images/gallery/field.webp",               title: "Terrain" },
  { id: "g7",  src: "/images/gallery/partners.webp",            title: "Partenaires" },
  { id: "g8",  src: "/images/gallery/legal-clinic-session.png", title: "Session Clinique Juridique" },
  { id: "g9",  src: "/images/gallery/research-field.png",       title: "Recherche sur le Terrain" },
  { id: "g10", src: "/images/gallery/conference.webp",          title: "Excellence Académique" },
];

const PAGE_SIZE = 6; // 6 images per "slide"

interface GalleryImage {
  id?: string | number;
  src?: string;
  imageUrl?: string;
  title?: string;
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

  // Normalize
  const allImages = ((images.length > 0 ? images : FALLBACK_IMAGES) as GalleryImage[])
    .slice(0, 10)
    .map((img, idx) => ({
      id:    img.id ?? idx,
      src:   img.src || img.imageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length].src,
      title: img.title || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length].title,
    }));

  const totalPages = Math.ceil(allImages.length / PAGE_SIZE);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const current = allImages.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

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
        {/* Dot indicators */}
        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
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
            {totalCount || allImages.length}+
          </span>
        </div>
      </motion.div>

      {/* Grid — 6 images, 3 cols on desktop, 2 on tablet, 1 on mobile */}
      <div className="overflow-visible relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1] // Custom ease-out expo for fluidity
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-visible"
          >
            {current.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.1 + idx * 0.05, 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  zIndex: 50,
                  boxShadow: "0 20px 48px -8px rgba(0,0,0,0.28)",
                  transition: { duration: 0.3 },
                }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer
                           border border-border/20 dark:border-border/10 bg-card z-0"
                style={{ transformOrigin: "center center" }}
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center"
                />

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Label */}
                <motion.p
                  className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-bold uppercase tracking-widest line-clamp-1 pointer-events-none"
                  initial={{ opacity: 0, y: 4 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  {img.title}
                </motion.p>
              </motion.div>
            ))}
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
          href="/gallery"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          <span>{t("Gallery.cta_view_all") ?? "Voir toute la galerie"}</span>
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
