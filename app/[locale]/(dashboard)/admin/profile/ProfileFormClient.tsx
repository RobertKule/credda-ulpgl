"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Eye, EyeOff, Save, ShieldAlert,
  Clock, Calendar
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { updateUserProfile, updateUserPassword } from "@/services/user-actions";

const createProfileSchema = (t: any) => z.object({
  name: z.string().min(2, t('messages.errorUpdate')),
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

interface ProfileFormClientProps {
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

export default function ProfileFormClient({ user, locale }: ProfileFormClientProps) {
  const t = useTranslations("AdminProfile");
  const router = useRouter();
  const currentLocale = useLocale();
  
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "preferences">("personal");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcome.morning');
    if (hour < 18) return t('welcome.afternoon');
    return t('welcome.evening');
  };

  const profileSchema = createProfileSchema(t);
  const passwordSchema = createPasswordSchema(t);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    try {
      const res = await updateUserPassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      if (res.success) {
        toast.success(t('messages.successPassword'));
        passwordForm.reset();
      } else {
        toast.error(res.error || t('messages.errorUpdate'));
      }
    } catch (error) {
      toast.error(t('messages.errorConn'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}/admin/profile`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t('card.securityDesc');
    return new Date(date).toLocaleDateString(currentLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ADMIN':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'RESEARCHER':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const tabs = [
    { id: 'personal' as const, label: t('personal.title'), icon: User },
    { id: 'security' as const, label: t('security.title'), icon: Lock },
    { id: 'preferences' as const, label: t('preferences.title'), icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
          {getGreeting()}, {user.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
          {t('header.subtitle')}
        </p>
      </motion.div>

      {/* Two-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Identity Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden relative">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                        {user.name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400 text-xs">
                    {t('card.certified')}: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                  {t('card.securityTitle')}
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {t('card.securityDesc')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form with Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                        activeTab === tab.id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('personal.name')}
                        </label>
                        <Input 
                          {...profileForm.register("name")} 
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white" 
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-xs text-red-500 font-medium">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          {t('personal.email')}
                          <Lock className="w-3 h-3" />
                        </label>
                        <div className="relative">
                          <Input 
                            value={user.email}
                            disabled
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 cursor-not-allowed font-medium" 
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('personal.phone')}
                        </label>
                        <Input 
                          {...profileForm.register("phone")} 
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('personal.bio')}
                        </label>
                        <Textarea 
                          {...profileForm.register("bio")} 
                          className="min-h-[120px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white resize-none" 
                          placeholder={t('personal.bioPlaceholder')}
                        />
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t('messages.loadingProfile')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              <span>{t('personal.save')}</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('security.currentPassword')}
                        </label>
                        <div className="relative">
                          <Input 
                            type={showPassword.current ? "text" : "password"}
                            {...passwordForm.register("currentPassword")} 
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white pr-12" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('security.newPassword')}
                        </label>
                        <div className="relative">
                          <Input 
                            type={showPassword.new ? "text" : "password"}
                            {...passwordForm.register("newPassword")} 
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white pr-12" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('security.confirmPassword')}
                        </label>
                        <div className="relative">
                          <Input 
                            type={showPassword.confirm ? "text" : "password"}
                            {...passwordForm.register("confirmPassword")} 
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 dark:text-white pr-12" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t('messages.loadingPassword')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" />
                              <span>{t('security.submit')}</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "preferences" && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                        {t('preferences.title')}
                      </h3>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('preferences.language')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { code: 'fr', label: 'Français' },
                            { code: 'en', label: 'English' },
                            { code: 'sw', label: 'Kiswahili' },
                          ].map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              className={`h-12 rounded-xl border-2 font-bold text-sm uppercase tracking-wider transition-all ${
                                currentLocale === lang.code
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        {t('header.protected')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
