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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
        setError(t('right.errors.invalid'));
      } else {
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
    return <div className="min-h-screen bg-[#0C0C0A] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#C9A84C]" size={48} />
    </div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0C0C0A]">
      {/* LEFT VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-[#0C0C0A] relative overflow-hidden items-center justify-center p-12 lg:p-24 border-r border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-[100px]" />
          <div className="absolute inset-0 bg-grid-move opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 rounded-none mb-8 px-5 py-2 uppercase tracking-[0.4em] text-[10px]">
              {t('left.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-7xl font-serif font-black text-[#F5F2EC] leading-[0.9]">
               Portail de Gestion <span className="text-[#C9A84C] italic">Scientifique</span>.
            </h2>
            <div className="w-16 h-[2px] bg-[#C9A84C] mt-8" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#F5F2EC]/40 font-light text-lg leading-relaxed max-w-md"
          >
            {t('left.description')}
          </motion.p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-[#111110]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-sm"
        >
          <div className="space-y-12 mb-16">
            <Link href="/" className="inline-flex items-center text-[10px] font-black text-white/20 hover:text-[#C9A84C] transition-colors uppercase tracking-[0.3em] group">
              <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              {t('right.back')}
            </Link>
            <div className="text-3xl font-serif font-black tracking-tight text-[#F5F2EC]">
              CREDDA<span className="text-[#C9A84C]">.ULPGL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Email Académique</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <Input
                    type="email"
                    placeholder="adresse@ulpgl.ac.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-black/40 border-white/5 rounded-none focus:border-[#C9A84C]/50 transition-all text-white font-light"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 bg-black/40 border-white/5 rounded-none focus:border-[#C9A84C]/50 transition-all text-white font-light"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-16 bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0C0C0A] rounded-none font-black uppercase tracking-[0.3em] text-[10px] transition-all relative overflow-hidden group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span>{t('right.submitting')}</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {t('right.submit')}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center mt-12 text-[9px] uppercase tracking-widest text-white/10">
            © {new Date().getFullYear()} CREDDA Research Management System
          </p>
        </motion.div>
      </div>
    </div>
  );
}