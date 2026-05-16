"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, Award } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";

const AfricaGlobe = dynamic(() => import("@/components/home/AfricaGlobe"), {
  ssr: false,
  loading: () => null,
});

export default function PersistentGlobeBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Institutional Deep Blue Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        theme === 'dark' ? 'bg-[#101B4D]' : 'bg-[#203696]'
      }`} />

      {/* Persistent Rotating Globe - Positioned Right */}
      <div className="absolute -right-[15%] top-[2%] w-[1000px] h-[1000px] opacity-25">
        <AfricaGlobe />
      </div>

      {/* Persistent Floating Cards (Only for Desktop) */}
      <div className="absolute right-[5%] top-[20%] z-10 hidden xl:block">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-[#E1F247]/20 rounded-xl flex items-center justify-center text-[#E1F247]">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Recherche</p>
            <h4 className="text-white text-xs font-bold">Scientific Excellence</h4>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-[12%] top-[55%] z-10 hidden xl:block">
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-[#E1F247]/20 rounded-xl flex items-center justify-center text-[#E1F247]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Impact</p>
            <h4 className="text-white text-xs font-bold">Legal Protection</h4>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-[2%] top-[80%] z-10 hidden xl:block">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-[#E1F247]/20 rounded-xl flex items-center justify-center text-[#E1F247]">
            <Award size={20} />
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Expertise</p>
            <h4 className="text-white text-xs font-bold">16 Years Heritage</h4>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
