"use client";
import React, { useState, useMemo } from "react";
import { Scale, Gavel, ShieldAlert, Search, Plus, Edit2, Trash2, Eye, AlertTriangle, CheckCircle2, Briefcase, ChevronUp, ChevronDown, X, ChevronRight } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CaseDetailPanel from "./CaseDetailPanel";
import { deleteClinicalCase, updateCaseStatus, createClinicalCase, updateClinicalCase } from "./actions";
import { UrgencyLevel, CaseStatus } from "@prisma/client";

function cn(...i: ClassValue[]) { return twMerge(clsx(i)); }

type SortField = "title" | "status" | "urgency" | "createdAt";
type SortDir = "asc" | "desc";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  NEW:               { label: "Nouveau",       cls: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300" },
  IN_PROGRESS:       { label: "En cours",      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  IN_ANALYSIS:       { label: "En analyse",    cls: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-600" },
  MEETING_SCHEDULED: { label: "Rendez-vous",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ACTION_ENGAGED:    { label: "Action engagée",cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  RESOLVED:          { label: "Résolu",         cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  CLOSED:            { label: "Clôturé",        cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

const URGENCY_MAP: Record<string, { cls: string }> = {
  LOW:      { cls: "text-emerald-600" },
  MEDIUM:   { cls: "text-amber-600" },
  HIGH:     { cls: "text-red-600" },
  CRITICAL: { cls: "text-red-700 font-black" },
};

type TabType = "ALL" | "NEW" | "IN_PROGRESS" | "IN_ANALYSIS" | "ACTION_ENGAGED" | "RESOLVED";
const TABS: { id: TabType; label: string }[] = [
  { id: "ALL",           label: "Tous" },
  { id: "NEW",           label: "Nouveaux" },
  { id: "IN_PROGRESS",   label: "En cours" },
  { id: "IN_ANALYSIS",   label: "En analyse" },
  { id: "ACTION_ENGAGED",label: "Action engagée" },
  { id: "RESOLVED",      label: "Résolus" },
];

interface FormData {
  title: string;
  problemType: string;
  location: string;
  description: string;
  actionsTaken: string;
  expectations: string;
  urgency: UrgencyLevel;
  status: CaseStatus;
  beneficiaryName: string;
  beneficiaryPhone: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  problemType: string;
  location: string;
  description: string;
  actionsTaken: string;
  expectations: string;
  urgency: UrgencyLevel;
  status: CaseStatus;
  createdAt: string | Date;
  trackingCode?: string;
  beneficiary?: {
    name: string;
    phone: string;
  };
  [key: string]: unknown;
}

export default function CliniqueClient({ locale, initialData }: { locale: string; initialData: ClinicalCase[] }) {
  const [tab, setTab]             = useState<TabType>("ALL");
  const [search, setSearch]       = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");
  const [viewItem, setViewItem]   = useState<ClinicalCase | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formStep, setFormStep]   = useState<1|2|3>(1);
  const [isSaving, setIsSaving]   = useState(false);
  const [formData, setFormData]   = useState<FormData>({ title: "", problemType: "", location: "", description: "", actionsTaken: "", expectations: "", urgency: "MEDIUM" as UrgencyLevel, status: "NEW" as CaseStatus, beneficiaryName: "", beneficiaryPhone: "" });
  const [toast, setToast]         = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const setField = <K extends keyof FormData>(k: K, v: FormData[K]) => setFormData(p => ({ ...p, [k]: v }));

  const showToast = (msg: string, type: "success"|"error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = initialData.filter(item => {
      if (tab !== "ALL" && item.status !== tab) return false;
      if (search) {
        const q = search.toLowerCase();
        return item.title?.toLowerCase().includes(q)
          || item.problemType?.toLowerCase().includes(q)
          || item.location?.toLowerCase().includes(q)
          || item.beneficiary?.name?.toLowerCase().includes(q)
          || item.trackingCode?.toLowerCase().includes(q);
      }
      return true;
    });
    data = [...data].sort((a, b) => {
      let av: any = a[sortField] ?? "", bv: any = b[sortField] ?? "";
      if (sortField === "createdAt") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [initialData, tab, search, sortField, sortDir]);

  const stats = [
    { label: "Total",          value: initialData.length,                                    color: "text-green-800", bg: "bg-green-50 dark:bg-green-950/20",  icon: Briefcase },
    { label: "En cours",       value: initialData.filter(c => ["IN_PROGRESS","IN_ANALYSIS","ACTION_ENGAGED"].includes(c.status)).length, color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",    icon: ShieldAlert },
    { label: "Contentieux",    value: initialData.filter(c => c.status === "ACTION_ENGAGED").length, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Gavel },
    { label: "Résolus",        value: initialData.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle2 },
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-green-800" /> : <ChevronDown className="w-3 h-3 text-green-800" />;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.problemType || !formData.location || !formData.description || !formData.beneficiaryName) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }
    try {
      setIsSaving(true);
      if (editingId) {
        const res = await updateClinicalCase(editingId, formData);
        if (res.success) {
          showToast("Dossier mis à jour avec succès !");
          setIsFormOpen(false);
          setEditingId(null);
        }
      } else {
        const res = await createClinicalCase(formData);
        if (res.success) {
          showToast(`Dossier ${res.trackingCode} créé avec succès !`);
          setIsFormOpen(false);
        }
      }
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur lors de l'enregistrement.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStart = (item: ClinicalCase) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      problemType: item.problemType || "",
      location: item.location || "",
      description: item.description || "",
      actionsTaken: item.actionsTaken || "",
      expectations: item.expectations || "",
      urgency: item.urgency || "MEDIUM",
      status: item.status || "NEW",
      beneficiaryName: item.beneficiary?.name || "",
      beneficiaryPhone: item.beneficiary?.phone || "",
    });
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClinicalCase(id);
      showToast("Dossier supprimé.");
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={cn("fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-white text-sm flex items-center gap-2",
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600")}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats + New button */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {stats.map((s, i) => (
            <div key={i} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", s.bg)}><s.icon className={cn("w-5 h-5", s.color)} /></div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setFormData({ title: "", problemType: "", location: "", description: "", actionsTaken: "", expectations: "", urgency: "MEDIUM", status: "NEW", beneficiaryName: "", beneficiaryPhone: "" }); setEditingId(null); setFormStep(1); setIsFormOpen(true); }}
          className="px-6 py-4 bg-green-800 hover:bg-green-900 text-white rounded-2xl font-bold shadow-lg shadow-green-800/20 transition-all flex items-center gap-2 whitespace-nowrap w-full lg:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nouveau Cas Clinique
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-wrap gap-1">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn("relative px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors",
                  active ? "text-green-900 dark:text-green-500" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200")}>
                {active && (
                  <motion.div layoutId="clinique-tab"
                    className="absolute inset-0 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/50"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Recherche…"
            className="pl-9 pr-4 py-2.5 w-full sm:w-72 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                <ThSort label="Titre & Problème"  field="title"     current={sortField} dir={sortDir} onClick={handleSort} />
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Bénéficiaire</th>
                <ThSort label="Statut"            field="status"    current={sortField} dir={sortDir} onClick={handleSort} />
                <ThSort label="Urgence"           field="urgency"   current={sortField} dir={sortDir} onClick={handleSort} />
                <ThSort label="Date"              field="createdAt" current={sortField} dir={sortDir} onClick={handleSort} />
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              <AnimatePresence>
                {filtered.map((item, idx) => {
                  const st = STATUS_MAP[item.status] ?? { label: item.status, cls: "bg-slate-100 text-slate-600" };
                  const urg = URGENCY_MAP[item.urgency] ?? { cls: "text-slate-500" };
                  return (
                    <motion.tr key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-4 py-4 text-xs text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-green-800 transition-colors line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.problemType} · {item.location}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-zinc-400">{item.beneficiary?.name ?? "—"}</td>
                      <td className="px-4 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", st.cls)}>{st.label}</span>
                      </td>
                      <td className={cn("px-4 py-4 text-xs font-bold uppercase tracking-wider", urg.cls)}>{item.urgency}</td>
                      <td className="px-4 py-4 text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewItem(item)} title="Voir les détails"
                            className="p-2 text-slate-400 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-700/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEditStart(item)} title="Modifier"
                            className="p-2 text-slate-400 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-700/10 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleting(item.id)} title="Supprimer"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-slate-400">
                  <Scale className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Aucun dossier trouvé.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <CaseDetailPanel item={viewItem} onClose={() => setViewItem(null)} />

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleting && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleting(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-zinc-800 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Supprimer ce dossier ?</h3>
                <p className="text-sm text-slate-500 mb-6">Cette action est irréversible.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleting(null)}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => handleDelete(deleting)}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ── Form Slide-over ── */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-zinc-950 z-50 flex flex-col border-l border-slate-200 dark:border-zinc-800 shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingId ? "Modifier le Cas Clinique" : "Nouveau Cas Clinique"}
                  </h2>
                  <p className="text-xs text-slate-400">Étape {formStep} / 3</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-full bg-white dark:bg-zinc-800 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>

              {/* Steps bar */}
              <div className="flex items-center px-6 py-4 gap-2 border-b border-slate-100 dark:border-zinc-800">
                {[1,2,3].map(s => (
                  <React.Fragment key={s}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 cursor-pointer transition-colors",
                      formStep >= s ? "border-green-800 bg-green-800 text-white" : "border-slate-200 dark:border-zinc-700 text-slate-400")}
                      onClick={() => setFormStep(s as 1|2|3)}>{s}</div>
                    {s < 3 && <div className={cn("flex-1 h-0.5 rounded", formStep > s ? "bg-green-800" : "bg-slate-200 dark:bg-zinc-700")} />}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div key="s1" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} className="space-y-4">
                      <h3 className="font-bold text-slate-700 dark:text-zinc-300">Identification du dossier</h3>
                      {[
                        { label: "Titre de l'affaire", key: "title", placeholder: "Ex: Pollution du Lac Kivu…" },
                        { label: "Type de problème", key: "problemType", placeholder: "Ex: Pollution des eaux, Déforestation…" },
                        { label: "Localisation", key: "location", placeholder: "Ex: Goma, Nord-Kivu" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                          <input value={formData[f.key as keyof FormData] as string} onChange={e => setField(f.key as keyof FormData, e.target.value)} placeholder={f.placeholder}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Urgence</label>
                        <div className="grid grid-cols-4 gap-2">
                          {["LOW","MEDIUM","HIGH","CRITICAL"].map(u => (
                            <button key={u} onClick={() => setField("urgency", u as UrgencyLevel)}
                              className={cn("px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                                formData.urgency === u ? "bg-green-800 border-green-800 text-white" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-500")}>{u}</button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {formStep === 2 && (
                    <motion.div key="s2" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} className="space-y-4">
                      <h3 className="font-bold text-slate-700 dark:text-zinc-300">Bénéficiaire & Faits</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Nom du bénéficiaire <span className="text-red-500">*</span></label>
                          <input value={formData.beneficiaryName} onChange={e => setField("beneficiaryName", e.target.value)} placeholder="Nom complet ou organisation"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Téléphone</label>
                          <input value={formData.beneficiaryPhone} onChange={e => setField("beneficiaryPhone", e.target.value)} placeholder="+243…"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Description des faits <span className="text-red-500">*</span></label>
                        <textarea value={formData.description} onChange={e => setField("description", e.target.value)}
                          className="w-full min-h-[120px] px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none"
                          placeholder="Décrivez les violations environnementales constatées…" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Actions engagées</label>
                        <textarea value={formData.actionsTaken} onChange={e => setField("actionsTaken", e.target.value)}
                          className="w-full min-h-[80px] px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none"
                          placeholder="Démarches ou mesures déjà prises…" />
                      </div>
                    </motion.div>
                  )}
                  {formStep === 3 && (
                    <motion.div key="s3" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} className="space-y-4">
                      <h3 className="font-bold text-slate-700 dark:text-zinc-300">Attentes & Stratégie</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Attentes du bénéficiaire</label>
                        <textarea value={formData.expectations} onChange={e => setField("expectations", e.target.value)}
                          className="w-full min-h-[120px] px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all resize-none"
                          placeholder="Qu'est-ce que le bénéficiaire espère obtenir…" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950 flex justify-between items-center">
                <button onClick={() => setFormStep(s => Math.max(1, s-1) as 1|2|3)} disabled={formStep === 1}
                  className="px-5 py-2.5 text-slate-500 font-bold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">Précédent</button>
                {formStep < 3
                  ? <button onClick={() => setFormStep(s => Math.min(3, s+1) as 1|2|3)}
                      className="px-6 py-2.5 bg-green-800 hover:bg-green-900 text-white font-bold rounded-xl flex items-center gap-2">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  : <button onClick={handleSave} disabled={isSaving}
                      className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-2">
                      {isSaving ? "Enregistrement…" : "Sauvegarder"}
                    </button>
                }
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThSort({ label, field, current, dir, onClick }: { label: string; field: SortField; current: SortField; dir: SortDir; onClick: (f: SortField) => void }) {
  const active = current === field;
  return (
    <th onClick={() => onClick(field)}
      className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-green-800 transition-colors select-none">
      <span className="flex items-center gap-1">
        {label}
        {active ? (dir === "asc" ? <ChevronUp className="w-3 h-3 text-green-800" /> : <ChevronDown className="w-3 h-3 text-green-800" />) : <ChevronUp className="w-3 h-3 opacity-20" />}
      </span>
    </th>
  );
}
