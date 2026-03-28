"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/services/user-actions";
import { useRouter, useParams } from "next/navigation";
import { ShieldAlert, Save, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function NewUserPage() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("AdminUsers.new");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "", role: "ADMIN" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createUser(data);
    if (res.success) {
      router.push(`/${locale}/admin/users`);
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-8 sm:p-10 shadow-2xl rounded-3xl space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
        <div className="text-center space-y-3">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm font-medium italic max-w-sm mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">
              {t('name')}
            </label>
            <Input 
              required 
              value={data.name} 
              onChange={e => setData({...data, name: e.target.value})} 
              className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all font-bold text-foreground" 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">
              {t('email')}
            </label>
            <Input 
              required 
              type="email" 
              value={data.email} 
              onChange={e => setData({...data, email: e.target.value})} 
              className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all font-bold text-foreground" 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">
              {t('password')}
            </label>
            <Input 
              required 
              type="password" 
              value={data.password} 
              onChange={e => setData({...data, password: e.target.value})} 
              className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all text-foreground" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-14 uppercase font-black text-xs tracking-[0.3em] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {t('submit')}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}