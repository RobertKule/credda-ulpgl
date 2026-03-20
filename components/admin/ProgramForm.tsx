"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createProgram, updateProgram } from "@/services/program-actions"
import { toast } from "react-hot-toast"
import { Loader2, Save, Globe, Settings2, Image as ImageIcon, Layout } from "lucide-react"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ProgramForm({ initialData, isEditing = false }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
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
    setLoading(true)

    const payload = {
      id: initialData?.id,
      ...baseData,
      translations: LANGUAGES.map(l => ({
        language: l.code,
        ...translations[l.code]
      }))
    }
    
    //@ts-ignore
    const res = isEditing ? await updateProgram(payload) : await createProgram(payload)
    
    if (res.success) {
      toast.success(isEditing ? "Programme mis à jour" : "Programme créé")
      router.push("/admin/programs")
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
          <Layout size={18} className="text-purple-600" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
            {isEditing ? "Édition du Programme" : "Nouveau Programme"}
          </span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button disabled={loading} className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 px-8">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {isEditing ? "Enregistrer" : "Créer le programme"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 p-1">
              {LANGUAGES.map(l => (
                <TabsTrigger key={l.code} value={l.code} className="font-bold uppercase text-[10px] tracking-widest">
                  <Globe size={14} className="mr-2" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent key={l.code} value={l.code} className="mt-6 animate-in fade-in duration-500">
                <Card className="p-8 space-y-6 rounded-none border-slate-200">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Titre ({l.code})</Label>
                    <Input 
                      className="text-2xl font-serif font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-purple-600"
                      placeholder="Titre du programme..."
                      value={translations[l.code].title}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Description courte</Label>
                    <Textarea 
                      className="rounded-none border-slate-200"
                      placeholder="Bref résumé..."
                      value={translations[l.code].description}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], description: e.target.value}})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Présentation détaillée (Markdown)</Label>
                    <Textarea 
                      className="min-h-[300px] rounded-none border-slate-200 font-mono text-sm leading-relaxed"
                      placeholder="Contenu complet du programme..."
                      value={translations[l.code].content}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], content: e.target.value}})}
                    />
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-6 rounded-none border-slate-200">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-purple-600 border-b pb-4 shadow-sm">Configuration</h3>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Slug de l'URL</Label>
              <Input 
                value={baseData.slug}
                onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
                placeholder="nom-du-programme" 
                className="rounded-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
              <Label className="text-[10px] font-bold uppercase cursor-pointer" htmlFor="pub-switch">Publié</Label>
              <Switch 
                id="pub-switch"
                checked={baseData.published}
                onCheckedChange={(val) => setBaseData({...baseData, published: val})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
              <Label className="text-[10px] font-bold uppercase cursor-pointer" htmlFor="featured-switch">Mettre en avant</Label>
              <Switch 
                id="featured-switch"
                checked={baseData.featured}
                onCheckedChange={(val) => setBaseData({...baseData, featured: val})}
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4 rounded-none border-slate-200 bg-slate-50/50">
             <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-slate-400 border-b pb-4">Visuels</h3>
             
             <div className="space-y-2">
               <Label className="text-[10px] font-bold flex items-center gap-2 uppercase">
                 <ImageIcon size={14} /> Image de couverture (URL)
               </Label>
               <Input 
                value={baseData.mainImage}
                onChange={(e) => setBaseData({...baseData, mainImage: e.target.value})}
                placeholder="https://..." 
                className="rounded-none bg-white"
               />
             </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
