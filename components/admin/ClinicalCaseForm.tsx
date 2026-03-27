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
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background/80 backdrop-blur-2xl py-6 border-b border-border -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 transition-all">
        <div className="flex flex-col gap-1 mb-4 sm:mb-0">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-md bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Module Justice Environnementale</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-foreground flex items-center gap-3">
             {isEditing ? "Édition" : "Nouveau"} Dossier <span className="text-emerald-700 dark:text-emerald-500 italic">Clinique</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all gap-2"
          >
            <ArrowLeft size={16} /> Annuler
          </Button>
          <Button className="flex-1 sm:flex-none h-12 px-10 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 dark:shadow-emerald-900/20 active:scale-95 transition-all rounded-md">
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
                <h3 className="text-xl font-serif font-black text-foreground tracking-tight uppercase">Détails de l'Incident</h3>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Informations précises sur les faits rapportés</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Type de Problème</Label>
                <Input 
                  required
                  placeholder="Ex: Pollution minière, Conflit foncier..."
                  value={formData.problemType}
                  onChange={(e) => setFormData({...formData, problemType: e.target.value})}
                  className="h-14 bg-muted/40 border-border rounded-2xl px-6 focus:ring-primary/10 focus:border-primary font-medium transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Localisation Exacte</Label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/20" size={18} />
                  <Input 
                    required
                    placeholder="Village, Territoire, Province..."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-14 pl-14 bg-muted/40 border-border rounded-2xl px-6 focus:ring-primary/10 focus:border-primary font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Description Détaillée des faits</Label>
              <Textarea 
                required
                placeholder="Rédigez un résumé complet des faits et des impacts observés..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[220px] bg-card border-border rounded-[2.5rem] p-8 focus:ring-primary/10 focus:border-primary font-medium transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Date de l'incident</Label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/20" size={18} />
                  <Input 
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                    className="h-14 pl-14 bg-muted/40 border-border rounded-2xl px-6 focus:ring-primary/10 focus:border-primary font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Niveau d'Urgence</Label>
                <select 
                  className="w-full h-14 bg-card border border-border rounded-2xl px-6 text-sm font-medium focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-foreground"
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                >
                  <option value="LOW" className="bg-card">Basse</option>
                  <option value="MEDIUM" className="bg-card">Moyenne</option>
                  <option value="HIGH" className="bg-card">Haute</option>
                  <option value="CRITICAL" className="bg-card text-destructive font-bold">Critique</option>
                </select>
              </div>
              {isEditing && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Statut du Dossier</Label>
                  <select 
                    className="w-full h-14 bg-card border border-border rounded-2xl px-6 text-sm font-medium focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-foreground"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="NEW" className="bg-card">Nouveau</option>
                    <option value="IN_ANALYSIS" className="bg-card">En Analyse</option>
                    <option value="MEETING_SCHEDULED" className="bg-card">Réunion Prévue</option>
                    <option value="ACTION_ENGAGED" className="bg-card">Action Engagée</option>
                    <option value="RESOLVED" className="bg-card text-emerald-600">Résolu</option>
                    <option value="CLOSED" className="bg-card text-muted-foreground/60">Clôturé</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Section: Attentes */}
          <section className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Attentes du bénéficiaire</Label>
            <Textarea 
              placeholder="Décrivez les résultats attendus par les parties prenantes..."
              value={formData.expectations}
              onChange={(e) => setFormData({...formData, expectations: e.target.value})}
              className="min-h-[120px] bg-muted/40 border-border rounded-[2rem] p-8 focus:ring-primary/10 focus:border-primary font-medium transition-all italic"
            />
          </section>
        </div>

        {/* SIDEBAR: Bénéficiaire */}
        <aside className="space-y-8">
          <div className="sticky top-40 bg-slate-900 dark:bg-card text-white dark:text-foreground rounded-[2.5rem] p-8 border border-white/5 dark:border-border shadow-2xl overflow-hidden relative group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500 opacity-[0.05] rounded-md group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-white dark:text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-black uppercase tracking-tight text-white dark:text-foreground leading-none">Bénéficiaire</h3>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 dark:text-muted-foreground/40 mt-1">Données Personnelles</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 dark:text-muted-foreground/40 ml-1">Nom Complet</Label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white/5 dark:bg-muted/20 border-white/10 dark:border-border text-white dark:text-foreground rounded-xl h-12 px-5 focus:bg-white/10 dark:focus:bg-muted/40 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 dark:text-muted-foreground/40 ml-1">Téléphone</Label>
                  <Input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/5 dark:bg-muted/20 border-white/10 dark:border-border text-white dark:text-foreground rounded-xl h-12 px-5 focus:bg-white/10 dark:focus:bg-muted/40 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 dark:text-muted-foreground/40 ml-1">Email</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white/5 dark:bg-muted/20 border-white/10 dark:border-border text-white dark:text-foreground rounded-xl h-12 px-5 focus:bg-white/10 dark:focus:bg-muted/40 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 dark:text-muted-foreground/40 ml-1">Type de Bénéficiaire</Label>
                  <select 
                    className="w-full h-12 bg-white/5 dark:bg-muted/20 border border-white/10 dark:border-border px-5 text-sm font-medium rounded-xl focus:bg-white/10 dark:focus:bg-muted/40 outline-none transition-all appearance-none cursor-pointer text-white dark:text-foreground"
                    value={formData.beneficiaryType}
                    onChange={(e) => setFormData({...formData, beneficiaryType: e.target.value as any})}
                  >
                    <option value="LOCAL_COMMUNITY" className="text-slate-900 bg-white">Communauté Locale</option>
                    <option value="INDIGENOUS_PEOPLE" className="text-slate-900 bg-white">Peuples Autochtones</option>
                    <option value="OTHER" className="text-slate-900 bg-white">Autre</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 dark:border-border">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse" />
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
