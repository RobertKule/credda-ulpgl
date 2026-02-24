"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ClinicalImpactSection() {
    const t = useTranslations('HomePage');

    return (
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#062c24] text-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
                <div className="relative aspect-video border-[8px] sm:border-[10px] lg:border-[15px] border-white/5 shadow-2xl overflow-hidden group order-2 lg:order-1">
                    <Image src="/images/director3.webp" alt="Impact Terrain" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-emerald-900/20" />
                </div>
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
                    <Badge className="bg-emerald-500 rounded-none uppercase text-[8px] sm:text-[9px] tracking-widest px-2 sm:px-3 py-1 border-none font-black">{t('clinical.badge')}</Badge>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold leading-tight">{t('clinical.title')}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-emerald-100/80 font-light leading-relaxed">
                        {t('clinical.description')}
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                        {[
                            { key: 'legal', icon: ShieldCheck },
                            { key: 'land', icon: MapPin }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 bg-white/5 border-l-2 border-emerald-500">
                                <item.icon className="text-emerald-400 shrink-0" size={16} />
                                <div>
                                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest">{t(`clinical.actions.${item.key}.title`)}</h4>
                                    <p className="text-[10px] sm:text-xs text-emerald-200/60 mt-1">{t(`clinical.actions.${item.key}.desc`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/clinical" className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-400 pb-1 sm:pb-2 hover:gap-4 sm:hover:gap-5 lg:hover:gap-6 transition-all">
                        {t('clinical.cta')} <ArrowRight size={12} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
