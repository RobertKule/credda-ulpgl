// components/public/CaseForm.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  User,
  MapPin,
  FileText,
  ShieldCheck
} from "lucide-react";
import { submitClinicalCase } from "@/services/clinical-actions";
import { motion, AnimatePresence } from "framer-motion";

export default function CaseForm() {
  const t = useTranslations("ContactPage.form");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    problemType: "",
    description: "",
    expectations: ""
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) return nextStep();
    
    setLoading(true);
    setError(null);

    try {
      const result = await submitClinicalCase(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Désolé, une erreur est survenue.");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="bg-primary text-white p-12 lg:p-20 text-center space-y-8 relative overflow-hidden border border-secondary shadow-3xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-secondary text-primary rounded-full mx-auto flex items-center justify-center p-6 mb-8"
        >
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-4xl font-serif font-black italic">Registry Confirmed.</h3>
          <p className="text-white/60 font-light max-w-md mx-auto leading-relaxed">
            Your case has been recorded in our secure legal registry. Our clinicians will analyze the submission and contact you via the provided coordinates.
          </p>
        </div>
        <Button onClick={() => { setSuccess(false); setStep(1); }} className="bg-secondary text-primary rounded-none px-12 h-16 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">
          New Submission
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-light-gray shadow-3xl relative overflow-hidden">
      {/* Progress Header */}
      <div className="bg-primary p-8 flex justify-between items-center border-b border-white/5">
        <div className="flex gap-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center gap-2">
               <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-black border transition-all ${step >= s ? 'bg-secondary border-secondary text-primary' : 'bg-transparent border-white/20 text-white/40'}`}>
                 0{s}
               </div>
               {s < 3 && <div className={`w-8 h-[1px] ${step > s ? 'bg-secondary' : 'bg-white/20'}`} />}
             </div>
           ))}
        </div>
        <div className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
           Status: <span className="text-secondary tracking-widest uppercase">In Intake Phase</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                   <User size={14} /> Identity Registry
                </h4>
                <div className="w-12 h-[1px] bg-secondary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Nom complet *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe" 
                    className="rounded-none border-light-gray h-14 focus:border-secondary transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Téléphone *</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+243..." 
                    className="rounded-none border-light-gray h-14 focus:border-secondary transition-all" 
                    required 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                   <MapPin size={14} /> Tactical Context
                </h4>
                <div className="w-12 h-[1px] bg-secondary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Localisation *</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Ex: Rubaya, Masisi" 
                    className="rounded-none border-light-gray h-14 focus:border-secondary transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="problemType" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Nature du Conflit *</Label>
                  <Select value={formData.problemType} onValueChange={(v) => updateField('problemType', v)} required>
                    <SelectTrigger className="rounded-none border-light-gray h-14 focus:border-secondary transition-all">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POLLUTION">Pollution & Déchets</SelectItem>
                      <SelectItem value="LAND_CONFLICT">Conflit Foncier</SelectItem>
                      <SelectItem value="DEFORESTATION">Déforestation & Exploitation</SelectItem>
                      <SelectItem value="HUMAN_RIGHTS">Droits de l'Homme</SelectItem>
                      <SelectItem value="OTHER">Autre Nature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                   <FileText size={14} /> Evidence & Intent
                </h4>
                <div className="w-12 h-[1px] bg-secondary" />
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Description des Faits *</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Exposez les faits de manière objective..." 
                    className="rounded-none border-light-gray min-h-[120px] focus:border-secondary transition-all"
                    required 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="expectations" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Objectif du Plaignant</Label>
                  <Textarea 
                    id="expectations" 
                    value={formData.expectations}
                    onChange={(e) => updateField('expectations', e.target.value)}
                    placeholder="Attentes vis-à-vis de la clinique..." 
                    className="rounded-none border-light-gray min-h-[100px] focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="p-6 bg-soft-cream/30 border border-light-gray flex items-start gap-4">
                 <ShieldCheck className="text-secondary shrink-0" size={20} />
                 <p className="text-[10px] text-anthracite/60 font-light leading-relaxed">
                   En soumettant ce formulaire, vous attestez de l'exactitude des informations fournies. Vos données sont traitées de manière confidentielle conformément au secret professionnel juridique.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-8 p-6 bg-red-50 text-red-700 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-l-4 border-red-600">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-light-gray flex justify-between gap-6">
          {step > 1 ? (
            <Button type="button" onClick={prevStep} variant="outline" className="rounded-none px-10 h-14 border-primary text-primary font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all">
              <ArrowLeft size={16} className="mr-3" /> Previous
            </Button>
          ) : (
            <div />
          )}

          <Button type="submit" disabled={loading} className="bg-primary text-white rounded-none px-12 h-14 font-black uppercase tracking-widest text-[9px] hover:bg-secondary hover:text-primary transition-all group">
            {loading ? (
              <Loader2 className="mr-3 h-4 w-4 animate-spin" />
            ) : (
              step < 3 ? (
                <>Next Module <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <>Submit Case to Registry <Send size={16} className="ml-3 group-hover:scale-110 transition-transform" /></>
              )
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
