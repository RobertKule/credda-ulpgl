"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type RoleType =
  | "researcher"
  | "student"
  | "admin"
  | "partner"
  | "clinic"
  | "guest"
  | "";

export function RequestAccessForm() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("RequestAccessPage");

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [direction, setDirection] = useState(1);

  const [modalType, setModalType] = useState<"success" | "error" | null>(
    null
  );
  const [modalMessage, setModalMessage] = useState("");

  // FORM
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<RoleType>("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // VALIDATION
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const isPhoneValid = useMemo(() => phone.length >= 8, [phone]);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  }, [password]);

  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return true;

      case 2:
        return (
          fullName.length > 2 &&
          isEmailValid &&
          isPhoneValid &&
          !!role
        );

      case 3:
        return passwordStrength >= 3 && isPasswordMatch;

      case 4:
        return agreeTerms;

      default:
        return false;
    }
  };

  const currentProgress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (!canGoNext()) {
      setModalType("error");

      if (step === 2) {
        setModalMessage(t("step_personal.validation_error"));
      }

      if (step === 3) {
        setModalMessage(t("step_security.validation_error"));
      }

      return;
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      setModalType("success");
      setModalMessage(t("success.text1"));
    }, 2000);
  };

  if (!mounted) return null;

  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir === 1 ? 40 : -40,
    }),

    animate: {
      opacity: 1,
      x: 0,
    },

    exit: (dir: number) => ({
      opacity: 0,
      x: dir === 1 ? -40 : 40,
    }),
  };

  const inputClass =
    "h-[56px] pl-12 pr-4 bg-white dark:bg-black/20 border border-emerald-200 dark:border-white/10 rounded-xl text-[15px] text-emerald-900 dark:text-foreground placeholder:text-emerald-400 dark:placeholder:text-muted-foreground/40 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-primary/40 focus-visible:border-emerald-500 dark:focus-visible:border-primary/60 transition-all";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60 dark:text-muted-foreground/60";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-200/50 dark:border-white/10 bg-card dark:backdrop-blur-3xl shadow-[0_20px_60px_rgba(16,185,129,0.05)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)] flex flex-col"
    >
      {/* HEADER */}
      {!modalType && (
        <div className="px-8 pt-6 pb-5 border-b border-emerald-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-emerald-300/50 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
              <Image
                src="/logocredda.png"
                alt="CREDDA"
                width={32}
                height={32}
                className="dark:invert"
              />
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-emerald-700/70 dark:text-primary">
              {step} / {totalSteps}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-1.5 bg-emerald-100 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 dark:bg-primary"
                animate={{
                  width: `${currentProgress}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative min-h-[420px] p-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-white/10 bg-white dark:bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-primary animate-pulse" />

                <span className="text-[9px] uppercase tracking-[0.22em] font-black text-emerald-700 dark:text-primary">
                  CREDDA · ACCESS
                </span>
              </div>

              <h2 className="text-4xl font-black tracking-tight text-emerald-950 dark:text-foreground">
                {t("step_welcome.title")}
              </h2>

              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-emerald-800/75 dark:text-muted-foreground">
                {t("step_welcome.subtitle")}
              </p>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-black text-emerald-950 dark:text-foreground">
                {t("step_personal.title")}
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="relative">
                  <div className={iconClass}>
                    <User size={18} />
                  </div>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("step_personal.fullName")}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className={iconClass}>
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("step_personal.email")}
                    className={inputClass}
                  />
                  <AnimatePresence>
                    {isEmailValid && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
                      >
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <div className={iconClass}>
                  <Phone size={18} />
                </div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("step_personal.phone")}
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                <div className="text-[12px] uppercase font-bold tracking-widest text-emerald-700/70 dark:text-primary">
                  {t("step_personal.roleLabel")}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      "researcher",
                      "student",
                      "admin",
                      "partner",
                      "clinic",
                      "guest",
                    ] as RoleType[]
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRole(type)}
                      className={`px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                        role === type
                          ? "bg-emerald-600 dark:bg-primary text-white dark:text-primary-foreground border-transparent"
                          : "bg-white dark:bg-white/5 border-emerald-200 dark:border-white/10 text-emerald-700 dark:text-muted-foreground hover:bg-emerald-50 dark:hover:bg-white/10"
                      }`}
                    >
                      {t(`step_personal.roles.${type}`)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-black text-emerald-950 dark:text-foreground">
                {t("step_security.title")}
              </h2>

              <div className="space-y-5">
                <div className="relative">
                  <div className={iconClass}>
                    <KeyRound size={18} />
                  </div>

                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t(
                      "step_security.passwordPlaceholder"
                    )}
                    className={`${inputClass} tracking-widest`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/60 dark:text-muted-foreground/60"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="flex gap-1 h-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i < passwordStrength
                          ? "bg-emerald-500 dark:bg-primary"
                          : "bg-emerald-100 dark:bg-white/5"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative">
                  <div className={iconClass}>
                    <ShieldAlert size={18} />
                  </div>

                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder={t(
                      "step_security.confirmPasswordPlaceholder"
                    )}
                    className={`${inputClass} tracking-widest`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-black text-emerald-950 dark:text-foreground">
                {t("step_review.title")}
              </h2>

              <div className="rounded-2xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="block text-[10px] uppercase opacity-50 dark:text-primary mb-1">
                      {t("step_personal.fullName")}
                    </span>

                    <span className="font-bold text-emerald-950 dark:text-white">
                      {fullName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase opacity-50 dark:text-primary mb-1">
                      {t("step_personal.email")}
                    </span>

                    <span className="font-bold text-emerald-950 dark:text-white">{email}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase opacity-50 dark:text-primary mb-1">
                      {t("step_personal.phone")}
                    </span>

                    <span className="font-bold text-emerald-950 dark:text-white">{phone}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase opacity-50 dark:text-primary mb-1">
                      {t("step_personal.roleLabel")}
                    </span>

                    <span className="font-bold text-emerald-950 dark:text-white">
                      {t(`step_personal.roles.${role}`)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className="flex items-start gap-4 text-left p-4 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-white/5 transition-colors hover:bg-emerald-50 dark:hover:bg-white/10"
              >
                <div className="w-5 h-5 rounded border-2 border-emerald-400 dark:border-primary flex items-center justify-center">
                  {agreeTerms && (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600 dark:text-primary"
                    />
                  )}
                </div>

                <p className="text-[13px] text-emerald-800 dark:text-muted-foreground">
                  {t("step_review.terms")}
                </p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      {!modalType && (
        <div className="border-t border-emerald-200/50 dark:border-white/10 px-6 py-5 flex items-center justify-between bg-emerald-50/50 dark:bg-white/[0.02]">
          {/* STEP 1 FOOTER */}
          {step === 1 ? (
            <>
              <div className="flex gap-3">
                <Link
                  href={`/`}
                  className="h-11 px-5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-white/5 inline-flex items-center justify-center text-[11px] uppercase tracking-[0.16em] font-black text-emerald-700 dark:text-primary transition-all hover:scale-105"
                >
                  Accueil
                </Link>

                <Link
                  href={`/login`}
                  className="h-11 px-5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-white/5 inline-flex items-center justify-center text-[11px] uppercase tracking-[0.16em] font-black text-emerald-700 dark:text-primary transition-all hover:scale-105"
                >
                  {t("header.subtitle")}
                </Link>
              </div>

              <Button
                onClick={handleNext}
                className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-black uppercase tracking-[0.16em] text-[11px] shadow-lg dark:shadow-primary/20"
              >
                {t("step_welcome.continue")}
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-emerald-700 dark:text-primary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={16} />
                {t("step_review.back")}
              </button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold uppercase tracking-widest text-[12px]"
                >
                  {t("step_personal.continue")}
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!agreeTerms || isSubmitting}
                  className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold uppercase tracking-widest text-[12px]"
                >
                  {isSubmitting ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    t("step_review.submit")
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-[#040D06]/95 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="max-w-sm text-center space-y-5"
            >
              <div
                className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center ${
                  modalType === "success"
                    ? "bg-emerald-500/10 text-emerald-500 dark:text-primary"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {modalType === "success" ? (
                  <CheckCircle2 size={30} />
                ) : (
                  <AlertTriangle size={30} />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-emerald-950 dark:text-foreground">
                  {modalType === "success"
                    ? t("success.title")
                    : t("errors.title")}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {modalMessage}
                </p>
              </div>

              {modalType === "success" ? (
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center h-12 rounded-xl bg-emerald-600 dark:bg-primary text-white dark:text-primary-foreground uppercase tracking-widest font-black text-[12px] shadow-lg dark:shadow-primary/20"
                >
                  {t("success.back")}
                </Link>
              ) : (
                <Button
                  onClick={() => setModalType(null)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-emerald-200 dark:border-white/10"
                >
                  {t("errors.retry")}
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}