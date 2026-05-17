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
  
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => { setMounted(true); }, []);

  // Live validation
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md p-8 sm:p-12 bg-card/90 dark:bg-card/30 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] text-center transition-colors duration-700 mx-4 overflow-hidden"
    >
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[30px] bg-primary/10 blur-[30px]" />

      {/* Header */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border/50 bg-background/50 backdrop-blur-md shadow-sm transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] group relative z-10">
          <Image src="/logocredda.png" alt="CREDDA" width={28} height={28} className="brightness-0 dark:invert transition-colors" />
        </div>
      </div>

      <div className="space-y-1.5 mb-10 relative z-10">
        <h1 className="text-2xl font-outfit font-bold tracking-tight text-foreground transition-colors duration-700">
          {view === "login" ? t('form_header.login_title') : t('form_header.forgot_title')}
        </h1>
        <p className="text-[13px] text-muted-foreground transition-colors duration-700">
          {view === "login" ? t('form_header.login_subtitle') : t('form_header.forgot_subtitle')}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {view === "login" ? (
          <motion.form 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit} 
            className="space-y-5 text-left relative z-10"
          >
            {/* Minimal Email Input */}
            <div className="space-y-1.5">
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within/input:text-primary">
                  <Mail size={16} />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('fields.email_placeholder')}
                  className={`h-[48px] pl-10 pr-10 bg-background/50 dark:bg-background/20 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-[14px] text-foreground transition-all placeholder:text-muted-foreground/40 shadow-sm ${isEmailValid ? 'border-emerald-500/30 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20' : ''}`}
                  required
                />
                <AnimatePresence>
                  {isEmailValid && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500"
                    >
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Minimal Password Input */}
            <div className="space-y-1.5">
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within/input:text-primary">
                  <KeyRound size={16} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`h-[48px] pl-10 pr-10 bg-background/50 dark:bg-background/20 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-[14px] text-foreground transition-all placeholder:text-muted-foreground/40 shadow-sm tracking-[0.2em] font-medium ${password.length > 0 && password.length < 6 ? 'border-amber-500/30' : ''}`}
                  required
                />
                <button 
                  type="button" 
                  title={showPassword ? t('fields.hide_password') : t('fields.show_password')}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || isPending}
                className="group relative w-full h-[48px] bg-foreground hover:bg-foreground/90 text-background rounded-xl text-[14px] font-medium transition-all hover:shadow-lg hover:-translate-y-[1px] active:scale-[0.98] overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isSubmitting || isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <span className="flex items-center gap-2">
                    {t('submit.label')}
                    <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>

            <div className="pt-6 flex flex-col items-center gap-4 text-center">
              <button 
                type="button" 
                onClick={() => setView("forgot")}
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium outline-none"
              >
                {t('fields.forgot_link')}
              </button>

              <Link href={`/request-access`} className="text-[12px] text-muted-foreground/60 hover:text-foreground transition-colors font-medium">
                {t('navigation.request_access')}
              </Link>
            </div>
          </motion.form>
        ) : (
          <motion.form 
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleResetRequest} 
            className="space-y-5 text-left relative z-10"
          >
            <div className="space-y-1.5">
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within/input:text-primary">
                  <Mail size={16} />
                </div>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder={t('fields.email_placeholder')}
                  className={`h-[48px] pl-10 pr-10 bg-background/50 dark:bg-background/20 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-[14px] text-foreground transition-all placeholder:text-muted-foreground/40 shadow-sm`}
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-[48px] bg-foreground hover:bg-foreground/90 text-background rounded-xl text-[14px] font-medium transition-all hover:shadow-lg hover:-translate-y-[1px] active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : t('forgot_view.submit')}
              </Button>
            </div>

            <div className="pt-6 flex justify-center">
              <button 
                type="button" 
                onClick={() => setView("login")}
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium outline-none"
              >
                {t('forgot_view.back')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FEEDBACK OVERLAY */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-card/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="text-center space-y-4"
            >
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${modalType === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                {modalType === 'success' ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <AlertTriangle size={24} strokeWidth={2.5} />}
              </div>
              <div className="space-y-1 mt-4">
                <h3 className="text-lg font-outfit font-medium text-foreground transition-colors duration-700">
                  {modalType === 'success' ? t('success_modal.title') : t('error_modal.title')}
                </h3>
                <p className="text-[13px] text-muted-foreground transition-colors duration-700 max-w-[200px] mx-auto">
                  {modalMessage}
                </p>
              </div>
              {modalType === 'error' && (
                <Button onClick={() => setModalType(null)} variant="ghost" className="h-8 mt-4 rounded-lg text-xs font-medium">
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
