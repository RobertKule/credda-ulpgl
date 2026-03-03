"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    image?: string;
}

export default function TeamCarousel({ team = [] }: { team: TeamMember[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth >= 1024 ? scrollRef.current.clientWidth / 3 :
                scrollRef.current.clientWidth >= 768 ? scrollRef.current.clientWidth / 2 :
                    scrollRef.current.clientWidth;

            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    if (team.length === 0) return null;

    return (
        <div className="relative">
            {/* Navigation */}
            <div className="flex gap-2 mb-6 md:absolute md:-top-24 md:right-0 md:mb-0 justify-end z-10">
                <button
                    onClick={() => scroll("left")}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors bg-white shadow-sm"
                    aria-label="Previous member"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors bg-white shadow-sm"
                    aria-label="Next member"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Carousel Track */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 px-4 -mx-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {team.map((member, index) => {
                    const imageUrl = member.image || "/images/hero-poster.webp";
                    const name = member.name || "Nom du Membre";
                    const role = member.role || "Rôle";

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            key={member.id || index}
                            className="min-w-full md:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)] snap-start flex-shrink-0"
                        >
                            <div className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-slate-100 p-4 transition-all duration-300">
                                <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100">
                                    <Image
                                        src={imageUrl}
                                        alt={name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply" />
                                </div>
                                <div className="text-center px-2 pb-2">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
                                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{role}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
