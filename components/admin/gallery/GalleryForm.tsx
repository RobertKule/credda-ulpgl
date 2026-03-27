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
      <div className="sticky top-20 z-30 flex items-center justify-between bg-background/80 backdrop-blur-md py-4 border-b border-border -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 mb-8 transition-all">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-muted-foreground/40" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Gestion de la Photothèque</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest rounded-xl text-muted-foreground hover:text-foreground transition-all">Annuler</Button>
          <Button disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            <Save className="mr-2" size={16} />
            {isEditing ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1 rounded-2xl border border-border">
              {LANGUAGES.map(l => (
                <TabsTrigger key={l.code} value={l.code} className="font-black uppercase text-[9px] tracking-[0.2em] rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all focus:outline-none">
                  <Globe size={14} className="mr-2" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent key={l.code} value={l.code} className="mt-6 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="p-8 space-y-8 rounded-[2.5rem] border-border bg-card shadow-sm transition-all">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Titre de l'image ({l.code})</Label>
                    <Input 
                      className="text-2xl font-serif font-black border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/20 italic"
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
          <Card className="p-8 space-y-8 rounded-[2.5rem] border-border bg-card shadow-sm transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-primary border-b border-border pb-6">Source & Organisation</h3>
            
            <SmartImageInput 
              label="Sélection de l'image"
              value={baseData.src}
              onChange={(val) => setBaseData({...baseData, src: val})}
              folder="gallery"
            />

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Catégorie</Label>
              <Input 
                value={baseData.category}
                onChange={(e) => setBaseData({...baseData, category: e.target.value})}
                placeholder="EVENT, RESEARCH, CAMPUS..." 
                className="rounded-xl bg-muted/20 border-border font-bold text-xs text-foreground focus:ring-primary/20 transition-all h-12"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-primary/[0.03] rounded-2xl border border-primary/10 transition-all group hover:bg-primary/[0.05]">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer" htmlFor="featured-switch">Mettre en vedette</Label>
              <Switch 
                id="featured-switch"
                checked={baseData.featured}
                onCheckedChange={(val) => setBaseData({...baseData, featured: val})}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
