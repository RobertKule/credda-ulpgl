"use client";

import React from "react";

export default function HeroSkeleton() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 lg:pt-36 pb-20 bg-black">
      {/* BACKGROUND PLACEHOLDER */}
      <div className="absolute inset-0 z-0 bg-neutral-900 animate-pulse" />
      
      {/* GRID FRAME BACKGROUND CLONE */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 w-full flex flex-col justify-end flex-grow pb-12 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-end justify-between w-full h-full gap-12">
          
          {/* BOTTOM LEFT LOGO SKELETON */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="flex flex-col gap-2 ml-2">
              <div className="w-20 h-4 bg-white/20 rounded-full" />
              <div className="w-24 h-2 bg-white/10 rounded-full" />
            </div>
          </div>

          {/* BOTTOM RIGHT BOX SKELETON */}
          <div className="w-full lg:max-w-xl bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-white/5 animate-pulse">
            {/* BADGE SKELETON */}
            <div className="w-32 h-4 bg-primary/20 rounded-full mb-6" />

            {/* TITLE SKELETON */}
            <div className="w-full h-10 bg-white/10 rounded-xl mb-4" />
            <div className="w-3/4 h-10 bg-white/10 rounded-xl mb-6" />

            {/* SUBTITLE SKELETON */}
            <div className="w-full h-4 bg-white/5 rounded-full mb-2" />
            <div className="w-full h-4 bg-white/5 rounded-full mb-8" />

            {/* CTA SKELETON */}
            <div className="flex gap-4">
              <div className="w-40 h-14 bg-primary/20 rounded-2xl" />
              <div className="w-40 h-14 bg-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
