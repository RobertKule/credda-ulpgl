"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { submitClinicalCase, updateClinicalCase } from "@/services/clinical-actions"
import { toast } from "react-hot-toast"
import { Save, Scale, User, MapPin, Calendar, AlertTriangle, ArrowLeft } from "lucide-react"
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";

export function ClinicalCaseForm({ initialData, isEditing = false }: any) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: initialData?.beneficiary?.name || "",
    email: initialData?.beneficiary?.email || "",
    phone: initialData?.beneficiary?.phone || "",
    location: initialData?.location || "",
    beneficiaryType: initialData?.beneficiary?.type || "LOCAL_COMMUNITY",
    problemType: initialData?.problemType || "",
    description: initialData?.description || "",
    urgency: initialData?.urgency || "MEDIUM",
    expectations: initialData?.expectations || "",
    incidentDate: initialData?.incidentDate ? new Date(initialData.incidentDate).toISOString().split('T')[0] : "",
    status: initialData?.status || "NEW",
    beneficiaryId: initialData?.beneficiaryId || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    showLoading(isEditing ? "Mise à jour du dossier clinique..." : "Enregistrement du nouveau cas...");

    try {
      const res = isEditing 
        ? await updateClinicalCase(initialData.id, formData) 
        : await submitClinicalCase(formData)
      
      if (res.success) {
        toast.success(isEditing ? "Dossier mis à jour avec succès" : "Dossier créé avec succès")
        router.push("/admin/clinical")
        router.refresh()
      } else {
        toast.error(res.error || "Une erreur est survenue")
      }
    } catch (err) {
      toast.error("Erreur de communication avec le serveur")
    } finally {
      hideLoading()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* HEADER LUXE STICKY */}
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl py-6 border-b border-slate-200 dark:border-white/5 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 transition-all">
        <div className="flex flex-col gap-1 mb-4 sm:mb-0">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">Module Justice Environnementale</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-3">
             {isEditing ? "Édition" : "Nouveau"} Dossier <span className="text-emerald-700 dark:text-emerald-500 italic">Clinique</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all gap-2"
          >
            <ArrowLeft size={16} /> Annuler
          </Button>
          <Button className="flex-1 sm:flex-none h-12 px-10 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 dark:shadow-emerald-900/20 active:scale-95 transition-all rounded-none">
            <Save size={18} className="mr-3" />
            {isEditing ? "Mettre à jour" : "Sauvegarder le cas"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-12">
          
          {/* Section: Détails de l'Affaire */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-800/20">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white tracking-tight uppercase">Détails de l'Incident</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informations précises sur les faits rapportés</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Type de Problème</Label>
                <Input 
                  required
                  placeholder="Ex: Pollution minière, Conflit foncier..."
                  value={formData.problemType}
                  onChange={(e) => setFormData({...formData, problemType: e.target.value})}
                  className="h-14 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-2xl px-6 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Localisation Exacte</Label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20" size={18} />
                  <Input 
                    required
                    placeholder="Village, Territoire, Province..."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-14 pl-14 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-2xl px-6 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Description Détaillée des faits</Label>
              <Textarea 
                required
                placeholder="Rédigez un résumé complet des faits et des impacts observés..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[220px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Date de l'incident</Label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20" size={18} />
                  <Input 
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                    className="h-14 pl-14 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-2xl px-6 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Niveau d'Urgence</Label>
                <select 
                  className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-6 text-sm font-medium focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                >
                  <option value="LOW" className="dark:bg-slate-900">Basse</option>
                  <option value="MEDIUM" className="dark:bg-slate-900">Moyenne</option>
                  <option value="HIGH" className="dark:bg-slate-900">Haute</option>
                  <option value="CRITICAL" className="dark:bg-slate-900 text-red-600 font-bold">Critique</option>
                </select>
              </div>
              {isEditing && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Statut du Dossier</Label>
                  <select 
                    className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-6 text-sm font-medium focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="NEW" className="dark:bg-slate-900">Nouveau</option>
                    <option value="IN_ANALYSIS" className="dark:bg-slate-900">En Analyse</option>
                    <option value="MEETING_SCHEDULED" className="dark:bg-slate-900">Réunion Prévue</option>
                    <option value="ACTION_ENGAGED" className="dark:bg-slate-900">Action Engagée</option>
                    <option value="RESOLVED" className="dark:bg-slate-900 text-emerald-600">Résolu</option>
                    <option value="CLOSED" className="dark:bg-slate-900 text-slate-500">Clôturé</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Section: Attentes */}
          <section className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Attentes du bénéficiaire</Label>
            <Textarea 
              placeholder="Décrivez les résultats attendus par les parties prenantes..."
              value={formData.expectations}
              onChange={(e) => setFormData({...formData, expectations: e.target.value})}
              className="min-h-[120px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-[2rem] p-8 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all italic"
            />
          </section>
        </div>

        {/* SIDEBAR: Bénéficiaire */}
        <aside className="space-y-8">
          <div className="sticky top-40 bg-slate-900 dark:bg-white/[0.03] text-white dark:text-white rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500 opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-black uppercase tracking-tight text-white leading-none">Bénéficiaire</h3>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Données Personnelles</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Nom Complet</Label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12 px-5 focus:bg-white/10 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Téléphone</Label>
                  <Input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12 px-5 focus:bg-white/10 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Email</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12 px-5 focus:bg-white/10 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Type de Bénéficiaire</Label>
                  <select 
                    className="w-full h-12 bg-white/5 border border-white/10 px-5 text-sm font-medium rounded-xl focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer text-white"
                    value={formData.beneficiaryType}
                    onChange={(e) => setFormData({...formData, beneficiaryType: e.target.value as any})}
                  >
                    <option value="LOCAL_COMMUNITY" className="text-slate-900">Communauté Locale</option>
                    <option value="INDIGENOUS_PEOPLE" className="text-slate-900">Peuples Autochtones</option>
                    <option value="OTHER" className="text-slate-900">Autre</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Protection des données activée
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
