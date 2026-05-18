"use client";

import React, { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";

interface AnnouncementBarProps {
  announcements: { id: string; content: string; isActive: boolean }[];
}

export default function AnnouncementBar({ announcements }: AnnouncementBarProps) {
  const [active, setActive] = useState(true);
  
  if (!announcements || announcements.length === 0) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative w-full bg-primary text-primary-foreground overflow-hidden py-2"
        >
          <div className="flex items-center w-full group whitespace-nowrap overflow-hidden">
            <div 
              className="inline-block animate-marquee group-hover:[animation-play-state:paused]"
              style={{ paddingLeft: "100%" }}
            >
              {announcements.filter(a => a.isActive).map((annc, idx) => (
                <span key={annc.id} className="mx-8 font-bold text-xs tracking-wider uppercase">
                  {annc.content} • 
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setActive(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-white"
            aria-label="Close Announcement"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
