"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface ResearchCardProps {
    article: any;
    delay?: number;
}

export default function ResearchCard({ article, delay = 0 }: ResearchCardProps) {
    // Use fallback values if data is missing
    const title = article.title || "Titre de la recherche";
    const excerpt = article.excerpt || (article.content ? article.content.substring(0, 100) + "..." : "Description de la recherche...");
    const imageUrl = article.coverImage || article.image || "/images/hero-poster.webp";
    const category = article.category?.name || "Recherche";
    const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "";
    const slug = article.slug || "#";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="group bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-border/40 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
        >
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                    {category}
                </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col flex-grow relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
                
                {date && (
                    <div className="relative z-10 flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4 opacity-60">
                        <Calendar className="w-3.5 h-3.5 text-primary/60" />
                        <span>{date}</span>
                    </div>
                )}

                <h3 className="relative z-10 text-xl md:text-2xl font-fraunces font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-500">
                    {title}
                </h3>

                <p className="relative z-10 text-muted-foreground mb-8 line-clamp-3 text-sm md:text-base font-outfit font-light leading-relaxed opacity-80">
                    {excerpt}
                </p>

                <div className="mt-auto pt-8 border-t border-border/30">
                    <Link
                        href={`/research/${slug}`}
                        className="inline-flex items-center gap-3 text-primary font-bold text-[11px] uppercase tracking-widest group/link"
                    >
                        Lire l'article
                        <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-primary-foreground transition-all duration-500">
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
