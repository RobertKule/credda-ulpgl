"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    description: string;
    coverImageUrl?: string;
    organizer?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const t = useTranslations("MediaCenter.eventCard");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative aspect-square w-full bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-700 hover:shadow-2xl shadow-black/5 flex flex-col"
    >
      {/* IMAGE SECTION - Occupies half of the square */}
      <div className="relative h-1/2 w-full overflow-hidden">
        <Image
          src={event.coverImageUrl || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1500&auto=format&fit=crop"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        
        {/* CATEGORY BADGE */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-primary/20 backdrop-blur-xl border border-primary/30 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION - Occupies the other half */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-[9px] font-black text-primary/60 tracking-[0.2em] uppercase">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {event.location}
            </span>
          </div>

          <h3 className="text-xl font-serif font-black text-foreground leading-tight group-hover:text-primary transition-colors duration-500 line-clamp-2">
            {event.title}
          </h3>

          <p className="text-muted-foreground/80 text-[11px] font-medium leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="pt-4 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              <User size={12} />
              <span className="truncate max-w-[100px]">{event.organizer || "CREDDA"}</span>
            </div>
            
            <button className="p-2 rounded-full bg-primary/5 group-hover:bg-primary transition-colors duration-500">
              <ArrowUpRight size={14} className="text-primary group-hover:text-primary-foreground transition-colors duration-500" />
            </button>
        </div>
      </div>

      {/* ACCESSORY EFFECTS */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
}
