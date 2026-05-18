// components/home/FAQSection.tsx
"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
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

  const faqs: FAQItem[] = [
    {
      question: t("items.0.q") || "Qu'est-ce que le CREDDA ?",
      answer: t("items.0.a") || "Le CREDDA est un centre de recherche..."
    },
    {
      question: t("items.1.q") || "Comment bénéficier de la clinique juridique ?",
      answer: t("items.1.a") || "Assistance gratuite pour les personnes vulnérables..."
    },
    {
      question: t("items.2.q") || "Acceptez-vous des chercheurs stagiaires ?",
      answer: t("items.2.a") || "Oui, nous accueillons chercheurs et étudiants..."
    },
    {
      question: t("items.3.q") || "Comment devenir partenaire ?",
      answer: t("items.3.a") || "Contactez-nous via la page partenariat..."
    }
  ];

  return (
    <section className="
      py-14 lg:py-24
      bg-gradient-to-b from-background via-background to-muted/20
      transition-colors duration-500
      overflow-hidden
    ">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14 space-y-5">
          <GSAPReveal direction="up">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-foreground">
              {t("title") || "Frequently Asked Questions"}
            </h2>
          </GSAPReveal>

          <GSAPReveal direction="up" delay={0.15}>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              {t("subtitle") || "Tout ce que vous devez savoir sur nos activités et services."}
            </p>
          </GSAPReveal>
        </div>

        {/* ACCORDION */}
        <div className="max-w-4xl mx-auto space-y-5">

          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <GSAPReveal key={idx} direction="up" delay={idx * 0.08}>
                <div
                  className={`
                    group relative rounded-2xl
                    border transition-all duration-300
                    ${isOpen
                      ? "bg-card border-primary/20 shadow-lg shadow-black/5"
                      : "bg-card/40 border-border/10 hover:border-primary/20 hover:bg-card/70"
                    }
                  `}
                >

                  {/* QUESTION */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="
                      w-full flex items-center justify-between
                      px-6 md:px-8 py-6 md:py-7
                      text-left
                      transition-all
                    "
                  >
                    <span className={`
                      text-lg md:text-xl font-semibold
                      transition-colors duration-300
                      ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"}
                    `}>
                      {faq.question}
                    </span>

                    <div className={`
                      w-9 h-9 rounded-full
                      flex items-center justify-center
                      border transition-all duration-300
                      ${isOpen
                        ? "bg-primary border-primary text-white rotate-180"
                        : "border-border text-muted-foreground group-hover:border-primary/30"
                      }
                    `}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  {/* ANSWER */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
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