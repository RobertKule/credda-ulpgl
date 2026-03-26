"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createProgram, updateProgram } from "@/services/program-actions"
import { toast } from "react-hot-toast"
import { Save, Globe, Settings2, Image as ImageIcon, Layout, ArrowLeft } from "lucide-react"
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ProgramForm({ initialData, isEditing = false }: any) {
  const router = useRouter()
  
  const [baseData, setBaseData] = useState({
    slug: initialData?.slug || "",
    mainImage: initialData?.mainImage || "",
    published: initialData?.published ?? false,
    featured: initialData?.featured ?? false
  })

  const [translations, setTranslations] = useState(() => {
    const t: any = {}
    LANGUAGES.forEach(l => {
      const existing = initialData?.translations?.find((ex: any) => ex.language === l.code)
      t[l.code] = {
        title: existing?.title || "",
        description: existing?.description || "",
        content: existing?.content || ""
      }
    })
    return t
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    showLoading(isEditing ? "Mise à jour du programme..." : "Création du nouveau programme...");

    const payload = {
      id: initialData?.id,
      ...baseData,
      translations: LANGUAGES.map(l => ({
        language: l.code,
        ...translations[l.code]
      }))
    }
    
    try {
      const res = isEditing ? await updateProgram(payload) : await createProgram(payload)
      
      if (res.success) {
        toast.success(isEditing ? "Programme mis à jour avec succès" : "Programme créé avec succès")
        router.push("/admin/programs")
        router.refresh()
      } else {
        toast.error(res.error || "Une erreur est survenue")
      }
    } catch (err) {
      toast.error("Erreur réseau lors de la sauvegarde")
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
             <div className="w-2 h-2 rounded-md bg-primary shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">Gestion des Programmes</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-3">
             {isEditing ? "Édition" : "Nouveau"} Programme <span className="text-primary italic">CREDDA</span>
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
          <Button className="flex-1 sm:flex-none h-12 px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all rounded-md">
            <Save size={18} className="mr-3" />
            {isEditing ? "Mettre à jour" : "Sauvegarder"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-transparent p-0 border-b border-slate-200 dark:border-white/5 w-full gap-8">
              {LANGUAGES.map(l => (
                <TabsTrigger 
                  key={l.code} 
                  value={l.code} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-md h-full px-0 font-black uppercase text-[10px] tracking-widest text-slate-400 data-[state=active]:text-primary"
                >
                  <Globe size={14} className="mr-2" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent key={l.code} value={l.code} className="mt-10 animate-in fade-in slide-in-from-top-2 duration-500 space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Titre du Programme ({l.code.toUpperCase()})</Label>
                  <Input 
                    className="h-20 text-4xl font-serif font-black bg-transparent border-0 border-b border-slate-200 dark:border-white/10 rounded-md px-0 focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-200 dark:placeholder:text-white/10 text-slate-900 dark:text-white"
                    placeholder="Titre stratégique..."
                    value={translations[l.code].title}
                    onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Résumé Exécutif</Label>
                  <Textarea 
                    className="min-h-[120px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-[2rem] p-8 focus:ring-blue-600/10 focus:border-blue-600 font-medium transition-all leading-relaxed text-slate-700 dark:text-slate-300"
                    placeholder="Une courte description accrocheuse pour les listes..."
                    value={translations[l.code].description}
                    onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], description: e.target.value}})}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Contenu Détaillé du Programme</Label>
                    <span className="text-[9px] font-bold text-primary/50 uppercase tracking-tighter">Supporte le Markdown</span>
                  </div>
                  <Textarea 
                    className="min-h-[400px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-[3rem] p-10 focus:ring-blue-600/10 focus:border-blue-600 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                    placeholder="# Introduction\n\nDécrivez les objectifs, la méthodologie et les impacts..."
                    value={translations[l.code].content}
                    onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], content: e.target.value}})}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* SIDEBAR CONFIGURATION */}
        <aside className="space-y-8">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-8 transition-all">
            <h3 className="font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Settings2 size={18} className="text-primary" />
              Réglages
            </h3>
            
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1">Identifiant URL (Slug)</Label>
              <Input 
                value={baseData.slug}
                onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
                placeholder="nom-du-programme" 
                className="h-12 bg-slate-50 dark:bg-white/5 border-transparent dark:border-transparent rounded-xl px-5 focus:ring-blue-600/10 focus:border-blue-600 font-bold text-xs transition-all text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Visibilité Publique</Label>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Rendre accessible sur le site</p>
                </div>
                <Switch 
                  checked={baseData.published}
                  onCheckedChange={(val) => setBaseData({...baseData, published: val})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between group cursor-pointer pt-4">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Mise en Avant</Label>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Afficher en priorité (Hero)</p>
                </div>
                <Switch 
                  checked={baseData.featured}
                  onCheckedChange={(val) => setBaseData({...baseData, featured: val})}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group transition-all">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-md group-hover:scale-150 transition-transform duration-700" />
             <div className="relative z-10 space-y-6">
                <h3 className="font-serif font-black uppercase tracking-tight flex items-center gap-3">
                  <ImageIcon size={18} />
                  Visuel
                </h3>
                <div className="space-y-3">
                   <Label className="text-[9px] font-black uppercase tracking-widest text-white/50 ml-1">URL de l'image principale</Label>
                   <Input 
                    value={baseData.mainImage}
                    onChange={(e) => setBaseData({...baseData, mainImage: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-white/10 border-white/20 text-white rounded-xl h-12 px-5 focus:bg-white/20 transition-all placeholder:text-white/20 shadow-inner"
                   />
                </div>
                <p className="text-[9px] font-bold text-white/40 leading-relaxed italic">
                  Utilisez des images de haute qualité (min. 1920x1080) pour un rendu immersif.
                </p>
             </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
