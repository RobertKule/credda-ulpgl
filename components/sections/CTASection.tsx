"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function CTASection() {
    return (
        <section className="relative py-24 lg:py-32 bg-[#1e3a8a] overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2" />
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-10 text-blue-200"
                    >
                        <Globe className="w-10 h-10" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-8"
                    >
                        Bâtir l'avenir par la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Science.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-blue-100 font-light max-w-3xl mb-12 leading-relaxed"
                    >
                        Rejoignez le CREDDA-ULPGL pour contribuer activement à la clinique juridique et participer à des recherches d'envergure internationale.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full"
                    >
                        <Link
                            href="/contact"
                            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1e3a8a] px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            Connexion Internationale
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/about"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                        >
                            Le Projet CREDDA
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
