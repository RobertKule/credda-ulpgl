"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, Mail, Phone, Lock, Save, 
  ShieldCheck, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { updateUserProfile, updateUserPassword } from "@/services/user-actions";
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";
import { useTranslations } from "next-intl";

const createProfileSchema = (t: any) => z.object({
  name: z.string().min(2, t('messages.errorUpdate')),
  email: z.string().email(t('messages.errorUpdate')),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const createPasswordSchema = (t: any) => z.object({
  currentPassword: z.string().min(1, t('messages.errorUpdate')),
  newPassword: z.string().min(6, t('messages.errorUpdate')),
  confirmPassword: z.string().min(6, t('messages.errorUpdate')),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('messages.errorMatch'),
  path: ["confirmPassword"],
});

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    role: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations("AdminProfile");
  
  const profileSchema = createProfileSchema(t);
  const passwordSchema = createPasswordSchema(t);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    showLoading(t('messages.loadingProfile'));
    try {
      const res = await updateUserProfile(user.id, values);
      if (res.success) {
        toast.success(t('messages.successProfile'));
      } else {
        toast.error(res.error || t('messages.errorUpdate'));
      }
    } catch (error) {
      toast.error(t('messages.errorConn'));
    } finally {
      hideLoading();
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    showLoading(t('messages.loadingPassword'));
    try {
      const res = await updateUserPassword(user.id, values.currentPassword, values.newPassword);
      if (res.success) {
        toast.success(t('messages.successPassword'));
        passwordForm.reset();
      } else {
        toast.error(res.error || t('messages.errorUpdate'));
      }
    } catch (error) {
      toast.error(t('messages.errorConn'));
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Colonne Gauche : Infos & Status */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-10 rounded-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-md group-hover:bg-primary/30 transition-all duration-700" />
           <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl font-serif font-black text-blue-400 border border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                {user.name?.[0] || 'A'}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-black uppercase tracking-tighter italic leading-none">{user.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 font-outfit">{user.role}</p>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{t('card.certified')}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Mail size={16} className="text-blue-500" />
                   <span className="text-[10px] font-bold text-white/70 truncate">{user.email}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
             <AlertCircle size={14} /> {t('card.securityTitle')}
           </h4>
           <p className="text-xs text-muted-foreground font-medium leading-relaxed">
             {t('card.securityDesc')}
           </p>
        </div>
      </div>

      {/* Contenu Central : Formulaires (Col span 2) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Formulaire Profil */}
        <div className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden transition-colors">
           <div className="bg-muted/30 px-8 py-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-serif font-black uppercase tracking-tighter text-foreground">{t('personal.title')}</h3>
              <User size={18} className="text-muted-foreground" />
           </div>
           
           <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('personal.name')}</label>
                  <Input {...profileForm.register("name")} className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all font-bold text-foreground" />
                  {profileForm.formState.errors.name && <p className="text-[10px] text-destructive font-bold uppercase">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('personal.email')}</label>
                  <Input {...profileForm.register("email")} className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all font-bold text-foreground" />
                  {profileForm.formState.errors.email && <p className="text-[10px] text-destructive font-bold uppercase">{profileForm.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('personal.phone')}</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input {...profileForm.register("phone")} className="pl-12 rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all font-bold text-foreground" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('personal.bio')}</label>
                <Textarea {...profileForm.register("bio")} className="rounded-xl min-h-[120px] bg-muted/20 border-border focus:border-primary transition-all font-medium italic text-foreground" placeholder={t('personal.bioPlaceholder')} />
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 h-14 font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                   <Save size={16} className="mr-3" /> {t('personal.save')}
                </Button>
              </div>
           </form>
        </div>

        {/* Formulaire Mot de Passe */}
        <div className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden transition-colors">
           <div className="bg-muted/30 px-8 py-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-serif font-black uppercase tracking-tighter text-foreground">{t('security.title')}</h3>
              <Lock size={18} className="text-muted-foreground" />
           </div>
           
           <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="p-8 space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('security.currentPassword')}</label>
                <Input type="password" {...passwordForm.register("currentPassword")} className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all text-foreground" />
                {passwordForm.formState.errors.currentPassword && <p className="text-[10px] text-destructive font-bold uppercase">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('security.newPassword')}</label>
                  <Input type="password" {...passwordForm.register("newPassword")} className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all text-foreground" />
                  {passwordForm.formState.errors.newPassword && <p className="text-[10px] text-destructive font-bold uppercase">{passwordForm.formState.errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">{t('security.confirmPassword')}</label>
                  <Input type="password" {...passwordForm.register("confirmPassword")} className="rounded-xl h-12 bg-muted/20 border-border focus:border-primary transition-all text-foreground" />
                  {passwordForm.formState.errors.confirmPassword && <p className="text-[10px] text-destructive font-bold uppercase">{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button className="w-full bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl h-14 font-black uppercase text-[10px] tracking-[0.4em] transition-all active:scale-[0.98]">
                   {t('security.submit')}
                </Button>
              </div>
           </form>
        </div>

      </div>
    </div>
  );
}
