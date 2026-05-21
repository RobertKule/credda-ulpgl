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
  Sparkles,
  ShieldCheck,
  LockKeyhole,
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

  const [modalType, setModalType] = useState<
    "success" | "error" | null
  >(null);

  const [modalMessage, setModalMessage] = useState("");

  const [view, setView] = useState<"login" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalType(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setModalMessage(t("errors.invalid"));
        setModalType("error");
        setIsSubmitting(false);
      } else {
        setModalType("success");
        setModalMessage(t("success_modal.message"));

        startTransition(() => {
          setTimeout(() => {
            router.push(`/admin`);
            router.refresh();
          }, 2000);
        });
      }
    } catch {
      setModalMessage(t("errors.connection"));
      setModalType("error");
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      setModalType("success");
      setModalMessage(t("modal.reset_success"));

      setTimeout(() => {
        setModalType(null);
        setView("login");
      }, 3000);
    }, 1500);
  };

  if (!mounted) return null;

  const inputClass =
    "h-[58px] pl-12 pr-12 rounded-2xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-primary/40 focus-visible:border-emerald-500 dark:focus-visible:border-primary/60 text-[15px] text-emerald-950 dark:text-foreground placeholder:text-emerald-400/50 dark:placeholder:text-muted-foreground/40 shadow-sm transition-all";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60 dark:text-muted-foreground/60 group-focus-within/input:text-emerald-700 dark:group-focus-within/input:text-primary transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        relative
        overflow-hidden
        w-full
        max-w-5xl
        lg:rounded-[2rem]
        lg:border
        lg:border-emerald-200/50
        lg:dark:border-white/10
        bg-card
        lg:shadow-[0_20px_70px_rgba(16,185,129,0.05)]
        lg:dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)]
        flex
        flex-col
        lg:flex-row
      "
    >
      {/* Glow */}
      <div className="hidden lg:block absolute top-[-120px] right-[-100px] w-[260px] h-[260px] rounded-full bg-emerald-400/5 blur-3xl dark:bg-primary/5" />
      <div className="hidden lg:block absolute bottom-[-120px] left-[-100px] w-[260px] h-[260px] rounded-full bg-emerald-500/5 blur-3xl dark:bg-primary/5" />

      {/* LEFT SIDE — Desktop only */}
      <div
        className="
          relative
          hidden
          lg:flex
          lg:w-[45%]
          lg:border-r
          border-emerald-200/50
          dark:border-white/5
          bg-emerald-50/30
          dark:bg-white/[0.02]
          p-14
          flex-col
          justify-between
        "
      >
        <div className="space-y-10 relative z-10">
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="
              w-16
              h-16
              rounded-2xl
              flex
              items-center
              justify-center
              border
              border-emerald-300/50
              dark:border-border/50
              bg-white/80
              dark:bg-background/80
              backdrop-blur-md
              shadow-sm
            "
          >
            <Image
              src="/logocredda.png"
              alt="CREDDA"
              width={32}
              height={32}
              className="dark:invert"
            />
          </motion.div>

          {/* TEXT */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl">
              <Sparkles size={13} className="text-emerald-600 dark:text-primary" />

              <span className="text-[10px] uppercase tracking-[0.22em] font-black text-emerald-700 dark:text-primary">
                CREDDA • PORTAL
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-fraunces font-black tracking-tight leading-[1.05] text-emerald-950 dark:text-foreground">
                {view === "login"
                  ? t("form_header.login_title")
                  : t("form_header.forgot_title")}
              </h1>

              <p className="max-w-md text-[15px] leading-relaxed text-emerald-800/75 dark:text-muted-foreground">
                {view === "login"
                  ? t("form_header.login_subtitle")
                  : t("form_header.forgot_subtitle")}
              </p>
            </div>
          </div>

          {/* FEATURES */}
          {view === "login" && (
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 text-emerald-600 dark:text-primary"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-foreground">
                    Secure authentication
                  </p>

                  <p className="text-xs text-emerald-700/70 dark:text-muted-foreground">
                    Protected research platform access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LockKeyhole
                  size={18}
                  className="mt-0.5 text-emerald-600 dark:text-primary"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-foreground">
                    Role-based access
                  </p>

                  <p className="text-xs text-emerald-700/70 dark:text-muted-foreground">
                    Students, researchers and partners.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* REQUEST ACCESS */}
        {view === "login" && (
          <div className="pt-10">
            <Link
              href={`/request-access`}
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                border
                border-emerald-300/50
                dark:border-white/10
                bg-white/70
                hover:bg-white
                dark:bg-white/5
                dark:hover:bg-white/10
                text-[11px]
                uppercase
                tracking-[0.18em]
                font-black
                text-emerald-700
                dark:text-primary
                transition-all
                hover:-translate-y-0.5
              "
            >
              {t("navigation.request_access")}
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT SIDE — Form */}
      <div className="relative w-full lg:w-[55%] px-4 py-8 sm:p-10 md:p-14 flex flex-col justify-center">
        {/* Mobile-only compact header */}
        <div className="lg:hidden mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-emerald-300/50 dark:border-white/10 bg-white/80 dark:bg-white/5">
              <Image
                src="/logocredda.png"
                alt="CREDDA"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03]">
              <Sparkles size={11} className="text-emerald-600 dark:text-primary" />
              <span className="text-[9px] uppercase tracking-[0.22em] font-black text-emerald-700 dark:text-primary">CREDDA</span>
            </div>
          </div>
          <h1 className="text-2xl font-fraunces font-black tracking-tight text-emerald-950 dark:text-foreground">
            {view === "login" ? t("form_header.login_title") : t("form_header.forgot_title")}
          </h1>
        </div>
        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="w-full space-y-7"
            >
              {/* EMAIL */}
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className={iconClass}>
                    <Mail size={18} />
                  </div>

                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder={t(
                      "fields.email_placeholder"
                    )}
                    className={`${inputClass} ${
                      isEmailValid
                        ? "border-emerald-400/50"
                        : ""
                    }`}
                    required
                  />

                  <AnimatePresence>
                    {isEmailValid && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0,
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
                      >
                        <CheckCircle2
                          size={18}
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className={iconClass}>
                    <KeyRound size={18} />
                  </div>

                  <Input
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••••"
                    className={`${inputClass} tracking-[0.2em]`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-emerald-500/60
                      dark:text-muted-foreground/60
                      hover:text-emerald-700
                      dark:hover:text-foreground
                      transition-colors
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setRememberMe(!rememberMe)
                  }
                  className="flex items-center gap-3"
                >
                  <div
                    data-state={
                      rememberMe
                        ? "checked"
                        : "unchecked"
                    }
                    className="
                      w-4
                      h-4
                      rounded
                      border-2
                      border-emerald-300/50
                      dark:border-muted-foreground/30
                      flex
                      items-center
                      justify-center
                      data-[state=checked]:bg-emerald-500
                      data-[state=checked]:border-emerald-500
                    "
                  >
                    {rememberMe && (
                      <CheckCircle2
                        size={12}
                        strokeWidth={3}
                        className="text-white"
                      />
                    )}
                  </div>

                  <span className="text-[13px] text-emerald-700/80 dark:text-muted-foreground">
                    {t("fields.remember_me")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="
                    text-[13px]
                    font-medium
                    text-emerald-700/80
                    dark:text-muted-foreground
                    hover:text-emerald-900
                    dark:hover:text-primary
                    transition-colors
                  "
                >
                  {t("fields.forgot_link")}
                </button>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="
                    group
                    relative
                    overflow-hidden
                    w-full
                    h-[58px]
                    rounded-2xl
                    bg-emerald-600
                    hover:bg-emerald-700
                    dark:bg-primary
                    dark:hover:bg-primary/90
                    text-white
                    dark:text-primary-foreground
                    uppercase
                    tracking-[0.16em]
                    text-[12px]
                    font-black
                    shadow-[0_10px_30px_rgba(16,185,129,0.25)]
                    hover:shadow-[0_15px_35px_rgba(16,185,129,0.35)]
                    transition-all
                    hover:-translate-y-[1px]
                    active:scale-[0.99]
                  "
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {isSubmitting || isPending ? (
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <span className="relative z-10 flex items-center gap-2">
                      {t("submit.label")}

                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleResetRequest}
              className="w-full space-y-7"
            >
              <div className="space-y-2">
                <div className="relative group/input">
                  <div className={iconClass}>
                    <Mail size={18} />
                  </div>

                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) =>
                      setResetEmail(e.target.value)
                    }
                    placeholder={t(
                      "fields.email_placeholder"
                    )}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    h-[58px]
                    rounded-2xl
                    bg-emerald-600
                    hover:bg-emerald-700
                    dark:bg-primary
                    dark:hover:bg-primary/90
                    text-white
                    uppercase
                    tracking-[0.16em]
                    text-[12px]
                    font-black
                  "
                >
                  {isSubmitting ? (
                    <Loader2
                      className="animate-spin"
                      size={20}
                    />
                  ) : (
                    t("forgot_view.submit")
                  )}
                </Button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.16em]
                      font-black
                      text-emerald-700/70
                      dark:text-muted-foreground
                      hover:text-emerald-900
                      dark:hover:text-foreground
                      transition-colors
                    "
                  >
                    {t("forgot_view.back")}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Mobile navigation links */}
        {view === "login" && (
          <div className="lg:hidden flex flex-wrap items-center gap-3 mt-8">
            <Link
              href="/request-access"
              className="h-10 px-4 rounded-xl border border-emerald-300/50 dark:border-white/10 bg-white/70 dark:bg-white/5 inline-flex items-center justify-center text-[10px] uppercase tracking-[0.16em] font-black text-emerald-700 dark:text-primary transition-all"
            >
              {t("navigation.request_access")}
            </Link>
            <Link
              href="/"
              className="h-10 px-4 rounded-xl border border-emerald-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 inline-flex items-center justify-center text-[10px] uppercase tracking-[0.16em] font-black text-emerald-700/60 dark:text-muted-foreground/70 transition-all"
            >
              {t("navigation.back_to_portal")}
            </Link>
          </div>
        )}

        {/* Desktop footer link */}
        <div className="hidden lg:block absolute bottom-6 right-6">
          <Link
            href="/"
            className="
              text-[10px]
              uppercase
              tracking-[0.16em]
              font-black
              text-emerald-700/60
              dark:text-muted-foreground/50
              hover:text-emerald-900
              dark:hover:text-foreground
              transition-colors
            "
          >
            {t("navigation.back_to_portal")}
          </Link>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              absolute
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-white/90
              dark:bg-[#040D06]/95
              backdrop-blur-xl
              p-6
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 10,
              }}
              className="
                text-center
                space-y-5
                max-w-sm
              "
            >
              <div
                className={`
                  mx-auto
                  w-16
                  h-16
                  rounded-3xl
                  flex
                  items-center
                  justify-center
                  ${
                    modalType === "success"
                      ? "bg-emerald-500/10 text-emerald-500 dark:text-primary"
                      : "bg-destructive/10 text-destructive"
                  }
                `}
              >
                {modalType === "success" ? (
                  <CheckCircle2
                    size={32}
                    strokeWidth={2.5}
                  />
                ) : (
                  <AlertTriangle
                    size={32}
                    strokeWidth={2.5}
                  />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-fraunces font-black text-emerald-950 dark:text-foreground">
                  {modalType === "success"
                    ? t("success_modal.title")
                    : t("error_modal.title")}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {modalMessage}
                </p>
              </div>

              {modalType === "error" && (
                <Button
                  variant="outline"
                  onClick={() => setModalType(null)}
                  className="
                    h-11
                    rounded-xl
                    uppercase
                    tracking-[0.16em]
                    text-[11px]
                    font-black
                    border-emerald-200
                    dark:border-white/10
                  "
                >
                  {t("modal.retry")}
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}