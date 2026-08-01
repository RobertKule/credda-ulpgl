"use client";

import React from "react";
import { createPortal } from "react-dom";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Film, Images } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/mediatheque/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string | null {
  if (url.includes("youtube.com/watch")) {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } catch { return null; }
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  }
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("/shorts/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  }
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null;
  }
  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  onNext?: () => void;
  onPrev?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MediaLightbox({
  isOpen,
  onClose,
  media,
  onNext,
  onPrev,
}: MediaLightboxProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useTranslations("MediaCenter.modal");
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when media changes
  React.useEffect(() => {
    setIsPlaying(false);
    setCurrentFileIndex(0);
  }, [media]);

  // Keyboard shortcuts and body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight") { handleNextGlobal(); return; }
      if (e.key === "ArrowLeft") { handlePrevGlobal(); return; }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, media, currentFileIndex]);

  if (!media) return null;

  const files =
    media.files && media.files.length > 0
      ? media.files
      : [{ url: media.url, fileType: media.type }];
  const currentFile = files[currentFileIndex];

  // ✅ isVideo based on media.type — videos with a coverImageUrl are still videos
  const isVideo = media.type === "VIDEO";
  const isAlbum = files.length > 1;
  const videoPlayUrl = media.url;
  const embedUrl = isVideo ? getEmbedUrl(videoPlayUrl) : null;

  const handleNextFile = () => {
    setCurrentFileIndex((p) => (p + 1) % files.length);
    setIsPlaying(false);
  };
  const handlePrevFile = () => {
    setCurrentFileIndex((p) => (p - 1 + files.length) % files.length);
    setIsPlaying(false);
  };
  const handleNextGlobal = () => {
    if (files.length > 1) handleNextFile();
    else if (onNext) onNext();
  };
  const handlePrevGlobal = () => {
    if (files.length > 1) handlePrevFile();
    else if (onPrev) onPrev();
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        /*
         * BACKDROP
         * fixed inset-0 = full viewport, no gap anywhere
         * flex flex-col = stack children vertically
         * On md+ we center the card both axes via items-center justify-center
         */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] h-[100dvh] w-screen flex flex-col items-stretch md:items-center md:justify-center bg-background/90 backdrop-blur-xl md:overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* ── Close button ── */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[120] p-2 bg-card/40 hover:bg-card/80 text-foreground/60 hover:text-foreground rounded-full border border-border/50 transition-colors backdrop-blur-md"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>

          {/* ── Desktop prev/next (outside card, vertically centered in the viewport) ── */}
          <button
            type="button"
            onClick={handlePrevGlobal}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-3 bg-card/40 hover:bg-card/80 text-foreground/60 hover:text-foreground rounded-full border border-border/50 transition-all hidden md:flex backdrop-blur-md"
            aria-label="Précédent"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={handleNextGlobal}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-3 bg-card/40 hover:bg-card/80 text-foreground/60 hover:text-foreground rounded-full border border-border/50 transition-all hidden md:flex backdrop-blur-md"
            aria-label="Suivant"
          >
            <ChevronRight size={22} />
          </button>

          {/*
           * CARD
           * Mobile  : w-full flex-1 min-h-0 overflow-y-auto (fills entire screen, scrolls internally)
           * Desktop : strict max-h + overflow-y-auto so card never exceeds viewport
           */}
          <motion.div
            layoutId={`media-${media.id}`}
            className="
              relative flex flex-col
              w-full flex-1 min-h-0 overflow-y-auto overscroll-contain bg-card
              md:flex-none md:h-auto md:max-h-[88vh] md:w-full md:max-w-5xl md:overflow-y-auto
              md:rounded-2xl md:border md:border-border/50 md:shadow-2xl
            "
          >
            {/* ══════════════════════════════════════════════════════
                SECTION 1 — MEDIA VIEWER
                flex-shrink-0 so it never collapses when content below is tall
            ══════════════════════════════════════════════════════ */}
            <div
              className="relative w-full flex-shrink-0 bg-muted/30"
              style={{ height: "56vw", maxHeight: "65vh", minHeight: "300px" }}
            >
              {/* Type badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground text-[10px] font-black uppercase tracking-widest">
                {isVideo ? <Film size={11} /> : <Images size={11} />}
                {isVideo ? "Vidéo" : isAlbum ? `Album · ${files.length}` : "Photo"}
              </div>

              {/* Album counter */}
              {isAlbum && (
                <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground text-[10px] font-black">
                  {currentFileIndex + 1} / {files.length}
                </div>
              )}

              {/* ── VIDEO ── */}
              {isVideo && (
                <>
                  {embedUrl ? (
                    /* External (YouTube / Vimeo) → iframe */
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <iframe
                        key={embedUrl}
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                        title={media.title}
                      />
                    </div>
                  ) : (
                    /* Local video → poster + play */
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      {!isPlaying && (
                        <>
                          {(media.coverImageUrl || media.thumbnailUrl) && (
                            <img
                              src={media.coverImageUrl || media.thumbnailUrl || ""}
                              alt={media.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40" />
                          <button
                            type="button"
                            onClick={() => setIsPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                            aria-label="Lire la vidéo"
                          >
                            <div className="w-20 h-20 rounded-full bg-background/80 backdrop-blur-md border-2 border-border/50 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-background">
                              <Play size={36} className="fill-foreground text-foreground ml-1" />
                            </div>
                          </button>
                        </>
                      )}
                      {isPlaying && (
                        <video
                          key={videoPlayUrl}
                          src={videoPlayUrl}
                          controls
                          autoPlay
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ── IMAGE ── */}
              {!isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {currentFile.url.startsWith("/") ? (
                    <Image
                      src={currentFile.url}
                      alt={media.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 1024px"
                    />
                  ) : (
                    <img
                      src={currentFile.url}
                      alt={media.title}
                      className="w-full h-full object-contain p-4"
                    />
                  )}

                  {/* In-viewer album navigation */}
                  {isAlbum && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevFile}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/60 hover:bg-background text-foreground rounded-full transition-colors z-10 backdrop-blur-sm border border-border/50"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextFile}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/60 hover:bg-background text-foreground rounded-full transition-colors z-10 backdrop-blur-sm border border-border/50"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════
                SECTION 2 — INFO + ALBUM
                Content will push height, causing the whole card to scroll if too long
            ══════════════════════════════════════════════════════ */}
            <div className="flex flex-col flex-1 md:flex-none">

              {/* Info */}
              <div className="flex flex-col gap-3 px-6 py-5">
                <span className="self-start text-[9px] font-black uppercase tracking-[0.25em] text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  {media.category}
                </span>
                <h2 className="text-foreground text-xl md:text-2xl font-serif font-bold leading-snug">
                  {media.title}
                </h2>
                {media.description && (
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">
                    {media.description}
                  </p>
                )}
                {isVideo && isPlaying && !embedUrl && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="self-start mt-1 flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors border border-border/50"
                  >
                    ← Retour à la couverture
                  </button>
                )}
              </div>

              {/* Album thumbnail strip */}
              {isAlbum && (
                <div className="border-t border-border/50 px-6 py-4 overflow-x-auto flex-shrink-0">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Contenu de l&apos;album
                  </p>
                  <div className="flex gap-2 pb-1">
                    {files.map((f: { url: string; fileType: string }, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setCurrentFileIndex(i); setIsPlaying(false); }}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentFileIndex === i
                            ? "border-primary scale-105 shadow-lg shadow-primary/20"
                            : "border-transparent opacity-40 hover:opacity-80"
                        }`}
                        aria-label={`Fichier ${i + 1}`}
                      >
                        {f.fileType === "IMAGE" ? (
                          f.url.startsWith("/") ? (
                            <Image src={f.url} alt="" fill className="object-cover" />
                          ) : (
                            <img src={f.url} alt="" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Play size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════
                SECTION 3 — PREV / NEXT BAR (sticky at bottom)
            ══════════════════════════════════════════════════════ */}
            <div className="flex-shrink-0 flex border-t border-border/50 sticky bottom-0 bg-card z-20">
              <button
                type="button"
                onClick={handlePrevGlobal}
                className="flex-1 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors border-r border-border/50"
              >
                <ChevronLeft size={15} /> Précédent
              </button>
              <button
                type="button"
                onClick={handleNextGlobal}
                className="flex-1 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Suivant <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}
