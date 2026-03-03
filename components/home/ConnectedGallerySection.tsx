"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function ConnectedGallerySection({ images }: { images: any[] }) {
    const t = useTranslations('HomePage');
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

    useEffect(() => {
        const galleryInterval = setInterval(() => {
            setCurrentGalleryIndex((prev) => images.length ? (prev + 1) % images.length : 0);
        }, 5000);
        return () => clearInterval(galleryInterval);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <Badge className="bg-blue-600/10 text-blue-700 rounded-none mb-3 sm:mb-4 uppercase text-[8px] sm:text-[9px] lg:text-[10px] font-black px-3 py-1 border-none">
                        {t('Gallery.badge')}
                    </Badge>
                    <FormattedHTML
                        html={t.raw('Gallery.title')}
                        as="h2"
                        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-900 leading-tight"
                    />
                    <p className="text-sm sm:text-base text-slate-500 font-light max-w-2xl mx-auto mt-3 sm:mt-4">
                        {t('Gallery.description')}
                    </p>
                </div>
            </div>

            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <Carousel
                    opts={{ align: "center", loop: true, skipSnaps: false, dragFree: false }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {images.map((img: any, idx: number) => (
                            <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <Image
                                        src={img.src} alt={img.title} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="space-y-2">
                                            <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-400">{img.category}</p>
                                            <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white line-clamp-1">{img.title}</h3>
                                            <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-white/70 line-clamp-2">{img.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 left-3 z-10">
                                        <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[6px] sm:text-[7px] lg:text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                                            {img.category}
                                        </Badge>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
                        <CarouselPrevious className="static translate-y-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-600 hover:text-white border-0 shadow-xl pointer-events-auto" />
                        <CarouselNext className="static translate-y-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-600 hover:text-white border-0 shadow-xl pointer-events-auto" />
                    </div>
                    <div className="flex justify-center gap-2 mt-6">
                        {images.map((_: any, idx: number) => (
                            <button
                                key={idx}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${idx === currentGalleryIndex ? 'bg-blue-600 w-4 sm:w-6' : 'bg-slate-300 hover:bg-slate-400'}`}
                                onClick={() => setCurrentGalleryIndex(idx)}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>

            <div className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-10 lg:mt-12">
                <div className="flex justify-center">
                    <Link href="/gallery" className="group inline-flex items-center gap-2 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600/30 pb-1 hover:border-blue-600 transition-all">
                        <span>{t('Gallery.cta')}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
