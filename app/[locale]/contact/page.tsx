// app/[locale]/contact/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* LEFT: INFO */}
          <div className="space-y-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#C9A84C] block mb-6">Liaison Institutionnelle</span>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-[#F5F2EC] leading-[0.85] mb-10">
                Parlons du <span className="text-[#C9A84C] italic">Futur</span>.
              </h1>
              <p className="text-[#F5F2EC]/40 font-sans font-light max-w-md leading-relaxed">
                Recherche scientifique, expertise clinique ou partenariat stratégique : notre secrétariat vous orientera vers les experts adéquats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ContactInfoCard 
                icon={<MapPin size={20} />} 
                title="Campus Salomon" 
                content="Avenue de la Corniche, Himbi, Goma, RDC" 
              />
              <ContactInfoCard 
                icon={<Mail size={20} />} 
                title="Email Officiel" 
                content="creddaulpgl08@gmail.com" 
              />
              <ContactInfoCard 
                icon={<Phone size={20} />} 
                title="Ligne Directe" 
                content="+243 812 345 678" 
              />
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="bg-[#111110] border border-white/5 p-10 lg:p-16 relative overflow-hidden">
             {status === "success" ? (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
                  <CheckCircle2 size={64} className="text-[#C9A84C] mb-4" />
                  <h2 className="text-3xl font-serif font-black text-white">Message Transmis</h2>
                  <p className="text-white/40 max-w-sm mx-auto">Votre requête a été envoyée au secrétariat scientifique du CREDDA-ULPGL. Nous vous répondrons dans les plus brefs délais.</p>
                  <Button 
                    onClick={() => setStatus("idle")}
                    className="mt-8 bg-[#C9A84C] text-black rounded-none uppercase font-black text-[10px] tracking-widest px-10 py-6"
                   >
                    Nouveau Message
                  </Button>
               </div>
             ) : (
               <>
                <h3 className="text-2xl font-serif font-black text-[#F5F2EC] mb-10 pb-6 border-b border-white/5">
                  Soumettre une requête
                </h3>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Identité Complète" name="name" placeholder="Pr. / Dr. / Nom" required />
                    <Field label="Email Institutionnel" name="email" type="email" placeholder="adresse@institution.org" required />
                  </div>
                  <Field label="Objet du Contact" name="subject" placeholder="Ex: Collaboration scientifique" required />
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Message</label>
                    <Textarea 
                      name="message"
                      placeholder="Décrivez votre message..." 
                      className="bg-black/40 border-white/5 rounded-none min-h-[150px] focus:border-[#C9A84C]/50 transition-all text-white font-light"
                      required
                    />
                  </div>
                  <Button 
                    disabled={status === "loading"}
                    className="w-full bg-[#C9A84C] text-[#0C0C0A] rounded-none py-8 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#E8C97A] transition-all"
                  >
                    {status === "loading" ? "Transmission..." : "Transmettre au secrétariat"}
                  </Button>
                  {status === "error" && <p className="text-red-500 text-xs text-center">Une erreur est survenue. Veuillez réessayer.</p>}
                </form>
               </>
             )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactInfoCard({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="space-y-4">
      <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
        {icon}
      </div>
      <h4 className="text-[10px] uppercase font-black tracking-widest text-[#F5F2EC]/30">{title}</h4>
      <p className="text-sm font-bold text-[#F5F2EC] leading-relaxed">{content}</p>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-black tracking-widest text-white/20">{label}</label>
      <Input 
        {...props}
        className="bg-black/40 border-white/5 rounded-none h-14 focus:border-[#C9A84C]/50 transition-all text-white font-light placeholder:text-white/10"
      />
    </div>
  );
}