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
      <div className="flex items-center justify-between gap-6 pb-8 border-b border-border">
        <div>
           <h1 className="text-4xl font-serif font-black text-foreground transition-colors">
             Annonces <span className="text-primary font-light italic">Systèmes</span>
           </h1>
           <p className="text-muted-foreground/60 text-[10px] sm:text-xs mt-2 uppercase tracking-[0.3em] font-black transition-colors">Diffuser un message à tous les utilisateurs</p>
        </div>
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5">
           <Megaphone size={28} />
        </div>
      </div>

      <Card className="p-8 bg-card border-border rounded-2xl shadow-2xl transition-all">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Nouveau Message</label>
            <Input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Maintenance prévue ce soir à 0h00..."
              className="bg-muted/40 border-border h-16 rounded-xl font-bold px-6 text-foreground focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/20"
            />
          </div>
          <Button 
            disabled={isLoading}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
          >
            {isLoading ? <Plus className="animate-spin mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
            Diffuser Maintenant
          </Button>
        </form>
      </Card>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 ml-1">Historique des annonces</h2>
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
                  p-8 rounded-2xl border transition-all duration-700 group relative overflow-hidden
                  ${ann.isActive 
                    ? 'bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.05)]' 
                    : 'bg-card border-border opacity-60'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <p className={`font-serif text-lg font-bold transition-colors ${ann.isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                      {ann.content}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-3 transition-colors">
                      Créée le {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(ann.id, ann.isActive)}
                      className={`
                        w-12 h-12 rounded-xl transition-all active:scale-90 flex items-center justify-center shadow-lg
                        ${ann.isActive 
                          ? 'bg-primary text-primary-foreground shadow-primary/20' 
                          : 'bg-muted text-muted-foreground/40 hover:text-primary hover:bg-primary/10'
                        }
                      `}
                    >
                      {ann.isActive ? <Power size={20} /> : <PowerOff size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all active:scale-90"
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
