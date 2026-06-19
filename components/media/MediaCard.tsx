"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Play, ZoomIn, Film, Images } from "lucide-react";
import Image from "next/image";

import type { MediaItem } from "@/lib/mediatheque/types";

interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
}

/** Extrait la miniature YouTube depuis une URL YT */
function getYoutubeThumbnail(url: string): string | null {
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(ytRegex);
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function MediaCard({ media, onClick }: MediaCardProps) {
  const isAlbum = media.files && media.files.length > 1;
  const isVideo = media.type === "VIDEO";

  // Ordre de priorité pour l'image affichée sur la carte :
  // 1. coverImageUrl (couverture manuelle) pour les vidéos
  // 2. Miniature YouTube auto-générée
  // 3. thumbnailUrl standard
  const resolvedThumbnail: string | null = (() => {
    if (isVideo) {
      if (media.coverImageUrl) return media.coverImageUrl;
      const ytThumb = getYoutubeThumbnail(media.url);
      if (ytThumb) return ytThumb;
    }
    return media.thumbnailUrl || null;
  })();

  return (
    <motion.div
      layoutId={`media-${media.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-card/40 border border-border/50 hover:border-primary/40 transition-all duration-700 shadow-lg shadow-black/5"
    >
      {/* THUMBNAIL / COVER */}
              {resolvedThumbnail ? (
          // If the thumbnail is an external URL (e.g., YouTube video URL), fall back to a plain <img>
          // Next/Image only supports domains listed in next.config.js.
          resolvedThumbnail.startsWith('/') ? (
            <Image
              src={resolvedThumbnail}
              alt={media.title}
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
          ) : (
            <img
              src={resolvedThumbnail}
              alt={media.title}
              className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110"
            />
          )
        ) : isVideo ? (
          /* Placeholder élégant pour les vidéos sans cover */
          <div className="w-full h-full bg-gradient-to-br from-violet-950 via-slate-900 to-zinc-900 flex items-center justify-center">
            <Film size={40} className="text-violet-400/40" />
          </div>
        ) : (
          <div className="w-full h-full bg-muted/30" />
        )}

      {/* PLAY ICON PERMANENT pour les vidéos — visible même sans hover */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <Play size={28} className="fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* OVERLAY au hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 text-center z-20">
        <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {!isVideo && isAlbum && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20">
                <Images size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                Voir l&apos;album
              </span>
            </div>
          )}
          {!isVideo && !isAlbum && (
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
              <ZoomIn size={24} className="text-white" />
            </div>
          )}
        </div>

        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
          <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            {media.category}
          </p>
          <h4 className="text-white text-sm font-serif font-bold line-clamp-2 leading-tight">
            {media.title}
          </h4>
        </div>
      </div>

      {/* BADGE album (coin haut droit) */}
      {isAlbum && (
        <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md flex items-center gap-1.5 text-white border border-white/10 group-hover:opacity-0 transition-all duration-500">
          <Images size={14} />
          <span className="text-[10px] font-bold">{media.files?.length}</span>
        </div>
      )}

      {/* BADGE vidéo (coin haut droit) quand pas d'album */}
      {!isAlbum && isVideo && (
        <div className="absolute top-4 left-4 z-30 px-2.5 py-1 rounded-full bg-violet-600/80 backdrop-blur-md flex items-center gap-1.5 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest">
          <Film size={11} />
          Vidéo
        </div>
      )}

      {/* ACCENT BORDER PRE-HOVER */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-30" />
    </motion.div>
  );
}
