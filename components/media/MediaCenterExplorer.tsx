"use client";

import React, { useState, useMemo } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, LayoutGrid, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import MediaCard from "./MediaCard";
import MediaLightbox from "./MediaLightbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MediaItem } from "@/lib/mediatheque/types";

type FilterType = "all" | "gallery" | "videos";

interface MediaCenterExplorerProps {
  media: MediaItem[];
}

export default function MediaCenterExplorer({ media }: MediaCenterExplorerProps) {
  const t = useTranslations("MediaCenter");

  const [filter, setFilter] = useState<FilterType>("videos");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [videoPage, setVideoPage] = useState(1);
  const [galleryPage, setGalleryPage] = useState(1);
  const [lightboxList, setLightboxList] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const ITEMS_PER_PAGE = parseInt(itemsPerPage);

  // Normalize media with robust type detection
  const normalizedMedia = useMemo<MediaItem[]>(() => media.map((m, i) => ({
    ...m,
    id: m.id || `m-${i}`,
    type: (
      m.type ||
      (m.coverImageUrl ||
        m.url?.includes('youtube') ||
        m.url?.includes('vimeo') ||
        m.url?.match(/\.(mp4|mov|webm|ogg|mkv)$/i) ||
        (m.files?.some(f => f.fileType === 'VIDEO'))
      )
        ? 'VIDEO'
        : 'IMAGE'
    ) as "VIDEO" | "IMAGE",
    title: m.title || `Media #${i + 1}`,
    category: m.category || 'General',
    // Preserve cover image URL for videos
    coverImageUrl: m.coverImageUrl,
  }) as MediaItem), [media]);

  // Split media into Video Reports and Gallery Images
  const videoReports = useMemo(() => normalizedMedia.filter(m => m.type === "VIDEO"), [normalizedMedia]);
  const galleryImagesOnly = useMemo(() => normalizedMedia.filter(m => m.type === "IMAGE"), [normalizedMedia]);

  const videoTotalPages = Math.ceil(videoReports.length / ITEMS_PER_PAGE);
  const galleryTotalPages = Math.ceil(galleryImagesOnly.length / ITEMS_PER_PAGE);

  const paginatedVideos = useMemo(() => {
    const start = (videoPage - 1) * ITEMS_PER_PAGE;
    return videoReports.slice(start, start + ITEMS_PER_PAGE);
  }, [videoReports, videoPage, ITEMS_PER_PAGE]);

  const paginatedGallery = useMemo(() => {
    const start = (galleryPage - 1) * ITEMS_PER_PAGE;
    return galleryImagesOnly.slice(start, start + ITEMS_PER_PAGE);
  }, [galleryImagesOnly, galleryPage, ITEMS_PER_PAGE]);

  // Pre-load images for lightbox & body scroll lock
  React.useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [lightboxIndex]);

  const Pagination = ({ page, setPage, totalPages }: { page: number, setPage: (p: number | ((prev: number) => number)) => void, totalPages: number }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-16 py-8 border-t border-border/30">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-6 py-3 rounded-md border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-primary disabled:opacity-20 transition-all font-bold uppercase text-[9px] tracking-[0.2em] flex items-center gap-3"
        >
          <ChevronLeft size={14} /> Précédent
        </button>
        
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-md text-[10px] font-bold transition-all duration-300 ${
                page === i + 1 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-6 py-3 rounded-md border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-primary disabled:opacity-20 transition-all font-bold uppercase text-[9px] tracking-[0.2em] flex items-center gap-3"
        >
          Suivant <ChevronRight size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-24">
      {/* FILTER & PAGINATION BAR */}
      <motion.div 
        className="sticky top-28 z-40 mx-auto max-w-5xl w-full px-4"
      >
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-card/40 backdrop-blur-xl px-2 lg:px-10 py-6 rounded-[2rem] lg:rounded-full border border-border/50 shadow-xl shadow-black/10">
            <div className="flex items-center bg-muted/30 p-1 rounded-full border border-border/20">
               {[
                 { id: "all", label: t("filters.all"), icon: LayoutGrid },
                 { id: "videos", label: t("filters.videos"), icon: Play },
                 { id: "gallery", label: t("filters.gallery"), icon: ImageIcon }
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => { setFilter(item.id as FilterType); setVideoPage(1); setGalleryPage(1); }}
                   className={`relative flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                     filter === item.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                   }`}
                 >
                   {filter === item.id && (
                     <motion.div
                       layoutId="activeFilter"
                       className="absolute inset-0 bg-primary rounded-full z-0"
                       transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                     />
                   )}
                   <item.icon size={14} className="relative z-10" />
                   <span className="relative z-10 hidden sm:inline">{item.label}</span>
                 </button>
               ))}
            </div>

            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t("explorer.itemsPerPage")}</span>
               <Select value={itemsPerPage} onValueChange={(val) => { setItemsPerPage(val); setVideoPage(1); setGalleryPage(1); }}>
                 <SelectTrigger className="w-20 lg:w-24 bg-background/50 border-border/30 rounded-full h-11 text-[10px] font-bold uppercase tracking-widest focus:ring-0">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                   {["5", "10", "20", "50"].map(val => (
                     <SelectItem key={val} value={val} className="text-[10px] uppercase font-bold tracking-widest">{val}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
         </div>
      </motion.div>

      {/* VIDEO REPORTS SECTION */}
      {(filter === "all" || filter === "videos") && (
        <section className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16 space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-black">Reportages Vidéo</h2>
            <div className="h-1 w-12 bg-primary/40 rounded-full" />
            <p className="text-muted-foreground/60 text-xs font-bold uppercase tracking-[0.3em]">
              {t("explorer.narrative_videos", { count: videoReports.length })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedVideos.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <MediaCard 
                    media={item} 
                    onClick={() => {
                      setLightboxList(videoReports);
                      setLightboxIndex(videoReports.findIndex(m => m.id === item.id));
                    }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {videoReports.length === 0 && (
            <p className="text-center py-20 text-muted-foreground italic font-serif">Aucun reportage vidéo disponible.</p>
          )}
          <Pagination page={videoPage} setPage={setVideoPage} totalPages={videoTotalPages} />
        </section>
      )}

      {/* SEPARATOR 2 */}
      {filter === "all" && videoReports.length > 0 && galleryImagesOnly.length > 0 && (
        <div className="container mx-auto px-6">
          <div className="relative py-12">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-6">
                <ImageIcon className="h-6 w-6 text-primary/30" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY SECTION */}
      {(filter === "all" || filter === "gallery") && (
        <section className="container mx-auto px-6 pb-32">
          <div className="flex flex-col items-center mb-16 space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-black">{t("explorer.gallery_title")}</h2>
            <div className="h-1 w-12 bg-primary/40 rounded-full" />
            <p className="text-muted-foreground/60 text-xs font-bold uppercase tracking-[0.3em]">
              {t("explorer.narrative_gallery", { count: galleryImagesOnly.length })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedGallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <MediaCard 
                    media={item} 
                    onClick={() => {
                      setLightboxList(galleryImagesOnly);
                      setLightboxIndex(galleryImagesOnly.findIndex(m => m.id === item.id));
                    }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {galleryImagesOnly.length === 0 && (
            <p className="text-center py-20 text-muted-foreground italic font-serif">Aucun média disponible dans la galerie.</p>
          )}
          <Pagination page={galleryPage} setPage={setGalleryPage} totalPages={galleryTotalPages} />
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      <MediaLightbox 
        isOpen={lightboxIndex !== null && lightboxList.length > 0}
        onClose={() => setLightboxIndex(null)}
        media={lightboxIndex !== null && lightboxList.length > 0 ? lightboxList[lightboxIndex] : null}
        onNext={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % lightboxList.length : null)}
        onPrev={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + lightboxList.length) % lightboxList.length : null)}
      />
    </div>
  );
}
