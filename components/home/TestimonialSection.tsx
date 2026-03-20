"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FormatQuote } from "@mui/icons-material";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
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
        <section className="py-24 lg:py-40 bg-[#0C0C0A] text-[#F5F2EC] relative overflow-hidden border-y border-white/5">
            {/* DECORATIVE NUMBER */}
            <div className="absolute top-20 right-10 lg:right-20 pointer-events-none select-none opacity-5">
               <span className="text-[20rem] lg:text-[25rem] font-fraunces font-extrabold italic text-[#C9A84C] leading-none">05</span>
            </div>

            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[120px] -mr-40 -mt-20" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A84C]/2 rounded-full blur-[100px] -ml-20 -mb-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center border-l-2 border-white/10 pl-6 lg:pl-12">
                    <div className="lg:col-span-4 space-y-8">
                        <GSAPReveal direction="left" delay={0.2}>
                            <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 rounded-none uppercase text-[10px] tracking-[0.4em] font-outfit font-bold px-4 py-1.5 mb-6">
                                {t('testimonials.badge')}
                            </Badge>
                            <h2 className="text-4xl lg:text-7xl font-fraunces font-extrabold leading-[1] text-[#F5F2EC]">
                                {t('testimonials.title_alt')}
                            </h2>
                        </GSAPReveal>

                        <GSAPReveal direction="left" delay={0.4}>
                            <div className="flex gap-4 pt-6">
                                <button 
                                  onClick={() => testimonialRef.current?.scrollPrev()} 
                                  className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all duration-500"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button 
                                  onClick={() => testimonialRef.current?.scrollNext()} 
                                  className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all duration-500"
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
                                            <div className="bg-[#161614] border border-white/5 p-10 lg:p-12 relative group hover:border-[#C9A84C]/30 transition-all duration-700 h-full flex flex-col rounded-none shadow-2xl">
                                                <div className="text-[#C9A84C]/10 absolute top-8 right-8 transition-transform duration-700 group-hover:scale-110">
                                                    <Quote size={64} />
                                                </div>
                                                <p className="text-lg lg:text-xl font-outfit font-light italic leading-relaxed mb-12 relative z-10 flex-1 text-[#F5F2EC]/60 group-hover:text-[#F5F2EC] transition-colors duration-500">
                                                    &ldquo;{testi.text}&rdquo;
                                                </p>
                                                <div className="flex items-center gap-6 mt-auto border-t border-white/5 pt-8">
                                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
                                                        <Image src={testi.image} alt={testi.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-outfit font-bold text-[11px] uppercase tracking-widest text-[#F5F2EC] group-hover:text-[#C9A84C] transition-colors">{testi.name}</h4>
                                                        <p className="text-[9px] text-[#C9A84C]/40 font-outfit font-bold uppercase tracking-widest mt-2">{testi.role}</p>
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
