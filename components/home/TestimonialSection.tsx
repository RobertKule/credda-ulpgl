"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
    name: string;
    role: string;
    image: string;
    text: string;
    location?: string;
}

export default function TestimonialSection({ testimonials = [] }: { testimonials: Testimonial[] }) {
    const t = useTranslations('HomePage');
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideNext = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const slidePrev = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    // AUTO-PLAY LOGIC
    useEffect(() => {
        if (!testimonials.length) return;
        const interval = setInterval(slideNext, 5000);
        return () => clearInterval(interval);
    }, [slideNext, testimonials.length]);

    if (!testimonials.length) return null;

    return (
        <section 
            className="relative w-full py-24 md:py-32 bg-background flex items-center justify-center overflow-hidden transition-colors duration-500"
        >
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                
                {/* Header & Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-black text-foreground leading-[0.9] tracking-tighter mb-8">
                            {t('testimonials.title_center') || "Ils nous font confiance"}
                        </h2>
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setDirection(i > current ? 1 : -1);
                                        setCurrent(i);
                                    }}
                                    className="relative h-1.5 transition-all duration-500 rounded-full bg-slate-300 dark:bg-white/10 overflow-hidden"
                                    style={{ width: current === i ? "48px" : "8px" }}
                                >
                                    {current === i && (
                                        <motion.div 
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 4, ease: "linear" }}
                                            className="absolute inset-0 bg-primary origin-left"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mb-2">
                        <button onClick={slidePrev} className="p-5 rounded-full border border-border/20 hover:bg-muted/50 transition-all text-foreground/70 dark:text-white/70">
                            <ChevronLeft size={28} />
                        </button>
                        <button onClick={slideNext} className="p-5 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-all shadow-xl hover:scale-105 active:scale-95">
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>

                {/* Carousel Display */}
                <div className="relative h-[650px] md:h-[550px] flex items-center justify-center my-10">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={{
                                enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.95, filter: "blur(10px)" }),
                                center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", zIndex: 10 },
                                exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.95, filter: "blur(10px)", zIndex: 0 })
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute w-full max-w-5xl"
                        >
                            <TestimonialCard testimonial={testimonials[current]} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-3xl min-h-[450px]">
            {/* Image Section */}
            <div className="relative h-72 lg:h-full min-h-[350px] group overflow-hidden">
                <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 to-transparent" />
                <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            {/* Content Section */}
            <div className="p-10 md:p-14 flex flex-col justify-center relative bg-white/40 dark:bg-transparent backdrop-blur-sm">
                <Quote className="absolute top-10 right-10 text-primary/10 w-24 h-24 rotate-12" />
                
                <p className="text-xl md:text-2xl lg:text-3xl font-fraunces italic text-foreground tracking-tight leading-relaxed mb-10 relative z-10">
                    &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="mt-auto">
                    <h4 className="text-2xl font-fraunces font-black text-foreground">
                        {testimonial.name}
                    </h4>
                    <p className="text-primary font-bold text-xs uppercase tracking-[0.4em] mt-2 font-sans">
                        {testimonial.role}
                    </p>
                    {testimonial.location && (
                        <div className="flex items-center gap-2 mt-6 text-muted-foreground">
                            <MapPin size={14} className="text-primary" />
                            <div className="w-8 h-[1px] bg-primary/20" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                                {testimonial.location}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}