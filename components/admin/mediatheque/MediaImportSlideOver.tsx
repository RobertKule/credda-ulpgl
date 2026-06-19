"use client";

import React, { useCallback, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  X,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Link2,
  CheckCircle2,
  Loader2,
  Plus,
  Clapperboard,
} from "lucide-react";
import type { MediaItem, MediaSource, MediaType } from "@/lib/mediatheque/types";
import { MEDIA_CATEGORIES } from "@/lib/mediatheque/types";
import { cn } from "@/lib/utils";

export interface MediaFile {
  url: string;
  thumbnailUrl: string;
  fileSize?: string;
  fileName?: string;
  file?: File;
}

export interface MediaFormData {
  title: string;
  description: string;
  category: string;
  type: MediaType;
  source: MediaSource;
  url: string;
  thumbnailUrl: string;
  /** Image de couverture personnalisée pour les vidéos */
  coverImageUrl?: string;
  /** Fichier File brut de la cover (avant upload) */
  coverImageFile?: File;
  fileSize?: string;
  files?: MediaFile[];
}

const EMPTY_FORM: MediaFormData = {
  title: "",
  description: "",
  category: MEDIA_CATEGORIES[0],
  type: "IMAGE",
  source: "LOCAL",
  url: "",
  thumbnailUrl: "",
  coverImageUrl: undefined,
  coverImageFile: undefined,
  files: [],
};

interface MediaImportSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MediaFormData) => void | Promise<void>;
  editingMedia?: MediaItem | null;
  isSubmitting?: boolean;
}

