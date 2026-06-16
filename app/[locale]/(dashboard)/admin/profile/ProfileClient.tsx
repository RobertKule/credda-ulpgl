"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Eye, EyeOff, Save, ShieldAlert,
  Clock, Calendar, Camera
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { updateUserProfile, updateUserPassword } from "@/services/user-actions";

const createProfileSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, t('messages.errorUpdate')),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const createPasswordSchema = (t: (key: string) => string) => z.object({
  currentPassword: z.string().min(1, t('messages.errorUpdate')),
  newPassword: z.string().min(6, t('messages.errorUpdate')),
  confirmPassword: z.string().min(6, t('messages.errorUpdate')),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('messages.errorMatch'),
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

export default function ProfileClient({ user, locale }: ProfileClientProps) {
  const t = useTranslations("Profile");
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
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'RESEARCHER':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  const tabs = [
    { id: 'personal' as const, label: t('tabs.personal'), icon: User },
    { id: 'security' as const, label: t('tabs.security'), icon: Lock },
    { id: 'preferences' as const, label: t('tabs.preferences'), icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6 lg:p-10">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-neutral-200 dark:border-neutral-800 p-8">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with hover effect */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                      {user.name?.[0] || 'U'}
                    </span>
                  )}
                </div>
              </div>
              {/* Camera icon on hover */}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                  {getGreeting()}, {user.name?.split(' ')[0] || 'User'}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-lg shadow-neutral-200/50 dark:shadow-neutral-900/50">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-emerald-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
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

        {/* Right Column: Form Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg shadow-neutral-200/50 dark:shadow-neutral-900/50 overflow-hidden">
            
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
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('personal.name')}
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            {...profileForm.register("name")} 
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 pl-12 transition-all font-medium text-neutral-900 dark:text-white" 
                          />
                        </div>
                        {profileForm.formState.errors.name && (
                          <p className="text-xs text-red-500 font-medium">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          {t('personal.email')}
                          <Lock className="w-3 h-3" />
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            value={user.email}
                            disabled
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-500 cursor-not-allowed font-medium pl-12" 
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('personal.phone')}
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            {...profileForm.register("phone")} 
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 pl-12 transition-all font-medium text-neutral-900 dark:text-white" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('personal.bio')}
                        </label>
                        <Textarea 
                          {...profileForm.register("bio")} 
                          className="min-h-[120px] rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 transition-all font-medium text-neutral-900 dark:text-white resize-none" 
                          placeholder={t('personal.bioPlaceholder')}
                        />
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t('messages.loading')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              <span>{t('buttons.save')}</span>
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
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('security.currentPassword')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            type={showPassword.current ? "text" : "password"}
                            {...passwordForm.register("currentPassword")} 
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 pl-12 pr-12 transition-all font-medium text-neutral-900 dark:text-white" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('security.newPassword')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            type={showPassword.new ? "text" : "password"}
                            {...passwordForm.register("newPassword")} 
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 pl-12 pr-12 transition-all font-medium text-neutral-900 dark:text-white" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {t('security.confirmPassword')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            type={showPassword.confirm ? "text" : "password"}
                            {...passwordForm.register("confirmPassword")} 
                            className="h-12 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 pl-12 pr-12 transition-all font-medium text-neutral-900 dark:text-white" 
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t('messages.loading')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" />
                              <span>{t('buttons.save')}</span>
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
                      <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
                        {t('preferences.title')}
                      </h3>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
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
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                              }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
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
