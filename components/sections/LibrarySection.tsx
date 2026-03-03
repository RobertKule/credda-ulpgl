"use client";

import React from "react";
import { motion } from "framer-motion";
import PublicationCard from "@/components/ui/PublicationCard";
import Link from "next/link";
import { ArrowRight, BookMarked, Layers } from "lucide-react";

interface LibrarySectionProps {
    reports: any[];
    stats: {
        totalResources: number;
        publications: number;
        clinicalArticles: number;
        researchArticles: number;
    };
}

export default function LibrarySection({ reports = [], stats }: LibrarySectionProps) {
    // Use first 3 reports or fallback dummy data if empty (to satisfy design prompt)
    const displayReports = reports.length > 0 ? reports.slice(0, 3) : [
        { id: "1", title: "Rapport Annuel CREDDA 2024 - Perspectives et Impact", createdAt: new Date() },
        { id: "2", title: "Rapport Annuel CREDDA 2023 - Perspectives et Impact", createdAt: new Date() },
        { id: "3", title: "Rapport Annuel CREDDA 2022 - Perspectives et Impact", createdAt: new Date() },
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-12 h-[2px] bg-blue-600 rounded-full" />
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                                Ressources
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                            Bibliothèque Numérique
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/publications"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors group"
                        >
                            Toutes les publications
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Content Split: 2/3 Cards, 1/3 Stats Box */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Publication list */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {displayReports.map((report, index) => (
                            <PublicationCard
                                key={report.id || index}
                                report={report}
                                delay={index * 0.15}
                            />
                        ))}
                    </div>

                    {/* Side Summary Block */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-blue-900 rounded-3xl p-8 relative overflow-hidden"
                    >
                        {/* Background patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 flex flex-col h-full">
                            <BookMarked className="w-12 h-12 text-blue-400 mb-6" />

                            <h3 className="text-2xl font-serif font-bold text-white mb-4">
                                Une base de données académique riche.
                            </h3>

                            <p className="text-blue-100 font-light mb-auto leading-relaxed">
                                Accès libre aux rapports de recherche, articles cliniques, mémentos et études réalisées par nos équipes et partenaires.
                            </p>

                            <div className="mt-10 pt-8 border-t border-blue-800/50 flex items-end justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-white mb-1">
                                        {stats.totalResources > 0 ? stats.totalResources : "500+"}
                                    </div>
                                    <div className="text-sm font-medium text-blue-300 uppercase tracking-widest">
                                        Documents
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