export default function MediaImportSlideOver({
  isOpen,
  onClose,
  onSubmit,
  editingMedia,
  isSubmitting = false,
}: MediaImportSlideOverProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<MediaFormData>(EMPTY_FORM);
  const [externalThumbnailGenerated, setExternalThumbnailGenerated] = useState(false);
  const [viewingFile, setViewingFile] = useState<MediaFile | null>(null);

  React.useEffect(() => {
    if (isOpen && editingMedia) {
      setForm({
        title: editingMedia.title,
        description: editingMedia.description ?? "",
        category: editingMedia.category,
        type: editingMedia.type,
        source: editingMedia.source,
        url: editingMedia.url,
        thumbnailUrl: editingMedia.thumbnailUrl,
        coverImageUrl: editingMedia.coverImageUrl,
        coverImageFile: undefined,
        fileSize: editingMedia.fileSize,
        files: editingMedia.files?.map(f => ({
          url: f.url,
          thumbnailUrl: f.thumbnailUrl || f.url,
          fileName: f.fileName,
          fileType: f.fileType || "IMAGE"
        })) || [],
      });
      setStep(1);
    } else if (isOpen && !editingMedia) {
      setForm(EMPTY_FORM);
      setStep(1);
      setExternalThumbnailGenerated(false);
      setViewingFile(null);
    }
  }, [isOpen, editingMedia]);

  const updateForm = (patch: Partial<MediaFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newFiles = acceptedFiles.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          url: previewUrl,
          thumbnailUrl: previewUrl,
          fileSize: `${sizeMb} MB`,
          fileName: file.name,
          file: file,
        };
      });

      setForm((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles],
      }));
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      form.type === "IMAGE"
        ? { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/avif": [".avif"] }
        : { "video/mp4": [".mp4"], "video/webm": [".webm"], "video/quicktime": [".mov"] },
    multiple: true,
    disabled: form.type === "VIDEO" && form.source === "EXTERNAL",
  });

  // Dropzone dédié à l'image de couverture des vidéos
  const onDropCover = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateForm({ coverImageUrl: previewUrl, coverImageFile: file });
  }, []);

  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive,
  } = useDropzone({
    onDrop: onDropCover,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    multiple: false,
  });

  const handleExternalUrlChange = (url: string) => {
    updateForm({ url, source: "EXTERNAL", fileSize: undefined, files: [] });
    setExternalThumbnailGenerated(false);

    if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")) {
      setTimeout(() => {
        updateForm({
          thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600",
        });
        setExternalThumbnailGenerated(true);
      }, 600);
    }
  };

  const removeFile = (index: number) => {
    setForm((prev) => {
      const newFiles = [...(prev.files || [])];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const canProceedStep1 = form.title.trim().length > 0 && form.category.length > 0;
  const canProceedStep2 =
    form.source === "EXTERNAL" ? form.url.trim().length > 0 : (form.files && form.files.length > 0) || form.url.length > 0;

  const handleSubmit = async () => {
    if (!canProceedStep1 || !canProceedStep2) return;
    
    // Pass the entire form with its files array
    await onSubmit(form);

    onClose();
    setForm(EMPTY_FORM);
    setStep(1);
    setExternalThumbnailGenerated(false);
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setForm(EMPTY_FORM);
    setExternalThumbnailGenerated(false);
    setViewingFile(null);
  };

  const removeCoverImage = () => {
    updateForm({ coverImageUrl: undefined, coverImageFile: undefined });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[111] w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-zinc-800 shrink-0">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingMedia ? "Modifier le média" : "Ajouter un média"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                  Étape {step} sur 3 — {step === 1 ? "Infos & indexation" : step === 2 ? "Source & fichier" : "Confirmation"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 shrink-0 overflow-x-auto">
              <div className="flex items-center gap-3 min-w-[300px]">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-black transition-colors",
                        step >= s
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                      )}
                    >
                      {step > s ? <CheckCircle2 size={16} /> : s}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold hidden sm:block whitespace-nowrap",
                        step >= s ? "text-slate-900 dark:text-white" : "text-slate-400"
                      )}
                    >
                      {s === 1 ? "Indexation" : s === 2 ? "Fichiers" : "Confirmer"}
                    </span>
                    {s < 3 && (
                      <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700 mx-1 min-w-[20px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => updateForm({ title: e.target.value })}
                      placeholder="Ex. Conférence annuelle 2025"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      rows={3}
                      placeholder="Description facultative du média…"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:border-emerald-600 transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                      Catégorie *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateForm({ category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:border-emerald-600 transition-colors"
                    >
                      {MEDIA_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                      Type de média *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["IMAGE", "VIDEO"] as MediaType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            updateForm({
                              type,
                              source: type === "IMAGE" ? "LOCAL" : form.source,
                            })
                          }
                          className={cn(
                            "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all",
                            form.type === type
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                              : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                          )}
                        >
                          {type === "IMAGE" ? <ImageIcon size={16} /> : <Video size={16} />}
                          {type === "IMAGE" ? "Image" : "Vidéo"}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {form.type === "VIDEO" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                        Source vidéo
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["LOCAL", "EXTERNAL"] as MediaSource[]).map((source) => (
                          <button
                            key={source}
                            type="button"
                            onClick={() => updateForm({ source, url: "", thumbnailUrl: "", fileSize: undefined, files: [] })}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all",
                              form.source === source
                                ? "border-violet-600 bg-violet-50 dark:bg-violet-950/30 text-violet-800 dark:text-violet-300"
                                : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                            )}
                          >
                            {source === "LOCAL" ? <UploadCloud size={16} /> : <Link2 size={16} />}
                            {source === "LOCAL" ? "Fichiers locaux" : "YouTube / Vimeo"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(form.type === "IMAGE" || (form.type === "VIDEO" && form.source === "LOCAL")) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                          {form.type === "IMAGE" ? "Fichiers images" : "Fichiers vidéos"}
                        </label>
                        {form.files && form.files.length > 0 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            {form.files.length} fichier(s)
                          </span>
                        )}
                      </div>

                      {form.files && form.files.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            {form.files.map((file, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 group cursor-pointer" onClick={() => setViewingFile(file)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {form.type === "IMAGE" ? (
                                  <img src={file.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Aperçu" />
                                ) : (
                                  <video src={file.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">Voir</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                  className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div
                            {...getRootProps()}
                            className="w-full py-4 border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl cursor-pointer hover:bg-emerald-100/50 transition-colors flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400 group"
                          >
                            <input {...getInputProps()} />
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Plus size={20} />
                            </div>
                            <span className="text-sm font-bold">Ajouter plus de médias</span>
                          </div>
                        </div>
                      ) : form.thumbnailUrl && editingMedia ? (
                        <div
                          {...getRootProps()}
                          className={cn(
                            "relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            isDragActive
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : "border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-emerald-400"
                          )}
                        >
                          <input {...getInputProps()} />
                          <div className="relative w-full h-full p-3 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {form.type === "IMAGE" ? (
                              <img src={form.thumbnailUrl} className="w-full h-full object-contain rounded-xl" alt="Fichier actuel" />
                            ) : (
                              <video src={form.thumbnailUrl} className="w-full h-full object-contain rounded-xl" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl m-3">
                              <span className="text-white text-sm font-bold">Cliquez ou glissez pour remplacer</span>
                            </div>
                            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                              Fichier actuel
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={cn(
                            "relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                            isDragActive
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : "border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-emerald-400 hover:bg-emerald-50/30"
                          )}
                        >
                          <input {...getInputProps()} />
                          <div className="w-16 h-16 bg-blue-100 dark:bg-zinc-800 text-blue-600 dark:text-zinc-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                            {isDragActive
                              ? "Déposez les fichiers ici"
                              : "Glissez-déposez ou cliquez pour ajouter des fichiers"}
                          </p>
                          <p className="text-xs mt-1 text-slate-400">
                            {form.type === "IMAGE"
                              ? "Sélection multiple autorisée (JPG, PNG...)"
                              : "Sélection multiple autorisée (MP4...)"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {form.type === "VIDEO" && form.source === "EXTERNAL" && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                        Lien YouTube ou Vimeo
                      </label>
                      <input
                        type="url"
                        value={form.url}
                        onChange={(e) => handleExternalUrlChange(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=…"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:border-violet-600 transition-colors"
                      />
                      {externalThumbnailGenerated && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.thumbnailUrl}
                            alt="Miniature générée"
                            className="w-16 h-10 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-xs font-bold text-violet-800 dark:text-violet-300 flex items-center gap-1">
                              <CheckCircle2 size={14} />
                              Miniature générée automatiquement
                            </p>
                            <p className="text-[10px] text-violet-600 dark:text-violet-400 mt-0.5">
                              Aperçu simulé depuis la plateforme externe
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* === Image de couverture pour les vidéos === */}
                  {form.type === "VIDEO" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
                          <Clapperboard size={13} />
                          Image de couverture
                        </label>
                        {form.coverImageUrl && (
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                          >
                            <X size={11} /> Supprimer
                          </button>
                        )}
                      </div>

                      {form.coverImageUrl ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.coverImageUrl}
                            alt="Image de couverture"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div
                              {...getCoverRootProps()}
                              className="cursor-pointer"
                            >
                              <input {...getCoverInputProps()} />
                              <span className="text-white text-sm font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                                Changer la couverture
                              </span>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            Couverture définie
                          </div>
                        </motion.div>
                      ) : (
                        <div
                          {...getCoverRootProps()}
                          className={cn(
                            "relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all gap-3",
                            isCoverDragActive
                              ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-violet-400 hover:bg-violet-50/30 dark:hover:bg-violet-950/10"
                          )}
                        >
                          <input {...getCoverInputProps()} />
                          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center">
                            <Clapperboard size={22} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                              {isCoverDragActive ? "Déposez l'image ici" : "Ajouter une image de couverture"}
                            </p>
                            <p className="text-xs mt-0.5 text-slate-400">
                              JPG, PNG ou WebP • Recommandé : 16/9
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Tout est prêt !</h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                      Vous allez importer <strong>{form.source === "LOCAL" && form.files ? form.files.length : 1}</strong> média(s) sous la catégorie <strong>{form.category}</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Récapitulatif</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Titre :</strong> {form.title}</p>
                      {form.description && <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Description :</strong> {form.description}</p>}
                      <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Type :</strong> {form.type}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Tout est prêt !</h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                      Vous allez importer <strong>{form.source === "LOCAL" && form.files ? form.files.length : 1}</strong> média(s) sous la catégorie <strong>{form.category}</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Récapitulatif</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Titre :</strong> {form.title}</p>
                      {form.description && <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Description :</strong> {form.description}</p>}
                      <p className="text-sm text-slate-700 dark:text-zinc-300"><strong>Type :</strong> {form.type}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <footer className="px-6 py-5 border-t border-slate-100 dark:border-zinc-800 flex gap-3 shrink-0">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Retour
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceedStep2 || isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Traitement en cours...
                    </>
                  ) : editingMedia ? (
                    "Enregistrer"
                  ) : (
                    "Confirmer et Ajouter"
                  )}
                </button>
              )}
            </footer>
          </motion.aside>
          
          {/* File Viewer Modal */}
          <AnimatePresence>
            {viewingFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingFile(null)}
                className="fixed inset-0 bg-black/90 z-[120] backdrop-blur-md flex items-center justify-center p-4"
              >
                <button className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 p-2 rounded-full"><X size={24} /></button>
                {form.type === "IMAGE" ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={viewingFile.url} className="max-w-full max-h-[90vh] object-contain rounded-lg" alt="Preview" />
                ) : (
                  <video src={viewingFile.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" />
                )}
                {viewingFile.fileName && (
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 px-4 py-2 rounded-full font-medium shadow-xl">
                    {viewingFile.fileName} {viewingFile.fileSize ? `(${viewingFile.fileSize})` : ""}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
