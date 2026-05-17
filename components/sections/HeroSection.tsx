"use client";

import React, { useRef, useState, useEffect } from "react";
import { m as motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HeroSection() {
    const t = useTranslations("common"); // fallback if not translated
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
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    if (!isMounted) return <div className="h-screen w-full bg-slate-900" />;

    return (
        <section className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
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
                {/* Overlay Gradients - Clean Light/Dark Theme Institutional */}
                <div className="absolute inset-0 bg-background/85" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
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
                        <span className="w-12 h-[2px] bg-primary/40 rounded-md" />
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">
                            CREDDA-ULPGL
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground font-black leading-[1.1] mb-6 drop-shadow-sm"
                    >
                        Clinique
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                            Juridique
                        </span>
                        <br />
                        <span className="text-muted-foreground/80">Environnementale.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10 font-medium leading-relaxed"
                    >
                        Nous protégeons les droits des communautés et la biodiversité par le droit.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/research"
                            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-emerald hover:from-primary/90 hover:to-emerald/90 text-white px-8 py-4 rounded-md shadow-lg shadow-emerald/20 font-medium transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10">Explorer nos recherches</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-md bg-white/20 transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10" />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-transparent hover:bg-muted text-foreground border border-border px-8 py-4 rounded-md font-bold transition-all duration-300"
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
                    className="w-12 h-12 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-md border border-border text-foreground hover:bg-muted transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                <button
                    onClick={toggleMute}
                    className="w-12 h-12 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-md border border-border text-foreground hover:bg-muted transition-colors"
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
                <span className="text-muted-foreground/60 text-xs uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-8 h-12 rounded-md border border-border flex items-start justify-center p-2 group-hover:border-primary transition-colors bg-background/50 backdrop-blur-sm"
                >
                    <span className="w-1 h-2 bg-primary rounded-md" />
                </motion.div>
            </motion.div>
        </section>
    );
}
