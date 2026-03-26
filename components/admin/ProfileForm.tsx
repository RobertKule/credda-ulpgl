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

const profileSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Requis"),
  newPassword: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string().min(6, "Minimum 6 caractères"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
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
    showLoading("Mise à jour de votre profil en cours...");
    try {
      const res = await updateUserProfile(user.id, values);
      if (res.success) {
        toast.success("Profil mis à jour avec succès");
      } else {
        toast.error(res.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      hideLoading();
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    showLoading("Sécurisation de votre nouveau mot de passe...");
    try {
      const res = await updateUserPassword(user.id, values.currentPassword, values.newPassword);
      if (res.success) {
        toast.success("Mot de passe modifié");
        passwordForm.reset();
      } else {
        toast.error(res.error || "Échec de la modification");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Colonne Gauche : Infos & Status */}
      <div className="space-y-6">
        <div className="bg-slate-900 dark:bg-slate-900/50 text-white p-10 rounded-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700" />
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
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Compte Certifié</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Mail size={16} className="text-blue-500" />
                   <span className="text-[10px] font-bold text-white/70 truncate">{user.email}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-3xl shadow-sm space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
             <AlertCircle size={14} /> Sécurité de Session
           </h4>
           <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
             Votre session admin est protégée par un protocole SSL. Si vous remarquez une activité suspecte, changez immédiatement votre mot de passe et déconnectez-vous.
           </p>
        </div>
      </div>

      {/* Contenu Central : Formulaires (Col span 2) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Formulaire Profil */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl overflow-hidden transition-colors">
           <div className="bg-slate-50 dark:bg-white/[0.02] px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-serif font-black uppercase tracking-tighter text-slate-900 dark:text-white">Informations Personnelles</h3>
              <User size={18} className="text-slate-400" />
           </div>
           
           <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Nom complet</label>
                  <Input {...profileForm.register("name")} className="rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 dark:text-white" />
                  {profileForm.formState.errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Email professionnel</label>
                  <Input {...profileForm.register("email")} className="rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 dark:text-white" />
                  {profileForm.formState.errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{profileForm.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Téléphone de liaison</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <Input {...profileForm.register("phone")} className="pl-12 rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Biographie Courte</label>
                <Textarea {...profileForm.register("bio")} className="rounded-xl min-h-[120px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all font-medium italic text-slate-900 dark:text-white" placeholder="Expertise, titres académiques..." />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-14 font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                   <Save size={16} className="mr-3" /> Enregistrer les modifications
                </Button>
              </div>
           </form>
        </div>

        {/* Formulaire Mot de Passe */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl overflow-hidden transition-colors">
           <div className="bg-slate-50 dark:bg-white/[0.02] px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-serif font-black uppercase tracking-tighter text-slate-900 dark:text-white">Sécurité & Accès</h3>
              <Lock size={18} className="text-slate-400" />
           </div>
           
           <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="p-8 space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Mot de passe actuel</label>
                <Input type="password" {...passwordForm.register("currentPassword")} className="rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 dark:text-white" />
                {passwordForm.formState.errors.currentPassword && <p className="text-[10px] text-red-500 font-bold uppercase">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Nouveau mot de passe</label>
                  <Input type="password" {...passwordForm.register("newPassword")} className="rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 dark:text-white" />
                  {passwordForm.formState.errors.newPassword && <p className="text-[10px] text-red-500 font-bold uppercase">{passwordForm.formState.errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Confirmer le nouveau</label>
                  <Input type="password" {...passwordForm.register("confirmPassword")} className="rounded-xl h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 focus-visible:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 dark:text-white" />
                  {passwordForm.formState.errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase">{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-200 rounded-xl h-14 font-black uppercase text-[10px] tracking-[0.4em] transition-all active:scale-[0.98]">
                   Réinitialiser les Clés d'Accès
                </Button>
              </div>
           </form>
        </div>

      </div>
    </div>
  );
}
