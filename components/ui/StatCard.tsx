"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    number: string | number;
    label: string;
    delay?: number;
}

export default function StatCard({ icon: Icon, number, label, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center justify-center text-center group"
        >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {number}{typeof number === "number" && number > 1000 ? "+" : ""}
            </h3>
            <p className="text-slate-600 font-medium text-sm md:text-base">{label}</p>
        </motion.div>
    );
}
