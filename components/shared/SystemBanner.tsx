"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, BellRing } from "lucide-react";

export default function SystemBanner() {
  const [announcements, setAnnouncements] = useState<{ id: string, content: string }[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements/active');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Check if any of these are dismissed
            const latestId = data[0].id; // We use the latest one to track dismissal for the whole bar
            const dismissed = localStorage.getItem(`dismissed-announcement-${latestId}`);
            if (!dismissed) {
              setAnnouncements(data);
              setIsVisible(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDismiss = () => {
    if (announcements.length > 0) {
      localStorage.setItem(`dismissed-announcement-${announcements[0].id}`, "true");
      setIsVisible(false);
    }
  };

  if (!isVisible || announcements.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-[200] bg-emerald-600 text-white overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center overflow-hidden h-10">
            <div className="flex items-center gap-4 pl-4 z-10 bg-emerald-600 shadow-xl">
               <BellRing size={14} className="animate-bounce" />
               <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-r border-white/20 pr-4">Actualités</span>
            </div>
            
            {/* INFINITE SCROLL MARQUEE */}
            <div className="flex-1 overflow-hidden relative group">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  duration: 30, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="flex items-center gap-12 whitespace-nowrap px-6 w-max"
              >
                {[...announcements, ...announcements].map((ann, idx) => (
                  <span key={`${ann.id}-${idx}`} className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                    {ann.content}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-3 hover:bg-black/10 transition-colors z-10 bg-emerald-600"
            aria-label="Fermer l'annonce"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
