"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Scale, Building2, User, Landmark, ShieldCheck } from "lucide-react";

export default function LegalPage() {
  const t = useTranslations("LegalPage");
  
  const icons = [Building2, User, Landmark, ShieldCheck];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
                dangerouslySetInnerHTML={{ __html: t.raw("header.title") }} />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) && t.raw("sections").map((section: any, index: number) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Icon className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                  </div>
                  <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="pb-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto p-12 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Scale className="mx-auto mb-6 opacity-50" size={48} />
              <p className="text-lg font-light text-slate-300 italic leading-relaxed">
                "La science au service du droit, le droit au service de la paix."
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    </main>
  );
}
