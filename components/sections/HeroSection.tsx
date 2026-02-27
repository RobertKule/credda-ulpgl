"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HeroSection() {
    const t = useTranslations("common" as any); // fallback if not translated
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Parallax scroll effects
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const scrollToNext = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
    };

    if (!isMounted) return <div className="h-screen w-full bg-slate-900" />;

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#0f172a] flex items-center justify-center">
            {/* Background Video with Parallax */}
            <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full pointer-events-none">
                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="/images/hero-poster.webp"
                >
                    <source src="/video/hero-bg.mp4" type="video/mp4" />
                </video>
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-transparent to-transparent" />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ opacity }}
                    className="max-w-4xl"
                >
                    <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
                        <span className="w-12 h-[2px] bg-blue-500 rounded-full" />
                        <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">
                            CREDDA-ULPGL
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold leading-tight mb-6"
                    >
                        Clinique
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Juridique
                        </span>
                        <br />
                        Environnementale.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-2xl text-slate-300 max-w-2xl mb-10 font-light leading-relaxed"
                    >
                        Nous protégeons les droits des communautés et la biodiversité par le droit.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/research"
                            className="group relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10">Explorer nos recherches</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10" />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-medium transition-all duration-300"
                        >
                            Nous contacter
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Video Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 right-8 z-20 flex items-center gap-4 hidden md:flex"
            >
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                <button
                    onClick={toggleMute}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={scrollToNext}
            >
                <span className="text-white/60 text-xs uppercase tracking-widest font-medium group-hover:text-white transition-colors">
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-8 h-12 rounded-full border border-white/30 flex items-start justify-center p-2 group-hover:border-white/60 transition-colors"
                >
                    <span className="w-1 h-2 bg-blue-400 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
