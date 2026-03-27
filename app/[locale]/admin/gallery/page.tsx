// app/[locale]/admin/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, Star, StarOff, ArrowUp, ArrowDown,
  Eye, Upload, Search, Filter, X, AlertCircle, CheckCircle,
  MoveVertical, Grid, List, Download, Loader2, Camera, Maximize2, FileUp
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAutoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    const total = files.length;
    let successCount = 0;

    const { createGalleryImage } = await import("@/services/gallery-actions");

    for (let i = 0; i < total; i++) {
       const file = files[i];
       const formData = new FormData();
       formData.append("file", file);
       formData.append("uploadType", "image");
       formData.append("folder", "gallery");

       try {
         const res = await fetch("/api/upload", {
           method: "POST",
           body: formData
         });
         
         if (res.ok) {
           const { url } = await res.json();
           
           // Create DB entry
           await createGalleryImage({
              src: url,
              category: "GALLERY",
              featured: false,
              translations: [
                { language: "fr", title: file.name.split('.')[0], description: "" },
                { language: "en", title: file.name.split('.')[0], description: "" },
                { language: "sw", title: file.name.split('.')[0], description: "" }
              ]
           });
           successCount++;
         }
       } catch (error) {
         console.error("Upload failed for file:", file.name, error);
       }
       setUploadProgress(Math.round(((i + 1) / total) * 100));
    }

    setUploading(false);
    setUploadDialog(false);
    toast({
       title: "Upload Terminé",
       description: `${successCount}/${total} images ont été ajoutées à la galerie.`
    });
    fetchImages();
  };

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
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 lg:p-12 space-y-12 transition-all">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 border-b border-border pb-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-xl relative z-10">
          <span className="text-[10px] uppercase tracking-[0.6em] font-black text-primary block mb-6 animate-in fade-in slide-in-from-left-4 duration-700">Contrôle Visuel</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-black leading-[0.85] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
             Gestion de la <span className="text-primary italic">Photothèque</span>
          </h1>
        </div>
        <div className="flex gap-4 relative z-10">
           <Button variant="outline" className="border-border text-foreground rounded-xl uppercase font-black text-[10px] tracking-widest h-14 px-8 hover:bg-muted transition-all" onClick={() => setUploadDialog(true)}>
              <Upload size={14} className="mr-3" /> Upload Automatique
           </Button>
           <Button className="bg-primary text-primary-foreground rounded-xl uppercase font-black text-[10px] tracking-widest h-14 px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95" asChild>
              <Link href="/admin/gallery/new">
                <Plus size={14} className="mr-3" /> Ajouter Manuellement
              </Link>
           </Button>
        </div>
      </div>

      {/* SEARCH/FILTERS */}
      <div className="flex flex-col lg:flex-row gap-6">
         <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <Input 
               placeholder="Rechercher dans les archives visuelles..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-card border-border rounded-2xl h-16 pl-16 focus:border-primary/50 transition-all font-bold tracking-tight text-foreground shadow-inner placeholder:text-muted-foreground/20 italic"
            />
         </div>
         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-[300px] bg-card border-border h-16 rounded-2xl text-muted-foreground font-black uppercase tracking-widest text-[10px] focus:ring-primary/20 transition-all">
               <div className="flex items-center">
                 <Filter size={14} className="mr-3 text-primary" />
                 <SelectValue placeholder="Catégorie" />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl text-foreground shadow-2xl">
               {categories.map(cat => (
                 <SelectItem key={cat} value={cat} className="uppercase text-[9px] font-black tracking-widest py-4 focus:bg-primary/10 transition-colors">
                   {cat === "all" ? "Toute la photothèque" : cat}
                 </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
         {filteredImages.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-card border border-border overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700">
               <Image 
                 src={img.src} 
                 alt={img.title || "Gallery Item"} 
                 fill 
                 className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8 transform translate-y-8 group-hover:translate-y-0">
                  <h3 className="text-sm font-serif font-black text-white truncate mb-6 uppercase tracking-wider">{img.title || "Sans titre"}</h3>
                  <div className="flex gap-4">
                     <Button size="icon" variant="outline" className="w-12 h-12 rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-primary hover:border-primary transition-all duration-300" asChild>
                        <Link href={`/admin/gallery/${img.id}/edit`}>
                           <Pencil size={16} />
                        </Link>
                     </Button>
                     <Button size="icon" variant="outline" className="w-12 h-12 rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-destructive hover:border-destructive transition-all duration-300" onClick={() => setDeleteDialog({ open: true, id: img.id })}>
                        <Trash2 size={16} />
                     </Button>
                  </div>
               </div>
               
               {img.featured && (
                  <div className="absolute top-6 left-6 drop-shadow-2xl">
                     <Star className="text-primary fill-primary animate-pulse" size={20} />
                  </div>
               )}
            </div>
         ))}
      </div>

      {/* DIALOGS */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
         <DialogContent className="bg-card border-border text-foreground rounded-[2rem] shadow-3xl max-w-md p-10 transition-colors">
            <DialogHeader className="space-y-4">
               <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <AlertCircle className="text-destructive" size={32} />
               </div>
               <DialogTitle className="font-serif font-black text-3xl tracking-tight leading-none">Suppression Définitive</DialogTitle>
               <DialogDescription className="text-muted-foreground/60 italic font-medium leading-relaxed">Cette action détruira définitivement cette archive visuelle de nos serveurs. Êtes-vous certain ?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-12 flex-col sm:flex-row gap-4">
               <Button variant="ghost" className="text-muted-foreground/40 hover:text-foreground font-black uppercase text-[10px] tracking-widest h-14 rounded-xl flex-1 transition-all" onClick={() => setDeleteDialog({ open: false, id: null })}>Annuler</Button>
               <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-black uppercase text-[10px] tracking-widest h-14 px-8 flex-1 shadow-lg shadow-destructive/20 transition-all active:scale-95" onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}>Retirer l'image</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
         <DialogContent className="bg-card border-border text-foreground rounded-[3rem] shadow-3xl max-w-xl p-12 transition-colors overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <DialogHeader className="relative z-10">
               <DialogTitle className="font-serif font-black text-4xl tracking-tighter leading-none">Upload <span className="text-primary italic">Organique</span></DialogTitle>
               <DialogDescription className="text-muted-foreground/60 mt-4 italic font-medium">Glissez vos chefs-d'œuvre ici pour les ajouter instantanément à la photothèque institutionnelle.</DialogDescription>
            </DialogHeader>
            
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2.5rem] hover:border-primary/50 transition-all group relative cursor-pointer mt-10 bg-muted/20 relative z-10 overflow-hidden">
               {uploading ? (
                 <div className="w-full px-16 space-y-8 text-center animate-in fade-in duration-500">
                    <Loader2 className="animate-spin text-primary mx-auto" size={48} />
                    <div className="space-y-4">
                       <div className="w-full bg-muted h-3 rounded-full overflow-hidden shadow-inner">
                          <div className="bg-primary h-full transition-all duration-500 ease-out shadow-lg" style={{ width: `${uploadProgress}%` }} />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Synchronisation: {uploadProgress}%</p>
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <FileUp className="text-primary animate-bounce" size={32} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">Déposer vos fichiers</p>
                   <input 
                     type="file" 
                     multiple 
                     accept="image/*"
                     className="absolute inset-0 opacity-0 cursor-pointer" 
                     onChange={(e) => handleAutoUpload(e.target.files)}
                   />
                 </>
               )}
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}