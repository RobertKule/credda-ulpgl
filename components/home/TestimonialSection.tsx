"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";
import { motion, AnimatePresence } from "framer-motion";

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
    
    // Config Embla avec un espacement plus naturel
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { 
        loop: true, 
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false
      },
      [Autoplay({ delay: 6000, stopOnMouseEnter: true })]
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
        <section className="relative overflow-hidden border-y border-border/10 bg-transparent py-16 lg:py-32 text-foreground">
            {/* Décoration de section - Plus discrète sur mobile */}
            <SectionDecorNumber value="05" className="hidden sm:block right-4 top-16 opacity-10" />
            
            {/* Glows d'arrière-plan optimisés pour ne pas gêner le texte */}
            <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />

            <div className="relative z-10 w-full max-w-[1800px] mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-start px-6 lg:px-16">
                    
                    {/* COLONNE GAUCHE : TITRE & NAV */}
                    <div className="lg:col-span-4 w-full space-y-8 sticky top-0">
                        <GSAPReveal direction="left">
                            <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-none uppercase text-[10px] tracking-[0.4em] font-bold px-4 py-2 mb-4">
                                {t('testimonials.badge')}
                            </Badge>
                            <h2 className="text-5xl lg:text-7xl xl:text-8xl font-fraunces font-black leading-[0.9] tracking-tighter text-foreground">
                                {t.rich('testimonials.title_alt', {
                                    span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
                                })}
                            </h2>
                        </GSAPReveal>

                        <div className="hidden lg:flex gap-4 pt-8">
                            <button 
                                onClick={() => emblaApi?.scrollPrev()} 
                                className="w-16 h-16 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => emblaApi?.scrollNext()} 
                                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-all duration-500 group"
                            >
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* COLONNE DROITE : CAROUSEL */}
                    <div className="lg:col-span-8 w-full">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex -ml-4 lg:-ml-8">
                                {testimonials.map((testi, idx) => {
                                    const isActive = selectedIndex === idx;
                                    return (
                                        <div key={idx} className="pl-4 lg:pl-8 shrink-0 basis-[90%] sm:basis-[80%] lg:basis-[55%] min-w-0">
                                            <motion.div 
                                                animate={{ 
                                                    opacity: isActive ? 1 : 0.3,
                                                    scale: isActive ? 1 : 0.95,
                                                    y: isActive ? 0 : 20
                                                }}
                                                className={`
                                                    relative h-full flex flex-col p-8 lg:p-14 border transition-all duration-700
                                                    ${isActive ? 'bg-background/40 backdrop-blur-md border-primary/30 shadow-2xl' : 'bg-muted/10 border-border/50'}
                                                `}
                                            >
                                                <Quote className={`absolute top-8 right-8 transition-colors duration-700 ${isActive ? 'text-primary/20' : 'text-muted/10'}`} size={60} />
                                                
                                                {/* Texte du témoignage avec animation interne */}
                                                <div className="relative z-10 flex-1 flex flex-col justify-center min-h-[200px]">
                                                    <AnimatePresence mode="wait">
                                                        {isActive && (
                                                            <motion.p 
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-xl lg:text-2xl font-light leading-relaxed italic text-foreground/90"
                                                            >
                                                                &ldquo;{testi.text}&rdquo;
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Infos auteur */}
                                                <div className="mt-10 pt-8 border-t border-border/50 flex items-center gap-5">
                                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                                                        <Image src={testi.image} alt={testi.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-xs uppercase tracking-widest text-primary">{testi.name}</h4>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{testi.role}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pagination & Nav mobile */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
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
                            
                            {/* Flèches visibles uniquement sur mobile pour faciliter la nav */}
                            <div className="flex lg:hidden gap-4">
                                <button onClick={() => emblaApi?.scrollPrev()} className="p-4 border border-border rounded-full"><ArrowLeft size={20} /></button>
                                <button onClick={() => emblaApi?.scrollNext()} className="p-4 bg-primary text-primary-foreground rounded-full"><ArrowRight size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}