"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { 
  Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, 
  ChevronLeft, CheckCircle2, AlertTriangle, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function AdminLogin() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('LoginPage');
  
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalType(null);

    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      
      if (result?.error) {
        setModalMessage(t('errors.invalid'));
        setModalType("error");
        setIsSubmitting(false);
      } else {
        setModalType("success");
        setModalMessage(t('success_modal.message'));
        
        startTransition(() => {
          setTimeout(() => {
            router.push(`/${locale}/admin`);
            router.refresh();
          }, 2000);
        });
      }
    } catch (err) {
      setModalMessage(t('errors.connection'));
      setModalType("error");
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setModalType("success");
      setModalMessage(t('modal.reset_success'));
      setTimeout(() => {
        setModalType(null);
        setView("login");
      }, 3000);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden selection:bg-primary/30">
      
      {/* LEFT SIDE: VISUAL (60%) - Fully Theme Aware */}
      <div className="relative hidden md:flex md:w-[60%] lg:w-[65%] flex-col justify-between p-12 lg:p-20 overflow-hidden bg-[#F0FDF4] dark:bg-[#064E3B] transition-colors duration-700">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/40 dark:bg-emerald-400/10 blur-[100px] rounded-full" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-grid-credda opacity-40 dark:opacity-20" 
          />
        </div>

        {/* Logo & Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-emerald-900/5 dark:bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-emerald-900/10 dark:border-white/20 shadow-2xl">
             <Image 
               src="/logocredda.png" 
               alt="Logo" 
               width={32} 
               height={32} 
               className="brightness-100 dark:brightness-0 dark:invert p-1 transition-all duration-700" 
             />
          </div>
          <div>
            <h2 className="text-xl font-fraunces font-black text-[#064E3B] dark:text-white tracking-widest leading-none uppercase transition-colors duration-700">
                {t('header.title')}
            </h2>
            <p className="text-[9px] font-outfit font-bold text-[#064E3B]/60 dark:text-white/50 tracking-[0.4em] uppercase mt-1 transition-colors duration-700">
                {t('visual.slogan')}
            </p>
          </div>
        </motion.div>

        {/* Content Slogan */}
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/5 dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#064E3B]/70 dark:text-white/70 mb-8 backdrop-blur-sm transition-colors duration-700">
              <ShieldCheck size={14} className="text-[#C9A84C]" />
              {t('visual.badge')}
            </span>
            <h1 className="text-5xl lg:text-7xl font-fraunces font-black text-[#064E3B] dark:text-white leading-[1.05] tracking-tight mb-8 transition-colors duration-700">
              {t.rich('visual.title', {
                span: (chunks) => <span className="text-[#C9A84C]">{chunks}</span>
              })}
            </h1>
            <p className="text-lg lg:text-xl font-outfit font-light text-[#064E3B]/70 dark:text-white/60 leading-relaxed max-w-xl transition-colors duration-700">
              {t('visual.description')}
            </p>
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 flex items-center gap-12 text-[10px] font-bold text-[#064E3B]/40 dark:text-white/30 uppercase tracking-[0.3em] transition-colors duration-700"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            {t('footer.university')}
          </div>
          <div>{t('footer.copyright', { year: new Date().getFullYear() })}</div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: FORM (40%) */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-card relative overflow-hidden transition-colors duration-700">
        {/* Mobile Header */}
        <div className="md:hidden absolute top-8 left-8 right-8 flex justify-between items-center z-10">
           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Image src="/logocredda.png" alt="Logo" width={24} height={24} className="p-0.5" />
           </div>
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              {t('navigation.exit')}
           </Link>
        </div>

        <div className="w-full max-w-[480px] mx-auto space-y-12">
          {/* Form Header */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-fraunces font-black text-foreground tracking-tighter uppercase leading-none">
                {view === "login" ? t('form_header.login_title') : t('form_header.forgot_title')}<span className="text-primary">.</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mt-4 leading-relaxed">
                {view === "login" ? t('form_header.login_subtitle') : t('form_header.forgot_subtitle')}
              </p>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 group-focus-within:text-primary transition-colors ml-1">
                      {t('fields.email_label')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={18} />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('fields.email_placeholder')}
                        className="h-16 pl-12 bg-muted/30 border-transparent focus:border-primary/50 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-3 group">
                    <div className="flex justify-between items-center pr-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 group-focus-within:text-primary transition-colors ml-1">
                        {t('fields.password_label')}
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setView("forgot")}
                        className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                      >
                        {t('fields.forgot_link')}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={18} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('fields.password_placeholder')}
                        className="h-16 pl-12 pr-12 bg-muted/30 border-transparent focus:border-primary/50 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-sm"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isPending}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    {isSubmitting || isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <span className="flex items-center gap-3">
                        {t('submit.label')}
                        <ArrowRight size={16} />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="forgot-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetRequest} 
                className="space-y-8"
              >
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 group-focus-within:text-primary transition-colors ml-1">
                    {t('fields.email_label')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={18} />
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder={t('fields.email_placeholder')}
                      className="h-16 pl-12 bg-muted/30 border-transparent focus:border-primary/50 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-primary/20 transition-all font-bold"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('forgot_view.submit')}
                  </Button>
                  <button 
                    type="button" 
                    onClick={() => setView("login")}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors pt-4"
                  >
                    {t('forgot_view.back')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Site link & Register */}
          <div className="pt-12 border-t border-border flex flex-col items-center gap-6">
             <Link href={`/${locale}/register`} className="text-[11px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all border border-primary/20 bg-primary/5 px-6 py-3 rounded-xl hover:scale-105">
                {t('navigation.create_account') || "Créer un compte"}
             </Link>
             <Link href="/" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t('navigation.back_to_portal')}
             </Link>
          </div>
        </div>

        {/* MODAL / FEEDBACK OVERLAY */}
        <AnimatePresence>
          {modalType && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/95 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={`relative w-full max-w-md p-12 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border ${modalType === 'success' ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'} text-center space-y-8`}
              >
                <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center ${modalType === 'success' ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/40' : 'bg-destructive text-destructive-foreground shadow-2xl shadow-destructive/40'}`}>
                  {modalType === 'success' ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <AlertTriangle size={40} strokeWidth={2.5} />}
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-fraunces font-black uppercase tracking-tighter text-foreground leading-none">
                    {modalType === 'success' ? t('success_modal.title') : t('error_modal.title')}
                  </h3>
                  <p className="text-sm font-outfit font-medium text-foreground/70 leading-relaxed">
                    {modalMessage}
                  </p>
                  {modalType === 'success' && (
                    <div className="w-full h-1.5 bg-muted rounded-full mt-10 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: "100%" }} 
                         className="h-full bg-primary" 
                         transition={{ duration: 2, ease: "easeInOut" }}
                       />
                    </div>
                  )}
                </div>
                {modalType === 'error' && (
                  <Button onClick={() => setModalType(null)} className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
                    {t('modal.retry')}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}