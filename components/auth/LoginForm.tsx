"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { 
  Loader2, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, Mail, KeyRound, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function LoginForm() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('LoginPage');
  
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

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
    } catch {
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl flex flex-col md:flex-row bg-card/95 dark:bg-card/40 backdrop-blur-2xl border border-primary/20 dark:border-primary/20 rounded-[2rem] shadow-[0_20px_60px_rgba(22,101,52,0.15)] dark:shadow-[0_20px_80px_rgba(225,242,71,0.05)] transition-colors duration-700 overflow-hidden text-white dark:text-foreground"
    >
      {/* Decorative top/side glow for dark mode to ensure clear boundaries */}
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-primary/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 dark:opacity-100" />
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 dark:opacity-100" />

      {/* Left Panel: Identity & Header */}
      <div className="w-full md:w-[45%] flex flex-col justify-center p-10 md:p-14 lg:p-16 border-b md:border-b-0 md:border-r border-white/20 dark:border-white/5 bg-transparent dark:bg-background/20">
        <div className="space-y-8 relative z-10 w-full">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 dark:border-border/50 bg-background/50 dark:bg-background/80 backdrop-blur-md shadow-sm transition-all duration-500 hover:scale-105 hover:border-white/40 dark:hover:border-primary/40 group">
            <Image src="/logocredda.png" alt="CREDDA" width={32} height={32} className="brightness-0 invert dark:invert transition-colors" />
          </div>

          <div className="space-y-3 pt-6">
            <h1 className="text-3xl md:text-4xl font-fraunces font-black tracking-tight text-white dark:text-foreground transition-colors duration-700">
              {view === "login" ? t('form_header.login_title') : t('form_header.forgot_title')}
            </h1>
            <p className="text-[14px] md:text-[15px] text-white/80 dark:text-muted-foreground transition-colors duration-700 leading-relaxed font-outfit border-l-2 border-white/30 dark:border-primary/30 pl-4">
              {view === "login" ? t('form_header.login_subtitle') : t('form_header.forgot_subtitle')}
            </p>
          </div>

          {view === "login" && (
            <div className="pt-8">
               <Link href={`/request-access`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 dark:border-primary/20 bg-white/10 dark:bg-primary/5 hover:bg-white/20 dark:hover:bg-primary/10 text-white dark:text-primary transition-colors text-[12px] font-bold uppercase tracking-widest">
                  {t('navigation.request_access')}
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="w-full md:w-[55%] p-10 md:p-14 lg:p-16 flex flex-col justify-center relative z-10 bg-transparent">
        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-6 text-left"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 dark:text-muted-foreground/60 transition-colors group-focus-within/input:text-white dark:group-focus-within/input:text-primary">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('fields.email_placeholder')}
                    className={`h-[56px] pl-12 pr-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-white/40 dark:focus-visible:ring-primary/40 focus-visible:border-white/60 dark:focus-visible:border-primary/60 rounded-xl text-[15px] text-white dark:text-foreground transition-all placeholder:text-white/50 dark:placeholder:text-muted-foreground/40 shadow-sm ${isEmailValid ? 'border-emerald-400/50 dark:border-emerald-500/40 focus-visible:border-emerald-400/70 focus-visible:ring-emerald-400/30 dark:focus-visible:ring-emerald-500/20' : ''}`}
                    required
                  />
                  <AnimatePresence>
                    {isEmailValid && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 dark:text-emerald-500"
                      >
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 dark:text-muted-foreground/60 transition-colors group-focus-within/input:text-white dark:group-focus-within/input:text-primary">
                    <KeyRound size={18} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`h-[56px] pl-12 pr-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-white/40 dark:focus-visible:ring-primary/40 focus-visible:border-white/60 dark:focus-visible:border-primary/60 rounded-xl text-[15px] text-white dark:text-foreground transition-all placeholder:text-white/50 dark:placeholder:text-muted-foreground/40 shadow-sm tracking-[0.2em] font-medium ${password.length > 0 && password.length < 6 ? 'border-amber-400/50 dark:border-amber-500/40' : ''}`}
                    required
                  />
                  <button 
                    type="button" 
                    title={showPassword ? t('fields.hide_password') : t('fields.show_password')}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 dark:text-muted-foreground/60 hover:text-white dark:hover:text-foreground transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Utilities */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRememberMe(!rememberMe)} 
                  className="flex items-center gap-2.5 group outline-none"
                >
                  <div className="w-4 h-4 border-2 border-white/30 dark:border-muted-foreground/30 rounded flex items-center justify-center transition-all group-hover:border-white dark:group-hover:border-primary group-focus-visible:border-white dark:group-focus-visible:border-primary data-[state=checked]:bg-white dark:data-[state=checked]:bg-primary data-[state=checked]:border-white dark:data-[state=checked]:border-primary" data-state={rememberMe ? "checked" : "unchecked"}>
                     {rememberMe && <CheckCircle2 size={12} strokeWidth={3} className="text-primary dark:text-primary-foreground" />}
                  </div>
                  <span className="text-[13px] font-medium text-white/70 dark:text-muted-foreground group-hover:text-white dark:group-hover:text-foreground transition-colors select-none">
                    {t('fields.remember_me')}
                  </span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setView("forgot")}
                  className="text-[13px] font-medium text-white/70 dark:text-muted-foreground hover:text-white dark:hover:text-primary transition-colors outline-none"
                >
                  {t('fields.forgot_link')}
                </button>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isPending}
                  className="group relative w-full h-[56px] bg-white text-primary hover:bg-white/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-xl text-[14px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.05)] hover:shadow-lg active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-background/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  {isSubmitting || isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('submit.label')}
                      <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetRequest} 
              className="space-y-6 text-left"
            >
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 dark:text-muted-foreground/60 transition-colors group-focus-within/input:text-white dark:group-focus-within/input:text-primary">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={t('fields.email_placeholder')}
                    className={`h-[56px] pl-12 pr-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-white/40 dark:focus-visible:ring-primary/40 focus-visible:border-white/60 dark:focus-visible:border-primary/60 rounded-xl text-[15px] text-white dark:text-foreground transition-all placeholder:text-white/50 dark:placeholder:text-muted-foreground/40 shadow-sm`}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-[56px] bg-white hover:bg-white/90 text-primary dark:bg-foreground dark:hover:bg-foreground/90 dark:text-background rounded-xl text-[14px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('forgot_view.submit')}
                </Button>
                <div className="flex justify-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setView("login")}
                    className="text-[12px] font-bold tracking-widest text-white/70 dark:text-muted-foreground hover:text-white dark:hover:text-foreground transition-colors uppercase outline-none"
                  >
                    {t('forgot_view.back')}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex items-center justify-end">
           <Link href="/" className="text-[10px] uppercase font-bold tracking-widest text-white/50 dark:text-muted-foreground/50 hover:text-white dark:hover:text-foreground transition-colors border-b border-transparent hover:border-white/50 dark:hover:border-foreground pb-0.5">
              {t('navigation.back_to_portal')}
           </Link>
        </div>
      </div>

      {/* FEEDBACK OVERLAY */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-card/80 dark:bg-background/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="text-center space-y-5"
            >
              <div className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center ${modalType === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                {modalType === 'success' ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <AlertTriangle size={32} strokeWidth={2.5} />}
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-fraunces font-black text-foreground transition-colors duration-700">
                  {modalType === 'success' ? t('success_modal.title') : t('error_modal.title')}
                </h3>
                <p className="text-[14px] font-outfit text-muted-foreground transition-colors duration-700 max-w-[240px] mx-auto leading-relaxed">
                  {modalMessage}
                </p>
              </div>
              {modalType === 'error' && (
                <Button onClick={() => setModalType(null)} variant="outline" className="h-10 mt-6 rounded-lg text-[12px] font-bold tracking-widest uppercase">
                  {t('modal.retry')}
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
