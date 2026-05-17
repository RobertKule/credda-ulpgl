"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/services/contact-actions";
import { toast } from "react-hot-toast";

interface ContactFormProps {
  t: {
    identity: string;
    contact: string;
    subject: string;
    message: string;
    submit: string;
    success: string;
    successMessage: string;
    new: string;
    official: string;
    secure: string;
  };
}

export default function ContactForm({ t }: ContactFormProps) {
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
    <div className="relative group w-full max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-card border border-border/50 p-8 md:p-12 shadow-2xl rounded-md overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center space-y-8 py-12"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center text-primary border border-primary/20">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold uppercase tracking-tight">{t.success}</h2>
                <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">
                  {t.successMessage}
                </p>
              </div>
              <Button 
                onClick={() => setStatus("idle")}
                className="bg-primary text-primary-foreground rounded-md uppercase font-bold text-[10px] tracking-widest px-10 py-6 hover:bg-primary/90 transition-all"
              >
                {t.new}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" className="w-full">
              <div className="flex items-center justify-between mb-12 border-b border-border/50 pb-6">
                <h3 className="text-lg font-serif font-bold italic text-foreground/80">{t.official}</h3>
                <div className="text-[8px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 border border-primary/20 rounded-sm">
                  {t.secure}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Field label={t.identity} name="name" placeholder="Robert Kule" required />
                  <Field label={t.contact} name="email" type="email" placeholder="contact@ulpgl.ac.cd" required />
                </div>
                <Field label={t.subject} name="subject" placeholder="Scientific Collaboration" required />
                
                <div className="space-y-3 group/field">
                  <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 group-focus-within/field:text-primary transition-colors">{t.message}</label>
                  <Textarea 
                    name="message"
                    placeholder="..." 
                    className="bg-muted/20 border-border/50 rounded-md min-h-[150px] focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all text-sm font-light"
                    required
                  />
                </div>

                <Button 
                  disabled={status === "loading"}
                  className="w-full bg-primary text-primary-foreground rounded-md h-16 font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-primary/10 group"
                >
                  {status === "loading" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <span className="flex items-center gap-4">
                      {t.submit}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-3 group/input">
      <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 group-focus-within/input:text-primary transition-colors">{label}</label>
      <Input 
        {...props}
        className="bg-muted/20 border-border/50 rounded-md h-14 focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all text-sm font-medium"
      />
    </div>
  );
}
