"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, TreePine, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClinicalSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Image with Overlay */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative h-[600px] w-full rounded-3xl overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[#059669]/20 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-0" />
                        <Image
                            src="/images/hero-poster.webp" // Consider updating to a specific clinical image if available
                            alt="Clinique Juridique"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 z-0" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                            <Scale className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>

                    {/* Right Side: Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
                            <span className="px-4 py-2 rounded-full bg-emerald-50 text-[#059669] text-sm font-semibold tracking-wide uppercase border border-emerald-100">
                                Impact de Terrain
                            </span>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6"
                        >
                            La Clinique Juridique & Environnementale.
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-slate-600 leading-relaxed mb-10"
                        >
                            Plus qu'un centre d'étude, le CREDDA agit. Nous accompagnons les communautés locales dans la sécurisation foncière et la protection des écosystèmes forestiers.
                        </motion.p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                            <motion.div
                                variants={itemVariants}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:bg-[#059669] transition-colors">
                                    <Scale className="w-6 h-6 text-[#059669] group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">Assistance Juridique</h4>
                                <p className="text-sm text-slate-500">Accompagnement légal personnalisé pour les communautés.</p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:bg-[#1e3a8a] transition-colors">
                                    <TreePine className="w-6 h-6 text-[#1e3a8a] group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">Protection Foncière</h4>
                                <p className="text-sm text-slate-500">Sécurisation des terres et ressources naturelles.</p>
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants}>
                            <Link
                                href="/clinique"
                                className="inline-flex items-center gap-3 text-lg font-bold text-[#1e3a8a] hover:text-[#2563eb] transition-colors group"
                            >
                                NOS ACTIONS CLINIQUES
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
