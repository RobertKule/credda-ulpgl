"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PartnerSectionProps {
    partners: string[];
}

export default function PartnerSection({ partners = [] }: PartnerSectionProps) {
    const t = useTranslations('HomePage');

    if (!partners || partners.length === 0) return null;

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <p className="text-center text-[8px] sm:text-[9px] lg:text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] sm:tracking-[0.45em] lg:tracking-[0.5em] mb-8 sm:mb-10 lg:mb-12">
                {t('partners.title')}
            </p>
            <div className="relative flex overflow-hidden">
                <div className="flex animate-infinite-scroll gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center whitespace-nowrap">
                    {[...partners, ...partners].map((logo, i) => (
                        <div key={i} className="relative w-24 sm:w-32 lg:w-36 xl:w-44 h-8 sm:h-10 lg:h-12 xl:h-16 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer">
                            <Image src={`/images/partenaires/${logo}`} alt="Partner" fill className="object-contain" />
                        </div>
                    ))}
                </div>
            </div>
            <style jsx global>{`
        @keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-infinite-scroll { animation: infinite-scroll 45s linear infinite; }
        
        @media (max-width: 640px) {
          .animate-infinite-scroll { animation-duration: 35s; }
        }
      `}</style>
        </section>
    );
}
