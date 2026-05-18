"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import { 
    Instagram, 
    Facebook, 
    Twitter, 
    Calendar, 
    Filter, 
    Search, 
    ChevronRight, 
    ChevronLeft,
    ArrowRight
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export default function ConnectedGallerySection({ images, totalCount = 0 }: { images: any[], totalCount?: number }) {
    const t = useTranslations('HomePage');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Fallback images if DB is empty
    const carouselImages = (images && images.length > 0) ? images : [
        { id: 'h1', src: '/images/hero/hero-bg.webp', title: 'Excellence en Recherche', description: 'Découvrez nos travaux sur le développement durable.' },
        { id: 'h2', src: '/images/hero/labo.webp', title: 'Innovation Juridique', description: 'Le CREDDA au cœur de l\'évolution du droit.' }
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [carouselImages.length, isPaused]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#0A192F]">
            {/* Background Carousel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={carouselImages[currentIndex].src}
                        alt={carouselImages[currentIndex].title}
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white px-6">
                <motion.div
                    key={`text-${currentIndex}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                    className="text-center space-y-8"
                >
                    <span className="text-xs md:text-sm font-black uppercase tracking-[1em] text-primary block mb-6">
                        CREDDA • MÉDIATHÈQUE
                    </span>
                    <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-black tracking-tighter leading-[0.8] mb-10 max-w-6xl mx-auto drop-shadow-2xl">
                        {carouselImages[currentIndex].title || "Institutional Excellence"}
                    </h2>
                </motion.div>

                {/* Simplified Bottom Bar (Stats + Button) */}
                <div className="absolute bottom-16 w-full max-w-4xl px-6">
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                    >
                        {/* Stats Block */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-primary shadow-xl">
                                <span className="sr-only">Images</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-images"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-serif font-black tracking-tighter text-primary">
                                    {totalCount || carouselImages.length}+
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                                    {t('Gallery.total_images') || "Images dans la médiathèque"}
                                </span>
                            </div>
                        </div>

                        {/* Separator (Mobile Hidden) */}
                        <div className="hidden md:block w-[1px] h-12 bg-white/10" />

                        {/* CTA Button */}
                        <Link 
                            href="/media-center"
                            className="w-full md:w-auto px-12 py-6 bg-white text-[#0A192F] text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 rounded-2xl flex items-center justify-center gap-4 group shadow-xl hover:-translate-y-1"
                        >
                            <span>{t('Gallery.cta_view_all') || "Aller voir la galerie"}</span>
                            <div className="w-8 h-8 rounded-full bg-[#0A192F]/5 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Social Icons Floating Right */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-10 items-center text-white/40">
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <a href="https://instagram.com" target="_blank" className="hover:text-primary transition-all hover:scale-150 transform"><Instagram size={22} /></a>
                <a href="https://facebook.com" target="_blank" className="hover:text-primary transition-all hover:scale-150 transform"><Facebook size={22} /></a>
                <a href="https://twitter.com" target="_blank" className="hover:text-primary transition-all hover:scale-150 transform"><Twitter size={22} /></a>
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            {/* Carousel Navigation */}
            <div className="absolute bottom-10 right-10 z-30 flex gap-4">
                <button 
                    onClick={() => { setIsPaused(true); setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length); }}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary transition-all group backdrop-blur-md"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => { setIsPaused(true); setCurrentIndex((prev) => (prev + 1) % carouselImages.length); }}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary transition-all group backdrop-blur-md"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Progress Bars */}
            <div className="absolute left-10 bottom-10 z-20 flex gap-3 h-1 items-end">
                {carouselImages.map((_, i) => (
                    <div 
                        key={i}
                        className="relative w-12 h-full bg-white/10 rounded-full overflow-hidden"
                    >
                        {i === currentIndex && (
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 7, ease: "linear" }}
                                className="absolute inset-0 bg-primary"
                            />
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .font-serif { font-family: var(--font-serif), serif; }
            `}</style>
        </section>
    );
}
