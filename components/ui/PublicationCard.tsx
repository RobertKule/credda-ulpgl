"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { EditorialItem } from "@/types/editorial";
import { useTranslations } from "next-intl";

interface PublicationCardProps {
  doc: EditorialItem;
  locale: string;
  delay?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PublicationCard({ doc, locale, delay = 0 }: PublicationCardProps) {
  const t = useTranslations("ResearchPage.article");
  
  const dateStr = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  }) : "2026";

  const year = doc.createdAt ? new Date(doc.createdAt).getFullYear() : "2026";
  const category = doc.category || (doc.type === 'publication' ? "Publication" : "Recherche");
  const fallbackImage = doc.type === 'publication' ? "/images/library.webp" : "/images/director3.webp";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="group relative flex flex-col h-full bg-background/40 dark:bg-card/20 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden rounded-md"
    >
      {/* Border Animation Lines */}
      <span className="absolute top-0 left-1/2 h-0.5 w-0 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out z-10" />
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out z-10" />
      <span className="absolute left-0 top-1/2 w-0.5 h-0 bg-primary group-hover:h-full group-hover:top-0 transition-all duration-500 ease-out z-10" />
      <span className="absolute right-0 top-1/2 w-0.5 h-0 bg-primary group-hover:h-full group-hover:top-0 transition-all duration-500 ease-out z-10" />

      <Link href={`/publications/${doc.id}`} className="flex flex-col h-full">
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={doc.coverImage || fallbackImage}
            fill
            alt={doc.title || t("noTitle")}
            className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

          {/* Category Badge Floating */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant="emerald" 
              className="px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-emerald/20 bg-emerald/5 backdrop-blur-md"
            >
              {category}
            </Badge>
          </div>

          {/* Type Badge Floating (Publication vs Article) */}
          <div className="absolute top-4 right-4">
            <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-sm border border-white/10 text-[7px] font-bold text-white/70 uppercase tracking-widest">
              {doc.type}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 lg:p-8 flex flex-col flex-1 min-h-[220px]">
          <h4 className="text-lg lg:text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-500 line-clamp-2">
            {doc.title || t("noTitle")}
          </h4>

          <p className="text-[11px] lg:text-xs text-muted-foreground line-clamp-3 font-light leading-relaxed mb-6 italic opacity-70 group-hover:opacity-100 transition-opacity duration-500">
            &ldquo;{doc.excerpt || doc.content?.substring(0, 80) || t("noExcerpt")}...&rdquo;
          </p>

          {/* FOOTER CARD */}
          <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-primary opacity-50" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                {year}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/arrow transition-colors duration-300">
              <span className="opacity-80 group-hover/arrow:opacity-100">{t("readMore") || "Lire plus"}</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={14} className="text-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
