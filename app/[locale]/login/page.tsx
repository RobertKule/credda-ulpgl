// app/[locale]/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { signIn } from "next-auth/react";
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `/${locale}/admin`
      });

      if (result?.error) {
        setError(result.error || t('right.errors.invalid'));
      } else {
        // Redirection manuelle après succès pour s'assurer qu'on garde le bon locale
        router.push(`/${locale}/admin`);
        router.refresh();
      }
    } catch (err) {
      setError(t('right.errors.connection'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#fafafa]">
      {/* PARTIE GAUCHE - VISUEL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050a15] relative overflow-hidden items-center justify-center p-12 lg:p-24">
        {/* Modern abstract shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[80px]" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full mb-8 px-5 py-2 uppercase tracking-[0.3em] text-[10px] shadow-lg backdrop-blur-md">
              {t('left.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-[1.1]">
              <span dangerouslySetInnerHTML={{ __html: t.raw('left.title') }} />
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-transparent mt-8 rounded-full" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-400 font-light text-lg lg:text-xl leading-relaxed max-w-md"
          >
            {t('left.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-12 flex items-center gap-4 text-slate-500 text-[10px] uppercase tracking-widest font-black"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="text-blue-400" size={18} />
            </div>
            <span>{t('left.footer')}</span>
          </motion.div>
        </div>
      </div>

      {/* PARTIE DROITE - FORMULAIRE */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto custom-scrollbar bg-white">
        
        {/* Subtle background glow for form area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="space-y-6 mb-12">
            <Link href="/" className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] group bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-full w-fit">
              <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              {t('right.back')}
            </Link>
            <div className="text-3xl lg:text-4xl font-serif font-black tracking-tight text-slate-900">
              <span dangerouslySetInnerHTML={{ __html: t.raw('right.logo') }} />
            </div>
          </div>

          <div className="space-y-3 mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{t('right.title')}</h1>
            <p className="text-slate-500 font-light">{t('right.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }} 
                  animate={{ opacity: 1, height: "auto", y: 0 }} 
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-medium"
                >
                  <div className="font-bold mt-0.5">!</div>
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="space-y-2 group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t('right.fields.email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-base placeholder:text-slate-400"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2 group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('right.fields.password.placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-base placeholder:text-slate-400"
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors z-10"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 relative overflow-hidden group/btn"
            >
              {isSubmitting ? (
                <span className="relative z-10 flex items-center gap-3">
                  <Loader2 className="animate-spin" size={18} />
                  {t('right.submitting')}
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('right.submit')}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
              
              {/* Animation background quand submit */}
              {isSubmitting && (
                <motion.div 
                  className="absolute inset-0 bg-blue-700"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </Button>
          </form>

          <div className="text-center mt-10">
            <Link 
              href="/contact" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors pb-1 border-b border-transparent hover:border-blue-600"
            >
              {t('right.forgotPassword')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}