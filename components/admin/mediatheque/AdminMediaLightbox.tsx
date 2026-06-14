"use client";

import React from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MediaItem } from "@/lib/mediatheque/types";

interface AdminMediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  return url;
}

export default function AdminMediaLightbox({
  media,
  onClose,
  onNext,
  onPrev,
}: AdminMediaLightboxProps) {
  return (
    <AnimatePresence>
      {media && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 z-[160] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={24} />
          </button>

          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[160] p-3 text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft size={40} strokeWidth={1.5} />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[160] p-3 text-white/40 hover:text-white transition-colors"
            >
              <ChevronRight size={40} strokeWidth={1.5} />
            </button>
          )}

          <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative flex-1 w-full min-h-[280px] max-h-[60vh] lg:max-h-[75vh] rounded-2xl overflow-hidden bg-black shadow-2xl"
            >
              {media.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.url}
                  alt={media.title}
                  className="w-full h-full object-contain"
                />
              ) : media.source === "EXTERNAL" ? (
                <iframe
                  src={getEmbedUrl(media.url)}
                  className="w-full h-full min-h-[280px] aspect-video"
                  allowFullScreen
                  title={media.title}
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-72 shrink-0 text-white space-y-5"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {media.type === "VIDEO" ? <Video size={14} /> : <ImageIcon size={14} />}
                {media.type === "VIDEO" ? "Vidéo" : "Image"}
                {media.source === "EXTERNAL" && " · Externe"}
              </div>

              <h2 className="text-2xl font-black leading-tight">{media.title}</h2>

              {media.description && (
                <p className="text-white/60 text-sm leading-relaxed">{media.description}</p>
              )}

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase tracking-widest">Catégorie</span>
                  <span className="font-bold text-emerald-400">{media.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase tracking-widest">Date</span>
                  <span className="font-bold">
                    {format(new Date(media.createdAt), "d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                {media.fileSize && (
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-widest">Taille</span>
                    <span className="font-bold">{media.fileSize}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
