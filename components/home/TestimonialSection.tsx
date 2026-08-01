"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { m as motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  text: string;
  location?: string;
}

export default function TestimonialSection({ testimonials = [] }: { testimonials: Testimonial[] }) {
  const t = useTranslations("HomePage");

  if (!testimonials.length) return null;

  return (
    <section className="relative py-24 md:py-40 bg-background overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015] dark:opacity-[0.03]">
        <span className="text-[25vw] font-serif font-black tracking-tighter select-none whitespace-nowrap">
          CREDDA
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-4 opacity-80">
              {t("testimonials.badge") ?? "TÉMOIGNAGES"}
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter leading-tight text-foreground">
              {t("testimonials.title_center") ?? "Ils nous font confiance"}
            </h2>
            <div className="h-[1px] w-24 bg-primary mx-auto mt-10 opacity-30" />
          </motion.div>
        </div>

        {/* GRID (DYNAMIC EXPAND) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <div key={i} className="flex h-full min-h-[450px]">
              <TestimonialCard testimonial={testimonial} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full h-full cursor-pointer"
    >
      {/* 1. LAYER: MAIN TEXT CONTENT (Hidden on Hover) */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0.95 : 1,
          filter: isHovered ? "blur(10px)" : "blur(0px)" 
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="
          relative
          bg-white/40 dark:bg-card/20
          backdrop-blur-xl
          border border-border/50
          rounded-none
          p-10 pt-24
          shadow-lg
          h-full
          flex flex-col
          z-10
        "
      >
        {/* STARS */}
        <div className="flex gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={15} className="text-primary fill-primary" />
          ))}
        </div>

        {/* TEXT PREVIEW */}
        <p className="text-lg font-serif italic text-foreground/90 leading-relaxed mb-10">
          “{testimonial.text}”
        </p>

        {/* FOOTER */}
        <div className="mt-auto">
           <h4 className="text-2xl font-serif font-black text-foreground tracking-tight transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mt-1 opacity-80">
            {testimonial.role}
          </p>
          {testimonial.location && (
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-2 opacity-50">
              {testimonial.location}
            </p>
          )}
        </div>
      </motion.div>

      {/* 2. LAYER: THE EXPANDING IMAGE (Starts as floating avatar, ends as background) */}
      <motion.div
        animate={{
          top: isHovered ? 0 : -56, // -top-14
          left: isHovered ? 0 : 40,  // left-10
          width: isHovered ? "100%" : 128, // md:w-32
          height: isHovered ? "100%" : 128, // md:h-32
          zIndex: isHovered ? 30 : 20,
        }}
        transition={{ 
          duration: 0.7, 
          type: "spring", 
          stiffness: 100, 
          damping: 20 
        }}
        className="absolute overflow-hidden shadow-2xl border-4 border-background bg-muted"
      >
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        
        {/* Optional: Overlay on expanded image to show info? */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-10"
            >
               <Quote className="text-primary opacity-20 w-16 h-16 absolute top-10 right-10" />
               <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3 }}
               >
                 <h4 className="text-3xl font-serif font-black text-foreground mb-1">
                   {testimonial.name}
                 </h4>
                 <p className="text-primary font-black text-[12px] uppercase tracking-[0.5em]">
                   {testimonial.role}
                 </p>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. LAYER: FLOATING QUOTE ICON (Stays visible if needed, or animated) */}
      {!isHovered && (
        <motion.div 
           className="absolute top-10 left-32 z-40 w-12 h-12 bg-primary flex items-center justify-center text-white shadow-xl ring-4 ring-background"
        >
          <Quote className="w-6 h-6 fill-current" />
        </motion.div>
      )}

      {/* 4. HOVER BORDER (As requested from ResearchSection) */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-primary/40 pointer-events-none z-50 transition-opacity"
      />
    </motion.div>
  );
}