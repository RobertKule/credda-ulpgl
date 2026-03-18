"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FormatQuote } from "@mui/icons-material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import GSAPReveal from "@/components/shared/GSAPReveal";
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
    const testimonialRef = useRef<any>(null);

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-24 lg:py-40 bg-[#050a15] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-20" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] -ml-20 -mb-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center border-l-2 border-white/10 pl-6 lg:pl-12">
                    <div className="lg:col-span-4 space-y-8">
                        <GSAPReveal direction="left" delay={0.2}>
                            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full uppercase text-[10px] tracking-[0.3em] font-black px-4 py-1.5 mb-6">
                                {t('testimonials.badge')}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-[1.1] text-white">
                                {t('testimonials.title')}
                            </h2>
                        </GSAPReveal>

                        <GSAPReveal direction="left" delay={0.4}>
                            <div className="flex gap-4 pt-6">
                                <button 
                                  onClick={() => testimonialRef.current?.scrollPrev()} 
                                  className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button 
                                  onClick={() => testimonialRef.current?.scrollNext()} 
                                  className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </GSAPReveal>
                    </div>

                    <div className="lg:col-span-8">
                        <GSAPReveal direction="right" delay={0.6}>
                            <Carousel 
                              opts={{ align: "start", loop: true }} 
                              plugins={[Autoplay({ delay: 6000 })]} 
                              setApi={(api) => { testimonialRef.current = api; }} 
                              className="w-full"
                            >
                                <CarouselContent className="-ml-6">
                                    {testimonials.map((testi, idx) => (
                                        <CarouselItem key={idx} className="pl-6 md:basis-1/2">
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 lg:p-12 relative group hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col rounded-2xl shadow-xl">
                                                <FormatQuote className="text-blue-500/20 absolute top-8 right-8 w-20 h-20 -scale-x-100 group-hover:scale-[1.1] transition-transform duration-500" />
                                                <p className="text-lg lg:text-xl font-serif font-light leading-relaxed mb-10 relative z-10 flex-1 text-slate-300 group-hover:text-white transition-colors duration-300">
                                                    "{testi.text}"
                                                </p>
                                                <div className="flex items-center gap-5 mt-auto border-t border-white/10 pt-8">
                                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-blue-500 transition-colors duration-500 shrink-0">
                                                        <Image src={testi.image} alt={testi.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-base tracking-wide text-white">{testi.name}</h4>
                                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">{testi.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </GSAPReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
