// app/[locale]/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  Image as ImageIcon,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('ProfilePage');
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    organization: "",
    bio: "",
    image: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        organization: (session.user as any).organization || "",
        bio: (session.user as any).bio || "",
        image: session.user.image || ""
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // Update session client-side
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: formData.image,
            phone: formData.phone,
            organization: formData.organization,
            bio: formData.bio
          }
        });
        setMessage({ type: "success", text: t('success') });
      } else {
        setMessage({ type: "error", text: t('error') });
      }
    } catch (error) {
      setMessage({ type: "error", text: t('error') });
    } finally {
      setIsSaving(false);
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Visual Profile Sidebar */}
          <div className="md:col-span-1 space-y-8">
            <div className="relative group">
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt={formData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={80} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                <p className="text-white text-xs font-bold uppercase tracking-widest">{t('actions.upload')}</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <Mail size={18} />
                <span className="text-sm font-bold truncate">{session.user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{(session.user as any).role}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.name')}</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.phone')}</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.organization')}</label>
                <div className="relative group">
                  <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.image')}</label>
                <div className="relative group">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input 
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t('fields.bio')}</label>
                <div className="relative group">
                  <FileText size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="pl-12 min-h-[150px] rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all py-4"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full sm:w-auto px-12 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-xs transition-all shadow-lg shadow-blue-600/20"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              {isSaving ? t('actions.saving') : t('actions.save')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Re-using same Lucide icon as in ProtectedRoute
function ShieldCheck({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
