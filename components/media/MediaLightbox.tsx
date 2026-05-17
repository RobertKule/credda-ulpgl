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
  } | null;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MediaLightbox({ isOpen, onClose, media, onNext, onPrev }: MediaLightboxProps) {
  const t = useTranslations("MediaCenter.modal");

  if (!media) return null;

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

          {/* NAVIGATION */}
          <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-[110]">
             <button onClick={onPrev} className="p-4 text-white/40 hover:text-white transition-colors">
               <ChevronLeft size={48} strokeWidth={1} />
             </button>
          </div>
          <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-[110]">
             <button onClick={onNext} className="p-4 text-white/40 hover:text-white transition-colors">
               <ChevronRight size={48} strokeWidth={1} />
             </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative w-full h-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-center overflow-y-auto md:overflow-hidden">
            
            {/* MEDIA DISPLAY */}
            <motion.div 
              layoutId={`media-${media.id}`}
              className="relative flex-1 w-full h-full min-h-[300px] max-h-[60vh] md:max-h-[80vh] rounded-md overflow-hidden bg-black shadow-2xl"
            >
              {media.type === "IMAGE" ? (
                <Image
                  src={media.src}
                  alt={media.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <iframe 
                    src={media.src.replace("watch?v=", "embed/")} 
                    className="w-full aspect-video md:h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </motion.div>

            {/* INFO PANEL */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-80 flex flex-col gap-6 text-white"
            >
              <div>
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  <Info size={14} />
                  {t("info")}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{media.title}</h2>
                <div className="h-px w-12 bg-primary/40 mb-6" />
                <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
                  {media.description || "Une archive visuelle vivante des activités du CREDDA, documentant l'impact de la recherche et de l'action clinique sur le terrain."}
                </p>
              </div>

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
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
