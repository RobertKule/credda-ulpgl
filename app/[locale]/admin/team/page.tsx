// app/[locale]/admin/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users, Loader2, Globe, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  email: string | null;
  image: string | null;
  translations: { language: string; name: string; role: string; bio: string | null }[];
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    image: "",
    translations: [
      { language: "fr", name: "", role: "", bio: "" },
      { language: "en", name: "", role: "", bio: "" },
      { language: "sw", name: "", role: "", bio: "" }
    ]
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setMembers(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger l'annuaire", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      email: "",
      image: "",
      translations: [{ language: "fr", name: "", role: "", bio: "" }, { language: "en", name: "", role: "", bio: "" }, { language: "sw", name: "", role: "", bio: "" }]
    });
    setIsDialogOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditingId(m.id);
    const trans = ["fr", "en", "sw"].map(l => ({
       language: l,
       name: m.translations.find(tr => tr.language === l)?.name || "",
       role: m.translations.find(tr => tr.language === l)?.role || "",
       bio: m.translations.find(tr => tr.language === l)?.bio || ""
    }));
    setFormData({
      email: m.email || "",
      image: m.image || "",
      translations: trans
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast({ title: "Succès", description: "Membre enregistré." });
        fetchMembers();
        setIsDialogOpen(false);
      }
    } catch {
       toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Retirer ce membre de l'annuaire ?")) return;
    try {
      await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      setMembers(members.filter(m => m.id !== id));
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
          <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#C9A84C] block mb-6">Secrétariat Scientifique</span>
          <h1 className="text-5xl lg:text-7xl font-serif font-black leading-[0.85]">
             Annuaire des <span className="text-[#C9A84C] italic">Chercheurs</span>
          </h1>
        </div>
        <Button className="bg-[#C9A84C] text-[#0C0C0A] rounded-none uppercase font-black text-[10px] tracking-widest h-14 px-10 hover:bg-[#E8C97A]" onClick={openAdd}>
           <Plus size={14} className="mr-3" /> Nouveau Profil
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {members.map((m) => {
            const fr = m.translations.find(tr => tr.language === "fr");
            return (
               <div key={m.id} className="bg-[#111110] border border-white/5 overflow-hidden group hover:border-[#C9A84C]/30 transition-all">
                  <div className="relative aspect-[3/4] bg-black">
                     {m.image ? (
                        <Image src={m.image} alt={fr?.name || "Member"} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                           <Users size={64} strokeWidth={0.5} />
                        </div>
                     )}
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="outline" className="w-10 h-10 rounded-none bg-black/60 border-white/10 text-white hover:bg-[#C9A84C] hover:text-black transition-all" onClick={() => openEdit(m)}>
                           <Pencil size={14} />
                        </Button>
                        <Button size="icon" variant="outline" className="w-10 h-10 rounded-none bg-black/60 border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-all" onClick={() => handleDelete(m.id)}>
                           <Trash2 size={14} />
                        </Button>
                     </div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-serif font-black text-[#F5F2EC] mb-1">{fr?.name || "Chercheur"}</h3>
                     <p className="text-[9px] uppercase tracking-widest text-[#C9A84C] font-black">{fr?.role || "Rôle non défini"}</p>
                  </div>
               </div>
            );
         })}
      </div>

      {/* EDIT DIALOG */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#111110] border-white/10 text-white max-w-4xl rounded-none">
             <DialogHeader>
                <DialogTitle className="font-serif font-black text-2xl">{editingId ? "Éditer le Profil" : "Nouveau Profil"}</DialogTitle>
             </DialogHeader>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">
                {/* GLOBAL DATA */}
                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Email de contact</label>
                       <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-black/40 border-white/5 rounded-none" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Image URL (Cloudinary)</label>
                       <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-black/40 border-white/5 rounded-none" />
                   </div>
                </div>

                {/* TRANSLATED DATA */}
                <div className="space-y-8 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                   {formData.translations.map((tr, i) => (
                      <div key={tr.language} className="space-y-4 p-6 bg-black/40 border border-white/5">
                         <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                            <Globe size={14} className="text-[#C9A84C]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">{tr.language}</span>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-white/10">Nom Complet</label>
                            <Input value={tr.name} onChange={e => {
                               const nt = [...formData.translations];
                               nt[i].name = e.target.value;
                               setFormData({ ...formData, translations: nt });
                            }} className="bg-[#111110] border-white/5 rounded-none h-10 text-sm" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-white/10">Rôle Académique</label>
                            <Input value={tr.role} onChange={e => {
                               const nt = [...formData.translations];
                               nt[i].role = e.target.value;
                               setFormData({ ...formData, translations: nt });
                            }} className="bg-[#111110] border-white/5 rounded-none h-10 text-sm" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-white/10">Biographie Courte</label>
                            <Textarea value={tr.bio} onChange={e => {
                               const nt = [...formData.translations];
                               nt[i].bio = e.target.value;
                               setFormData({ ...formData, translations: nt });
                            }} className="bg-[#111110] border-white/5 rounded-none text-sm min-h-[80px]" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <DialogFooter className="border-t border-white/5 pt-8">
                <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button className="bg-[#C9A84C] text-black font-black uppercase text-[10px] tracking-widest rounded-none h-14 px-10" onClick={handleSubmit} disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="animate-spin" /> : "Générer Profil"}
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
