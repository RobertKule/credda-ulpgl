"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { SectionDecorNumber } from "@/components/home/SectionDecorNumber";

export default function TeamSection({ team }: { team: any[] }) {
    const t = useTranslations('HomePage');
    const carouselRef = useRef<any>(null);

    if (!team || team.length === 0) return null;

    return (
        <section className="relative overflow-hidden border-b border-border bg-transparent py-12 lg:py-24">
            <SectionDecorNumber value="04" className="left-0 top-6 sm:left-2" />
            <div className="relative z-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 lg:mb-16 gap-6">
                    <div className="max-w-xl lg:max-w-2xl">
                        <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 rounded-md uppercase text-[10px] tracking-[0.4em] font-outfit font-bold px-4 py-1.5 mb-6">
                            {t('team.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-fraunces font-extrabold text-foreground leading-[1] tracking-tighter">
                            {t('team.title_alt') || t('team.title')}
                        </h2>
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                        <button
                            onClick={() => carouselRef.current?.scrollPrev()}
                            aria-label={t('team.prev') || "Précédent"}
                            className="w-14 h-14 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            onClick={() => carouselRef.current?.scrollNext()}
                            aria-label={t('team.next') || "Suivant"}
                            className="w-14 h-14 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-500"
                        >
                            <ArrowRight size={20} />
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
                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted border border-border mb-8">
                                        <Image
                                            src={member.image || "/images/director3.webp"}
                                            alt={member.translations[0]?.name}
                                            fill
                                            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-fraunces font-extrabold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                                            {member.translations[0]?.name}
                                        </h3>
                                        <p className="text-[10px] text-primary/60 font-outfit font-bold uppercase tracking-widest mt-2">
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
