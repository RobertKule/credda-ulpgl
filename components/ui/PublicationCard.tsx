"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PublicationCardProps {
  doc: any;
  locale: string;
  delay?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PublicationCard({ doc, locale, delay = 0 }: PublicationCardProps) {
  const t = doc.translations?.[0];
  const date = doc.publishedAt || doc.createdAt ? new Date(doc.publishedAt || doc.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  }) : "Recent";

  const category = doc.category?.translations?.[0]?.name || doc.category || "Research Paper";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="group relative"
    >
      <Link href={`/publications/${doc.slug || doc.id}`} className="block">
        <div className="relative overflow-hidden bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 md:p-10 
                        transition-all duration-500 hover:border-primary/40 hover:bg-card/80 
                        hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2">
          
          {/* TOP DECORATIVE ELEMENT */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <FileText size={22} />
              </div>
              <span className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                {category}
              </span>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground/30 font-mono tracking-tighter">
              {doc.year || new Date(doc.createdAt).getFullYear()}
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {t?.title || "Untitled Research"}
            </h3>
            <p className="text-muted-foreground font-light leading-relaxed line-clamp-3 text-sm md:text-base">
              {t?.excerpt || t?.description || "Access the full research and detailed analysis of this institutional work."}
            </p>
          </div>

          {/* FOOTER */}
          <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
              <Calendar size={14} className="opacity-40" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest group/arrow">
              <span>Read Full Paper</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={16} className="text-primary" />
              </motion.div>
            </div>
          </div>

          {/* BACKGROUND TEXTURE ACCENT */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </Link>
    </motion.div>
  );
}
