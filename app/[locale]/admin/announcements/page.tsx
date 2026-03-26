"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Power, PowerOff, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/admin/announcements');
    if (res.ok) {
      const data = await res.json();
      setAnnouncements(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, isActive: true })
      });
      if (res.ok) {
        toast.success("Annonce créée et activée");
        setContent("");
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Annonce désactivée" : "Annonce activée");
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Annonce supprimée");
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white">Annonces Systèmes</h1>
           <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-black">Diffuser un message à tous les utilisateurs</p>
        </div>
        <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center text-[#C9A84C]">
           <Megaphone size={24} />
        </div>
      </div>

      <Card className="p-6 bg-white dark:bg-[#0C0C0A] border-slate-200 dark:border-white/5 rounded-3xl shadow-xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">Nouveau Message</label>
            <Input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Maintenance prévue ce soir à 0h00..."
              className="bg-slate-50 dark:bg-white/5 border-transparent h-14 rounded-2xl font-bold px-6"
            />
          </div>
          <Button 
            disabled={isLoading}
            className="w-full h-14 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0C0C0A] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#C9A84C]/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="mr-2" size={20} />
            Diffuser Maintenant
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Historique des annonces</h2>
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {announcements.map((ann) => (
              <motion.div
                key={ann.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  p-6 rounded-3xl border transition-all duration-500 group
                  ${ann.isActive 
                    ? 'bg-[#C9A84C]/5 border-[#C9A84C]/20 shadow-[0_0_50px_rgba(201,168,76,0.05)]' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-60'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className={`font-bold transition-colors ${ann.isActive ? 'text-slate-900 dark:text-[#C9A84C]' : 'text-slate-500'}`}>
                      {ann.content}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">
                      Créée le {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(ann.id, ann.isActive)}
                      className={`
                        p-3 rounded-2xl transition-all active:scale-90
                        ${ann.isActive 
                          ? 'bg-[#C9A84C] text-[#0C0C0A]' 
                          : 'bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-[#C9A84C]'
                        }
                      `}
                    >
                      {ann.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
