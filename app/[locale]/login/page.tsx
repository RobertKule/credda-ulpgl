// app/[locale]/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Link } from "@/navigation";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";

export default function AdminLogin() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('LoginPage');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
        router.push(`/${locale}/admin`);
      } else {
        setError(data.message || t('right.errors.invalid'));
      }
    } catch (err) {
      setError(t('right.errors.connection'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* PARTIE GAUCHE - VISUEL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050a15] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full border border-blue-500/30" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full border border-blue-500/20" />
        </div>

        <div className="relative z-10 max-w-md text-center md:text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-blue-600 text-white rounded-none mb-6 px-4 py-1 uppercase tracking-widest text-[10px]">
              {t('left.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('left.title') }} />
            </h2>
            <div className="w-20 h-1 bg-blue-600 mt-6 hidden md:block" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-light leading-relaxed"
          >
            {t('left.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 flex items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-bold"
          >
            <ShieldCheck className="text-blue-500" size={20} />
            {t('left.footer')}
          </motion.div>
        </div>
      </div>

      {/* PARTIE DROITE - FORMULAIRE */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-10"
        >
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest group">
              <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
              {t('right.back')}
            </Link>
            <div className="text-3xl font-serif font-black tracking-tighter text-slate-900">
              <span dangerouslySetInnerHTML={{ __html: t.raw('right.logo') }} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('right.title')}</h1>
            <p className="text-sm text-slate-500">{t('right.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t('right.fields.email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-none border-slate-200 focus:border-blue-600 focus:ring-0 transition-all bg-white"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('right.fields.password.placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-none border-slate-200 focus:border-blue-600 focus:ring-0 transition-all bg-white"
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-none font-bold uppercase tracking-[0.2em] transition-all group shadow-xl shadow-slate-200 relative overflow-hidden"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  {t('right.submitting')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('right.submit')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
              
              {/* Effet de chargement progressif */}
              {isSubmitting && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-blue-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </Button>
          </form>

          {/* Lien optionnel pour mot de passe oublié */}
          <div className="text-center">
            <Link 
              href="/contact" 
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
            >
              {t('right.forgotPassword')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}