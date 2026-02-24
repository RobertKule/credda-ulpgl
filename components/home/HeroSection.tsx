"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const t = useTranslations('HomePage');
    const slides: any[] = t.raw('hero.slides') || [];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 8000);
        return () => clearInterval(interval);
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
            <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 sm:opacity-40">
                <source src="/video/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-30 flex gap-2 sm:gap-3 lg:gap-4">
                <button
                    onClick={togglePlay}
                    className="p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
                >
                    {isPaused ? <Play size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" /> : <Pause size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" />}
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all rounded-full shadow-xl"
                >
                    {isMuted ? <VolumeX size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <Volume2 size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
                </button>
            </div>

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
                            <Badge className="bg-blue-600 text-white rounded-none px-3 sm:px-4 py-1 sm:py-1.5 uppercase tracking-widest text-[8px] sm:text-[9px] lg:text-[10px] font-black border-none shadow-lg">
                                {t('hero.badge')}
                            </Badge>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif font-bold text-white leading-[1.1] sm:leading-[1.08] lg:leading-[1.05]">
                                {slides[currentSlide]?.title}
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 font-light max-w-lg sm:max-w-xl lg:max-w-2xl leading-relaxed">
                                {slides[currentSlide]?.desc}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 pt-2 sm:pt-3 lg:pt-4">
                                <Link href="/publications" className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-slate-950 font-black hover:bg-blue-600 hover:text-white transition-all rounded-none text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-widest shadow-2xl text-center">
                                    {t('hero.cta_publications')}
                                </Link>
                                <Link href="/contact" className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border-2 border-white/30 text-white font-black hover:bg-white/10 transition-all rounded-none text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-widest text-center">
                                    {t('hero.cta_contact')}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-6 left-4 sm:left-6 z-20 flex gap-3 sm:gap-4 lg:gap-6">
                    {[0, 1, 2].map((i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} className="flex items-center group">
                            <span className={`text-[8px] sm:text-[9px] lg:text-[10px] font-black mr-2 sm:mr-3 ${currentSlide === i ? 'text-blue-500' : 'text-slate-500'}`}>0{i + 1}</span>
                            <div className="h-[2px] w-8 sm:w-12 lg:w-16 bg-white/20 relative overflow-hidden">
                                {currentSlide === i && (
                                    <motion.div layoutId="progress" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 8, ease: "linear" }} className="absolute inset-0 bg-blue-500" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
