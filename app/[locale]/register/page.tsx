// app/[locale]/register/page.tsx
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
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
  User,
  Phone,
  Building,
  FileText,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";

export default function RegisterWizard() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('RegisterPage');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    organization: "",
    requestedRole: "",
    bio: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError(t('right.errors.missingFields'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t('right.errors.passwordsDontMatch'));
        return;
      }
    }
    if (step === 2) {
      if (!formData.name || !formData.phone) {
        setError(t('right.errors.missingFields'));
        return;
      }
    }
    setError("");
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || t('right.errors.generic'));
      }
    } catch (err) {
      setError(t('right.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoginSkeleton />;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-blue-500/5 text-center space-y-8 border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-md flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">{t('right.success.title')}</h2>
            <p className="text-slate-500 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('right.success.description') }} />
          </div>
          <Button 
            onClick={() => router.push(`/${locale}`)}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-xs transition-all shadow-lg shadow-blue-600/20"
          >
            {t('right.success.button')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#fafafa]">
      {/* LEFT SIDE - VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050a15] relative overflow-hidden items-center justify-center p-12 lg:p-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-md bg-blue-600/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-md bg-emerald-600/5 blur-[80px]" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-md mb-8 px-5 py-2 uppercase tracking-[0.3em] text-[10px] shadow-lg backdrop-blur-md">
              {t('left.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-[1.1]">
              <span dangerouslySetInnerHTML={{ __html: t.raw('left.title') }} />
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-transparent mt-8 rounded-md" />
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
            <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="text-blue-400" size={18} />
            </div>
            <span>{t('left.footer')}</span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - WIZARD FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto custom-scrollbar bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-md blur-3xl -mr-64 -mt-64 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Header & Steps Indicator */}
          <div className="space-y-12 mb-12">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] group bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-md">
                <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                {t('right.back')}
              </Link>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s}
                    className={`h-1.5 rounded-md transition-all duration-500 ${step >= s ? 'w-8 bg-blue-600' : 'w-4 bg-slate-100'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-serif font-black tracking-tight text-slate-900">
                {t('right.title')}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">{`0${step}`}</span>
                <span className="h-px w-8 bg-slate-200" />
                <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
                  {step === 1 ? t('right.steps.account') : step === 2 ? t('right.steps.profile') : t('right.steps.details')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-medium overflow-hidden"
                >
                  <div className="font-bold">!</div>
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {step === 1 && (
                  <>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Mail size={18} />
                      </div>
                      <Input
                        name="email"
                        type="email"
                        placeholder={t('right.fields.email.placeholder')}
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Lock size={18} />
                      </div>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('right.fields.password.placeholder')}
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-12 pr-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 z-10">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Lock size={18} />
                      </div>
                      <Input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('right.fields.confirmPassword.placeholder')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <User size={18} />
                      </div>
                      <Input
                        name="name"
                        placeholder={t('right.fields.name.placeholder')}
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Phone size={18} />
                      </div>
                      <Input
                        name="phone"
                        placeholder={t('right.fields.phone.placeholder')}
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Building size={18} />
                      </div>
                      <Input
                        name="organization"
                        placeholder={t('right.fields.organization.placeholder')}
                        value={formData.organization}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <ShieldCheck size={18} />
                      </div>
                      <Input
                        name="requestedRole"
                        placeholder={t('right.fields.requestedRole.placeholder')}
                        value={formData.requestedRole}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2 group relative">
                      <div className="absolute left-4 top-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <FileText size={18} />
                      </div>
                      <Textarea
                        name="bio"
                        placeholder={t('right.fields.bio.placeholder')}
                        value={formData.bio}
                        onChange={handleChange}
                        className="pl-12 min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={prevStep} 
                  className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold uppercase tracking-[0.1em] text-[10px]"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  {t('right.prev')}
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-[10px] transition-all shadow-lg shadow-blue-600/20 group/btn"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <span className="flex items-center gap-2">
                    {step === 3 ? t('right.submit') : t('right.next')}
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
