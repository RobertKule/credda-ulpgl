// components/home/FAQSection.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const t = useTranslations("HomePage.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Fallback data if translations are missing
  const faqs: FAQItem[] = [
    {
      question: t("items.0.q") || "Qu'est-ce que le CREDDA ?",
      answer: t("items.0.a") || "Le CREDDA est un centre de recherche d'excellence dédié à l'étude des défis juridiques, politiques et sociaux en Afrique, avec un focus sur la région des Grands Lacs."
    },
    {
      question: t("items.1.q") || "Comment peut-on bénéficier de la clinique juridique ?",
      answer: t("items.1.a") || "La clinique juridique offre une assistance gratuite aux personnes vulnérables. Vous pouvez soumettre votre cas via notre portail en ligne ou vous rendre à notre bureau de Goma."
    },
    {
      question: t("items.2.q") || "Le CREDDA accepte-t-il des chercheurs stagiaires ?",
      answer: t("items.2.a") || "Oui, nous accueillons régulièrement des chercheurs et étudiants en master ou doctorat pour des stages de recherche ou des collaborations scientifiques."
    },
    {
      question: t("items.3.q") || "Comment devenir partenaire du CREDDA ?",
      answer: t("items.3.a") || "Les institutions souhaitant collaborer avec nous peuvent nous contacter via le formulaire de partenariat sur la page Contact pour discuter des modalités de coopération."
    }
  ];

  return (
    <section className="py-8 lg:py-16 bg-background transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-6">
          <GSAPReveal direction="up">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-fraunces font-black tracking-tighter leading-[0.9] text-foreground">
              {t("title") || "Frequently Asked Questions"}
            </h2>
          </GSAPReveal>
          <GSAPReveal direction="up" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              {t("subtitle") || "Tout ce que vous devez savoir sur nos activités de recherche et nos services juridiques."}
            </p>
          </GSAPReveal>
        </div>

        {/* ACCORDION BLOCK - Centered & Max Width */}
        <div className="max-w-5xl mx-auto space-y-6">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
                <div 
                  className={`group transition-all duration-500 ${
                    isOpen 
                      ? "bg-card shadow-2xl shadow-slate-200/50 dark:shadow-none border border-primary/20" 
                      : "bg-secondary/10 hover:bg-secondary/20 border border-transparent"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-8 md:p-10 text-left focus:outline-none"
                  >
                    <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                      isOpen ? "text-primary" : "text-foreground group-hover:text-primary/70"
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isOpen ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                    }`}>
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-8 pb-10 md:px-10 md:pb-12 pt-0">
                          <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-light">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GSAPReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
