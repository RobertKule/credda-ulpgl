// app/[locale]/admin/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, Star, StarOff, ArrowUp, ArrowDown,
  Eye, Upload, Search, Filter, X, AlertCircle, CheckCircle,
  MoveVertical, Grid, List, Download, Loader2, Camera, Maximize2
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
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
      toast({
        title: "Erreur de synchronisation",
        description: "L'accès à la base de données a échoué.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        toast({ title: "Supprimé", description: "L'image a été retirée de la photothèque." });
      }
    } catch (error) {
       toast({ title: "Erreur", description: "Échec de la suppression.", variant: "destructive" });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.title?.toLowerCase().includes(search.toLowerCase()) ||
                         img.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(images.map(img => img.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0A]">
        <Loader2 className="animate-spin text-[#C9A84C]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0A] text-[#F5F2EC] p-8 lg:p-12 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 border-b border-white/5 pb-12">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#C9A84C] block mb-6">Contrôle Visuel</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-black leading-[0.85]">
             Gestion de la <span className="text-[#C9A84C] italic">Galerie</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-white/10 text-white rounded-md uppercase font-black text-[10px] tracking-widest h-14 px-8 hover:bg-white hover:text-black" onClick={() => setUploadDialog(true)}>
              <Upload size={14} className="mr-3" /> Upload Automatique
           </Button>
           <Button className="bg-[#C9A84C] text-[#0C0C0A] rounded-md uppercase font-black text-[10px] tracking-widest h-14 px-8 hover:bg-[#E8C97A]" asChild>
              <Link href="/admin/gallery/new">
                <Plus size={14} className="mr-3" /> Ajouter Manuellement
              </Link>
           </Button>
        </div>
      </div>

      {/* SEARCH/FILTERS */}
      <div className="flex flex-col lg:flex-row gap-6">
         <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C9A84C] transition-colors" size={18} />
            <Input 
               placeholder="Rechercher dans les archives..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-[#111110] border-white/5 rounded-md h-16 pl-16 focus:border-[#C9A84C]/50 transition-all font-light"
            />
         </div>
         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-[300px] bg-[#111110] border-white/5 h-16 rounded-md text-white/50 font-black uppercase tracking-widest text-[10px]">
               <Filter size={14} className="mr-3 text-[#C9A84C]" />
               <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-[#111110] border-white/10 rounded-md text-white">
               {categories.map(cat => (
                 <SelectItem key={cat} value={cat} className="uppercase text-[9px] tracking-widest py-3">
                   {cat === "all" ? "Toute la photothèque" : cat}
                 </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
         {filteredImages.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-[#111110] border border-white/5 overflow-hidden">
               <Image 
                 src={img.src} 
                 alt={img.title || "Gallery Item"} 
                 fill 
                 className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
               />
               <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-sm font-serif font-black text-white truncate mb-4">{img.title || "Sans titre"}</h3>
                  <div className="flex gap-2">
                     <Button size="icon" variant="outline" className="w-10 h-10 rounded-md border-white/20 bg-black/40 text-white hover:bg-[#C9A84C] hover:text-black transition-all" asChild>
                        <Link href={`/admin/gallery/${img.id}/edit`}>
                           <Pencil size={14} />
                        </Link>
                     </Button>
                     <Button size="icon" variant="outline" className="w-10 h-10 rounded-md border-white/20 bg-black/40 text-white hover:bg-red-500 hover:border-red-500 transition-all" onClick={() => setDeleteDialog({ open: true, id: img.id })}>
                        <Trash2 size={14} />
                     </Button>
                  </div>
               </div>
               
               {img.featured && (
                  <div className="absolute top-4 left-4">
                     <Star className="text-[#C9A84C] fill-[#C9A84C]" size={16} />
                  </div>
               )}
            </div>
         ))}
      </div>

      {/* DIALOGS */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
         <DialogContent className="bg-[#111110] border-white/10 text-white rounded-md">
            <DialogHeader>
               <DialogTitle className="font-serif font-black text-2xl tracking-tight">Confirmer la suppression</DialogTitle>
               <DialogDescription className="text-white/40 pt-4">Cette action est irréversible. L'image sera définitivement retirée de la base de données.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-10">
               <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setDeleteDialog({ open: false, id: null })}>Annuler</Button>
               <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md" onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}>Confirmer Suppression</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}