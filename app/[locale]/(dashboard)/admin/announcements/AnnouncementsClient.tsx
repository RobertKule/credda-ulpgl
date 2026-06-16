"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Megaphone, 
  AlertTriangle, 
  Bell, 
  Users, 
  Calendar, 
  Eye, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Archive,
  EyeOff,
  Filter
} from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from "./actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnnouncementTranslation {
  language: string;
  title: string | null;
  content: string;
}

interface DBAnnouncement {
  id: string;
  level: "INFO" | "WARNING" | "URGENT";
  targetAudience: "ALL" | "RESEARCHERS" | "PUBLIC";
  isPersistent: boolean;
  expiresAt: Date | null;
  status: "ACTIVE" | "ARCHIVED" | "SCHEDULED";
  createdAt: Date;
  announcementTranslations: AnnouncementTranslation[];
}

type TabType = "ALL" | "ACTIVE" | "ARCHIVED_SCHEDULED";
const TABS: { id: TabType; label: string }[] = [
  { id: "ALL", label: "Toutes" },
  { id: "ACTIVE", label: "Actives" },
  { id: "ARCHIVED_SCHEDULED", label: "Archivées / Planifiées" }
];

export default function AnnouncementsClient({ 
  locale, 
  initialData 
}: { 
  locale: string; 
  initialData: any[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search and tabs
  const [tab, setTab] = useState<TabType>("ALL");
  const [search, setSearch] = useState("");

  // New Filters
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterAudience, setFilterAudience] = useState<string>("ALL");

  // Selection states
  const [viewItem, setViewItem] = useState<DBAnnouncement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [formLang, setFormLang] = useState<"fr" | "en" | "sw">("fr");
  
  const [formData, setFormData] = useState({
    titleFr: "",
    titleEn: "",
    titleSw: "",
    contentFr: "",
    contentEn: "",
    contentSw: "",
    priority: "INFO" as "INFO" | "WARNING" | "CRITICAL",
    targetAudience: "ALL" as "ALL" | "RESEARCHERS" | "PUBLIC",
    isPersistent: false,
    expiresAt: "",
    status: "ACTIVE" as "ACTIVE" | "ARCHIVED" | "SCHEDULED"
  });

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setField = (key: string, val: unknown) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  // Extract translation helper
  const getTranslation = (item: DBAnnouncement) => {
    const tr = item.announcementTranslations?.find((t) => t.language === locale) 
            || item.announcementTranslations?.find((t) => t.language === "fr")
            || item.announcementTranslations?.[0];
    return {
      title: tr?.title || "Sans titre",
      content: tr?.content || ""
    };
  };

  const handleCreateNew = () => {
    setFormData({
      titleFr: "",
      titleEn: "",
      titleSw: "",
      contentFr: "",
      contentEn: "",
      contentSw: "",
      priority: "INFO",
      targetAudience: "ALL",
      isPersistent: false,
      expiresAt: "",
      status: "ACTIVE"
    });
    setEditingId(null);
    setFormStep(1);
    setFormLang("fr");
    setIsFormOpen(true);
  };

  const handleEdit = (item: DBAnnouncement) => {
    const fr = item.announcementTranslations.find(t => t.language === "fr");
    const en = item.announcementTranslations.find(t => t.language === "en");
    const sw = item.announcementTranslations.find(t => t.language === "sw");

    setEditingId(item.id);
    setFormData({
      titleFr: fr?.title || "",
      titleEn: en?.title || "",
      titleSw: sw?.title || "",
      contentFr: fr?.content || "",
      contentEn: en?.content || "",
      contentSw: sw?.content || "",
      priority: item.level === "URGENT" ? "CRITICAL" : item.level,
      targetAudience: item.targetAudience,
      isPersistent: item.isPersistent,
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : "",
      status: item.status
    });
    setFormStep(1);
    setFormLang("fr");
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.titleFr.trim() || !formData.contentFr.trim()) {
      showToast("Le titre et le contenu en français sont obligatoires.", "error");
      return;
    }

    startTransition(async () => {
      try {
        if (editingId) {
          const res = await updateAnnouncement(editingId, formData);
          if (res.success) {
            showToast("Annonce mise à jour avec succès !");
            setIsFormOpen(false);
            setEditingId(null);
            router.refresh();
          }
        } else {
          const res = await createAnnouncement(formData);
          if (res.success) {
            showToast("Annonce créée avec succès !");
            setIsFormOpen(false);
            router.refresh();
          }
        }
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Erreur de sauvegarde", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteAnnouncement(id);
        if (res.success) {
          showToast("Annonce supprimée.");
          setDeletingId(null);
          setViewItem(null);
          router.refresh();
        }
      } catch {
        showToast("Erreur lors de la suppression.", "error");
      }
    });
  };

  // Filtered lists
  const filtered = useMemo(() => {
    return (initialData as DBAnnouncement[]).filter(item => {
      // Tab Filtering
      if (tab === "ACTIVE" && item.status !== "ACTIVE") return false;
      if (tab === "ARCHIVED_SCHEDULED" && item.status === "ACTIVE") return false;

      // Priority Filter
      if (filterPriority !== "ALL") {
        const currentPrio = item.level === "URGENT" ? "CRITICAL" : item.level;
        if (currentPrio !== filterPriority) return false;
      }

      // Audience Filter
      if (filterAudience !== "ALL" && item.targetAudience !== filterAudience) return false;

      // Search Filtering
      if (search) {
        const q = search.toLowerCase();
        const tr = getTranslation(item);
        return tr.title.toLowerCase().includes(q) || tr.content.toLowerCase().includes(q);
      }
      return true;
    });
  }, [initialData, tab, search, filterPriority, filterAudience, locale]);

  const activeCount = useMemo(() => {
    return initialData.filter(a => a.status === "ACTIVE").length;
  }, [initialData]);

  const priorityColors = {
    INFO: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
    WARNING: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
    CRITICAL: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 animate-pulse font-bold",
    URGENT: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 animate-pulse font-bold"
  };

  const audienceColors: Record<string, string> = {
    ALL: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
    RESEARCHERS: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-100 dark:border-green-900/20",
    PUBLIC: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/20"
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-500",
    SCHEDULED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-500",
    ARCHIVED: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className={cn(
              "fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-white text-sm flex items-center gap-2",
              toast.type === "success" ? "bg-green-800" : "bg-red-600"
            )}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-green-800 p-1.5 rounded-lg text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Système d'Annonces Globales</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Actuellement <strong className="text-green-800 dark:text-green-500">{activeCount} annonce(s)</strong> actives sur l'interface publique.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-green-800 hover:bg-green-900 text-white rounded-2xl font-bold shadow-lg shadow-green-800/20 transition-all flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center animate-in fade-in duration-300"
        >
          <Plus className="w-5 h-5" />
          Créer une Annonce
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors select-none",
                  active ? "text-green-900 dark:text-green-500" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {active && (
                  <motion.div 
                    layoutId="announcements-tab"
                    className="absolute inset-0 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/50"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }} 
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters dropdowns and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-zinc-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="ALL">Priorité: Toutes</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          {/* Audience Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-zinc-800">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={filterAudience} 
              onChange={e => setFilterAudience(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="ALL">Audience: Toutes</option>
              <option value="RESEARCHERS">Chercheurs</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 w-full sm:w-60 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold" 
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Titre & Priorité</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Audience cible</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date de création</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Statut de diffusion</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              <AnimatePresence>
                {filtered.map((item) => {
                  const tr = getTranslation(item);
                  const mappedPriority = item.level === "URGENT" ? "CRITICAL" : item.level;
                  return (
                    <motion.tr 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Title & Priority Badge */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-sm">
                            {tr.title}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit self-start", priorityColors[item.level])}>
                            {mappedPriority}
                          </span>
                        </div>
                        {item.isPersistent && (
                          <span className="text-[10px] text-green-700 dark:text-green-500 mt-1 font-semibold flex items-center gap-1">
                            <Bell className="w-3 h-3" /> Persistant (doit être fermé manuellement)
                          </span>
                        )}
                      </td>

                      {/* Target Audience */}
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit", audienceColors[item.targetAudience] || audienceColors.ALL)}>
                          <Users className="w-3 h-3" /> {item.targetAudience === "ALL" ? "Tous" : item.targetAudience === "RESEARCHERS" ? "Chercheurs" : "Public"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400">
                        {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit", statusColors[item.status] || statusColors.ACTIVE)}>
                          {item.status === "ACTIVE" ? "Actif" : item.status === "SCHEDULED" ? "Planifiée" : "Archivée"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setViewItem(item)} 
                            title="Détails"
                            className="p-2 text-slate-400 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-700/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(item)} 
                            title="Modifier"
                            className="p-2 text-slate-400 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-700/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeletingId(item.id)} 
                            title="Supprimer"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Aucune annonce trouvée.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <AnimatePresence>
        {viewItem && (() => {
          const tr = getTranslation(viewItem);
          const mappedPriority = viewItem.level === "URGENT" ? "CRITICAL" : viewItem.level;
          return (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setViewItem(null)} 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
              />
              <motion.div 
                initial={{ x: "100%" }} 
                animate={{ x: 0 }} 
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-zinc-950 z-50 flex flex-col border-l border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-800 rounded-xl text-white">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Aperçu Annonce</span>
                      <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Détails</h2>
                    </div>
                  </div>
                  <button onClick={() => setViewItem(null)} className="p-2 rounded-full bg-white dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white shadow-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 flex-1">
                  <div className="space-y-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit", priorityColors[viewItem.level])}>
                      {mappedPriority}
                    </span>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white mt-2 leading-tight">
                      {tr.title}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Message de diffusion ({locale.toUpperCase()})</span>
                    <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{tr.content}</p>
                  </div>

                  {/* Other locales tabs */}
                  <div className="border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Autres Traductions</span>
                    {viewItem.announcementTranslations.filter(t => t.language !== locale).map(t => (
                      <div key={t.language} className="border-t border-slate-100 dark:border-zinc-800/60 pt-2 first:border-0 first:pt-0">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-green-800 dark:text-green-500">{t.language}</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-0.5">{t.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Cible</span>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 w-fit", audienceColors[viewItem.targetAudience] || audienceColors.ALL)}>
                        <Users className="w-3 h-3" /> {viewItem.targetAudience === "ALL" ? "Tous" : viewItem.targetAudience === "RESEARCHERS" ? "Chercheurs" : "Public"}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Statut</span>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit inline-block", statusColors[viewItem.status] || statusColors.ACTIVE)}>
                        {viewItem.status === "ACTIVE" ? "Actif" : viewItem.status === "SCHEDULED" ? "Planifiée" : "Archivée"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Créé le: <strong>{new Date(viewItem.createdAt).toLocaleString("fr-FR")}</strong></span>
                    </div>
                    {viewItem.expiresAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Expire le: <strong>{new Date(viewItem.expiresAt).toLocaleString("fr-FR")}</strong></span>
                    </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Persistance: <strong>{viewItem.isPersistent ? "Oui (doit être fermée par l'utilisateur)" : "Non (simple notification)"}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950 flex gap-3">
                  <button 
                    onClick={() => { handleEdit(viewItem); setViewItem(null); }}
                    className="flex-1 py-3 bg-green-800 hover:bg-green-900 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Modifier
                  </button>
                  <button 
                    onClick={() => { setDeletingId(viewItem.id); }}
                    className="px-4 py-3 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold transition-all text-sm flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deletingId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)} 
              className="fixed inset-0 bg-black/60 z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-zinc-800 text-center pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Supprimer cette annonce ?</h3>
                <p className="text-xs text-slate-500 mb-6">Cette action est irréversible. L'annonce sera immédiatement retirée de l'espace ciblé.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeletingId(null)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => handleDelete(deletingId)}
                    disabled={isPending}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
                  >
                    {isPending ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Multi-step Form Slide-over */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-zinc-950 z-50 flex flex-col border-l border-slate-200 dark:border-zinc-800 shadow-2xl"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingId ? "Modifier l'Annonce" : "Créer une Annonce"}
                  </h2>
                  <p className="text-xs text-slate-400">Étape {formStep} / 3</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-full bg-white dark:bg-zinc-800 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>

              {/* Form Steps Indicators */}
              <div className="flex items-center px-6 py-4 gap-2 border-b border-slate-100 dark:border-zinc-800">
                {[1, 2, 3].map(s => (
                  <React.Fragment key={s}>
                    <button 
                      onClick={() => setFormStep(s as 1 | 2 | 3)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all cursor-pointer",
                        formStep >= s ? "border-green-800 bg-green-800 text-white" : "border-slate-200 dark:border-zinc-700 text-slate-400"
                      )}
                    >
                      {s}
                    </button>
                    {s < 3 && <div className={cn("flex-1 h-0.5 rounded", formStep > s ? "bg-green-800" : "bg-slate-200 dark:bg-zinc-700")} />}
                  </React.Fragment>
                ))}
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div 
                      key="step-1" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300">Contenu du Message</h3>
                        
                        {/* Translation tabs inside form */}
                        <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl">
                          {(["fr", "en", "sw"] as const).map(lang => (
                            <button
                              type="button"
                              key={lang}
                              onClick={() => setFormLang(lang)}
                              className={cn(
                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                formLang === lang 
                                  ? "bg-white dark:bg-zinc-800 text-green-800 dark:text-green-400 shadow-sm"
                                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-700"
                              )}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Trilingual Title input */}
                      {formLang === "fr" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Titre de l'annonce (FR) <span className="text-red-500">*</span></label>
                          <input 
                            value={formData.titleFr} 
                            onChange={e => setField("titleFr", e.target.value)} 
                            placeholder="Ex: Appel à articles..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold" 
                          />
                        </div>
                      )}
                      {formLang === "en" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Titre de l'annonce (EN)</label>
                          <input 
                            value={formData.titleEn} 
                            onChange={e => setField("titleEn", e.target.value)} 
                            placeholder="Ex: Call for papers..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold" 
                          />
                        </div>
                      )}
                      {formLang === "sw" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Titre de l'annonce (SW)</label>
                          <input 
                            value={formData.titleSw} 
                            onChange={e => setField("titleSw", e.target.value)} 
                            placeholder="Ex: Wito wa makala..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold" 
                          />
                        </div>
                      )}

                      {/* Trilingual Content textarea */}
                      {formLang === "fr" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Contenu détaillé (FR) <span className="text-red-500">*</span></label>
                          <textarea 
                            value={formData.contentFr} 
                            onChange={e => setField("contentFr", e.target.value)} 
                            placeholder="Saisissez le message complet en français..."
                            rows={6}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none leading-relaxed" 
                          />
                        </div>
                      )}
                      {formLang === "en" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Contenu détaillé (EN)</label>
                          <textarea 
                            value={formData.contentEn} 
                            onChange={e => setField("contentEn", e.target.value)} 
                            placeholder="Saisissez le message complet en anglais..."
                            rows={6}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none leading-relaxed" 
                          />
                        </div>
                      )}
                      {formLang === "sw" && (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Contenu détaillé (SW)</label>
                          <textarea 
                            value={formData.contentSw} 
                            onChange={e => setField("contentSw", e.target.value)} 
                            placeholder="Saisissez le message complet en swahili..."
                            rows={6}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none leading-relaxed" 
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div 
                      key="step-2" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300 mb-4">Niveau de Priorité</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "INFO", label: "Info", desc: "Bleu", colorClass: "text-blue-600 border-blue-100" },
                            { id: "WARNING", label: "Warning", desc: "Orange", colorClass: "text-amber-600 border-amber-100" },
                            { id: "CRITICAL", label: "Critical", desc: "Rouge", colorClass: "text-red-600 border-red-100" }
                          ].map(p => (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => setField("priority", p.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all font-bold",
                                formData.priority === p.id 
                                  ? "border-green-800 bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-400" 
                                  : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500"
                              )}
                            >
                              <span className={cn("text-sm", p.colorClass)}>{p.label}</span>
                              <span className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{p.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300 mb-4">Audience Cible</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "ALL", label: "Tous", desc: "Public + Chercheurs" },
                            { id: "RESEARCHERS", label: "Chercheurs", desc: "Espace interne" },
                            { id: "PUBLIC", label: "Public", desc: "Espace visiteur" }
                          ].map(a => (
                            <button
                              type="button"
                              key={a.id}
                              onClick={() => setField("targetAudience", a.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all font-bold text-center",
                                formData.targetAudience === a.id 
                                  ? "border-green-800 bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-400" 
                                  : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500"
                              )}
                            >
                              <span className="text-sm">{a.label}</span>
                              <span className="text-[8px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{a.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div 
                      key="step-3" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <h3 className="font-bold text-slate-700 dark:text-zinc-300">Paramètres de Diffusion</h3>
                      
                      {/* Status select (Active / Scheduled / Archived) */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Statut Initial</label>
                        <select 
                          value={formData.status} 
                          onChange={e => setField("status", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold text-slate-800 dark:text-zinc-200"
                        >
                          <option value="ACTIVE">Active (En diffusion immédiate)</option>
                          <option value="SCHEDULED">Planifiée (Programmée)</option>
                          <option value="ARCHIVED">Archivée (Masquée)</option>
                        </select>
                      </div>

                      {/* Expiration date */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Date d'expiration automatique (optionnel)</label>
                        <input 
                          type="datetime-local" 
                          value={formData.expiresAt} 
                          onChange={e => setField("expiresAt", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all font-semibold text-slate-800 dark:text-zinc-200" 
                        />
                      </div>

                      {/* Persistent Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl">
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">Annonce Persistante</span>
                          <span className="text-[10px] text-slate-400 block leading-tight">Oblige l'utilisateur à cliquer pour fermer</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setField("isPersistent", !formData.isPersistent)}
                          className={cn(
                            "w-14 h-8 rounded-full p-1 transition-all duration-300",
                            formData.isPersistent ? "bg-green-800" : "bg-slate-200 dark:bg-zinc-800"
                          )}
                        >
                          <div 
                            className={cn(
                              "w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300",
                              formData.isPersistent ? "translate-x-6" : "translate-x-0"
                            )} 
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form Footer */}
              <div className="p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950 flex justify-between items-center">
                <button 
                  onClick={() => setFormStep(s => Math.max(1, s-1) as 1 | 2 | 3)} 
                  disabled={formStep === 1}
                  className="px-5 py-2.5 text-slate-500 font-bold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Précédent
                </button>
                {formStep < 3 ? (
                  <button 
                    onClick={() => setFormStep(s => Math.min(3, s+1) as 1 | 2 | 3)}
                    className="px-6 py-2.5 bg-green-800 hover:bg-green-900 text-white font-bold rounded-xl flex items-center gap-2"
                  >
                    Suivant <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSave} 
                    disabled={isPending}
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? "Enregistrement..." : "Sauvegarder"}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
