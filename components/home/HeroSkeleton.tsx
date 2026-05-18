"use client";

import React from "react";

export default function HeroSkeleton() {
  return (
    <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-start overflow-hidden pt-32 lg:pt-36 pb-0 bg-background">
      {/* GRID FRAME BACKGROUND CLONE */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 w-full mb-16 flex flex-col items-center flex-1">
        
        {/* BADGE SKELETON */}
        <div className="bg-primary/5 rounded-full px-5 py-2 mb-4 inline-block border border-primary/10 animate-pulse mt-2">
          <div className="w-32 h-3 bg-primary/20 rounded-full" />
        </div>

        {/* TITLE SKELETON */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-4 mb-6">
          <div className="w-[80%] h-12 md:h-16 lg:h-20 bg-foreground/5 rounded-2xl animate-pulse" />
          <div className="w-[60%] h-12 md:h-16 lg:h-20 bg-foreground/5 rounded-2xl animate-pulse" />
        </div>

        {/* SUBTITLE SKELETON */}
        <div className="w-full max-w-2xl h-4 bg-muted-foreground/10 rounded-full animate-pulse mb-2" />
        <div className="w-[40%] max-w-md h-4 bg-muted-foreground/10 rounded-full animate-pulse mb-10" />

        {/* LOGO SWITCHER SKELETON */}
        <div className="flex items-center justify-center gap-10 md:gap-16 mb-8 mt-4">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-foreground/5 animate-pulse" />
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-foreground/5 animate-pulse" />
        </div>

        {/* CTA SKELETON */}
        <div className="flex items-center gap-6 mb-16">
          <div className="w-40 h-14 bg-primary/20 rounded-full animate-pulse" />
          <div className="w-14 h-14 bg-primary/10 rounded-full animate-pulse" />
        </div>

        {/* BOTTOM IMAGE FRAME SKELETON */}
        <div className="relative mt-auto w-full flex justify-center min-h-[400px]">
           <div className="relative z-10 rounded-t-full w-[350px] md:w-[450px] h-[400px] md:h-[480px] bg-card border-t border-l border-r border-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
              <div className="w-full h-full bg-foreground/2 animate-pulse" />
           </div>
        </div>
      </div>
    </section>
  );
}
