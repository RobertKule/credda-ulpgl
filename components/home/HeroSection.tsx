"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    
    // Dynamic controls state
    const [showControls, setShowControls] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const t = useTranslations('HomePage');
    const slides: any[] = t.raw('hero.slides') || [];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Handle idle cursor to auto-hide controls
    useEffect(() => {
        const handleGlobalMouseMove = () => {
            setShowControls(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShowControls(false), 2500);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPaused) videoRef.current.play();
            else videoRef.current.pause();
            setIsPaused(!isPaused);
        }
    };

    return (
        <section className="relative h-[80vh] sm:h-[85vh] lg:h-[90vh] xl:h-[95vh] w-full overflow-hidden bg-slate-950">
            {/* BACKGROUND VIDEO */}
            <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 sm:opacity-40">
                <source src="/video/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />

            {/* DYNAMIC MEDIA CONTROLS (Fades out when cursor is idle) */}
            <AnimatePresence>
                {showControls && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-8 right-8 lg:top-12 lg:right-12 z-30 flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-md shadow-2xl"
                    >
                        <button
                            onClick={togglePlay}
                            className="p-2 text-white/80 hover:text-white transition-all hover:scale-110"
                        >
                            {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                        </button>
                        <div className="w-[1px] h-6 bg-white/20 mx-1" />
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2 text-white/80 hover:text-white transition-all hover:scale-110"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex items-center">
                <AnimatePresence mode="wait">
                    {slides.length > 0 && (
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8"
                        >
                            <Badge className="bg-primary text-primary-foreground rounded-none px-4 py-2 uppercase tracking-[0.3em] font-black border-none shadow-lg text-[9px] sm:text-[10px] lg:text-[11px]">
                                {t('hero.badge')}
                            </Badge>
                            <FormattedHTML
                                html={slides[currentSlide]?.title}
                                as="h1"
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-fraunces font-black text-white leading-[1.05] sm:leading-[1.02] tracking-tighter"
                            />
                            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 font-light max-w-lg sm:max-w-xl lg:max-w-2xl leading-relaxed">
                                {slides[currentSlide]?.desc}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4 lg:pt-8 w-full sm:w-auto">
                                <Link href="/publications" className="px-8 lg:px-12 py-4 lg:py-5 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-widest shadow-2xl shadow-primary/20 text-center w-full sm:w-auto hover:-translate-y-1">
                                    {t('hero.cta_publications')}
                                </Link>
                                <Link href="/contact" className="px-8 lg:px-12 py-4 lg:py-5 border border-white/30 text-white font-bold hover:bg-white/10 transition-all text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-widest text-center w-full sm:w-auto hover:-translate-y-1">
                                    {t('hero.cta_contact')}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SLIDE INDICATORS */}
                <div className="absolute bottom-16 sm:bottom-24 left-4 sm:left-6 lg:left-12 z-20 flex gap-4 lg:gap-8">
                    {[0, 1, 2].map((i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} className="flex items-center group">
                            <span className={`text-[10px] lg:text-xs font-black mr-3 transition-colors ${currentSlide === i ? 'text-primary' : 'text-slate-500'}`}>0{i + 1}</span>
                            <div className="h-[2px] w-12 lg:w-20 bg-white/20 relative overflow-hidden">
                                {currentSlide === i && (
                                    <motion.div layoutId="progress" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 8, ease: "linear" }} className="absolute inset-0 bg-primary" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* BOTTOM WAVY CURVE */}
            <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
                <svg className="relative block w-full h-[50px] sm:h-[80px] lg:h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V120A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
                </svg>
            </div>
        </section>
    );
}
