"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutTimeline() {
  const t = useTranslations("AboutPage.history");
  
  // Use raw to get the array of timeline items
  const items = t.raw("timeline") as { year: string; title: string; desc: string }[];

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t("title")}
          </h2>
        </div>

        <div className="relative">
          {/* VERTICAL LINE (DESKTOP) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block opacity-30" />

          <div className="space-y-12 md:space-y-24">
            {items.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* YEAR SIDE */}
                <div className="w-full md:w-1/2 flex justify-center px-6">
                  <div className="relative">
                    <span className="text-5xl md:text-7xl font-serif font-black text-primary/10 tracking-tighter transition-colors group-hover:text-primary/20">
                      {item.year}
                    </span>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                      {item.year}
                    </div>
                  </div>
                </div>

                {/* DOT (DESKTOP CENTER) */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />

                {/* CONTENT SIDE */}
                <div className="w-full md:w-1/2 px-6">
                  <div className={`p-8 md:p-12 bg-card/50 backdrop-blur-md border border-border/40 rounded-md shadow-sm
                    hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:border-primary/40 hover:bg-card/80
                    transition-all duration-500 ${
                      i % 2 === 0 ? "text-center md:text-right" : "text-center md:text-left"
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
