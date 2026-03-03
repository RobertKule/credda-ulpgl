"use client";

import React from "react";
import { motion } from "framer-motion";
import ResearchCard from "@/components/ui/ResearchCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ResearchSectionProps {
    articles: any[];
}

export default function ResearchSection({ articles = [] }: ResearchSectionProps) {
    // Only display up to 4 articles as requested
    const displayArticles = articles.slice(0, 4);

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                            Recherches récentes
                        </h2>
                        <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/research"
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors group"
                        >
                            Voir toutes les recherches
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayArticles.length > 0 ? (
                        displayArticles.map((article, index) => (
                            <ResearchCard
                                key={article.id || index}
                                article={article}
                                delay={index * 0.15}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Aucune recherche disponible pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
