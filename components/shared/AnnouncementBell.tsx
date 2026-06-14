"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, X, AlertTriangle, Info, ShieldAlert, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface Announcement {
  id: string;
  content: string;
  title?: string | null;
  level: "INFO" | "WARNING" | "URGENT";
}

const LEVEL_CONFIG = {
  INFO: {
    icon: Info,
    bg: "from-blue-600 to-blue-700",
    light: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800/40",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    label: "Information",
  },
  WARNING: {
    icon: AlertTriangle,
    bg: "from-amber-500 to-amber-600",
    light: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    label: "Avertissement",
  },
  URGENT: {
    icon: ShieldAlert,
    bg: "from-red-600 to-red-700",
    light: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800/40",
    text: "text-red-700 dark:text-red-400",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    label: "Urgent",
  },
};

export default function AnnouncementBell({ announcements }: { announcements: Announcement[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [hasNew, setHasNew] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (announcements.length === 0) return;
    const seen = JSON.parse(localStorage.getItem("seen_announcements") || "[]") as string[];
    const unseen = announcements.filter(a => !seen.includes(a.id));
    setHasNew(unseen.length > 0);
  }, [announcements]);

  const handleOpen = () => {
    setIsOpen(true);
    // Mark all as seen
    const allIds = announcements.map(a => a.id);
    localStorage.setItem("seen_announcements", JSON.stringify(allIds));
    setHasNew(false);
  };

  if (announcements.length === 0) return null;

  const item = announcements[current];
  const config = LEVEL_CONFIG[item?.level] ?? LEVEL_CONFIG.INFO;
  const Icon = config.icon;

  const prev = () => setCurrent(c => (c - 1 + announcements.length) % announcements.length);
  const next = () => setCurrent(c => (c + 1) % announcements.length);

  return (
    <>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        aria-label="Voir les annonces"
        className="relative w-8 h-8 flex items-center justify-center rounded-full bg-muted/40 border border-border/20 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105"
      >
        <Bell size={15} />
        {hasNew && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
        <span className="absolute -top-0.5 -right-0.5 flex">
          <span className={cn(
            "w-2.5 h-2.5 rounded-full border-2 border-background",
            hasNew ? "hidden" : announcements.length > 0 ? "bg-green-500" : ""
          )} />
        </span>
      </button>

      {/* Announcements Modal inside Portal */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-full max-w-md p-4 pointer-events-none"
              >
                <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-border/50 overflow-hidden pointer-events-auto">
                  {/* Modal Header */}
                  <div className={cn("p-5 bg-gradient-to-r text-white relative overflow-hidden", config.bg)}>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                            Annonces Officielles
                          </p>
                          <p className="text-sm font-black">
                            {announcements.length} annonce{announcements.length > 1 ? "s" : ""} active{announcements.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Progress dots */}
                    {announcements.length > 1 && (
                      <div className="relative flex items-center justify-center gap-1.5 mt-4">
                        {announcements.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={cn(
                              "rounded-full transition-all duration-300",
                              i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Announcement Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 space-y-4"
                    >
                      {/* Level badge */}
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", config.badge)}>
                        <Icon size={10} />
                        {config.label}
                      </span>

                      {/* Title */}
                      {item.title && (
                        <h3 className="text-base font-black text-foreground leading-tight">
                          {item.title}
                        </h3>
                      )}

                      {/* Content */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>

                      {/* Counter */}
                      {announcements.length > 1 && (
                        <p className="text-[10px] text-muted-foreground/60 font-mono">
                          {current + 1} / {announcements.length}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation footer */}
                  {announcements.length > 1 && (
                    <div className="px-6 pb-6 flex gap-3">
                      <button
                        onClick={prev}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all"
                      >
                        <ChevronLeft size={14} /> Précédente
                      </button>
                      <button
                        onClick={next}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all"
                      >
                        Suivante <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Single announcement close */}
                  {announcements.length === 1 && (
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all"
                      >
                        Compris
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
