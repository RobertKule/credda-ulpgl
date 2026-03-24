"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
    
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop: true, align: "start" },
      [Autoplay({ delay: 5000, stopOnMouseEnter: true })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

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
        <section className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden border-y border-border">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[120px] -mr-40 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A84C]/2 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 w-full">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center border-l-2 border-border pl-6 lg:pl-12">
                    <div className="lg:col-span-4 space-y-8">
                        <GSAPReveal direction="left" delay={0.2}>
                            <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 rounded-none uppercase text-[10px] tracking-[0.4em] font-outfit font-bold px-4 py-1.5 mb-6">
                                {t('testimonials.badge')}
                            </Badge>
                            <h2 className="text-4xl lg:text-7xl font-fraunces font-extrabold leading-[1] text-foreground">
                                {t('testimonials.title_alt')}
                            </h2>
                        </GSAPReveal>

                        <GSAPReveal direction="left" delay={0.4}>
                            <div className="flex gap-4 pt-6">
                                <button 
                                  onClick={scrollPrev} 
                                  className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-all duration-300"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button 
                                  onClick={scrollNext} 
                                  className="w-14 h-14 rounded-full border border-[#C9A84C] bg-[#C9A84C] flex items-center justify-center text-[#0D0D0B] hover:bg-[#C9A84C]/90 transition-all duration-300"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </GSAPReveal>
                    </div>

                    <div className="lg:col-span-8 w-full overflow-hidden">
                        <GSAPReveal direction="right" delay={0.6}>
                            <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
                                <div className="flex -ml-6 w-full">
                                    {testimonials.map((testi, idx) => {
                                        const isActive = selectedIndex === idx;
                                        return (
                                            <div 
                                                key={idx} 
                                                className="pl-6 shrink-0 basis-full lg:basis-1/2 min-w-0"
                                            >
                                                <div 
                                                    style={{ 
                                                        opacity: isActive ? 1 : 0.45, 
                                                        transform: isActive ? 'scale(1)' : 'scale(0.97)',
                                                        borderColor: isActive ? 'rgba(201,168,76,0.35)' : 'hsl(var(--border))',
                                                        transition: 'all 0.5s ease'
                                                    }}
                                                    className="bg-muted border p-10 lg:p-12 relative group h-full flex flex-col rounded-none shadow-2xl"
                                                >
                                                    <div className="text-[#C9A84C]/10 absolute top-8 right-8">
                                                        <Quote size={64} />
                                                    </div>
                                                    <p className="text-lg lg:text-xl font-outfit font-light italic leading-relaxed mb-12 relative z-10 flex-1 text-muted-foreground transition-colors duration-500">
                                                        &ldquo;{testi.text}&rdquo;
                                                    </p>
                                                    <div className="flex items-center gap-6 mt-auto border-t border-border pt-8">
                                                        <div className="relative w-16 h-16 rounded-sm overflow-hidden border border-border shrink-0">
                                                            <Image src={testi.image} alt={testi.name} fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-outfit font-bold text-[11px] uppercase tracking-widest text-foreground">{testi.name}</h4>
                                                            <p className="text-[9px] text-[#C9A84C]/60 font-outfit font-bold uppercase tracking-widest mt-2">{testi.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DOTS Pagnination */}
                            <div className="flex gap-2 mt-12 justify-center lg:justify-start lg:pl-6">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => emblaApi?.scrollTo(idx)}
                                        style={{
                                            width: selectedIndex === idx ? '24px' : '6px',
                                            transition: 'all 0.4s ease'
                                        }}
                                        className={`h-[6px] rounded-full inline-block ${selectedIndex === idx ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </GSAPReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
