"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { ArrowOutward, FormatQuote } from "@mui/icons-material";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function TeamSection({ team }: { team: any[] }) {
    const t = useTranslations('HomePage');
    const carouselRef = useRef<any>(null);

    if (!team || team.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 lg:mb-16 gap-6">
                    <div className="max-w-xl lg:max-w-2xl">
                        <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none rounded-none uppercase text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.2em] font-black px-3 py-1 mb-4">
                            {t('team.badge')}
                        </Badge>
                        <FormattedHTML
                            html={t.raw('team.title')}
                            as="h2"
                            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight"
                        />
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                        <button
                            onClick={() => carouselRef.current?.scrollPrev()}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-slate-400 group"
                        >
                            <ArrowLeft size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => carouselRef.current?.scrollNext()}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-slate-400 group"
                        >
                            <ArrowRight size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <Carousel
                    opts={{ align: "start", loop: true, skipSnaps: false }}
                    plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
                    setApi={(api) => { carouselRef.current = api; }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 sm:-ml-6 lg:-ml-8">
                        {team.map((member: any, idx: number) => (
                            <CarouselItem key={idx} className="pl-4 sm:pl-6 lg:pl-8 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <Link href={`/about#team-${member.id}`} className="group block">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4 sm:mb-6">
                                        <Image
                                            src={member.image || "/images/director3.webp"}
                                            alt={member.translations[0]?.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <ArrowOutward fontSize="small" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {member.translations[0]?.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-[11px] lg:text-xs text-blue-600/80 font-bold uppercase tracking-widest mt-1 sm:mt-2">
                                            {member.translations[0]?.role}
                                        </p>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
