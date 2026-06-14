"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Image as ImageIcon, Video, Play, Eye, Edit3, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MediaItem } from "@/lib/mediatheque/types";
import { cn } from "@/lib/utils";

interface AdminMediaCardProps {
  media: MediaItem;
  index: number;
  onPreview: (media: MediaItem) => void;
  onEdit: (media: MediaItem) => void;
  onDelete: (media: MediaItem) => void;
}

export default function AdminMediaCard({
  media,
  index,
  onPreview,
  onEdit,
  onDelete,
}: AdminMediaCardProps) {
  const formattedDate = format(new Date(media.createdAt), "d MMM yyyy", { locale: fr });

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.thumbnailUrl}
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border",
            media.type === "VIDEO"
              ? "bg-violet-500/20 border-violet-400/30 text-violet-100"
              : "bg-emerald-500/20 border-emerald-400/30 text-emerald-100"
          )}
        >
          {media.type === "VIDEO" ? (
            <>
              <Play size={10} className="fill-current" />
              Video
            </>
          ) : (
            <>
              <ImageIcon size={10} />
              Image
            </>
          )}
        </div>

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4">
          <div className="text-center space-y-1 mb-2">
            <h3 className="text-white text-sm font-bold line-clamp-2">{media.title}</h3>
            <p className="text-white/60 text-xs">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(media)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
              title="Aperçu"
            >
              <Eye size={14} />
              Aperçu
            </button>
            <button
              type="button"
              onClick={() => onEdit(media)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
              title="Modifier"
            >
              <Edit3 size={14} />
              Modifier
            </button>
            <button
              type="button"
              onClick={() => onDelete(media)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-red-100 text-xs font-semibold backdrop-blur-sm transition-colors"
              title="Supprimer"
            >
              <Trash2 size={14} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 truncate">
          {media.category}
        </p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{media.title}</h3>
        {media.fileSize && (
          <p className="text-xs text-slate-500 dark:text-zinc-500">{media.fileSize}</p>
        )}
        {media.type === "VIDEO" && media.source === "EXTERNAL" && (
          <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
            <Video size={12} />
            <span>Lien externe</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
