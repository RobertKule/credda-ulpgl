"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createArticle, updateArticle } from "@/services/article-actions"
import { toast } from "react-hot-toast"
import { Loader2, Save, Globe, Settings2, Image as ImageIcon, Video } from "lucide-react"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ArticleForm({ categories, initialData, isEditing = false }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [baseData, setBaseData] = useState({
    slug: initialData?.slug || "",
    domain: initialData?.domain || "RESEARCH",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    videoUrl: initialData?.videoUrl || "",
    mainImage: initialData?.mainImage || "",
    published: initialData?.published ?? true
  })

  // Initialisation sécurisée des traductions
  const [translations, setTranslations] = useState(() => {
    const t: any = {}
    LANGUAGES.forEach(l => {
      const existing = initialData?.translations?.find((ex: any) => ex.language === l.code)
      t[l.code] = {
        title: existing?.title || "",
        excerpt: existing?.excerpt || "",
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
    
    const res = isEditing ? await updateArticle(payload) : await createArticle(payload)
    
    if (res.success) {
      toast.success(isEditing ? "Mis à jour avec succès" : "Publié avec succès")
      router.push("/admin/articles")
      router.refresh()
    } else {
      toast.error(res.error || "Une erreur est survenue")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Barre d'action collante */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md py-4 border-b -mx-10 px-10 mb-8">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-slate-400" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Configuration de l'article</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {isEditing ? "Enregistrer les modifications" : "Publier l'article"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonne Principale : Contenu Multi-langue */}
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
                    <Label className="text-[10px] font-black uppercase text-slate-400">Titre Scientifique ({l.code})</Label>
                    <Input 
                      className="text-2xl font-serif font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-600"
                      placeholder="Entrez le titre..."
                      value={translations[l.code].title}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Résumé / Excerpt</Label>
                    <Textarea 
                      className="rounded-none border-slate-200 italic"
                      placeholder="Court résumé de l'article..."
                      value={translations[l.code].excerpt}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], excerpt: e.target.value}})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Corps de l'article (Markdown)</Label>
                    <Textarea 
                      className="min-h-[400px] rounded-none border-slate-200 font-mono text-sm leading-relaxed"
                      placeholder="Rédigez votre contenu ici..."
                      value={translations[l.code].content}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], content: e.target.value}})}
                    />
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Barre Latérale : Métadonnées */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 rounded-none border-slate-200">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-blue-600 border-b pb-4">Paramètres de publication</h3>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Slug de l'URL</Label>
              <Input 
                value={baseData.slug}
                onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
                placeholder="titre-de-l-article" 
                className="rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Domaine</Label>
              <select 
                className="w-full h-10 border border-slate-200 px-3 text-sm rounded-none"
                value={baseData.domain}
                onChange={(e) => setBaseData({...baseData, domain: e.target.value})}
              >
                <option value="RESEARCH">Recherche Scientifique</option>
                <option value="CLINICAL">Clinique Juridique</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Catégorie</Label>
              <select 
                className="w-full h-10 border border-slate-200 px-3 text-sm rounded-none"
                value={baseData.categoryId}
                onChange={(e) => setBaseData({...baseData, categoryId: e.target.value})}
              >
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.translations.find((t: any) => t.language === 'fr')?.name || c.slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
              <Label className="text-[10px] font-bold uppercase cursor-pointer" htmlFor="pub-switch">Statut : Publié</Label>
              <Switch 
                id="pub-switch"
                checked={baseData.published}
                onCheckedChange={(val) => setBaseData({...baseData, published: val})}
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4 rounded-none border-slate-200 bg-slate-50/50">
             <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-slate-400 border-b pb-4">Médias</h3>
             
             <div className="space-y-2">
               <Label className="text-[10px] font-bold flex items-center gap-2 uppercase">
                 <ImageIcon size={14} /> Image principale (URL)
               </Label>
               <Input 
                value={baseData.mainImage}
                onChange={(e) => setBaseData({...baseData, mainImage: e.target.value})}
                placeholder="https://..." 
                className="rounded-none bg-white"
               />
             </div>

             <div className="space-y-2">
               <Label className="text-[10px] font-bold flex items-center gap-2 uppercase">
                 <Video size={14} /> Vidéo YouTube/Vimeo (URL)
               </Label>
               <Input 
                value={baseData.videoUrl}
                onChange={(e) => setBaseData({...baseData, videoUrl: e.target.value})}
                placeholder="https://youtube.com/watch?v=..." 
                className="rounded-none bg-white"
               />
             </div>
          </Card>
        </div>
      </div>
    </form>
  )
}