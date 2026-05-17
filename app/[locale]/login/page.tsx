"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden selection:bg-primary/30 font-outfit transition-colors duration-700">
      
      {/* LEFT SIDE: VISUAL (55%) */}
      <div className="relative hidden md:flex md:w-[60%] lg:w-[55%] flex-col justify-between p-12 lg:p-20 overflow-hidden bg-muted/20 transition-colors duration-700 border-r border-border/50">
        
        {/* Logo & Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex items-center gap-4"
        >
          <div className="w-12 h-12 flex items-center justify-center">
             <Image 
               src="/logocredda.png" 
               alt="Logo" 
               width={32} 
               height={32} 
               className="transition-all duration-700 brightness-0 dark:invert" 
             />
          </div>
          <div>
            <h2 className="text-xl font-fraunces font-black text-foreground tracking-widest leading-none uppercase transition-colors duration-700">
                {t('header.title')}
            </h2>
            <p className="text-[9px] font-outfit font-bold text-muted-foreground tracking-[0.4em] uppercase mt-1 transition-colors duration-700">
                {t('visual.slogan')}
            </p>
          </div>
        </motion.div>

        {/* Content Slogan */}
        <div className="relative z-10 flex-1 flex flex-col justify-center my-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-8 backdrop-blur-sm transition-colors duration-700">
              <ShieldCheck size={14} className="text-primary" />
              {t('visual.badge')}
            </span>
            <h1 className="text-5xl lg:text-7xl font-fraunces font-black text-foreground leading-[1.05] tracking-tight mb-8 transition-colors duration-700">
              {t.rich('visual.title', {
                span: (chunks) => <span className="text-primary">{chunks}</span>
              })}
            </h1>
            <p className="text-lg lg:text-xl font-outfit font-light text-muted-foreground leading-relaxed max-w-xl transition-colors duration-700">
              {t('visual.description')}
            </p>
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 flex items-center gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] transition-colors duration-700"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('footer.university')}
          </div>
          <div>{t('footer.copyright', { year: new Date().getFullYear() })}</div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: FORM (45%) */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-20 bg-card relative overflow-hidden transition-colors duration-700">
        
        {/* Mobile Header */}
        <div className="md:hidden absolute top-8 left-8 right-8 flex justify-between items-center z-10">
           <div className="w-10 h-10 flex items-center justify-center">
              <Image src="/logocredda.png" alt="Logo" width={24} height={24} className="brightness-0 dark:invert transition-colors duration-700" />
           </div>
           <Link href="/" className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('navigation.exit')}
           </Link>
        </div>

        <div className="w-full max-w-[360px] mx-auto xl:ml-12 space-y-10">
          {/* Form Header */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-outfit font-medium text-foreground leading-none transition-colors duration-700">
                {view === "login" ? t('form_header.login_title') : t('form_header.forgot_title')}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed transition-colors duration-700">
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
                className="space-y-6"
              >
                <div className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-muted-foreground transition-colors ml-1">
                      {t('fields.email_label')}
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('fields.email_placeholder')}
                      className="h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm text-sm text-foreground transition-all placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-muted-foreground transition-colors ml-1">
                      {t('fields.password_label')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm text-sm text-foreground transition-all placeholder:text-muted-foreground/50 pr-10 tracking-widest"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Terms / Info */}
                  <div className="flex items-center gap-2 pt-1 pl-1">
                    <div className="w-3.5 h-3.5 bg-primary rounded-sm flex items-center justify-center">
                       <CheckCircle2 size={10} className="text-primary-foreground" />
                    </div>
                    <span className="text-[11px] text-muted-foreground transition-colors">
                      I agree to the terms of service
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isPending}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm text-sm font-medium transition-all shadow-md shadow-primary/20 dark:shadow-none"
                  >
                    {isSubmitting || isPending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      t('submit.label')
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
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground transition-colors ml-1">
                    {t('fields.email_label')}
                  </label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={t('fields.email_placeholder')}
                    className="h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm text-sm text-foreground transition-all placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm text-sm font-medium transition-all shadow-md shadow-primary/20 dark:shadow-none"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : t('forgot_view.submit')}
                  </Button>
                  <button 
                    type="button" 
                    onClick={() => setView("login")}
                    className="w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {t('forgot_view.back')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Site link & Forgot / Register */}
          <div className="pt-8 flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors">
               <span>Need access?</span>
               <Link href={`/register`} className="text-primary font-medium hover:text-primary/80 transition-colors">
                  {t('navigation.create_account')}
               </Link>
             </div>
             
             {view === "login" && (
             <button 
               onClick={() => setView("forgot")}
               className="text-[11.5px] text-muted-foreground hover:text-primary transition-colors"
             >
                {t('fields.forgot_link')}
             </button>
             )}
          </div>
          
          <div className="pt-4 flex">
             <Link href="/" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.back_to_portal')}
             </Link>
          </div>
        </div>

        {/* MODAL / FEEDBACK OVERLAY */}
        <AnimatePresence>
          {modalType && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className={`relative w-full max-w-sm p-8 rounded-2xl shadow-2xl bg-card border border-border text-center space-y-6 transition-colors duration-700`}
              >
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${modalType === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-destructive'}`}>
                  {modalType === 'success' ? <CheckCircle2 size={32} strokeWidth={2} className="text-emerald-500" /> : <AlertTriangle size={32} strokeWidth={2} className="text-destructive" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-medium text-foreground transition-colors duration-700">
                    {modalType === 'success' ? t('success_modal.title') : t('error_modal.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-700">
                    {modalMessage}
                  </p>
                </div>
                {modalType === 'error' && (
                  <Button onClick={() => setModalType(null)} className="w-full h-10 rounded-sm bg-foreground text-background text-xs font-medium transition-transform">
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