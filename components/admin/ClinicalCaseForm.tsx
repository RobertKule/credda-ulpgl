"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { submitClinicalCase, updateClinicalCase } from "@/services/clinical-actions"
import { toast } from "react-hot-toast"
import { Loader2, Save, Scale, User, MapPin, Calendar, AlertTriangle } from "lucide-react"

export function ClinicalCaseForm({ initialData, isEditing = false }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
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
    setLoading(true)

    const res = isEditing 
      ? await updateClinicalCase(initialData.id, formData) 
      : await submitClinicalCase(formData)
    
    if (res.success) {
      toast.success(isEditing ? "Cas mis à jour" : "Cas créé avec succès")
      router.push("/admin/clinical")
      router.refresh()
    } else {
      toast.error(res.error || "Une erreur est survenue")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md py-4 border-b -mx-10 px-10 mb-8">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-emerald-700" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
            {isEditing ? "Édition du Dossier Clinique" : "Nouveau Dossier Clinique"}
          </span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button disabled={loading} className="bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-800/20 px-8 rounded-none">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {isEditing ? "Enregistrer" : "Créer le dossier"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Informations sur l'incident */}
          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Détails de l'Affaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider">Type de Problème</Label>
                  <Input 
                    required
                    placeholder="Ex: Pollution d'eau, Conflit foncier..."
                    value={formData.problemType}
                    onChange={(e) => setFormData({...formData, problemType: e.target.value})}
                    className="rounded-none shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider">Localisation de l'incident</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <Input 
                      required
                      placeholder="Village, Territoire..."
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pl-10 rounded-none shadow-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider">Description des faits</Label>
                <Textarea 
                  required
                  placeholder="Décrivez précisément les faits..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[150px] rounded-none shadow-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider">Date de l'incident</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <Input 
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                      className="pl-10 rounded-none shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider">Urgence</Label>
                  <select 
                    className="w-full h-10 border border-slate-200 px-3 text-sm rounded-none focus:ring-1 focus:ring-emerald-500 outline-none"
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="CRITICAL">Critique</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider">Attentes du bénéficiaire</Label>
                <Textarea 
                  placeholder="Qu'attend le bénéficiaire de notre intervention ?"
                  value={formData.expectations}
                  onChange={(e) => setFormData({...formData, expectations: e.target.value})}
                  className="rounded-none shadow-none italic"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Informations Bénéficiaire */}
          <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <User size={18} />
                Bénéficiaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Nom Complet</Label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white rounded-none focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Téléphone</Label>
                <Input 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/10 border-white/20 text-white rounded-none focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Email (Optionnel)</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border-white/20 text-white rounded-none focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Type de bénéficiaire</Label>
                <select 
                  className="w-full h-10 bg-white/10 border border-white/20 px-3 text-sm rounded-none focus:bg-white/20 outline-none"
                  value={formData.beneficiaryType}
                  onChange={(e) => setFormData({...formData, beneficiaryType: e.target.value as any})}
                >
                  <option value="LOCAL_COMMUNITY" className="text-slate-900">Communauté Locale</option>
                  <option value="INDIGENOUS_PEOPLE" className="text-slate-900">Peuples Autochtones</option>
                  <option value="OTHER" className="text-slate-900">Autre</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Statut (Seulement en édition) */}
          {isEditing && (
            <Card className="rounded-none border-slate-200">
              <CardHeader className="py-4">
                <Label className="text-[10px] font-bold uppercase">Statut du dossier</Label>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <select 
                  className="w-full h-10 border border-slate-200 px-3 text-sm rounded-none focus:ring-1 focus:ring-emerald-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="NEW">Nouveau</option>
                  <option value="IN_ANALYSIS">En Analyse</option>
                  <option value="MEETING_SCHEDULED">Réunion prévue</option>
                  <option value="ACTION_ENGAGED">Action engagée</option>
                  <option value="RESOLVED">Résolu</option>
                  <option value="CLOSED">Clôturé</option>
                </select>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
