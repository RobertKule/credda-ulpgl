"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, BellRing } from "lucide-react";

export default function SystemBanner() {
  const [announcement, setAnnouncement] = useState<{ id: string, content: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch('/api/announcements/active');
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            const dismissed = localStorage.getItem(`dismissed-announcement-${data.id}`);
            if (!dismissed) {
              setAnnouncement(data);
              setIsVisible(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };
    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem(`dismissed-announcement-${announcement.id}`, "true");
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && announcement && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[200] bg-[#C9A84C] text-[#0C0C0A] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="hidden sm:flex w-8 h-8 items-center justify-center bg-[#0C0C0A]/10 rounded-md">
                <BellRing size={16} className="animate-bounce" />
              </div>
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest truncate">
                <span className="opacity-60 mr-2">Info:</span>
                {announcement.content}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-[#0C0C0A]/10 rounded-md transition-colors active:scale-90 flex-shrink-0"
              aria-label="Fermer l'annonce"
            >
              <X size={16} />
            </button>
          </div>
          {/* Decorative Shimmer */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
