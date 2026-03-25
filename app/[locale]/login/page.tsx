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
import { useTheme } from "next-themes";

export default function AdminLogin() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('LoginPage');
  const { theme, resolvedTheme } = useTheme(); 
  
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalType(null);

    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      
      if (result?.error) {
        setModalMessage(t('right.errors.invalid') || "Identifiants invalides");
        setModalType("error");
        setIsSubmitting(false);
      } else {
        setModalType("success");
        setModalMessage("Authentification réussie. Redirection en cours...");
        
        startTransition(() => {
          setTimeout(() => {
            router.push(`/${locale}/admin`);
            router.refresh();
          }, 1500);
        });
      }
    } catch (err) {
      setModalMessage(t('right.errors.connection') || "Erreur de connexion");
      setModalType("error");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const isLight = resolvedTheme === "light" || theme === "light";

  return (
    <div className={isLight ? "light" : ""}>
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

        <div className="relative z-10 w-full max-w-[520px] p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square w-full bg-card/90 backdrop-blur-3xl border border-border p-8 md:p-14 flex flex-col justify-center rounded-2xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] group overflow-hidden"
          >
            {/* INDICATEURS TECHNIQUES AUX ANGLES */}
            <div className="absolute top-6 left-6 flex gap-1 opacity-50">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="w-8 h-[1px] bg-primary/30 mt-[3px]" />
            </div>
            <div className="absolute bottom-6 right-6 flex gap-1 opacity-50">
              <div className="w-8 h-[1px] bg-primary/30 mt-[3px]" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            {/* BORDURE PULSÉE DÉLICATE */}
            <motion.div 
              animate={{ borderColor: ["var(--border)", "var(--primary)", "var(--border)"], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 border-2 rounded-2xl pointer-events-none z-0"
            />

            <div className="relative z-10 w-full">
              {/* HEADER */}
              <div className="flex flex-col items-center mb-10 text-center">
                <Link href="/" className="group flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all mb-6">
                  <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  RETOUR
                </Link>
                <h1 className="text-5xl font-serif font-black tracking-tighter text-foreground uppercase leading-none">
                  CREDDA<span className="text-primary">.</span>
                </h1>
                <p className="text-[8px] uppercase tracking-[0.8em] text-primary/60 font-black mt-4">
                  Management Portal v4.0
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  {/* LABEL + INPUT EMAIL */}
                  <div className="group/field relative space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60 ml-1 group-focus-within/field:text-primary transition-colors">
                      Identifiant
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/field:text-primary transition-colors" size={16} />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 bg-background/50 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 transition-all placeholder:text-muted-foreground/10 text-sm"
                        placeholder="nom@ulpgl.ac.cd"
                        required
                      />
                    </div>
                  </div>

                  {/* LABEL + INPUT PASSWORD */}
                  <div className="group/field relative space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60 ml-1 group-focus-within/field:text-primary transition-colors">
                      Clé d'accès
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/field:text-primary transition-colors" size={16} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 pl-12 pr-12 bg-background/50 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 transition-all placeholder:text-muted-foreground/10 text-sm"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOUTON D'ACCÈS AVEC EFFET GLOW */}
                <div className="relative group/btn pt-4">
                  <div className="absolute -inset-1 bg-primary/20 blur-md opacity-0 group-hover/btn:opacity-100 transition duration-500 rounded-xl" />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isPending} 
                    className="relative w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
                  >
                    {isSubmitting || isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <span className="flex items-center gap-3">
                        Initialiser la session
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* FOOTER */}
              <div className="mt-10 pt-6 border-t border-border/50 flex justify-between items-center text-[7px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">
                <span>ULPGL GOMA</span>
                <span>SECURED ACCESS</span>
              </div>
            </div>
          </motion.div>
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
                  <h3 className="text-xl font-serif font-black uppercase tracking-tighter">
                    {modalType === 'success' ? "Bienvenue" : "Accès Refusé"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium uppercase tracking-widest">
                    {modalMessage}
                  </p>
                </div>
                {modalType === 'error' && (
                  <Button onClick={() => setModalType(null)} className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-[10px] uppercase tracking-widest">
                    Réessayer
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