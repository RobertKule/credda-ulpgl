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
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
        >
            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {date && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                    </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow">
                    {excerpt}
                </p>

                <Link
                    href={`/research/${slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold group/link mt-auto"
                >
                    Lire l'article
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
