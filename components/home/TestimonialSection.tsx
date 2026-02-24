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
import Autoplay from "embla-carousel-autoplay";

const TESTIMONIALS = [
    {
        quote: "Le CREDDA a complètement transformé notre approche de la recherche clinique en RDC.",
        author: "Dr. Jean-Paul",
        role: "Chercheur Partenaire",
        avatar: "/images/director3.webp"
    },
    {
        quote: "L'expertise juridique du centre est inestimable pour nos communautés locales.",
        author: "Marie Dubois",
        role: "Directrice ONG",
        avatar: "/images/director3.webp"
    }
];

export default function TestimonialSection() {
    const t = useTranslations('HomePage');
    const testimonialRef = useRef<any>(null);

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <Badge className="bg-white/10 text-white rounded-none border-none uppercase text-[9px] tracking-[0.2em] font-black px-3 py-1">
                            Témoignages
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-[1.1]">
                            Ce qu'ils <span className="text-blue-500 italic font-light">disent</span> de nous
                        </h2>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => testimonialRef.current?.scrollPrev()} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
                                <ArrowLeft size={18} />
                            </button>
                            <button onClick={() => testimonialRef.current?.scrollNext()} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000 })]} setApi={(api) => { testimonialRef.current = api; }} className="w-full">
                            <CarouselContent className="-ml-6">
                                {TESTIMONIALS.map((testi, idx) => (
                                    <CarouselItem key={idx} className="pl-6 md:basis-1/2">
                                        <div className="bg-white/5 border border-white/10 p-8 sm:p-10 relative group hover:bg-white/10 transition-all h-full flex flex-col">
                                            <FormatQuote className="text-blue-500/20 absolute top-6 right-6 w-16 h-16 sm:w-20 sm:h-20 -scale-x-100" />
                                            <p className="text-base sm:text-lg lg:text-xl font-serif font-light leading-relaxed mb-8 relative z-10 flex-1">
                                                "{testi.quote}"
                                            </p>
                                            <div className="flex items-center gap-4 mt-auto">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-blue-500 transition-colors">
                                                    <Image src={testi.avatar} alt={testi.author} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm tracking-wide">{testi.author}</h4>
                                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{testi.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}
