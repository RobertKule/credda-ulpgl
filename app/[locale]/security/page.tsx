// app/[locale]/security/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Lock, 
  ShieldCheck, 
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('SecurityPage');
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: t('errors.dontMatch') });
      setIsUpdating(false);
      return;
    }

    try {
      const res = await fetch("/api/user/security", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: t('success') });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        const errorText = data.message === "Invalid current password" ? t('errors.wrongCurrent') : t('error');
        setMessage({ type: "error", text: errorText });
      }
    } catch (error) {
      setMessage({ type: "error", text: t('error') });
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">
            {t('title')}
          </h1>
          <p className="text-slate-500 font-light text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Security Visual Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
              <ShieldCheck size={40} />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Conseils de sécurité</h3>
              <ul className="space-y-3">
                {[
                  "Utilisez au moins 8 caractères",
                  "Mélangez lettres, chiffres et symboles",
                  "Évitez les informations personnelles"
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-400 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <KeyRound size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dernière mise à jour</p>
                <p className="text-xs font-bold text-slate-600">Non disponible</p>
              </div>
            </div>
          </div>

          {/* Security Form */}
          <div className="md:col-span-2 space-y-8">
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                  message.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.current')}</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-50 my-2" />

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.new')}</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.confirm')}</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="confirmPassword"
                    type={showNew ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUpdating}
                className="w-full sm:w-auto px-12 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-xs transition-all shadow-lg shadow-blue-600/20"
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <RefreshCw className="mr-2" size={18} />
                )}
                {isUpdating ? t('actions.updating') : t('actions.update')}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
