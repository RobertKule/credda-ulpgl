"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, User, Tag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { sendContactMessage } from "@/services/contact-actions"; // Import de l'action
import { MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, ShieldCheck, Globe } from "lucide-react";
export default function ContactPage() {
  interface ContactFormState {
    success: boolean;
    error?: string;
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
const [result, setResult] = useState<ContactFormState>({ success: false });
  // Interface pour le state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = await sendContactMessage(data);

    if (result.success) {
      setIsSent(true);
    } else {
      setError(result.error || "Une erreur est survenue.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* --- 1. HEADER CONTACT (DARK ACADEMIC) --- */}
      <header className="bg-[#050a15] text-white py-24 lg:py-32 relative overflow-hidden">
        {/* Cercles de fond décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -ml-20 -mb-20" />

        <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-blue-600 rounded-none px-4 py-1.5 uppercase tracking-[0.3em] text-[10px] mb-4">
              Liaison Institutionnelle
            </Badge>
            <h1 className="text-5xl lg:text-8xl font-serif font-bold italic leading-tight">
              Parlons du <span className="text-blue-400">Futur</span>.
            </h1>
          </motion.div>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
            Recherche scientifique, expertise clinique ou partenariats stratégiques :
            notre secrétariat vous oriente vers les bons experts.
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
                <h3 className="text-3xl font-serif font-bold">Contact Hub</h3>
                <div className="h-1 w-12 bg-blue-600" />
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Accès direct aux départements de recherche et de clinique juridique de l'ULPGL.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <MapPin className="text-blue-500" />, title: "Campus Salomon", content: "Avenue de la Corniche, Himbi, Goma, RDC" },
                  { icon: <Mail className="text-blue-500" />, title: "Email Officiel", content: "contact@credda-ulpgl.org" },
                  { icon: <Phone className="text-blue-500" />, title: "Ligne Directe", content: "+243 812 345 678" },
                  { icon: <Clock className="text-blue-500" />, title: "Heures d'ouverture", content: "Lun - Ven: 08:30 - 16:30" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5 group">
                    <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-blue-600/20 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-1">{item.title}</p>
                      <p className="text-blue-50 text-sm font-light leading-snug">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-16 space-y-6 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Connectivité Sociale</p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* DROITE : FORMULAIRE (CLEAN WHITE) */}
          {/* DROITE : FORMULAIRE RÉEL */}
          <div className="lg:col-span-8 p-10 lg:p-20 bg-white">
            {!isSent ? (
              <div className="max-w-2xl mx-auto space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight">Envoyez une requête scientifique</h3>
                  {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-3 border-l-4 border-red-600">{error}</p>}
                </div>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* NOM COMPLET */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <User size={12} className="text-blue-600/50" />
                      Identité Complète *
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder="Pr. / Dr. / Nom complet"
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Mail size={12} className="text-blue-600/50" />
                      Courriel Institutionnel *
                    </label>
                    <Input
                      name="email"
                      required
                      type="email"
                      placeholder="adresse@institution.org"
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* SUJET */}
                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Tag size={12} className="text-blue-600/50" />
                      Objet de la Correspondance *
                    </label>
                    <Input
                      name="subject"
                      required
                      placeholder="Ex: Demande de partenariat scientifique ou expertise clinique"
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-transparent px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <MessageSquare size={12} className="text-blue-600/50" />
                      Détails de votre requête *
                    </label>
                    <Textarea
                      name="message"
                      required
                      placeholder="Rédigez ici votre message à l'attention du secrétariat du CREDDA..."
                      className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 bg-slate-50/30 p-4 min-h-[180px] text-lg focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 font-light resize-none"
                    />
                  </div>

                  {/* BOUTON D'ENVOI */}
                  <div className="md:col-span-2 pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-16 h-16 bg-[#050a15] hover:bg-blue-700 text-white rounded-none uppercase font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all flex items-center gap-4 group"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <>
                          Transmettre au secrétariat
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
                    Requête Enregistrée.
                  </h3>
                  <div className="w-12 h-1 bg-emerald-500 mx-auto mb-6" />
                  <p className="text-slate-600 font-light leading-relaxed">
                    Votre message a été transmis avec succès au <span className="font-bold text-slate-900">Secrétariat Scientifique du CREDDA-ULPGL</span>.
                    Un accusé de réception vous sera envoyé par courriel après examen de votre demande par nos experts.
                  </p>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={() => setIsSent(false)}
                    variant="outline"
                    className="rounded-none border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-600 uppercase font-black text-[10px] tracking-widest px-10 h-12 transition-all"
                  >
                    Nouvelle correspondance
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
          <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400">Géolocalisation</Badge>
          <h3 className="text-4xl font-serif font-bold text-slate-900">Le Campus Salomon</h3>
        </div>

        <div className="h-[500px] w-full bg-slate-100 shadow-2xl relative border-8 border-white overflow-hidden group">
          {/* GOOGLE MAPS IFRAME POINTE SUR ULPGL GOMA CAMPUS SALOMON */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.102660144983!2d29.21980311475458!3d-1.6836423987723048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f81d11e5f8f%3A0xc36e3c5443c7b3c2!2sULPGL%20Salomon!5e0!3m2!1sfr!2s!4v1707600000000!5m2!1sfr!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
          />
          {/* Overlay d'information sur la carte */}
          <div className="absolute bottom-6 left-6 bg-white p-6 shadow-2xl hidden md:block max-w-xs border-l-4 border-blue-600">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 tracking-widest">Coordonnées GPS</p>
            <p className="text-slate-800 font-bold text-sm mb-1 italic">Quartier Himbi, Goma</p>
            <p className="text-slate-500 text-xs leading-relaxed font-light">Suivez l'avenue de la Corniche jusqu'au portail principal du Campus Salomon.</p>
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
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Sécurité des données</h4>
              <p className="text-slate-500 text-sm font-light">Vos informations sont chiffrées et ne sont jamais partagées.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white shadow-xl">
              <Globe size={32} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Portée Régionale</h4>
              <p className="text-slate-500 text-sm font-light">Nous intervenons partout dans la région des Grands Lacs.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
