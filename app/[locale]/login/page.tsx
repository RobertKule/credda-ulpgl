"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
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

export default function AdminLogin() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/${locale}/admin/login`, { // Adapté selon ta route API réelle
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // En production, utilise un vrai JWT ou session sécurisée via NextAuth
        document.cookie = "token=ok; path=/; max-age=3600; SameSite=Strict";
        router.push(`/${locale}/admin`);
      } else {
        const data = await res.json();
        setError(data.message || "Identifiants invalides");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      
      {/* --- PARTIE GAUCHE : VISUEL INSTITUTIONNEL --- */}
      <div className="hidden md:flex md:w-1/2 bg-[#050a15] relative overflow-hidden items-center justify-center p-12">
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full border border-blue-500/30" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full border border-blue-500/20" />
        </div>

        <div className="relative z-10 max-w-md text-center md:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-blue-600 text-white rounded-none mb-6 px-4 py-1 uppercase tracking-widest text-[10px]">
              Espace Sécurisé
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Portail de Gestion <br />
              <span className="text-blue-400 italic">Scientifique</span>.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mt-6 hidden md:block" />
          </motion.div>

          <p className="text-slate-400 font-light leading-relaxed">
            Bienvenue sur l'interface d'administration du CREDDA. Cet espace est réservé 
            aux chercheurs et administrateurs autorisés pour la publication des travaux de recherche.
          </p>

          <div className="pt-8 flex items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
            <ShieldCheck className="text-blue-500" size={20} />
            Protection des données de recherche conforme
          </div>
        </div>
      </div>

      {/* --- PARTIE DROITE : FORMULAIRE --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-10"
        >
          {/* Logo / Back link */}
          <div className="space-y-4">
             <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                <ChevronLeft size={14} className="mr-1" /> Retour au site
             </Link>
             <div className="text-3xl font-serif font-black tracking-tighter text-slate-900">
               CREDDA<span className="text-blue-600">.ULPGL</span>
             </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connexion Admin</h1>
            <p className="text-sm text-slate-500">Veuillez entrer vos paramètres d'accès.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* EMAIL */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder="Adresse email professionnelle"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-none border-slate-200 focus:border-blue-600 focus:ring-0 transition-all bg-white"
                  required
                />
              </div>

              {/* MOT DE PASSE */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-none border-slate-200 focus:border-blue-600 focus:ring-0 transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
               <Link href="#" className="text-[10px] uppercase font-bold text-blue-600 hover:underline tracking-widest">
                  Mot de passe oublié ?
               </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-none font-bold uppercase tracking-[0.2em] transition-all group shadow-xl shadow-slate-200"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <footer className="pt-10 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} CREDDA Research Hub <br />
              Accès strictement surveillé
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}