"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Play, ZoomIn, Film } from "lucide-react";
import Image from "next/image";

interface MediaCardProps {
  media: {
    id: string;
    src: string;
    title: string;
    category: string;
    type: "IMAGE" | "VIDEO";
  };
  onClick: () => void;
}

export default function MediaCard({ media, onClick }: MediaCardProps) {
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
        src={media.src}
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

      {/* VIDEO INDICATOR (SMALL) */}
      {media.type === "VIDEO" && (
        <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:opacity-0 transition-all duration-500">
          <Film size={18} />
        </div>
      )}

      {/* ACCENT BORDER PRE-HOVER */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out" />
    </motion.div>
  );
}
