"use client";

import React from "react";
import { motion } from "framer-motion";
import TeamCarousel from "@/components/ui/TeamCarousel";

interface TeamSectionProps {
    team?: any[];
}

export default function TeamSection({ team = [] }: TeamSectionProps) {
    // Use team prop, if empty provide elegant fallback to show design
    const displayTeam = team.length > 0 ? team : [
        { id: "1", name: "Dr. Jean Dupont", role: "Directeur Général", image: "/images/hero-poster.webp" },
        { id: "2", name: "Prof. Marie Curie", role: "Chercheuse Principale", image: "/images/hero-poster.webp" },
        { id: "3", name: "Me. Albert Camus", role: "Avocat Conseil", image: "/images/hero-poster.webp" },
        { id: "4", name: "Dr. Léa Yavo", role: "Biologiste Experte", image: "/images/hero-poster.webp" },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 max-w-2xl relative z-10"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-12 h-[2px] bg-blue-600 rounded-full" />
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                            L'Équipe
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                        Leadership Scientifique
                    </h2>
                </motion.div>

                <TeamCarousel team={displayTeam} />
            </div>

            {/* Hide scrollbar styles needed for next/image responsive scroll */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
        </section>
    );
}
