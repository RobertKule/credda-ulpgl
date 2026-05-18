"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background transition-colors duration-500">
      {/* SHIMMER BACKGROUND EFFECT */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--primary) 0%, transparent 70%)`,
          backgroundSize: '100% 100%'
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-24 h-24 md:w-32 md:h-32"
        >
          <Image
            src="/logocredda.png"
            alt="CREDDA"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* 3 DOTS ANIMATION */}
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: 1, y: -6 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: idx * 0.15,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
          ))}
        </div>
        
        {/* SUBTLE BRAND TEXT */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mt-2"
        >
          Research & Excellence
        </motion.span>
      </div>
    </div>
  );
}
