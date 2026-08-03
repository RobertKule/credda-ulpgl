"use client";

import React from "react";
import Image from "next/image";

export default function PartnerSection({ partners = [] }: { partners?: string[] }) {
    const allPartners = [
        "logoulpgl.webp", 
        ...partners
    ];

    return (
        <section className="py-8 bg-background border-y border-border overflow-hidden w-full relative z-20 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="relative flex overflow-hidden">
                    {/* Conteneur du défilement */}
                    <div className="flex animate-infinite-scroll gap-8 lg:gap-16 items-center whitespace-nowrap py-4">
                        {[...allPartners, ...allPartners, ...allPartners].map((logo, i) => {
                            const srcPath = logo === "logoulpgl.webp" ? `/logoulpgl.webp` : `/images/partenaires/${logo}`;
                            
                            return (
                                <div 
                                    key={i} 
                                    className="relative w-32 h-32 lg:w-32 lg:h-32 grayscale opacity-80 dark:opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer shrink-0"
                                >
                                    <Image 
                                        src={srcPath} 
                                        alt={`Partner ${i}`} 
                                        fill
                                        sizes="128px" 
                                        className="object-contain" 
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
              @keyframes infinite-scroll { 
                from { transform: translateX(0); } 
                to { transform: translateX(-33.33%); } 
              }
              .animate-infinite-scroll { 
                animation: infinite-scroll 25s linear infinite; 
              }
            `}</style>
        </section>
    );
}