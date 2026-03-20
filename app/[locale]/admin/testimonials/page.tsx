// app/[locale]/admin/testimonials/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Quote, Loader2, CheckCircle, XCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  isPublished: boolean;
  translations: { language: string; quote: string }[];
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    authorName: "",
    authorRole: "",
    isPublished: true,
    translations: [
      { language: "fr", quote: "" },
      { language: "en", quote: "" },
      { language: "sw", quote: "" }
    ]
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les témoignages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      authorName: "",
      authorRole: "",
      isPublished: true,
      translations: [{ language: "fr", quote: "" }, { language: "en", quote: "" }, { language: "sw", quote: "" }]
    });
    setIsDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    const trans = ["fr", "en", "sw"].map(l => ({
       language: l,
       quote: t.translations.find(tr => tr.language === l)?.quote || ""
    }));
    setFormData({
      authorName: t.authorName,
      authorRole: t.authorRole,
      isPublished: t.isPublished,
      translations: trans
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast({ title: "Succès", description: "Témoignage enregistré." });
        fetchTestimonials();
        setIsDialogOpen(false);
      }
    } catch {
       toast({ title: "Erreur", description: "Opération échouée", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({ title: "Supprimé" });
    } catch {
      toast({ title: "Erreur deletion", variant: "destructive" });
    }
  };

  if (loading) return <div className="h-screen bg-[#0C0C0A] flex items-center justify-center"><Loader2 className="animate-spin text-[#C9A84C]" /></div>;

  return (
    <div className="min-h-screen bg-[#0C0C0A] text-[#F5F2EC] p-8 lg:p-12 space-y-12">
       <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 border-b border-white/5 pb-12">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#C9A84C] block mb-6">Voix d'Afrique</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-black leading-[0.85]">
             Gestion des <span className="text-[#C9A84C] italic">Témoignages</span>
          </h1>
        </div>
        <Button className="bg-[#C9A84C] text-[#0C0C0A] rounded-none uppercase font-black text-[10px] tracking-widest h-14 px-10 hover:bg-[#E8C97A]" onClick={openAdd}>
           <Plus size={14} className="mr-3" /> Nouveau Témoignage
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {testimonials.map((t) => (
            <div key={t.id} className="p-8 bg-[#111110] border border-white/5 space-y-6 group hover:border-[#C9A84C]/30 transition-all">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-black flex items-center justify-center text-[#C9A84C] border border-white/5">
                     <Quote size={20} />
                  </div>
                  <div className="flex gap-2">
                     <Button size="icon" variant="ghost" className="text-white/20 hover:text-[#C9A84C]" onClick={() => openEdit(t)}>
                        <Pencil size={14} />
                     </Button>
                     <Button size="icon" variant="ghost" className="text-white/20 hover:text-red-500" onClick={() => handleDelete(t.id)}>
                        <Trash2 size={14} />
                     </Button>
                  </div>
               </div>

               <p className="text-[#F5F2EC]/40 italic text-sm line-clamp-3">
                  "{t.translations.find(tr => tr.language === "fr")?.quote || "Pas de version française"}"
               </p>

               <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                     <p className="text-sm font-black uppercase text-[#F5F2EC]">{t.authorName}</p>
                     <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] pt-1">{t.authorRole}</p>
                  </div>
                  <Badge variant={t.isPublished ? "default" : "outline"} className={t.isPublished ? "bg-[#C9A84C] text-black rounded-none h-6 uppercase text-[8px] font-black tracking-widest" : "border-white/10 text-white/20 rounded-none h-6 uppercase text-[8px] tracking-widest"}>
                     {t.isPublished ? "Publié" : "Brouillon"}
                  </Badge>
               </div>
            </div>
         ))}
      </div>

      {/* EDIT/ADD DIALOG */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#111110] border-white/10 text-white max-w-2xl rounded-none">
             <DialogHeader>
                <DialogTitle className="font-serif font-black text-2xl">{editingId ? "Éditer le Témoignage" : "Nouveau Témoignage"}</DialogTitle>
             </DialogHeader>
             
             <div className="space-y-6 py-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Auteur</label>
                      <Input 
                        value={formData.authorName} 
                        onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                        className="bg-black/40 border-white/5 rounded-none text-white h-12"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Rôle / Titre</label>
                      <Input 
                        value={formData.authorRole} 
                        onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                        className="bg-black/40 border-white/5 rounded-none text-white h-12"
                      />
                   </div>
                </div>

                {formData.translations.map((tr, i) => (
                   <div key={tr.language} className="space-y-2">
                      <div className="flex items-center gap-2">
                         <Globe size={12} className="text-[#C9A84C]" />
                         <label className="text-[10px] uppercase font-black tracking-widest text-[#C9A84C]">Citation ({tr.language})</label>
                      </div>
                      <Textarea 
                        value={tr.quote} 
                        onChange={e => {
                           const newTrans = [...formData.translations];
                           newTrans[i].quote = e.target.value;
                           setFormData({ ...formData, translations: newTrans });
                        }}
                        className="bg-black/40 border-white/5 rounded-none text-white min-h-[100px]"
                      />
                   </div>
                ))}
             </div>

             <DialogFooter className="border-t border-white/5 pt-8">
                <Button variant="ghost" className="text-white/20 hover:text-white" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button className="bg-[#C9A84C] text-black font-black uppercase text-[10px] tracking-widest rounded-none h-14 px-10" onClick={handleSubmit} disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="animate-spin" /> : "Sauvegarder"}
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
