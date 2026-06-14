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
} from "lucide-react";
import type { MediaItem, MediaSource, MediaType } from "@/lib/mediatheque/types";
import { MEDIA_CATEGORIES } from "@/lib/mediatheque/types";
import { cn } from "@/lib/utils";

export interface MediaFormData {
  title: string;
  description: string;
  category: string;
  type: MediaType;
  source: MediaSource;
  url: string;
  thumbnailUrl: string;
  fileSize?: string;
}

const EMPTY_FORM: MediaFormData = {
  title: "",
  description: "",
  category: MEDIA_CATEGORIES[0],
  type: "IMAGE",
  source: "LOCAL",
  url: "",
  thumbnailUrl: "",
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
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<MediaFormData>(EMPTY_FORM);
  const [fileName, setFileName] = useState<string | null>(null);
  const [externalThumbnailGenerated, setExternalThumbnailGenerated] = useState(false);

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
        fileSize: editingMedia.fileSize,
      });
      setStep(1);
    } else if (isOpen && !editingMedia) {
      setForm(EMPTY_FORM);
      setStep(1);
      setFileName(null);
      setExternalThumbnailGenerated(false);
    }
  }, [isOpen, editingMedia]);

  const updateForm = (patch: Partial<MediaFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      setFileName(file.name);
      updateForm({
        url: previewUrl,
        thumbnailUrl: previewUrl,
        fileSize: `${sizeMb} MB`,
        source: "LOCAL",
      });
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      form.type === "IMAGE"
        ? { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/avif": [".avif"] }
        : { "video/mp4": [".mp4"], "video/webm": [".webm"], "video/quicktime": [".mov"] },
    maxFiles: 1,
    disabled: form.type === "VIDEO" && form.source === "EXTERNAL",
  });

  const handleExternalUrlChange = (url: string) => {
    updateForm({ url, source: "EXTERNAL", fileSize: undefined });
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

  const canProceedStep1 = form.title.trim().length > 0 && form.category.length > 0;
  const canSubmit =
    form.title.trim().length > 0 &&
    (form.source === "EXTERNAL" ? form.url.trim().length > 0 : form.url.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit(form);
    onClose();
    setForm(EMPTY_FORM);
    setStep(1);
    setFileName(null);
    setExternalThumbnailGenerated(false);
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setForm(EMPTY_FORM);
    setFileName(null);
    setExternalThumbnailGenerated(false);
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
                  Étape {step} sur 2 — {step === 1 ? "Infos & indexation" : "Source & fichier"}
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

            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors",
                        step >= s
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                      )}
                    >
                      {step > s ? <CheckCircle2 size={16} /> : s}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold hidden sm:block",
                        step >= s ? "text-slate-900 dark:text-white" : "text-slate-400"
                      )}
                    >
                      {s === 1 ? "Indexation" : "Fichier"}
                    </span>
                    {s === 1 && (
                      <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700 mx-1" />
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
                            onClick={() => updateForm({ source, url: "", thumbnailUrl: "", fileSize: undefined })}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all",
                              form.source === source
                                ? "border-violet-600 bg-violet-50 dark:bg-violet-950/30 text-violet-800 dark:text-violet-300"
                                : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                            )}
                          >
                            {source === "LOCAL" ? <UploadCloud size={16} /> : <Link2 size={16} />}
                            {source === "LOCAL" ? "Fichier local" : "YouTube / Vimeo"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(form.type === "IMAGE" || (form.type === "VIDEO" && form.source === "LOCAL")) && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                        {form.type === "IMAGE" ? "Fichier image" : "Fichier vidéo"}
                      </label>
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
                        {form.thumbnailUrl ? (
                          <div className="relative w-full h-full p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={form.thumbnailUrl}
                              alt="Aperçu"
                              className="w-full h-full object-contain rounded-xl"
                            />
                            {fileName && (
                              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                                {fileName}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-slate-500 dark:text-zinc-500 p-6 text-center">
                            <UploadCloud size={40} className="mb-3 text-slate-400" />
                            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                              {isDragActive
                                ? "Déposez le fichier ici"
                                : "Glissez-déposez ou cliquez pour sélectionner"}
                            </p>
                            <p className="text-xs mt-1 text-slate-400">
                              {form.type === "IMAGE"
                                ? "JPG, PNG, WEBP — max 10 Mo"
                                : "MP4, WEBM — max 500 Mo"}
                            </p>
                          </div>
                        )}
                      </div>
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
                </motion.div>
              )}
            </div>

            <footer className="px-6 py-5 border-t border-slate-100 dark:border-zinc-800 flex gap-3 shrink-0">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Retour
                </button>
              )}
              <div className="flex-1" />
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
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
                    "Ajouter à la médiathèque"
                  )}
                </button>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
