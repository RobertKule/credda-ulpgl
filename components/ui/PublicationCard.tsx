"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar } from "lucide-react";
import Link from "next/link";

interface PublicationCardProps {
    report: any;
    delay?: number;
}

export default function PublicationCard({ report, delay = 0 }: PublicationCardProps) {
    const title = report.title || "Titre du rapport";
    const category = report.category?.name || "Rapport / Publication";
    const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString('fr-FR', { year: 'numeric' }) : new Date().getFullYear().toString();
    const fileUrl = report.fileUrl || report.pdfUrl || "#";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                    <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>
            </div>

            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-blue-600 transition-colors group/btn flex-shrink-0"
            >
                <span>Télécharger PDF</span>
                <Download className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
        </motion.div>
    );
}
