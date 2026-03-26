"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function ClinicalImpactSection() {
    const t = useTranslations('HomePage');

    return (
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#062c24] text-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
                <div className="relative aspect-video border-[4px] sm:border-[8px] lg:border-[12px] border-white/5 shadow-3xl overflow-hidden group order-2 lg:order-1 rounded-[2.5rem]">
                    <Image src="/images/director3.webp" alt="Impact Terrain" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-emerald-900/20" />
                </div>
                <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400 rounded-full uppercase text-[9px] tracking-[0.4em] px-4 py-1.5 border border-emerald-500/30 font-bold">{t('clinical.badge')}</Badge>
                    <FormattedHTML
                        html={t.raw('clinical.title')}
                        as="h3"
                        className="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-black leading-tight tracking-tighter"
                    />
                    <p className="text-base lg:text-lg text-emerald-100/70 font-outfit font-light leading-relaxed max-w-xl">
                        {t('clinical.description')}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { key: 'legal', icon: ShieldCheck },
                            { key: 'land', icon: MapPin }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-4 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-colors duration-500">
                                <item.icon className="text-emerald-400" size={20} />
                                <div>
                                    <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-emerald-100">{t(`clinical.actions.${item.key}.title`)}</h4>
                                    <p className="text-[11px] text-emerald-100/50 mt-2 font-outfit leading-relaxed">{t(`clinical.actions.${item.key}.desc`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/clinical" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 border-b border-emerald-400/30 pb-2 hover:border-emerald-400 transition-all">
                        {t('clinical.cta')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
