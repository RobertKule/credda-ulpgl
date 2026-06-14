"use client";

import React from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    id: string;
    src: string;
    title: string;
    category: string;
    type: "IMAGE" | "VIDEO";
    description?: string;
    files?: { url: string; fileType: string }[];
  } | null;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MediaLightbox({ isOpen, onClose, media, onNext, onPrev }: MediaLightboxProps) {
  const t = useTranslations("MediaCenter.modal");
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0);

  React.useEffect(() => {
    setCurrentFileIndex(0);
  }, [media]);

  if (!media) return null;

  const files = media.files && media.files.length > 0 ? media.files : [{ url: media.src, fileType: media.type }];
  const currentFile = files[currentFileIndex];

  const handleNextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % files.length);
  };

  const handlePrevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const isVideoUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
  };

  const isImage = currentFile.fileType === "IMAGE" && !isVideoUrl(currentFile.url);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
        >
          {/* CLOSE BUTTON */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
          >
            <X size={24} />
          </button>

          {/* MAIN CONTENT */}
          <div className="relative w-full h-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-center overflow-y-auto md:overflow-hidden">
            
            {/* MEDIA DISPLAY */}
            <motion.div 
              layoutId={`media-${media.id}`}
              className="relative flex-1 w-full h-full min-h-[300px] max-h-[60vh] md:max-h-[80vh] rounded-md overflow-hidden bg-black shadow-2xl group"
            >
              {isImage ? (
                <Image
                  src={currentFile.url}
                  alt={media.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <iframe 
                    src={currentFile.url.replace("watch?v=", "embed/")} 
                    className="w-full aspect-video md:h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* UNIFIED NAVIGATION ARROWS */}
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (files.length > 1) handlePrevFile();
                    else if (onPrev) onPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors z-10"
                  title={files.length > 1 ? "Image Précédente" : "Média Précédent"}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (files.length > 1) handleNextFile();
                    else if (onNext) onNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors z-10"
                  title={files.length > 1 ? "Image Suivante" : "Média Suivant"}
                >
                  <ChevronRight size={24} />
                </button>
                {files.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 px-4 py-1.5 rounded-full text-[10px] font-black text-white tracking-widest z-10">
                    {currentFileIndex + 1} / {files.length}
                  </div>
                )}
              </>
            </motion.div>

            {/* INFO PANEL */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-80 flex flex-col gap-6 text-white max-h-[80vh]"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  <Info size={14} />
                  {t("info")}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{media.title}</h2>
                <div className="h-px w-12 bg-primary/40 mb-6" />
                <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
                  {media.description || "Une archive visuelle vivante des activités du CREDDA, documentant l'impact de la recherche et de l'action clinique sur le terrain."}
                </p>

                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-white/30">Catégorie</span>
                    <span className="font-bold text-primary">{media.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-white/30">Type</span>
                    <span className="font-bold">{media.type}</span>
                  </div>
                </div>
              </div>

              {files.length > 1 && (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t border-white/10 pt-6 mt-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Contenu de l'album</p>
                  <div className="grid grid-cols-3 gap-3">
                    {files.map((f: any, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentFileIndex(i)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          currentFileIndex === i ? "border-primary scale-105" : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        {f.fileType === "IMAGE" ? (
                          <Image src={f.url} alt="" fill className="object-cover" />
                        ) : (
                          <video src={f.url} className="w-full h-full object-cover" />
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
