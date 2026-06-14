"use client";

import React, { useState, useMemo, useRef, useTransition } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { Domain, ContentStatus } from "@prisma/client";
import { createArticleAction, updateArticleAction, deleteArticleAction, uploadPublicationMedia } from "./actions";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Scale,
  UploadCloud,
  ChevronRight,
  X,
  FileUp,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Bold,
  Italic,
  Heading,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PublicationItem {
  id: string;
  title: string;
  type: Domain;
  category: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  pdfUrl?: string;
  status: ContentStatus;
  createdAt: string;
}

export default function PublicationsClient({ locale, initialData }: { locale: string, initialData: PublicationItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tabs & Search
  const [activeTab, setActiveTab] = useState<"ALL" | "RESEARCH" | "CLINICAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals & Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PublicationItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<PublicationItem | null>(null);
  
  // Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Controlled Form Data
  type FormData = {
    title: string;
    type: Domain;
    categorySlug: string;
    shortDescription: string;
    content: string;
    status: ContentStatus;
    imageUrl: string;
    pdfUrl: string;
  };
  const emptyForm = {
    title: "",
    type: Domain.RESEARCH,
    categorySlug: "",
    shortDescription: "",
    content: "",
    status: ContentStatus.DRAFT,
    imageUrl: "",
    pdfUrl: ""
  } as FormData;
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const setField = (field: string, value: string | Domain | ContentStatus) => setFormData(prev => ({ ...prev, [field]: value }));

  // Form Step & Editor
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [editorMode, setEditorMode] = useState<"WRITE" | "PREVIEW">("WRITE");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Markdown Helper
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    const newValue = `${before}${prefix}${selected}${suffix}${after}`;
    setField("content", newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Sorting
  const [sortField, setSortField] = useState<"createdAt" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filtering Data
  const filteredData = useMemo(() => {
    let result = [...initialData];

    if (activeTab !== "ALL") {
      result = result.filter(item => item.type === (activeTab as Domain));
    }
    
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortField === "title") {
        return sortOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return result;
  }, [initialData, activeTab, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: "createdAt" | "title") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleFileUpload = async (file: File, type: "image" | "pdf") => {
    if (!file) return;
    
    // Basic validation
    if (type === "image" && !file.type.startsWith("image/")) {
      showToast("Veuillez sélectionner une image valide.", "error");
      return;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      showToast("Veuillez sélectionner un document PDF valide.", "error");
      return;
    }

    try {
      if (type === "image") setIsUploadingImage(true);
      else setIsUploadingPdf(true);

      const form = new FormData();
      form.append("file", file);
      
      const res = await uploadPublicationMedia(form);
      if (res.error) throw new Error(res.error);
      if (res.url) {
        if (type === "image") setField("imageUrl", res.url);
        else setField("pdfUrl", res.url);
        showToast("Fichier uploadé avec succès !", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'upload", "error");
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingPdf(false);
    }
  };

  const handleOpenForm = (item?: PublicationItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        type: item.type,
        categorySlug: item.category,
        shortDescription: item.shortDescription || "",
        content: item.content || "",
        status: item.status,
        imageUrl: item.imageUrl || "",
        pdfUrl: item.pdfUrl || ""
      });
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
    }
    setFormStep(1);
    setEditorMode("WRITE");
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = {
        title: formData.title,
        type: formData.type,
        categorySlug: formData.categorySlug,
        shortDescription: formData.shortDescription,
        content: formData.content,
        status: formData.status,
        imageUrl: formData.imageUrl || undefined,
        pdfUrl: formData.pdfUrl || undefined
      };
      try {
        if (editingItem) {
          await updateArticleAction(editingItem.id, payload);
          showToast("Publication mise à jour avec succès !", "success");
        } else {
          await createArticleAction(payload);
          showToast("Publication créée avec succès !", "success");
        }
        setIsFormOpen(false);
        router.refresh();
      } catch (err) {
        showToast("Une erreur est survenue. Veuillez réessayer.", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteArticleAction(id);
        setIsDeleteModalOpen(null);
        showToast("Publication supprimée.", "success");
        router.refresh();
      } catch {
        showToast("Erreur lors de la suppression.", "error");
      }
    });
  };

  // KPI Calculations
  const stats = useMemo(() => {
    return {
      total: initialData.length,
      published: initialData.filter(i => i.status === ContentStatus.PUBLISHED).length,
      drafts: initialData.filter(i => i.status === ContentStatus.DRAFT).length,
      clinic: initialData.filter(i => i.type === Domain.CLINICAL).length
    };
  }, [initialData]);

  return (
    <div className="flex flex-col space-y-6">

      {/* ─── Toast Notification ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={cn(
              "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold border",
              toast.type === "success"
                ? "bg-green-700 text-white border-green-600"
                : "bg-red-600 text-white border-red-500"
            )}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Top Actions & KPIs ─── */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="text-slate-500 dark:text-zinc-400">
              <FileText className="w-5 h-5 mb-2" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stats.total}</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Total</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="text-emerald-500">
              <CheckCircle2 className="w-5 h-5 mb-2" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stats.published}</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Publiées</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="text-slate-400 dark:text-zinc-500">
              <Edit2 className="w-5 h-5 mb-2" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stats.drafts}</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Brouillons</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="text-[#b8932a] dark:text-[#D4AF37]">
              <Scale className="w-5 h-5 mb-2" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stats.clinic}</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Cas Cliniques</p>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="flex md:flex-col justify-center shrink-0">
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-6 py-4 md:py-0 md:h-full rounded-2xl text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95 group w-full md:w-auto"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-left leading-tight">Nouvelle<br/>Publication</span>
          </button>
        </div>
      </div>
      
      {/* ─── Controls (Tabs & Search) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Animated Tabs */}
        <div className="relative flex p-1 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl w-fit">
          {["ALL", "RESEARCH", "CLINICAL"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={cn(
                  "relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors",
                  isActive ? "text-green-800 dark:text-green-300" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="pub-tab-indicator"
                    className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-600"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "ALL" ? "Tout" : tab === "RESEARCH" ? "Recherche" : "Clinique"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher par titre ou catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all w-full sm:w-80"
          />
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-zinc-900 shadow-sm border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 w-16 text-center">Cover</th>
                <th 
                  className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors"
                  onClick={() => toggleSort("title")}
                >
                  Titre & Catégorie {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">Type</th>
                <th 
                  className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors"
                  onClick={() => toggleSort("createdAt")}
                >
                  Date {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">Statut</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              <AnimatePresence>
                {filteredData.map((item) => (
                  <motion.tr 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 mx-auto">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {item.category}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                        item.type === Domain.RESEARCH
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-[#D4AF37]/10 text-[#b8932a] dark:text-[#D4AF37]"
                      )}>
                        {item.type === Domain.RESEARCH ? <FileText className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                        {item.type === Domain.RESEARCH ? "Recherche" : "Clinique"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        item.status === ContentStatus.PUBLISHED
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30"
                          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                      )}>
                        {item.status === ContentStatus.PUBLISHED && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {item.status === ContentStatus.DRAFT && <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500" />}
                        {item.status === ContentStatus.PUBLISHED ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Aperçu"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenForm(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setIsDeleteModalOpen(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-medium">
              Aucune publication trouvée.
            </div>
          )}
        </div>
      </div>

      {/* ─── Create/Edit Slide-over Form ─── */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-zinc-950 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-zinc-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingItem ? "Modifier la Publication" : "Nouvelle Publication"}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                    Étape {formStep} sur 3
                  </p>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800">
                <motion.div 
                  className="h-full bg-green-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(formStep / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">Informations Générales</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Titre de la publication *</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ex: Rapport annuel 2026..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all dark:text-white outline-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Type *</label>
                            <select
                              value={formData.type}
                              onChange={(e) => setField("type", e.target.value as Domain)}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all dark:text-white outline-none appearance-none"
                            >
                              <option value="RESEARCH">Recherche (Article)</option>
                              <option value="CLINICAL">Clinique Juridique</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Catégorie *</label>
                            <input
                              type="text"
                              value={formData.categorySlug}
                              onChange={(e) => setField("categorySlug", e.target.value)}
                              placeholder="Ex: Droit foncier"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all dark:text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Description courte / Accroche</label>
                          <textarea
                            rows={3}
                            value={formData.shortDescription}
                            onChange={(e) => setField("shortDescription", e.target.value)}
                            placeholder="Un bref résumé pour les listes..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all dark:text-white outline-none resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 h-full flex flex-col"
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">Corps de l'Article</h3>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Contenu complet</label>
                          <div className="flex bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                            <button 
                              onClick={() => setEditorMode("WRITE")}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                editorMode === "WRITE" ? "bg-white dark:bg-zinc-700 text-green-700 dark:text-green-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
                              )}
                            >
                              <Code className="w-3.5 h-3.5" /> Markdown
                            </button>
                            <button 
                              onClick={() => setEditorMode("PREVIEW")}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                editorMode === "PREVIEW" ? "bg-white dark:bg-zinc-700 text-green-700 dark:text-green-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
                              )}
                            >
                              <Eye className="w-3.5 h-3.5" /> Aperçu
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 transition-all">
                          
                          {editorMode === "WRITE" ? (
                            <>
                              {/* Toolbar */}
                              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("**", "**"); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Gras">
                                  <Bold className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("*", "*"); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Italique">
                                  <Italic className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("### "); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Titre">
                                  <Heading className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("> "); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Citation">
                                  <Quote className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("- "); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Liste à puces">
                                  <List className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("1. "); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Liste numérotée">
                                  <ListOrdered className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("[", "](url)"); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Lien">
                                  <LinkIcon className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.preventDefault(); insertMarkdown("![Description](", ")"); }} className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-zinc-800 dark:hover:text-green-400 rounded transition-colors" title="Image">
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Textarea */}
                              <textarea 
                                ref={contentRef}
                                value={formData.content}
                                onChange={(e) => setField("content", e.target.value)}
                                placeholder="Rédigez le contenu complet ici en Markdown..." 
                                className="w-full flex-1 min-h-[300px] px-4 py-3 bg-transparent text-sm dark:text-white outline-none resize-none" 
                              />
                            </>
                          ) : (
                            <div className="w-full flex-1 min-h-[300px] p-6 bg-slate-50/50 dark:bg-zinc-900/50 overflow-y-auto prose dark:prose-invert prose-green prose-sm max-w-none">
                              {formData.content ? (
                                <ReactMarkdown>{formData.content}</ReactMarkdown>
                              ) : (
                                <p className="text-slate-400 dark:text-zinc-600 italic">Rien à afficher...</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">Médias & Fichiers</h3>
                      
                      <div className="space-y-6">
                        {/* Image Dropzone & Preview */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Image de couverture</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            hidden 
                            ref={imageInputRef} 
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "image")}
                          />
                          
                          {formData.imageUrl ? (
                            <div className="relative border-2 border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden group">
                              <img src={formData.imageUrl} alt="Couverture" className="w-full h-48 object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <button onClick={() => setField("imageUrl", "")} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700">Retirer l'image</button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => imageInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.length) handleFileUpload(e.dataTransfer.files[0], "image");
                              }}
                              className={cn(
                                "border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:border-green-500 transition-colors cursor-pointer group",
                                isUploadingImage ? "opacity-50 pointer-events-none" : ""
                              )}
                            >
                              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                {isUploadingImage ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                                {isUploadingImage ? "Upload en cours..." : "Cliquez ou glissez une image ici"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
                            </div>
                          )}
                        </div>

                        {/* PDF Upload & Preview */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Document Joint (Optionnel)</label>
                          <input 
                            type="file" 
                            accept="application/pdf" 
                            hidden 
                            ref={pdfInputRef} 
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "pdf")}
                          />

                          {formData.pdfUrl ? (
                            <div className="border border-green-500 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 flex items-center gap-4 group">
                              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800 shadow-sm border border-green-200 dark:border-green-700 flex items-center justify-center text-green-600 dark:text-green-300">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-green-800 dark:text-green-300 truncate">Document attaché</p>
                                <a href={formData.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-green-600 dark:text-green-400 hover:underline truncate block">{formData.pdfUrl}</a>
                              </div>
                              <button onClick={() => setField("pdfUrl", "")} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => pdfInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.length) handleFileUpload(e.dataTransfer.files[0], "pdf");
                              }}
                              className={cn(
                                "border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-4 bg-slate-50 dark:bg-zinc-900 hover:border-green-500/50 transition-colors cursor-pointer group",
                                isUploadingPdf ? "opacity-50 pointer-events-none" : ""
                              )}
                            >
                              <div className="flex w-full items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-slate-100 dark:border-zinc-700 flex items-center justify-center text-red-500 group-hover:text-red-600">
                                  {isUploadingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                                    {isUploadingPdf ? "Upload en cours..." : "Ajouter un PDF"}
                                  </p>
                                  <p className="text-xs text-slate-500">Pour les rapports détaillés et études</p>
                                </div>
                                <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                           <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-3">Statut de la publication</label>
                           <div className="flex gap-4">
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input
                                 type="radio"
                                 name="pub-status"
                                 value="PUBLISHED"
                                 checked={formData.status === ContentStatus.PUBLISHED}
                                 onChange={() => setField("status", ContentStatus.PUBLISHED)}
                                 className="text-green-600 focus:ring-green-600"
                               />
                               <span className="text-sm font-medium dark:text-zinc-300">Publier immédiatement</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input
                                 type="radio"
                                 name="pub-status"
                                 value="DRAFT"
                                 checked={formData.status === ContentStatus.DRAFT}
                                 onChange={() => setField("status", ContentStatus.DRAFT)}
                                 className="text-green-600 focus:ring-green-600"
                               />
                               <span className="text-sm font-medium dark:text-zinc-300">Garder en brouillon</span>
                             </label>
                           </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-between">
                <button 
                  onClick={() => formStep > 1 ? setFormStep((s) => (s - 1) as 1 | 2 | 3) : setIsFormOpen(false)}
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {formStep === 1 ? "Annuler" : "Précédent"}
                </button>
                
                <button 
                  onClick={() => {
                    if (formStep < 3) setFormStep((s) => (s + 1) as 1 | 2 | 3);
                    else handleSubmit();
                  }}
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-700 hover:bg-green-800 text-white shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isPending && formStep === 3 ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                  ) : formStep < 3 ? (
                    <>Suivant <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Enregistrer</>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsDeleteModalOpen(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-zinc-800 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Supprimer la publication ?</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8">
                  Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément de la base de données ?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteModalOpen(null)}
                    className="flex-1 py-3 px-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl text-sm font-bold transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => handleDelete(isDeleteModalOpen)}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Preview Modal ─── */}
      <AnimatePresence>
        {previewItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-950 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Aperçu de la Publication</h3>
                  <button 
                    onClick={() => setPreviewItem(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                  {previewItem.imageUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900">
                      <img src={previewItem.imageUrl} alt={previewItem.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                        previewItem.type === Domain.RESEARCH
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-[#D4AF37]/10 text-[#b8932a] dark:text-[#D4AF37]"
                      )}>
                        {previewItem.type === Domain.RESEARCH ? "Recherche" : "Clinique"}
                      </span>
                      <span className="text-xs text-slate-500 font-bold uppercase">{previewItem.category}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                      {previewItem.title}
                    </h4>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Description courte</h5>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {previewItem.shortDescription}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Contenu complet</h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      {previewItem.content || "Aucun contenu détaillé."}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
