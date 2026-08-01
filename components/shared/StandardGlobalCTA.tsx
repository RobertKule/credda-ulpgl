"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface StandardGlobalCTAProps {
  title: React.ReactNode;
  subtitle: string;
  buttonText: string;
  href: string;
  className?: string;
  bgImage?: string;
}

export default function StandardGlobalCTA({
  title,
  subtitle,
  buttonText,
  href,
  className = "",
  bgImage,
}: StandardGlobalCTAProps) {
  return (
    <section className={`py-24 lg:py-40 relative overflow-hidden ${className}`}>
      {/* Background image (optional) */}
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-background" />
      )}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-background/90 dark:bg-background/80 backdrop-blur-xl border border-border/50 p-8 lg:p-14 rounded-2xl text-center shadow-2xl"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 inline-block">
            Collaboration &amp; Contact
          </span>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-[1.1] mb-4">
            {title}
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed mb-8">
            {subtitle}
          </p>
          
          <Link 
            href={href}
            className="inline-flex items-center gap-4 bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold uppercase tracking-widest text-[11px] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(201,168,76,0.3)] group"
          >
            {buttonText}
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
