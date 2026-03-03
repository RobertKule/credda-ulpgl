"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PartnersSectionProps {
    partners?: string[];
}

// In case the partners list is empty, we fall back to a predefined array of placeholder names
const FALLBACK_PARTNERS = [
    "Université de Genève",
    "Réseau Clinique Juridique Francophone",
    "Fonds pour l'Environnement Mondial",
    "WWF",
    "PNUD",
    "OSC Locales",
    "Barreau du Nord-Kivu",
    "Université de Kisangani"
];

export default function PartnersSection({ partners = [] }: PartnersSectionProps) {
    const displayPartners = partners.length > 0 ? partners : FALLBACK_PARTNERS;

    // We double the list to create the seamless infinite scroll effect
    const scrollingPartners = [...displayPartners, ...displayPartners];

    return (
        <section className="py-20 md:py-24 bg-white border-t border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex flex-col items-center gap-2 mb-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                            Partenaires Internationaux
                        </h2>
                        <div className="w-16 h-1 mt-2 bg-blue-600 rounded-full" />
                    </div>
                    <p className="text-slate-500 max-w-2xl mx-auto mt-4">
                        Notre réseau mondial d'institutions académiques et d'organisations environnementales.
                    </p>
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full flex overflow-hidden mask-image-blur group">

                <div className="animate-infinite-scroll flex gap-12 sm:gap-20 items-center justify-start w-max px-6 sm:px-10 group-hover:pause-animation">
                    {scrollingPartners.map((partner, idx) => (
                        <div
                            key={`${partner}-${idx}`}
                            className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 min-w-max"
                        >
                            <span className="text-lg md:text-xl font-bold font-sans text-slate-800 uppercase tracking-widest px-4">
                                {typeof partner === 'string' ? partner : "Partenaire"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Style for the infinite scroll and mask */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          .mask-image-blur {
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-50% - 0.5rem)); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
          }
          .pause-animation {
            animation-play-state: paused;
          }
        `}} />
            </div>
        </section>
    );
}
