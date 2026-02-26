"use client";

import React from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function CtaSection() {
    const t = useTranslations('HomePage');

    return (
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-blue-900 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                <FormattedHTML
                    html={t.raw('cta.title')}
                    as="h2"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-serif font-bold max-w-4xl lg:max-w-5xl mx-auto tracking-tighter uppercase leading-none"
                />
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-5 xl:gap-8 pt-4 sm:pt-5 lg:pt-6 xl:pt-8">
                    <Link href="/contact" className="px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 bg-slate-950 text-white font-black uppercase text-[9px] sm:text-[10px] lg:text-[11px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-2xl rounded-none">
                        {t('cta.partner')}
                    </Link>
                    <Link href="/about" className="px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 border-2 border-white/40 text-white font-black uppercase text-[9px] sm:text-[10px] lg:text-[11px] tracking-widest hover:bg-white/10 transition-all rounded-none text-center">
                        {t('cta.about')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
