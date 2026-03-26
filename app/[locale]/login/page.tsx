"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { 
  Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, 
  ChevronLeft, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function AdminLogin() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('LoginPage');
  const { theme } = useTheme(); 
  
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
        setModalMessage(t('errors.invalid') || "Identifiants invalides");
        setModalType("error");
        setIsSubmitting(false);
      } else {
        setModalType("success");
        setModalMessage(t('modal.success_msg'));
        
        startTransition(() => {
          setTimeout(() => {
            router.push(`/${locale}/admin`);
            router.refresh();
          }, 1500);
        });
      }
    } catch (err) {
      setModalMessage(t('errors.connection') || "Erreur de connexion");
      setModalType("error");
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for reset
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

  const isLight = theme === "light";

  return (
    <div className={isLight ? "light text-slate-900" : "dark text-white"}>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-700 font-sans">
        
        {/* ANIMATION DE FOND INFINIE */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ 
              scale: [1.1, 1.2, 1.15, 1.25, 1.1],
              x: [0, -30, 20, -20, 0],
              y: [0, 20, -20, 10, 0]
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 grayscale shadow-inner"
            style={{ backgroundImage: "url('/images/bg-credda.jpg')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[480px] p-4 sm:p-6 mt-12 mb-12">
          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative w-full bg-card/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 md:p-16 flex flex-col justify-center rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group overflow-hidden"
              >
                {/* LUXURY ACCENTS */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 w-full">
                  {/* HEADER */}
                  <div className="flex flex-col items-center mb-12 text-center">
                    <Link href="/" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all mb-10">
                      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      {t('header.back')}
                    </Link>
                    <div className="relative inline-block mb-4">
                      <h1 className="text-5xl md:text-6xl font-fraunces font-black tracking-tighter text-foreground uppercase leading-none">
                        {t('header.title')}<span className="text-primary">.</span>
                      </h1>
                    </div>
                    <div className="h-[1px] w-12 bg-primary/30 mx-auto my-6" />
                    <p className="text-[9px] uppercase tracking-[0.6em] text-muted-foreground/60 font-medium">
                      {t('header.subtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      {/* LABEL + INPUT EMAIL */}
                      <div className="group/field relative space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50 ml-1 group-focus-within/field:text-primary transition-colors">
                          {t('fields.email_label')}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within/field:text-primary/60 transition-colors" size={18} />
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-16 pl-14 bg-background/30 border-white/5 rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/20 text-sm border-b-2 border-b-transparent focus:border-b-primary/50"
                            placeholder={t('fields.email_placeholder')}
                            required
                          />
                        </div>
                      </div>

                      {/* LABEL + INPUT PASSWORD */}
                      <div className="group/field relative space-y-3">
                        <div className="flex justify-between items-end pr-1">
                          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50 ml-1 group-focus-within/field:text-primary transition-colors">
                            {t('fields.password_label')}
                          </label>
                          <button 
                            type="button" 
                            onClick={() => setView("forgot")}
                            className="text-[9px] uppercase font-bold tracking-widest text-primary/60 hover:text-primary transition-colors"
                          >
                            {t('fields.forgot_link')}
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within/field:text-primary/60 transition-colors" size={18} />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-16 pl-14 pr-14 bg-background/30 border-white/5 rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/20 text-sm border-b-2 border-b-transparent focus:border-b-primary/50"
                            placeholder={t('fields.password_placeholder')}
                            required
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/20 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOUTON D'ACCÈS */}
                    <div className="relative group/btn pt-6">
                      <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition duration-1000 rounded-[2rem]" />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || isPending} 
                        className="relative w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-xl shadow-primary/10 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        {isSubmitting || isPending ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-4">
                            {t('submit.label')}
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-500" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* FOOTER */}
                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] uppercase tracking-[0.3em] font-medium text-muted-foreground/30">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                      <span>{t('footer.university')}</span>
                    </div>
                    <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative w-full bg-card/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 md:p-16 flex flex-col justify-center rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group overflow-hidden"
              >
                {/* LUXURY ACCENTS */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 w-full">
                  {/* HEADER */}
                  <div className="flex flex-col items-center mb-12 text-center">
                    <button 
                      onClick={() => setView("login")} 
                      className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all mb-10"
                    >
                      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      {t('forgot_view.back')}
                    </button>
                    <h2 className="text-4xl md:text-5xl font-fraunces font-black tracking-tighter text-foreground uppercase leading-none mb-6">
                      {t('forgot_view.title')}<span className="text-primary">.</span>
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                      {t('forgot_view.description')}
                    </p>
                  </div>

                  <form onSubmit={handleResetRequest} className="space-y-8">
                    <div className="group/field relative space-y-3">
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50 ml-1 group-focus-within/field:text-primary transition-colors">
                        {t('fields.email_label')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within/field:text-primary/60 transition-colors" size={18} />
                        <Input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="h-16 pl-14 bg-background/30 border-white/5 rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/20 text-sm border-b-2 border-b-transparent focus:border-b-primary/50"
                          placeholder={t('fields.email_placeholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative group/btn pt-6">
                      <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition duration-1000 rounded-[2rem]" />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="relative w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-xl shadow-primary/10 overflow-hidden"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-4">
                            {t('forgot_view.submit')}
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-500" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODALES D'ÉTAT */}
        <AnimatePresence>
          {modalType && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className={`relative w-full max-w-sm p-8 rounded-2xl shadow-2xl border ${modalType === 'success' ? 'border-primary' : 'border-destructive'} bg-card text-center space-y-6`}
              >
                <div className={`mx-auto p-4 rounded-full w-fit ${modalType === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  {modalType === 'success' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-fraunces font-black uppercase tracking-tighter">
                    {modalType === 'success' ? t('modal.welcome') : t('modal.denied')}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-[0.2em]">
                    {modalMessage}
                  </p>
                </div>
                {modalType === 'error' && (
                  <Button onClick={() => setModalType(null)} className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02]">
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