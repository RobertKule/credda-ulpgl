"use client";

import React, { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Announcement {
  id: string;
  content: string;
  title?: string | null;
  level: "INFO" | "WARNING" | "URGENT";
}

export default function FooterTickerBar({ announcements }: { announcements: Announcement[] }) {
  const [visible, setVisible] = useState(false);
  const active = announcements.filter(Boolean);

  useEffect(() => {
    if (active.length === 0) return;
    
    // Check if the latest announcement was dismissed
    const latestId = active[0].id;
    const dismissed = localStorage.getItem(`dismissed-ticker-${latestId}`);
    if (!dismissed) {
      setVisible(true);
    }
  }, [announcements]);

  const handleDismiss = () => {
    if (active.length > 0) {
      localStorage.setItem(`dismissed-ticker-${active[0].id}`, "true");
    }
    setVisible(false);
  };

  if (!visible || active.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-0 left-0 right-0 w-full bg-emerald-700/95 dark:bg-zinc-950/95 text-white backdrop-blur-xl border-t border-emerald-500/30 dark:border-zinc-800/80 z-[120] shadow-[0_-12px_40px_rgba(0,0,0,0.25)]"
        >
          {/* Subtle animated light ray overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-white/5 to-emerald-600/0 pointer-events-none z-10" />

          <div className="flex items-center h-10 relative">
            {/* Left badge selector */}
            <div className="shrink-0 flex items-center gap-2 px-5 h-full bg-black/10 dark:bg-white/5 border-r border-white/10 z-20">
              <Megaphone size={13} className="text-emerald-300 dark:text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100">
                Actus
              </span>
            </div>

            {/* Marquee Ticker */}
            <div className="flex-1 overflow-hidden relative z-10">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: Math.max(20, active.length * 15),
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="flex items-center whitespace-nowrap gap-12 text-xs font-semibold w-max px-6"
              >
                {/* Double the list to support perfect loop */}
                {[...active, ...active].map((ann, i) => {
                  const isUrgent = ann.level === "URGENT";
                  const isWarning = ann.level === "WARNING";
                  
                  return (
                    <span key={`${ann.id}-${i}`} className="flex items-center gap-3.5">
                      {/* Priority bullet indicator */}
                      <span className={cn(
                        "w-2 h-2 rounded-full inline-block shrink-0",
                        isUrgent && "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
                        isWarning && "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
                        !isUrgent && !isWarning && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                      )} />

                      {ann.title && (
                        <span className={cn(
                          "font-black tracking-tight uppercase text-[11px]",
                          isUrgent ? "text-rose-200" : isWarning ? "text-amber-200" : "text-emerald-200"
                        )}>
                          {ann.title} :
                        </span>
                      )}
                      
                      <span className={cn(
                        "font-medium text-white/90",
                        isUrgent && "font-bold"
                      )}>
                        {ann.content}
                      </span>

                      <span className="opacity-25 font-black text-[10px] text-emerald-200 px-2">◆</span>
                    </span>
                  );
                })}
              </motion.div>
            </div>

            {/* Close action */}
            <button
              onClick={handleDismiss}
              className="shrink-0 w-10 h-full flex items-center justify-center border-l border-white/10 hover:bg-white/10 active:scale-95 transition-all text-white/70 hover:text-white z-20 cursor-pointer"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
