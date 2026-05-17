"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendContactMessage } from "@/services/contact-actions";
import { toast } from "react-hot-toast";

interface ContactFormProps {
  t: {
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      subject: { label: string; placeholder: string };
      requestType: {
        label: string;
        placeholder: string;
        options: Record<string, string>;
      };
      message: { label: string; placeholder: string };
    };
    submit: string;
    submitting: string;
    success: {
      title: string;
      description: string | React.ReactNode;
      button: string;
    };
    title: string;
    secure: string;
  };
}

export default function ContactForm({ t }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestType, setRequestType] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requestType) {
      toast.error("Veuillez sélectionner un type de demande.");
      return;
    }

    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: `[${requestType}] ${formData.get("subject") as string}`,
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

  const formVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative group w-full mx-auto pb-4">
      {/* Decorative Glow background behind the form */}
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-card/60 backdrop-blur-2xl border border-border/40 p-6 sm:p-8 md:p-12 shadow-2xl rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20"
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              key="success"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center space-y-8 py-16"
            >
              <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 transition={{ type: "spring", delay: 0.2 }}
                 className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(201,168,76,0.3)]"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">{t.success.title}</h2>
                <div className="text-sm text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
                  {t.success.description}
                </div>
              </div>
              <Button 
                onClick={() => { setStatus("idle"); setRequestType(""); }}
                className="bg-primary text-primary-foreground rounded-full mt-4 uppercase font-black text-[10px] tracking-widest px-10 py-6 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                {t.success.button}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/30">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{t.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {t.secure}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label={t.fields.name.label} name="name" placeholder={t.fields.name.placeholder} required />
                  <Field label={t.fields.email.label} name="email" type="email" placeholder={t.fields.email.placeholder} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3 group/input">
                     <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 transition-colors group-focus-within/input:text-primary">
                       {t.fields.requestType.label}
                     </label>
                     <Select value={requestType} onValueChange={setRequestType}>
                       <SelectTrigger className="bg-muted/10 border-border/50 rounded-md h-14 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-medium shadow-sm hover:bg-muted/20 hover:border-primary/30 outline-none">
                         <SelectValue placeholder={t.fields.requestType.placeholder} />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                         {Object.entries(t.fields.requestType.options).map(([key, value]) => (
                           <SelectItem key={key} value={key} className="text-sm cursor-pointer">{value as string}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   
                   <Field label={t.fields.subject.label} name="subject" placeholder={t.fields.subject.placeholder} required />
                </div>

                <div className="space-y-3 group/field">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 transition-colors group-focus-within/field:text-primary">
                    {t.fields.message.label}
                  </label>
                  <Textarea 
                    name="message"
                    placeholder={t.fields.message.placeholder} 
                    className="bg-muted/10 border-border/50 rounded-md min-h-[160px] focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-light shadow-inner resize-none hover:bg-muted/20 outline-none"
                    required
                  />
                </div>

                <Button 
                  disabled={status === "loading"}
                  className="w-full bg-primary text-primary-foreground rounded-lg h-16 font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-primary/20 group/submit relative overflow-hidden"
                >
                  {/* Subtle shine effect on button */}
                  <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/submit:translate-x-[150%] transition-transform duration-[1500ms]" />
                  
                  {status === "loading" ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="animate-spin" size={18} /> {t.submitting}
                    </span>
                  ) : (
                    <span className="flex items-center gap-4 relative z-10">
                      {t.submit}
                      <ArrowRight size={16} className="group-hover/submit:translate-x-1 transition-transform" />
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
      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 transition-colors group-focus-within/input:text-primary">{label}</label>
      <Input 
        {...props}
        className="bg-muted/10 border-border/50 rounded-md h-14 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-medium shadow-sm hover:bg-muted/20 hover:border-primary/30 outline-none"
      />
    </div>
  );
}
