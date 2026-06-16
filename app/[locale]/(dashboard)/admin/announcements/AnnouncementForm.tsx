"use client";

import React, { useState } from "react";
import { Megaphone, Save, AlertCircle, Bell, Info, ShieldAlert, Globe } from "lucide-react";
import { createAnnouncement } from "./actions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Locale = "fr" | "en" | "sw";

export default function AnnouncementForm() {
  const [activeTab, setActiveTab] = useState<Locale>("fr");
  const [level, setLevel] = useState<"INFO" | "WARNING" | "URGENT">("INFO");
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translations, setTranslations] = useState<Record<Locale, { title: string; content: string }>>({
    fr: { title: "", content: "" },
    en: { title: "", content: "" },
    sw: { title: "", content: "" },
  });

  const handleInputChange = (field: "title" | "content", value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await createAnnouncement({
        titleFr: translations.fr.title,
        titleEn: translations.en.title,
        titleSw: translations.sw.title,
        contentFr: translations.fr.content,
        contentEn: translations.en.content,
        contentSw: translations.sw.content,
        priority: level === "URGENT" ? "CRITICAL" : level,
        targetAudience: "ALL",
        isPersistent: true,
        status: isActive ? "ACTIVE" : "INACTIVE"
      });
      if (res.success) {
        alert("Annonce enregistrée avec succès !");
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erreur de connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const levels = [
    { id: "INFO", icon: Info, label: "Information", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200" },
    { id: "WARNING", icon: AlertCircle, label: "Avertissement", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200" },
    { id: "URGENT", icon: ShieldAlert, label: "Urgent", color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-indigo-600" />
            Gestion des Annonces
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 mt-1 font-medium">Diffusez un flash-info sur tout le site public.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? "Publication..." : <><Save className="w-5 h-5" /> Publier l'annonce</>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Language Tabs */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 w-fit">
            {(["fr", "en", "sw"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-black transition-all uppercase tracking-widest",
                  activeTab === lang 
                    ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 dark:text-zinc-500 hover:text-slate-900"
                )}
              >
                {lang}
              </button>
            ))}
          </div>

          <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'annonce ({activeTab})</label>
              <input
                type="text"
                value={translations[activeTab].title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Maintenance du serveur, Nouveau rapport publié..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message principal</label>
              <textarea
                value={translations[activeTab].content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Décrivez l'annonce en quelques mots..."
                rows={4}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium resize-none leading-relaxed"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              Niveau de Criticité
            </h3>
            <div className="space-y-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id as "INFO" | "WARNING" | "URGENT")}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-[1.25rem] border transition-all text-left",
                    level === lvl.id 
                      ? `${lvl.bg} ${lvl.border} ${lvl.color} ring-4 ring-offset-0 ring-${lvl.id === 'INFO' ? 'blue' : lvl.id === 'WARNING' ? 'amber' : 'red'}-500/5` 
                      : "border-slate-100 dark:border-zinc-800 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <lvl.icon className="w-6 h-6" />
                  <span className="font-black text-sm">{lvl.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
             <div className="flex items-center justify-between p-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Statut</div>
                  <div className="text-xs text-slate-500">Activer immédiatement</div>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "w-14 h-8 rounded-full p-1 transition-all duration-500 ease-spring",
                    isActive ? "bg-indigo-600" : "bg-slate-200 dark:bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-500",
                    isActive ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
             </div>
          </section>

          <section className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
            <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="font-black text-base relative z-10 italic">Diffusion Synchronisée</h4>
            <p className="text-slate-400 text-xs mt-2 relative z-10 leading-relaxed font-medium">
              L'annonce sera visible en FR, EN et SW dès validation. Elle restera persistante jusqu'à ce que l'utilisateur la ferme explicitement.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
