"use client";

import React, { useMemo, useState, useTransition } from "react";
import { m as motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  UploadCloud,
  HardDrive,
  Files,
  Image as ImageIcon,
  Video,
  FolderOpen,
  Loader2,
} from "lucide-react";
import type { MediaItem, MediaTab } from "@/lib/mediatheque/types";
import { MEDIA_CATEGORIES } from "@/lib/mediatheque/types";
import { computeStorageStats } from "@/lib/mediatheque/mock-data";
import AdminMediaCard from "@/components/admin/mediatheque/AdminMediaCard";
import AdminMediaLightbox from "@/components/admin/mediatheque/AdminMediaLightbox";
import DeleteConfirmModal from "@/components/admin/mediatheque/DeleteConfirmModal";
import MediaImportSlideOver, {
  type MediaFormData,
} from "@/components/admin/mediatheque/MediaImportSlideOver";
import { cn } from "@/lib/utils";
import { createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/services/gallery-actions";
import { uploadFileAction } from "@/services/storage-actions";

const TABS: { id: MediaTab; label: string; icon: React.ElementType }[] = [
  { id: "ALL", label: "Tous les fichiers", icon: Files },
  { id: "IMAGE", label: "Photos & Captures", icon: ImageIcon },
  { id: "VIDEO", label: "Vidéos & Documentaires", icon: Video },
];

interface MediathequeClientProps {
  initialItems: MediaItem[];
}

export default function MediathequeClient({ initialItems }: MediathequeClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<MediaTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const storageStats = useMemo(() => computeStorageStats(items), [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "IMAGE" && item.type === "IMAGE") ||
        (activeTab === "VIDEO" && item.type === "VIDEO");

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;

      return matchesTab && matchesSearch && matchesCategory;
    });
  }, [items, activeTab, searchQuery, categoryFilter]);

  const handleDelete = () => {
    if (!deletingMedia) return;
    setIsDeleting(true);
    startTransition(async () => {
      try {
        await deleteGalleryImage(deletingMedia.id);
        setItems((prev) => prev.filter((i) => i.id !== deletingMedia.id));
        setDeletingMedia(null);
        if (previewMedia?.id === deletingMedia.id) setPreviewMedia(null);
        router.refresh();
      } catch (error) {
        console.error("Error deleting media:", error);
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const handleFormSubmit = async (data: MediaFormData) => {
    setIsSubmitting(true);
    try {
      let mainUrl = data.url;
      const finalFiles: { url: string; fileType: string }[] = [];

      // Process and upload all files
      if (data.source === "LOCAL" && data.files && data.files.length > 0) {
        for (const fileItem of data.files) {
          let fileUrl = fileItem.url;
          if (fileUrl.startsWith("blob:")) {
            try {
              const response = await fetch(fileUrl);
              const blob = await response.blob();
              const fileExtension = data.type === "IMAGE" ? "jpg" : "mp4";
              const mimeType = data.type === "IMAGE" ? "image/jpeg" : "video/mp4";

              const formData = new FormData();
              // fileItem.file contains the actual File object if available
              formData.append("file", fileItem.file || new File([blob], `${data.title}-${Date.now()}.${fileExtension}`, { type: mimeType }));

              const uploadResult = await uploadFileAction(formData);
              if (uploadResult.error) {
                throw new Error(uploadResult.error);
              }
              fileUrl = uploadResult.url || fileUrl;
            } catch (error) {
              console.error("Error uploading file to Supabase:", error);
              throw new Error("Erreur lors de l'upload d'un des fichiers");
            }
          }
          finalFiles.push({
            url: fileUrl,
            fileType: data.type
          });
        }
        mainUrl = finalFiles[0]?.url || data.url;
      } else {
        // Fallback for single file or EXTERNAL
        if (data.source === "LOCAL" && data.url.startsWith("blob:")) {
            try {
              const response = await fetch(data.url);
              const blob = await response.blob();
              const fileExtension = data.type === "IMAGE" ? "jpg" : "mp4";
              const mimeType = data.type === "IMAGE" ? "image/jpeg" : "video/mp4";

              const formData = new FormData();
              formData.append("file", new File([blob], `${data.title}.${fileExtension}`, { type: mimeType }));

              const uploadResult = await uploadFileAction(formData);
              if (uploadResult.error) {
                throw new Error(uploadResult.error);
              }
              mainUrl = uploadResult.url || data.url;
            } catch (error) {
              console.error("Error uploading file to Supabase:", error);
              throw new Error("Erreur lors de l'upload du fichier");
            }
        }
      }

      if (editingMedia) {
        // Update existing media
        const result = await updateGalleryImage({
          id: editingMedia.id,
          src: mainUrl,
          category: data.category,
          featured: false,
          translations: [
            {
              language: "fr",
              title: data.title,
              description: data.description || "",
            },
            {
              language: "en",
              title: data.title,
              description: data.description || "",
            },
            {
              language: "sw",
              title: data.title,
              description: data.description || "",
            },
          ],
          files: finalFiles.length > 0 ? finalFiles : undefined,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        setItems((prev) =>
          prev.map((item) =>
            item.id === editingMedia.id
              ? {
                  ...item,
                  title: data.title,
                  description: data.description || undefined,
                  category: data.category,
                  type: data.type,
                  source: data.source,
                  url: mainUrl,
                  thumbnailUrl: mainUrl,
                  fileSize: data.fileSize,
                  files: finalFiles,
                }
              : item
          )
        );
        setEditingMedia(null);
      } else {
        // Create new media
        const result = await createGalleryImage({
          src: mainUrl,
          category: data.category,
          featured: false,
          translations: [
            {
              language: "fr",
              title: data.title,
              description: data.description || "",
            },
            {
              language: "en",
              title: data.title,
              description: data.description || "",
            },
            {
              language: "sw",
              title: data.title,
              description: data.description || "",
            },
          ],
          files: finalFiles.length > 0 ? finalFiles : undefined,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const newItem: MediaItem = {
          id: result.data?.id || crypto.randomUUID(),
          title: data.title,
          description: data.description || undefined,
          type: data.type,
          source: data.source,
          url: mainUrl,
          thumbnailUrl: mainUrl,
          category: data.category,
          fileSize: data.fileSize,
          createdAt: new Date().toISOString(),
          files: finalFiles,
        };
        setItems((prev) => [newItem, ...prev]);
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving media:", error);
      alert("Erreur lors de la sauvegarde du média");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (media: MediaItem) => {
    setEditingMedia(media);
    setIsImportOpen(true);
  };

  const openImport = () => {
    setEditingMedia(null);
    setIsImportOpen(true);
  };

  const navigatePreview = (direction: "next" | "prev") => {
    if (!previewMedia) return;
    const idx = filteredItems.findIndex((i) => i.id === previewMedia.id);
    if (idx === -1) return;
    const nextIdx =
      direction === "next"
        ? (idx + 1) % filteredItems.length
        : (idx - 1 + filteredItems.length) % filteredItems.length;
    setPreviewMedia(filteredItems[nextIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Médiathèque Institutionnelle
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400">
              <Files size={15} className="text-emerald-600" />
              <strong className="text-slate-900 dark:text-white">{storageStats.totalFiles}</strong>{" "}
              fichiers
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400">
              <HardDrive size={15} className="text-emerald-600" />
              <strong className="text-slate-900 dark:text-white">{storageStats.usedSpace}</strong>
              <span className="text-slate-400">/ {storageStats.totalCapacity}</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${storageStats.usagePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {storageStats.usagePercent}%
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openImport}
          className="flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] shrink-0"
        >
          <UploadCloud size={18} />
          Ajouter un Média
        </button>
      </header>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, description ou catégorie…"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-transparent focus:border-emerald-600 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-700 dark:text-zinc-300 outline-none focus:border-emerald-600 transition-colors min-w-[200px]"
        >
          <option value="ALL">Toutes les catégories</option>
          {MEDIA_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="relative flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors z-10",
                isActive
                  ? "text-emerald-800 dark:text-emerald-300"
                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mediatheque-tab"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700"
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "ALL" ? "Tous" : tab.id === "IMAGE" ? "Photos" : "Vidéos"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <AdminMediaCard
              key={item.id}
              media={item}
              index={index}
              onPreview={setPreviewMedia}
              onEdit={openEdit}
              onDelete={setDeletingMedia}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-md flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Aucun média trouvé
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== "ALL" || activeTab !== "ALL"
              ? "Ajustez vos filtres ou votre recherche pour afficher d'autres résultats."
              : "Commencez par ajouter votre premier média à la médiathèque."}
          </p>
          {!searchQuery && categoryFilter === "ALL" && activeTab === "ALL" && (
            <button
              type="button"
              onClick={openImport}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-colors"
            >
              <UploadCloud size={16} />
              Ajouter un média
            </button>
          )}
        </div>
      )}

      {/* Modals & Slide-over */}
      <AdminMediaLightbox
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onNext={filteredItems.length > 1 ? () => navigatePreview("next") : undefined}
        onPrev={filteredItems.length > 1 ? () => navigatePreview("prev") : undefined}
      />

      <DeleteConfirmModal
        media={deletingMedia}
        onClose={() => setDeletingMedia(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <MediaImportSlideOver
        isOpen={isImportOpen}
        onClose={() => {
          setIsImportOpen(false);
          setEditingMedia(null);
        }}
        onSubmit={handleFormSubmit}
        editingMedia={editingMedia}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
