"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { sendContactMessage } from "@/services/contact-actions";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await sendContactMessage(data);
      if (res.success) {
        setStatus("success");
        toast.success("Message envoyé au secrétariat !");
      } else {
        setStatus("error");
        toast.error(res.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Erreur réseau. Veuillez réessayer.");
    }
  }

  return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12 selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* GAUCHE : IDENTITÉ & INFOS */}
          <div className="space-y-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-primary">Liaison Institutionnelle</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-serif font-black text-foreground leading-[0.85] tracking-tighter uppercase">
                Écrivons le <br />
                <span className="text-primary italic">Futur.</span>
              </h1>
              
              <p className="text-muted-foreground font-medium max-w-md leading-relaxed text-sm uppercase tracking-widest opacity-60">
                Recherche scientifique, expertise clinique ou partenariat stratégique : le secrétariat CREDDA-ULPGL assure votre orientation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 border-t border-border/50 pt-16">
              <ContactInfoCard 
                icon={<MapPin size={18} />} 
                title="Campus Salomon" 
                content="Av. de la Corniche, Himbi, Goma" 
              />
              <ContactInfoCard 
                icon={<Mail size={18} />} 
                title="Email Officiel" 
                content="creddaulpgl08@gmail.com" 
              />
              <ContactInfoCard 
                icon={<Phone size={18} />} 
                title="Ligne Directe" 
                content="+243 812 345 678" 
              />
            </div>
          </div>

          {/* DROITE : LE FORMULAIRE (RATIO CARRÉ) */}
          <div className="relative group">
            {/* Déco technique autour du formulaire */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-primary/20 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-primary/20 pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-card border border-border p-10 lg:p-14 flex flex-col justify-center shadow-2xl overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center text-primary border border-primary/20">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-serif font-black uppercase tracking-tighter">Transmis.</h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                        Votre requête est en cours de traitement par le secrétariat.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setStatus("idle")}
                      className="bg-foreground text-background rounded-md uppercase font-black text-[10px] tracking-widest px-10 py-6 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Nouveau Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="w-full">
                    <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
                      <h3 className="text-xl font-serif font-black uppercase tracking-tighter italic">Requête Officielle</h3>
                      <div className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1">Secure Protocol</div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Field label="Identité" name="name" placeholder="Pr. Robert Kule" required />
                        <Field label="Contact" name="email" type="email" placeholder="kule@ulpgl.ac.cd" required />
                      </div>
                      <Field label="Sujet" name="subject" placeholder="Coopération de recherche" required />
                      
                      <div className="space-y-3 group/field">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground group-focus-within/field:text-primary transition-colors">Message</label>
                          <div className="h-[1px] w-8 bg-border group-focus-within/field:bg-primary transition-all" />
                        </div>
                        <Textarea 
                          name="message"
                          placeholder="Explicitez votre requête ici..." 
                          className="bg-muted/30 border-border rounded-md min-h-[120px] focus-visible:ring-1 focus-visible:ring-primary/40 focus:border-primary/50 transition-all text-sm font-medium placeholder:opacity-10"
                          required
                        />
                      </div>

                      <Button 
                        disabled={status === "loading"}
                        className="w-full bg-primary text-primary-foreground rounded-md h-16 font-black uppercase tracking-[0.4em] text-[10px] hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-primary/10"
                      >
                        {status === "loading" ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <span className="flex items-center gap-4">
                            Envoyer au Secrétariat
                            <ArrowRight size={14} />
                          </span>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

// COMPOSANTS LOCAUX
function ContactInfoCard({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="group space-y-4">
      <div className="w-12 h-12 bg-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">{title}</h4>
        <p className="text-sm font-bold text-foreground leading-relaxed uppercase tracking-tighter">{content}</p>
      </div>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-2 group/input">
      <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground group-focus-within/input:text-primary transition-colors">{label}</label>
      <Input 
        {...props}
        className="bg-muted/30 border-border rounded-md h-12 focus-visible:ring-1 focus-visible:ring-primary/40 transition-all text-xs font-bold placeholder:opacity-10"
      />
    </div>
  );
}