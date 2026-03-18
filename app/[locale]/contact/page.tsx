"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Loader2, CheckCircle2, User, Tag, MessageSquare,
  MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { sendContactMessage } from "@/services/contact-actions";
import { useTranslations } from "next-intl";
import ContactMap from "@/components/contact/ContactMap";

interface ContactFormResult {
  success: boolean;
  error?: string;
}

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ContactFormResult>({ success: false });

  const infoItems = t.raw('info.items');
  const formFields = t.raw('form.fields');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult({ success: false });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await sendContactMessage(data);
      let resultData: ContactFormResult;
      
      if (typeof response === 'object' && response !== null) {
        resultData = {
          success: response.success ?? false,
          error: response.error ?? undefined
        };
      } else {
        resultData = { success: false, error: t('form.error.invalid') };
      }
      
      setResult(resultData);
      
      if (resultData.success) {
        setIsSent(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(resultData.error || t('form.error.generic'));
      }
    } catch (err) {
      setError(t('form.error.connection'));
      console.error("Erreur d'envoi:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const icons = [MapPin, Phone, Mail, Clock]; // Mapping to Location, Phone, Email, Hours

  return (
    <main className="min-h-screen bg-[#fafafa] overflow-x-hidden pt-28 lg:pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-7xl relative">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT SIDE: MAP & LOCATION INFO */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1 flex flex-col gap-6">
            <div className="h-[400px] lg:h-[calc(100vh-200px)] min-h-[600px] sticky top-32 rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.1)] border-4 border-white z-10">
              <ContactMap />
              <div className="absolute top-6 left-6 z-[500] pointer-events-none">
                <Badge className="bg-white/95 text-blue-600 border-none rounded-2xl px-5 py-2 uppercase tracking-widest text-[10px] font-black shadow-lg backdrop-blur-md flex items-center gap-2">
                  <MapPin size={14} />
                  {t('map.badge')}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('info.social')}</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <motion.a 
                    key={i} 
                    href="#" 
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTENT & FORM */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2 flex flex-col gap-12">
            
            {/* HEADER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge className="bg-blue-600/10 text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">
                {t('header.badge')}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
              </h1>
              <p className="text-slate-500 max-w-xl font-light text-lg lg:text-xl leading-relaxed">
                {t('header.description')}
              </p>
            </motion.div>

            {/* INFO CARDS */}
            <div className="grid sm:grid-cols-2 gap-4">
              {infoItems.map((item: any, idx: number) => {
                const Icon = icons[idx];
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    key={idx}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-blue-100 group flex flex-col gap-4 cursor-default transition-shadow"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl group-hover:bg-blue-600/10 group-hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1.5 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">{item.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CONTACT FORM */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.04)] relative overflow-hidden"
            >
              {/* Form visual elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60" />

              <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight mb-8 relative z-10">
                {t('form.title')}
              </h3>

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative z-10"
                  >
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm font-medium"
                      >
                        <div className="font-bold mt-0.5">!</div>
                        <p>{error}</p>
                      </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* NAME */}
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          {formFields.name.label} {formFields.name.required && <span className="text-red-400">*</span>}
                        </label>
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                          <Input
                            name="name"
                            required
                            placeholder={formFields.name.placeholder}
                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base placeholder:text-slate-400 font-medium"
                          />
                        </div>
                      </div>

                      {/* EMAIL */}
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          {formFields.email.label} {formFields.email.required && <span className="text-red-400">*</span>}
                        </label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                          <Input
                            name="email"
                            type="email"
                            required
                            placeholder={formFields.email.placeholder}
                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base placeholder:text-slate-400 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUBJECT */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        {formFields.subject.label} {formFields.subject.required && <span className="text-red-400">*</span>}
                      </label>
                      <div className="relative">
                        <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                        <Input
                          name="subject"
                          required
                          placeholder={formFields.subject.placeholder}
                          className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        {formFields.message.label} {formFields.message.required && <span className="text-red-400">*</span>}
                      </label>
                      <div className="relative">
                        <MessageSquare size={18} className="absolute left-4 top-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                        <Textarea
                          name="message"
                          required
                          placeholder={formFields.message.placeholder}
                          className="min-h-[160px] pl-12 pt-4 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base placeholder:text-slate-400 font-medium resize-none shadow-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl uppercase font-bold tracking-[0.1em] text-xs shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group/btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>{t('form.submitting')}</span>
                        </>
                      ) : (
                        <div className="relative flex items-center gap-2">
                          <span className="relative z-10">{t('form.submit')}</span>
                          <Send size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 relative z-10"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 mx-auto"
                    >
                      <CheckCircle2 size={48} strokeWidth={2} />
                    </motion.div>

                    <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                      {t('form.success.title')}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto" 
                       dangerouslySetInnerHTML={{ __html: t.raw('form.success.description') }} />

                    <Button
                      onClick={() => setIsSent(false)}
                      variant="outline"
                      className="mt-10 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 uppercase font-bold text-xs tracking-widest px-8 h-12 transition-all duration-300"
                    >
                      {t('form.success.button')}
                    </Button>
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