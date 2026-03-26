"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmartImageInput } from "@/components/admin/shared/SmartImageInput"
import { ModernMarkdownEditor } from "@/components/admin/shared/ModernMarkdownEditor"
import { createGalleryImage, updateGalleryImage } from "@/services/gallery-actions"
import { toast } from "react-hot-toast"
import { Save, Globe, Settings2 } from "lucide-react"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function GalleryForm({ initialData, isEditing = false }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [baseData, setBaseData] = useState({
    src: initialData?.src || "",
    category: initialData?.category || "EVENT",
    featured: initialData?.featured ?? false
  })

  const [translations, setTranslations] = useState(() => {
    const t: any = {}
    LANGUAGES.forEach(l => {
      const existing = initialData?.translations?.find((ex: any) => ex.language === l.code)
      t[l.code] = {
        title: existing?.title || "",
        description: existing?.description || ""
      }
    })
    return t
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseData.src) {
      toast.error("Veuillez sélectionner ou entrer une URL d'image")
      return
    }

    setLoading(true)
    const payload = {
      id: initialData?.id,
      ...baseData,
      translations: LANGUAGES.map(l => ({
        language: l.code,
        ...translations[l.code]
      }))
    }
    
    try {
      const res = isEditing ? await updateGalleryImage(payload) : await createGalleryImage(payload)
      if (res.success) {
        toast.success(isEditing ? "Mis à jour avec succès" : "Ajouté avec succès")
        router.push("/admin/gallery")
        router.refresh()
      } else {
        toast.error(res.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="sticky top-20 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/5 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 mb-8 transition-colors">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Gestion de la Galerie</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest rounded-xl">Annuler</Button>
          <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            <Save className="mr-2" size={16} />
            {isEditing ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
              {LANGUAGES.map(l => (
                <TabsTrigger key={l.code} value={l.code} className="font-black uppercase text-[9px] tracking-[0.2em] rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 shadow-none">
                  <Globe size={14} className="mr-2" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent key={l.code} value={l.code} className="mt-6 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de l'image ({l.code})</Label>
                    <Input 
                      className="text-2xl font-serif font-black border-0 border-b border-slate-100 dark:border-white/5 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-600 bg-transparent text-slate-900 dark:text-white"
                      placeholder="Légende de l'image..."
                      value={translations[l.code].title}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                    />
                  </div>
                  
                  <ModernMarkdownEditor 
                    label="Description (Markdown)"
                    value={translations[l.code].description}
                    onChange={(val) => setTranslations({...translations, [l.code]: {...translations[l.code], description: val}})}
                  />
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-white/5 pb-6">Source & Organisation</h3>
            
            <SmartImageInput 
              label="Sélection de l'image"
              value={baseData.src}
              onChange={(val) => setBaseData({...baseData, src: val})}
              folder="gallery"
            />

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</Label>
              <Input 
                value={baseData.category}
                onChange={(e) => setBaseData({...baseData, category: e.target.value})}
                placeholder="EVENT, RESEARCH, CAMPUS..." 
                className="rounded-xl bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 font-bold text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-5 bg-blue-600/5 dark:bg-blue-600/10 rounded-2xl border border-blue-600/10 transition-colors">
              <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 cursor-pointer" htmlFor="featured-switch">Mettre en vedette</Label>
              <Switch 
                id="featured-switch"
                checked={baseData.featured}
                onCheckedChange={(val) => setBaseData({...baseData, featured: val})}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
