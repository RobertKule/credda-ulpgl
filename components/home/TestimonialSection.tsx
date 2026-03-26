"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";
import { motion } from "framer-motion";

export interface Testimonial {
    name: string;
    role: string;
    image: string;
    text: string;
}

interface TestimonialSectionProps {
    testimonials?: Testimonial[];
}

export default function TestimonialSection({ testimonials = [] }: TestimonialSectionProps) {
    const t = useTranslations('HomePage');
    
    // Config Embla circulaire avec alignement centré
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { 
        loop: true, 
        align: "center",
        skipSnaps: false,
      },
      [Autoplay({ delay: 6000, stopOnInteraction: false })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="relative overflow-hidden bg-background py-24 lg:py-40 text-foreground">
            {/* Background elements */}
            <SectionDecorNumber value="05" className="hidden sm:block right-4 top-16 opacity-5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16 lg:mb-24">
                    <GSAPReveal direction="up">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full uppercase text-[10px] tracking-[0.4em] font-bold px-6 py-2 mb-8 lg:mb-12">
                            {t('testimonials.badge')}
                        </Badge>
                        <h2 className="text-5xl lg:text-7xl xl:text-8xl font-fraunces font-black leading-[1.1] tracking-tighter text-foreground max-w-4xl mx-auto">
                            {t.rich('testimonials.title_alt', {
                                span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
                            })}
                        </h2>
                    </GSAPReveal>
                </div>

                {/* Carousel */}
                <div className="relative ">
                    <div className="overflow-hidden py-10" ref={emblaRef}>
                                <div className="flex -ml-4 sm:-ml-6 lg:-ml-8 touch-pan-y">
                            {testimonials.map((testi, idx) => {
                                const isActive = selectedIndex === idx;
                                return (
                                    <div key={idx} className="pl-4 pr-4 sm:pr-0 sm:pl-6 lg:pl-8 flex-[0_0_100%] sm:flex-[0_0_70%] lg:flex-[0_0_55%] min-w-0 ">
                                        <motion.div 
                                            animate={{ 
                                                opacity: isActive ? 1 : 0.4,
                                                scale: isActive ? 1 : 0.95,
                                                y: isActive ? 0 : 15
                                            }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className={`
                                                relative h-full aspect-square md:aspect-auto min-h-[340px] md:min-h-[420px] flex flex-col p-6 sm:p-10 md:p-12 rounded-[2.5rem] overflow-hidden border transition-all duration-700
                                                ${isActive 
                                                    ? 'bg-card/90 border-primary/40 shadow-[0_30px_60px_-12px_rgba(201,168,76,0.15)] backdrop-blur-2xl ring-1 ring-primary/10' 
                                                    : 'bg-muted/10 border-border/30 backdrop-blur-sm'}
                                            `}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                            
                                            <Quote className="absolute top-8 right-8 text-primary/10 rotate-12 w-16 h-16 md:w-20 md:h-20" />
                                            
                                            {/* Testimonial Text */}
                                            <div className="relative z-10 flex-1 flex flex-col justify-center mb-10">
                                                <p className="text-lg md:text-xl lg:text-2xl font-outfit font-light leading-relaxed italic text-foreground/90 tracking-wide">
                                                    &ldquo;{testi.text}&rdquo;
                                                </p>
                                            </div>

                                            {/* Author Info */}
                                            <div className="relative z-10 mt-auto flex items-center gap-5">
                                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-primary/20 p-1 bg-background shrink-0">
                                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-muted shadow-inner">
                                                        <Image src={testi.image} alt={testi.name} fill sizes="80px" className="object-cover" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-sm md:text-base uppercase tracking-[0.2em] text-primary mb-0.5">{testi.name}</h3>
                                                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.1em] font-medium opacity-70">{testi.role}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-12 mt-8 lg:mt-16">
                        <button 
                            onClick={() => emblaApi?.scrollPrev()} 
                            className="hidden sm:flex w-14 h-14 rounded-full border border-border items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="flex gap-3">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => emblaApi?.scrollTo(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${selectedIndex === idx ? 'w-12 bg-primary' : 'w-4 bg-border hover:bg-primary/50'}`}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={() => emblaApi?.scrollNext()} 
                            className="hidden sm:flex w-14 h-14 rounded-full bg-primary items-center justify-center text-primary-foreground hover:scale-110 shadow-lg shadow-primary/25 transition-all duration-500 group"
                        >
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}