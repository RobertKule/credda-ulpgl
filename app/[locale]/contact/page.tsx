// app/[locale]/contact/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, Loader2, CheckCircle2, User, Tag, MessageSquare,
  MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, 
  ShieldCheck, Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { sendContactMessage } from "@/services/contact-actions";
import { useTranslations } from "next-intl";

// Interface pour le résultat du formulaire
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

  const icons = [MapPin, Mail, Phone, Clock];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* --- 1. HEADER CONTACT (DARK ACADEMIC) --- */}
      <header className="relative bg-[#050a15] text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -ml-20 -mb-20" />

        <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-blue-600 rounded-none px-4 py-1.5 uppercase tracking-[0.3em] text-[10px] mb-4">
              {t('header.badge')}
            </Badge>
            <h1 className="text-5xl lg:text-8xl font-serif font-bold italic leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
          </motion.div>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
            {t('header.description')}
          </p>
        </div>
      </header>

      {/* --- 2. SECTION CARTE DE CONTACT (SPLIT DESIGN) --- */}
      <section className="container mx-auto px-6 -mt-20 relative z-20 mb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-12 gap-0 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-slate-100"
        >
          {/* GAUCHE : INFOS DE CONTACT (DEEP BLUE) */}
          <div className="lg:col-span-4 bg-[#0a1120] text-white p-10 lg:p-16 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />

            <div className="space-y-12 relative z-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-serif font-bold">{t('info.title')}</h3>
                <div className="h-1 w-12 bg-blue-600" />
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  {t('info.description')}
                </p>
              </div>

              <div className="space-y-8">
                {infoItems.map((item: any, idx: number) => {
                  const Icon = icons[idx];
                  return (
                    <div key={idx} className="flex items-start gap-5 group">
                      <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-blue-600/20 transition-all">
                        <Icon className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-1">{item.title}</p>
                        <p className="text-blue-50 text-sm font-light leading-snug">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-16 space-y-6 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t('info.social')}</p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* DROITE : FORMULAIRE */}
          <div className="lg:col-span-8 p-10 lg:p-20 bg-white">
            {!isSent ? (
              <div className="max-w-2xl mx-auto space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight">
                    {t('form.title')}
                  </h3>
                  
                  {/* Affichage des erreurs */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-50 border-l-4 border-red-600 p-4 flex items-start gap-3"
                    >
                      <div className="text-red-600 font-bold text-lg">!</div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* NOM COMPLET */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <User size={12} className="text-blue-600/50" />
                      {formFields.name.label} {formFields.name.required}
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder={formFields.name.placeholder}
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Mail size={12} className="text-blue-600/50" />
                      {formFields.email.label} {formFields.email.required}
                    </label>
                    <Input
                      name="email"
                      required
                      type="email"
                      placeholder={formFields.email.placeholder}
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* SUJET */}
                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Tag size={12} className="text-blue-600/50" />
                      {formFields.subject.label} {formFields.subject.required}
                    </label>
                    <Input
                      name="subject"
                      required
                      placeholder={formFields.subject.placeholder}
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <MessageSquare size={12} className="text-blue-600/50" />
                      {formFields.message.label} {formFields.message.required}
                    </label>
                    <Textarea
                      name="message"
                      required
                      placeholder={formFields.message.placeholder}
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-slate-50/30 p-4 min-h-[180px] text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light resize-none"
                    />
                  </div>

                  {/* BOUTON D'ENVOI */}
                  <div className="md:col-span-2 pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-16 h-16 bg-[#050a15] hover:bg-blue-700 text-white rounded-none uppercase font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all flex items-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>{t('form.submitting')}</span>
                        </>
                      ) : (
                        <>
                          {t('form.submit')}
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-6 bg-slate-50 border border-slate-100 rounded-none space-y-8"
              >
                <div className="relative mx-auto w-24 h-24">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-0 bg-emerald-500 rounded-full opacity-20"
                  />
                  <div className="relative flex items-center justify-center h-full text-emerald-600">
                    <CheckCircle2 size={64} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <h3 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {t('form.success.title')}
                  </h3>
                  <div className="w-12 h-1 bg-emerald-500 mx-auto mb-6" />
                  <p className="text-slate-600 font-light leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: t.raw('form.success.description') }} />
                </div>

                <div className="pt-6">
                  <Button
                    onClick={() => {
                      setIsSent(false);
                      setError("");
                      setResult({ success: false });
                    }}
                    variant="outline"
                    className="rounded-none border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-600 uppercase font-black text-[10px] tracking-widest px-10 h-12 transition-all"
                  >
                    {t('form.success.button')}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* --- 3. SECTION CARTE INTERACTIVE (CAMPUS SALOMON GOMA) --- */}
      <section className="container mx-auto px-6 mb-24">
        <div className="space-y-6 mb-12 text-center">
          <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400">
            {t('map.badge')}
          </Badge>
          <h3 className="text-4xl font-serif font-bold text-slate-900">{t('map.title')}</h3>
        </div>

        <div className="h-[500px] w-full bg-slate-100 shadow-2xl relative border-8 border-white overflow-hidden group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.102660144983!2d29.21980311475458!3d-1.6836423987723048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f81d11e5f8f%3A0xc36e3c5443c7b3c2!2sULPGL%20Salomon!5e0!3m2!1sfr!2s!4v1707600000000!5m2!1sfr!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute bottom-6 left-6 bg-white p-6 shadow-2xl hidden md:block max-w-xs border-l-4 border-blue-600">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 tracking-widest">{t('map.gps')}</p>
            <p className="text-slate-800 font-bold text-sm mb-1 italic">{t('map.location')}</p>
            <p className="text-slate-500 text-xs leading-relaxed font-light">
              {t('map.description')}
            </p>
          </div>
        </div>
      </section>

      {/* --- 4. SECTION FAQ RAPIDE (ACCESSIBILITÉ) --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white shadow-xl">
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">{t('faq.security.title')}</h4>
              <p className="text-slate-500 text-sm font-light">
                {t('faq.security.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white shadow-xl">
              <Globe size={32} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">{t('faq.regional.title')}</h4>
              <p className="text-slate-500 text-sm font-light">
                {t('faq.regional.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}