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
import { Save, Globe, Settings2, Loader2 } from "lucide-react"

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
    <form onSubmit={handleSubmit} className="space-y-10 pb-20">
      <div className="sticky top-20 z-30 flex items-center justify-between bg-background/80 backdrop-blur-xl py-6 border-b border-border -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 mb-8 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Settings2 size={20} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Administration</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Photothèque : {isEditing ? "Édition" : "Nouveau"}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()} 
            className="text-[10px] font-black uppercase tracking-widest rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all border border-transparent hover:border-border"
          >
            Annuler
          </Button>
          <Button 
            disabled={loading} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 px-10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all h-12"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save className="mr-3" size={18} />
                {isEditing ? "Enregistrer" : "Créer l'entrée"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/30 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50">
              {LANGUAGES.map(l => (
                <TabsTrigger 
                  key={l.code} 
                  value={l.code} 
                  className="font-black uppercase text-[9px] tracking-[0.22em] rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-black/5 transition-all duration-500 focus:outline-none"
                >
                  <Globe size={14} className="mr-2.5" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent 
                key={l.code} 
                value={l.code} 
                className="mt-8 space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <Card className="p-8 md:p-12 space-y-10 rounded-[2.5rem] border-border/60 bg-card/60 backdrop-blur-sm shadow-2xl shadow-black/[0.02] transition-all hover:shadow-black/[0.04]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-px bg-primary/30" />
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Titre de l'image ({l.code})</Label>
                    </div>
                    <Input 
                      className="text-2xl md:text-3xl font-fraunces font-black border-0 border-b-2 border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent text-foreground placeholder:text-muted-foreground/10 italic pb-4 h-auto"
                      placeholder="Légende artistique de l'image..."
                      value={translations[l.code].title}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-border/20">
                    <ModernMarkdownEditor 
                      label={`Description détaillée (${l.label})`}
                      value={translations[l.code].description}
                      onChange={(val) => setTranslations({...translations, [l.code]: {...translations[l.code], description: val}})}
                    />
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="p-8 md:p-10 space-y-10 rounded-[2.5rem] border-border/60 bg-card/60 backdrop-blur-sm shadow-2xl shadow-black/[0.02] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="font-black uppercase text-[11px] tracking-[0.4em] text-primary">Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <SmartImageInput 
                label="Fichier Visuel"
                value={baseData.src}
                onChange={(val) => setBaseData({...baseData, src: val})}
                folder="gallery"
              />
              <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest pl-2 italic">
                Sera affichée dans la photothèque publique
              </p>
            </div>

            <div className="space-y-5 pt-4 border-t border-border/20">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Catégorie thématique
              </Label>
              <Input 
                value={baseData.category}
                onChange={(e) => setBaseData({...baseData, category: e.target.value})}
                placeholder="Ex: EVENT, RESEARCH, CLINIC..." 
                className="rounded-2xl bg-muted/20 border-border/40 font-bold text-xs text-foreground focus:ring-primary/10 transition-all h-14 pl-6"
              />
            </div>

            <div className="flex items-center justify-between p-7 bg-primary/[0.04] dark:bg-primary/[0.08] rounded-[2rem] border border-primary/20 transition-all group hover:bg-primary/[0.06] shadow-sm">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-primary cursor-pointer leading-none" htmlFor="featured-switch">
                  Mise en avant
                </Label>
                <p className="text-[9px] font-medium text-primary/40 leading-none">Carousel de la page d'accueil</p>
              </div>
              <Switch 
                id="featured-switch"
                checked={baseData.featured}
                onCheckedChange={(val) => setBaseData({...baseData, featured: val})}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </Card>

          <Card className="p-8 rounded-[2rem] border-dashed border-border/60 bg-muted/10 flex items-center justify-center text-center">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] leading-relaxed">
              Dernière modification : {new Date().toLocaleDateString()}<br />
              ID: {initialData?.id || "Nouveau"}
            </p>
          </Card>
        </div>
      </div>
    </form>
  )
}
