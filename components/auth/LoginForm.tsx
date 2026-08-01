"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";

import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Mail,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function LoginForm() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations("LoginPage");

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
        setModalMessage(t("errors.invalid"));
        setModalType("error");
        setIsSubmitting(false);
      } else {
        setModalType("success");
        setModalMessage(t("success_modal.message"));
        startTransition(() => {
          setTimeout(() => { router.push(`/admin`); router.refresh(); }, 2000);
        });
      }
    } catch {
      setModalMessage(t("errors.connection"));
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
      setModalMessage(t("modal.reset_success"));
      setTimeout(() => { setModalType(null); setView("login"); }, 3000);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* ── Full-screen background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/cta.jpg"
          alt="CREDDA Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>


      {/* ── Centered Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md lg:max-w-xl mx-4"
      >
        {/* Glass card */}
        <div className="bg-background/80 dark:bg-background/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Card Header */}
          <div className="px-8 pt-10 pb-6 border-b border-border/20 text-center">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl border border-border/30 bg-background/80 flex items-center justify-center shadow-sm">
                <Image src="/logocredda.png" alt="CREDDA" width={22} height={22} className="dark:invert" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">CREDDA • ULPGL</p>
                <p className="text-[11px] text-muted-foreground font-medium">Portail Institutionnel</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.div key="login-header" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                    {t("form_header.login_title")}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 font-light">
                    {t("form_header.login_subtitle")}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="forgot-header" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                    {t("form_header.forgot_title")}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 font-light">
                    {t("form_header.forgot_subtitle")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Body — Forms */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>
                    <div className="relative group/input">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="robert@credda.net"
                        className="h-12 pl-11 pr-10 rounded-xl bg-muted/40 dark:bg-muted/20 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/60 text-sm transition-all"
                        required
                      />
                      <AnimatePresence>
                        {isEmailValid && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                          >
                            <CheckCircle2 size={16} strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Mot de passe
                    </label>
                    <div className="relative group/input">
                      <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="h-12 pl-11 pr-10 rounded-xl bg-muted/40 dark:bg-muted/20 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/60 text-sm tracking-widest transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className="flex items-center gap-2 group"
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-primary border-primary" : "border-border/60 group-hover:border-primary/50"}`}>
                        {rememberMe && <CheckCircle2 size={10} strokeWidth={3} className="text-white" />}
                      </div>
                      <span className="text-[12px] text-muted-foreground">{t("fields.remember_me")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-[12px] text-primary/70 hover:text-primary font-semibold transition-colors"
                    >
                      {t("fields.forgot_link")}
                    </button>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isPending || !email || !password}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-px active:scale-[0.99] mt-2 group"
                  >
                    {isSubmitting || isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {t("submit.label")}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleResetRequest}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>
                    <div className="relative group/input">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="robert@credda.net"
                        className="h-12 pl-11 rounded-xl bg-muted/40 dark:bg-muted/20 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/60 text-sm transition-all"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-[0.15em] text-[11px] transition-all mt-2"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : t("forgot_view.submit")}
                  </Button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <ArrowRight size={11} className="rotate-180" />
                      {t("forgot_view.back")}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Toast Notification (slides from right) ── */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm"
          >
            <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl ${
              modalType === "success"
                ? "bg-background/90 border-green-500/30 text-foreground"
                : "bg-background/90 border-destructive/30 text-foreground"
            }`}>
              {/* Icon */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                modalType === "success" ? "bg-green-500/15 text-green-500" : "bg-destructive/15 text-destructive"
              }`}>
                {modalType === "success"
                  ? <CheckCircle2 size={18} strokeWidth={2.5} />
                  : <AlertTriangle size={18} strokeWidth={2.5} />
                }
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[12px] font-bold uppercase tracking-widest text-foreground mb-0.5">
                  {modalType === "success" ? t("success_modal.title") : t("error_modal.title")}
                </p>
                <p className="text-[13px] text-muted-foreground font-light leading-snug">
                  {modalMessage}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setModalType(null)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-all text-xs"
              >
                ✕
              </button>
            </div>

            {/* Progress bar for success */}
            {modalType === "success" && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[2px] w-full bg-green-500/50 rounded-full origin-left"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}