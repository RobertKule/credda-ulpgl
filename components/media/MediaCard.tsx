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

export default function MediaCard({ media, onClick }: MediaCardProps) {
  const isAlbum = media.files && media.files.length > 1;

  const getThumbnailUrl = (url: string) => {
    if (!url) return "";
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return url;
  };

  const thumbnailUrl = media.thumbnailUrl || getThumbnailUrl(media.url);

  return (
    <motion.div
      layoutId={`media-${media.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-card/40 border border-border/50 hover:border-primary/40 transition-all duration-700 shadow-lg shadow-black/5"
    >
      <Image
        src={thumbnailUrl}
        alt={media.title}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 text-center">
        <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {media.type === "VIDEO" ? (
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          ) : isAlbum ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20">
                <Images size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                Voir l'album
              </span>
            </div>
          ) : (
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
              <ZoomIn size={24} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2">{media.category}</p>
            <h4 className="text-white text-sm font-serif font-bold line-clamp-2 leading-tight">{media.title}</h4>
        </div>
      </div>

      {/* INDICATORS (SMALL) */}
      {isAlbum && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md flex items-center gap-1.5 text-white border border-white/10 group-hover:opacity-0 transition-all duration-500">
          <Images size={14} />
          <span className="text-[10px] font-bold">{media.files?.length}</span>
        </div>
      )}
      {!isAlbum && media.type === "VIDEO" && (
        <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:opacity-0 transition-all duration-500">
          <Film size={18} />
        </div>
      )}

      {/* ACCENT BORDER PRE-HOVER */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out" />
    </motion.div>
  );
}
