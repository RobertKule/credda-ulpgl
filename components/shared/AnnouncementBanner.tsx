"use client";

import React, { useState, useEffect } from "react";
import { X, Info, AlertCircle, ShieldAlert, Megaphone, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnnouncementBannerProps {
  announcement: {
    id: string;
    level: "INFO" | "WARNING" | "URGENT";
    title?: string;
    content: string;
  } | null;
}

export default function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!announcement) return;

    // Vérifier si cette annonce spécifique est marquée comme fermée
    const dismissedAnnouncements = JSON.parse(localStorage.getItem("dismissed_announcements") || "[]");
    if (!dismissedAnnouncements.includes(announcement.id)) {
      setIsVisible(true);
    }
  }, [announcement]);

  if (!announcement || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    const dismissedAnnouncements = JSON.parse(localStorage.getItem("dismissed_announcements") || "[]");
    if (!dismissedAnnouncements.includes(announcement.id)) {
      dismissedAnnouncements.push(announcement.id);
      localStorage.setItem("dismissed_announcements", JSON.stringify(dismissedAnnouncements));
    }
  };

  const config = {
    INFO: {
      bg: "bg-indigo-600",
      text: "text-white",
      icon: Info,
      label: "Information",
      glow: "shadow-indigo-500/50"
    },
    WARNING: {
      bg: "bg-amber-500",
      text: "text-black",
      icon: AlertCircle,
      label: "Attention",
      glow: "shadow-amber-500/50"
    },
    URGENT: {
      bg: "bg-red-600",
      text: "text-white",
      icon: ShieldAlert,
      label: "Urgent",
      glow: "shadow-red-500/50"
    }
  }[announcement.level];

  return (
    <div className={cn(
      "relative z-[100] w-full py-3 px-4 sm:px-6 lg:px-8 transition-all duration-700 animate-in slide-in-from-top ease-out shadow-2xl",
      config.bg,
      config.text,
      config.glow
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-1 px-2.5 rounded-full bg-white/20 backdrop-blur-md hidden sm:flex items-center gap-2">
            <config.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
          </div>
          
          <div className="flex-1 min-w-0 flex items-center gap-2">
            {announcement.title && (
              <span className="font-black text-sm uppercase tracking-tight whitespace-nowrap overflow-hidden border-r border-white/20 pr-2 hidden md:block">
                {announcement.title}
              </span>
            )}
            <p className="text-sm font-bold truncate leading-tight">
              {announcement.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs font-black uppercase tracking-widest group">
            En savoir plus
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={handleDismiss}
            className="p-1.5 hover:bg-black/10 rounded-full transition-all active:scale-90"
            aria-label="Fermer l'annonce"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Decorative pulse glow */}
      <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
    </div>
  );
}
