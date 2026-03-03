"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    hoverEffect?: "lift" | "scale" | "glow" | "none";
}

export default function AnimatedCard({
    children,
    delay = 0,
    className = "",
    hoverEffect = "lift",
    ...props
}: AnimatedCardProps) {

    const hoverVariants = {
        lift: { y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
        scale: { scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
        glow: { boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)" },
        none: {}
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            whileHover={hoverVariants[hoverEffect]}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
