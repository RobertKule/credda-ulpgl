"use client";

import { m as motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function AboutStory() {
  const locale = useLocale();
  const t = useTranslations("AboutPage.story");

  return (
    <section className="py-24 lg:py-40">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-6xl mx-auto bg-card rounded-md shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-border/50 relative overflow-hidden group"
        >
          {/* ANIMATED BORDER BEAM */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_15deg,transparent_30deg)] animate-border-beam" />
          </div>
          {/* INNER MASK */}
          <div className="absolute inset-[1.5px] bg-card rounded-[inherit] z-0" />

          {/* CONTENT CONTAINER */}
          <div className="relative z-10 p-8 md:p-16 lg:p-14">
            <div className="flex flex-col space-y-12 lg:space-y-16">
              {/* ROW 1: TITLE & IMAGE */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* BRANDING / TITLE */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col space-y-4 text-center lg:text-left items-center lg:items-start"
                >
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">
                    {t("badge")}
                  </span>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                    {t("title")}
                  </h2>
                </motion.div>

                {/* IMAGE SIDE */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex justify-center lg:justify-end"
                >
                  <div className="relative aspect-[16/10] w-full max-w-lg rounded-md overflow-hidden shadow-2xl group
                                  hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-500">
                    <Image
                      src="/images/recheche.webp"
                      alt="Institutional Story"
                      fill
                      priority
                      className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                    />
                    {/* DARK OVERLAY ON HOVER */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
                    {/* GLASS OVERLAY */}
                    <div className="absolute inset-x-4 bottom-4 p-4 bg-background/40 backdrop-blur-md border border-white/10 rounded shadow-lg
                                    translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white text-[10px] font-bold tracking-widest uppercase text-center">
                        {t("image_label")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ROW 2: NARRATIVE & HIGHLIGHTS */}
              <div className="grid grid-cols-1 gap-8 pt-6 border-t border-border/50">
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  {/* STORY TEXT - SPANS 2 COLS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-2 space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed font-light"
                  >
                    <p className="border-l-4 border-primary/30 pl-6 italic text-left">
                      {t("p1")}
                    </p>
                    <p className="text-left">
                      {t("p2")}
                    </p>
                  </motion.div>

                  {/* KEY HIGHLIGHTS - SPANS 1 COL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full">
                    {[
                      { icon: "01", label: locale === "fr" ? "Excellence" : "Excellence" },
                      { icon: "02", label: locale === "fr" ? "Indépendance" : "Independence" },
                      { icon: "03", label: locale === "fr" ? "Impact Social" : "Social Impact" },
                      { icon: "04", label: locale === "fr" ? "Innovation" : "Innovation" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.icon}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-3 rounded-[1.5rem] border border-border/40
                                   hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80
                                   transition-all duration-500 group"
                      >
                        <span className="text-[10px] font-black text-primary/40 group-hover:text-primary transition-colors">
                          {item.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
