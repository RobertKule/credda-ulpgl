"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const heroSlides = [
  "/images/hero/ProfKenendyWithEtudiant.jpeg",
  "/images/hero/onSiteCredda.jpeg",
  "/images/hero/profKenedyHero.jpeg",
  "/images/hero/profKenedyHero2.jpeg",
  "/images/hero/profKenedyWithEtudiant2.jpeg",
  "/images/hero/profKenedyWithEtudiant3.jpeg",
  "/images/hero/profKenedyWithEtudiant4.jpeg",
  "/images/hero/profKenedyWithEtudiant5.jpeg",
  "/images/hero/profKenedyWithEtudiant6.jpeg",
  "/images/hero/theCreddaSite.jpeg",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  const variants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Cinematic Zoom Effect */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={heroSlides[currentIndex]}
              alt={`Hero Slide ${currentIndex + 1}`}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle Vignette for depth (Optional, and much lighter) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-[1] pointer-events-none" />

      {/* Navigation Arrows */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-[30] flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 lg:group-hover:opacity-100">
        <button
          onClick={prevSlide}
          className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white/20 transition-all active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white/20 transition-all active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[30] flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-700",
              currentIndex === index 
                ? "w-8 bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)]" 
                : "w-2 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
