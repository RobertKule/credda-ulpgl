"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Save, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Type,
  AlignLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Locale = "fr" | "en" | "sw";

interface FormData {
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
}

const INITIAL_DATA: Record<Locale, FormData> = {
  fr: { title: "", content: "", status: "DRAFT" },
  en: { title: "", content: "", status: "DRAFT" },
  sw: { title: "", content: "", status: "DRAFT" },
};

export default function ResearchesPage() {
  const [activeTab, setActiveTab] = useState<Locale>("fr");
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value }
    }));
  };

  const tabs: { key: Locale; label: string; flag: string }[] = [
    { key: "fr", label: "Français", flag: "🇫🇷" },
    { key: "en", label: "English", flag: "🇬🇧" },
    { key: "sw", label: "Kiswahili", flag: "🇰🇪" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Nouvelle Publication</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Gérez le contenu de votre recherche dans toutes les langues.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <Eye className="w-4 h-4" />
            Aperçu
          </button>
          <button 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Enregistrement..." : "Publier tout"}
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all",
              activeTab === tab.key 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
            )}
          >
            <span>{tab.flag}</span>
            {tab.label}
            {formData[tab.key].status === "PUBLISHED" && (
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-400" />
                  Titre de la publication ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData[activeTab].title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Entrez un titre percutant..."
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-slate-400" />
                  Contenu détaillé
                </label>
                <textarea
                  value={formData[activeTab].content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Rédigez votre contenu ici (supporte le Markdown)..."
                  rows={12}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <aside className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Statut de la version
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleInputChange("status", "DRAFT")}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                  formData[activeTab].status === "DRAFT"
                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Brouillon</span>
                </div>
                {formData[activeTab].status === "DRAFT" && <div className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>

              <button
                onClick={() => handleInputChange("status", "PUBLISHED")}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                  formData[activeTab].status === "PUBLISHED"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Publié</span>
                </div>
                {formData[activeTab].status === "PUBLISHED" && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </section>

          <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="font-bold text-lg relative z-10">Optimisation i18n</h4>
            <p className="text-white/80 text-sm mt-2 relative z-10 leading-relaxed">
              Une fois publié, ce contenu sera immédiatement indexé par le moteur de recherche régional.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
