"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Eye, EyeOff, Save, ShieldAlert,
  Camera, Pencil, CheckCircle2, X, Phone, FileText, Globe
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { updateUserProfile, updateUserPassword, uploadUserProfileImage } from "@/services/user-actions";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Requis"),
  newPassword: z.string().min(6, "Min 6 caractères"),
  confirmPassword: z.string().min(6, "Min 6 caractères"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface ProfileClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    role: string;
    image: string | null;
    createdAt: Date;
  };
  locale: string;
}

type Tab = "personal" | "security" | "preferences";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal", label: "Informations", icon: User },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "preferences", label: "Préférences", icon: Globe },
];

function getRoleBadge(role: string) {
  if (role === "SUPERADMIN") return "bg-purple-500/10 text-purple-600 border-purple-500/20";
  if (role === "ADMIN") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (role === "EDITOR") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
}

function calcCompletion(user: ProfileClientProps["user"]) {
  const fields = [user.name, user.email, user.phone, user.bio, user.image];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default function ProfileClient({ user, locale }: ProfileClientProps) {
  const router = useRouter();
  const currentLocale = useLocale();
  const { update: updateSession } = useSession();

  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "success">("idle");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completion = calcCompletion(user);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name || "", phone: user.phone || "", bio: user.bio || "" },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsSaving(true);
    try {
      const res = await updateUserProfile(user.id, values);
      if (res.success) {
        toast.success("Profil mis à jour avec succès !");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur de mise à jour");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsSaving(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsSavingPassword(true);
    try {
      const res = await updateUserPassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res.success) {
        toast.success("Mot de passe modifié !");
        passwordForm.reset();
      } else {
        toast.error(res.error || "Erreur");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Fichier image requis"); return; }

    setIsUploading(true);
    setUploadProgress("uploading");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadUserProfileImage(fd);
      if (res.error) { toast.error(res.error); setUploadProgress("idle"); return; }
      if (res.url) {
        await updateUserProfile(user.id, { image: res.url });
        await updateSession({ image: res.url });
        setUploadProgress("success");
        toast.success("Photo de profil mise à jour !");
        setTimeout(() => { setUploadProgress("idle"); router.refresh(); }, 1500);
      }
    } catch {
      toast.error("Erreur lors de l'envoi");
      setUploadProgress("idle");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const progressColor = completion < 40 ? "bg-red-500" : completion < 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6">

      {/* === HERO HEADER === */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-emerald-500/5 via-white to-transparent dark:from-emerald-900/10 dark:via-neutral-900 p-6 lg:p-8">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">

            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-0.5 shadow-xl">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-white dark:bg-neutral-800 flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.name || "Profil"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-neutral-700 dark:text-white">{user.name?.[0] || "U"}</span>
                  )}
                </div>
              </div>
              {/* Overlay */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-0 rounded-2xl bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isUploading || uploadProgress === "success" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                {uploadProgress === "uploading" && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-[9px] font-bold text-white tracking-wider">Import...</span>
                  </div>
                )}
                {uploadProgress === "success" && (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-[9px] font-bold text-emerald-300 tracking-wider">Succès !</span>
                  </div>
                )}
                {uploadProgress === "idle" && (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-[9px] font-bold text-white tracking-wider uppercase">Modifier</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Info + Progress */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {user.name || "Utilisateur"}
                </h1>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Complétude du profil</span>
                  <span className={`text-[11px] font-black ${completion >= 70 ? "text-emerald-600" : completion >= 40 ? "text-amber-600" : "text-red-500"}`}>{completion}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {completion < 100 && (
                  <p className="text-[10px] text-neutral-400">
                    {!user.phone && "· Numéro de téléphone "}
                    {!user.bio && "· Biographie "}
                    {!user.image && "· Photo de profil "}
                    manquant{(!user.phone || !user.bio || !user.image) ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* === TABS === */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-1.5 flex gap-1 shadow-sm">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setIsEditing(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${activeTab === id ? "text-emerald-700 dark:text-emerald-300" : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
            >
              <Icon className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline relative z-10">{label}</span>
              {activeTab === id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20" initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* === CONTENT === */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">

          {/* --- PERSONAL TAB --- */}
          {activeTab === "personal" && (
            <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white">Informations personnelles</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">{isEditing ? "Modifiez vos informations ci-dessous" : "Vos informations de profil"}</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-bold border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier le profil
                    </button>
                  ) : (
                    <button
                      onClick={() => { setIsEditing(false); profileForm.reset(); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-sm font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Annuler
                    </button>
                  )}
                </div>

                <div className="p-8">
                  {!isEditing ? (
                    /* View Mode */
                    <div className="space-y-4">
                      {[
                        { icon: User, label: "Nom complet", value: user.name || "—" },
                        { icon: Mail, label: "Adresse e-mail", value: user.email },
                        { icon: Phone, label: "Téléphone", value: user.phone || "—" },
                        { icon: FileText, label: "Biographie", value: user.bio || "—" },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Edit Mode */
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Nom complet</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input {...profileForm.register("name")} className="h-12 pl-11 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                        </div>
                        {profileForm.formState.errors.name && <p className="text-xs text-red-500">{profileForm.formState.errors.name.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">E-mail <Lock className="w-3 h-3" /></label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input value={user.email} disabled className="h-12 pl-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 cursor-not-allowed opacity-60" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input {...profileForm.register("phone")} className="h-12 pl-11 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Biographie</label>
                        <Textarea {...profileForm.register("bio")} className="min-h-[100px] rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 resize-none" placeholder="Parlez-nous de vous..." />
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Modification de vos informations en cours...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer les modifications
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- SECURITY TAB --- */}
          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg overflow-hidden">
                <div className="px-8 py-5 border-b border-neutral-100 dark:border-neutral-800">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">Changer le mot de passe</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Utilisez un mot de passe fort d'au moins 8 caractères</p>
                </div>
                <div className="p-8 space-y-5">
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">Ne partagez jamais votre mot de passe. CREDDA ne vous le demandera jamais.</p>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                    {(["current", "new", "confirm"] as const).map((field) => {
                      const labels = { current: "Mot de passe actuel", new: "Nouveau mot de passe", confirm: "Confirmer le mot de passe" };
                      const keys = { current: "currentPassword", new: "newPassword", confirm: "confirmPassword" } as const;
                      const err = passwordForm.formState.errors[keys[field]];
                      return (
                        <div key={field} className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{labels[field]}</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <Input
                              type={showPassword[field] ? "text" : "password"}
                              {...passwordForm.register(keys[field])}
                              className="h-12 pl-11 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                            />
                            <button type="button" onClick={() => setShowPassword(p => ({ ...p, [field]: !p[field] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                              {showPassword[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {err && <p className="text-xs text-red-500">{err.message}</p>}
                        </div>
                      );
                    })}

                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSavingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Modification en cours...
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-4 h-4" />
                          Mettre à jour le mot de passe
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- PREFERENCES TAB --- */}
          {activeTab === "preferences" && (
            <motion.div key="preferences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg overflow-hidden">
                <div className="px-8 py-5 border-b border-neutral-100 dark:border-neutral-800">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">Préférences</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Langue d'affichage de l'interface</p>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Langue</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ code: "fr", label: "Français", flag: "🇫🇷" }, { code: "en", label: "English", flag: "🇬🇧" }, { code: "sw", label: "Kiswahili", flag: "🇹🇿" }].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => router.push(`/${lang.code}/admin/profile`)}
                        className={`h-14 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 ${currentLocale === lang.code ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-300"}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-xs">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-[11px] text-neutral-400 text-center">Vos données sont protégées et sécurisées par CREDDA.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
