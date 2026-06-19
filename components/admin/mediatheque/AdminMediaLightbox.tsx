"use client";

import React from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MediaItem } from "@/lib/mediatheque/types";
import { cn } from "@/lib/utils";

interface AdminMediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

function getEmbedUrl(url: string): string | null {
  // youtube.com/watch?v=ID
  if (url.includes("youtube.com/watch")) {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } catch { return null; }
  }
  // youtu.be/ID
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  }
  // youtube.com/shorts/ID
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("/shorts/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  }
  // vimeo.com/ID
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null;
  }
  return null; // Not an embeddable external URL — use <video> tag
}

export default function AdminMediaLightbox({
  media,
  onClose,
  onNext,
  onPrev,
}: AdminMediaLightboxProps) {
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0);

  React.useEffect(() => {
    setCurrentFileIndex(0);
  }, [media]);

  if (!media) return null;

  const files = media.files && media.files.length > 0 ? media.files : [{ url: media.url, fileType: media.type, thumbnailUrl: media.thumbnailUrl || media.url }];
  const currentFile = files[currentFileIndex];

  const handleNextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % files.length);
  };

  const handlePrevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const isVideoUrl = (url: string) =>
    url?.includes("youtube.com") || url?.includes("youtu.be") || url?.includes("vimeo.com");

  // Pour une vidéo, la vraie URL de lecture est media.url (pas currentFile.url qui peut être la cover)
  const videoPlayUrl = media.type === "VIDEO" ? media.url : currentFile.url;
  const isImage = currentFile.fileType === "IMAGE" && !isVideoUrl(currentFile.url);
  const embedUrl = !isImage ? getEmbedUrl(videoPlayUrl) : null;

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
              title="Album Précédent"
            >
              <ChevronLeft size={40} strokeWidth={1.5} />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[160] p-3 text-white/40 hover:text-white transition-colors"
              title="Album Suivant"
            >
              <ChevronRight size={40} strokeWidth={1.5} />
            </button>
          )}

          <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative flex-1 w-full min-h-[280px] max-h-[60vh] lg:max-h-[75vh] rounded-2xl overflow-hidden bg-black shadow-2xl group"
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentFile.url}
                  alt={media.title}
                  className="w-full h-full object-contain"
                />
              ) : embedUrl ? (
                // Vidéo externe (YouTube / Vimeo) → iframe
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  className="w-full h-full min-h-[280px] aspect-video"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  title={media.title}
                />
              ) : (
                // Vidéo locale → balise video native
                <video
                  key={videoPlayUrl}
                  src={videoPlayUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}

              {files.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevFile}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Média Précédent"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFile}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Média Suivant"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-xs font-bold text-white tracking-widest">
                    {currentFileIndex + 1} / {files.length}
                  </div>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-72 shrink-0 text-white flex flex-col max-h-[75vh]"
            >
              <div className="space-y-5 flex-shrink-0">
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {currentFile.fileType === "VIDEO" ? <Video size={14} /> : <ImageIcon size={14} />}
                  {currentFile.fileType === "VIDEO" ? "Vidéo" : "Image"}
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
                      <span className="text-white/40 uppercase tracking-widest">Taille totale</span>
                      <span className="font-bold">{media.fileSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {files.length > 1 && (
                <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar border-t border-white/10 pt-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Tous les médias de cet album</p>
                  <div className="grid grid-cols-3 gap-2">
                    {files.map((f: { url: string; fileType: string; thumbnailUrl?: string; }, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentFileIndex(i)}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          currentFileIndex === i ? "border-emerald-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                      >
                        {f.fileType === "IMAGE" ? (
                          <img src={f.thumbnailUrl || f.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={f.thumbnailUrl || f.url} className="w-full h-full object-cover" />
                        )}
                        {f.fileType === "VIDEO" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
