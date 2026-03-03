// app/[locale]/admin/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, Star, StarOff, ArrowUp, ArrowDown,
  Eye, Upload, Search, Filter, X, AlertCircle, CheckCircle,
  MoveVertical, Grid, List, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string | null;
  order: number;
  featured: boolean;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Charger les images
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une image
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        toast({
          title: "Succès",
          description: "Image supprimée avec succès",
          variant: "success"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  // Toggle featured
  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current })
      });
      if (res.ok) {
        setImages(images.map(img => 
          img.id === id ? { ...img, featured: !current } : img
        ));
        toast({
          title: "Succès",
          description: !current ? "Image mise à la une" : "Image retirée de la une"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  // Réordonnancer (drag & drop)
  const moveImage = async (id: string, direction: "up" | "down") => {
    const index = images.findIndex(img => img.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === images.length - 1)
    ) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[direction === "up" ? index - 1 : index + 1];
    newImages[direction === "up" ? index - 1 : index + 1] = temp;

    // Mettre à jour l'ordre
    try {
      await fetch("/api/admin/gallery/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newImages.map(img => img.id) })
      });
      setImages(newImages);
    } catch (error) {
      console.error("Erreur réordonnancement:", error);
    }
  };

  // Upload d'image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/admin/gallery/new?src=${data.url}`);
        setUploadDialog(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Filtrer les images
  const filteredImages = images.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(search.toLowerCase()) ||
                         img.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques
  const categories = ["all", ...new Set(images.map(img => img.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Gestion de la Galerie
          </h1>
          <p className="text-slate-500 mt-1">
            {images.length} image{images.length > 1 ? 's' : ''} • Gérez les photos institutionnelles
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <Button asChild variant="outline">
              <button onClick={() => setUploadDialog(true)}>
                <Upload size={16} className="mr-2" />
                Upload
              </button>
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Uploader une image</DialogTitle>
                <DialogDescription>
                  Sélectionnez une image à uploader (JPG, PNG, WEBP - max 10MB)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="w-full"
                />
                {uploading && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link href="/admin/gallery/new">
              <Plus size={16} className="mr-2" />
              Nouvelle image
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Rechercher par titre ou catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "Toutes les catégories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-3"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Actions de masse */}
      {selectedImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedImages.length} image(s) sélectionnée(s)
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedImages([])}>
              <X size={14} className="mr-2" />
              Désélectionner
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 size={14} className="mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Grille des images */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all ${
                selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg bg-slate-100">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {image.featured && (
                    <Badge className="bg-amber-500 text-white border-0">
                      <Star size={12} className="mr-1 fill-white" />
                      À la une
                    </Badge>
                  )}
                </div>

                {/* Checkbox de sélection */}
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages([...selectedImages, image.id]);
                    } else {
                      setSelectedImages(selectedImages.filter(id => id !== image.id));
                    }
                  }}
                  className="absolute top-2 right-2 w-4 h-4 rounded border-slate-300"
                />

                {/* Actions au survol */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40 text-white"
                        asChild
                      >
                        <Link href={`/admin/gallery/${image.id}/edit`}>
                          <Pencil size={14} />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40 text-white"
                        onClick={() => window.open(image.src, '_blank')}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40 text-white"
                        onClick={() => moveImage(image.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40 text-white"
                        onClick={() => moveImage(image.id, "down")}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown size={14} />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/20 hover:bg-red-500/80 text-white"
                      onClick={() => setDeleteDialog({ open: true, id: image.id })}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {image.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {image.category}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleFeatured(image.id, image.featured)}
                  >
                    {image.featured ? (
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                    ) : (
                      <StarOff size={14} className="text-slate-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vue liste
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedImages.length === filteredImages.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages(filteredImages.map(img => img.id));
                      } else {
                        setSelectedImages([]);
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredImages.map((image, index) => (
                <tr key={image.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, image.id]);
                        } else {
                          setSelectedImages(selectedImages.filter(id => id !== image.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-slate-100">
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{image.title}</p>
                    {image.description && (
                      <p className="text-xs text-slate-500">{image.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{image.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {image.featured ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        À la une
                      </Badge>
                    ) : (
                      <Badge variant="outline">Standard</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveImage(image.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveImage(image.id, "down")}
                      disabled={index === images.length - 1}
                    >
                      <ArrowDown size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/gallery/${image.id}/edit`}>
                        <Pencil size={14} />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteDialog({ open: true, id: image.id })}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}