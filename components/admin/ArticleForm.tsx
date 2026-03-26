"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmartImageInput } from "./shared/SmartImageInput"
import { ModernMarkdownEditor } from "./shared/ModernMarkdownEditor"
import { createArticle, updateArticle } from "@/services/article-actions"
import { toast } from "react-hot-toast"
import { Save, Globe, Settings2, Video } from "lucide-react"
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ArticleForm({ categories, initialData, isEditing = false }: any) {
  const router = useRouter()
  
  const [baseData, setBaseData] = useState({
    slug: initialData?.slug || "",
    domain: initialData?.domain || "RESEARCH",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    videoUrl: initialData?.videoUrl || "",
    mainImage: initialData?.mainImage || "",
    published: initialData?.published ?? true
  })

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
    showLoading(isEditing ? "Mise à jour de l'article..." : "Publication de l'article en cours...")

    const payload = {
      id: initialData?.id,
      ...baseData,
      translations: LANGUAGES.map(l => ({
        language: l.code,
        ...translations[l.code]
      }))
    }
    
    try {
      const res = isEditing ? await updateArticle(payload) : await createArticle(payload)
      if (res.success) {
        toast.success(isEditing ? "Mis à jour avec succès" : "Publié avec succès")
        router.push("/admin/articles")
        router.refresh()
      } else {
        toast.error(res.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      hideLoading()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="sticky top-20 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/5 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 mb-8 transition-colors">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Configuration de l'article</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest rounded-xl">Annuler</Button>
          <Button className="bg-primary hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            <Save className="mr-2" size={16} />
            {isEditing ? "Enregistrer" : "Publier"}
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
              <TabsContent key={l.code} value={l.code} className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
                <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre Scientifique ({l.code})</Label>
                    <Input 
                      className="text-3xl font-serif font-black border-0 border-b border-slate-100 dark:border-white/5 rounded-md px-0 focus-visible:ring-0 focus-visible:border-blue-600 bg-transparent text-slate-900 dark:text-white"
                      placeholder="Entrez le titre..."
                      value={translations[l.code].title}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Résumé / Excerpt</Label>
                    <Textarea 
                      className="rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] italic font-medium min-h-[100px] focus:border-blue-600 transition-all text-slate-900 dark:text-white"
                      placeholder="Court résumé de l'article pour les cartes d'aperçu..."
                      value={translations[l.code].excerpt}
                      onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], excerpt: e.target.value}})}
                    />
                  </div>

                  <ModernMarkdownEditor 
                    label="Corps de l'article (Markdown)"
                    value={translations[l.code].content}
                    onChange={(val) => setTranslations({...translations, [l.code]: {...translations[l.code], content: val}})}
                  />
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-primary dark:text-blue-400 border-b border-slate-100 dark:border-white/5 pb-6">Paramètres</h3>
            
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug de l'URL</Label>
              <Input 
                value={baseData.slug}
                onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
                placeholder="titre-de-l-article" 
                className="rounded-xl bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 font-bold text-xs"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domaine de Recherche</Label>
              <select 
                className="w-full h-12 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 px-4 text-xs font-bold rounded-xl outline-none focus:border-blue-600 transition-all dark:text-white"
                value={baseData.domain}
                onChange={(e) => setBaseData({...baseData, domain: e.target.value})}
              >
                <option value="RESEARCH">Recherche Scientifique</option>
                <option value="CLINICAL">Clinique Juridique</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</Label>
              <select 
                className="w-full h-12 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 px-4 text-xs font-bold rounded-xl outline-none focus:border-blue-600 transition-all dark:text-white"
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

            <div className="flex items-center justify-between p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-blue-600/10 transition-colors">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-blue-400 cursor-pointer" htmlFor="pub-switch">Publier immédiatement</Label>
              <Switch 
                id="pub-switch"
                checked={baseData.published}
                onCheckedChange={(val) => setBaseData({...baseData, published: val})}
              />
            </div>
          </Card>

          <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] shadow-sm">
             <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5 pb-6">Ressources Médias</h3>
             
             <SmartImageInput 
                label="Couverture Principale"
                value={baseData.mainImage}
                onChange={(val) => setBaseData({...baseData, mainImage: val})}
                folder="articles"
             />

             <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                  <Video size={14} className="text-primary" /> Lien Vidéo Immergeant
                </Label>
                <Input 
                 value={baseData.videoUrl}
                 onChange={(e) => setBaseData({...baseData, videoUrl: e.target.value})}
                 placeholder="Lien YouTube ou Vimeo" 
                 className="rounded-xl bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-xs font-bold h-12"
                />
             </div>
          </Card>
        </div>
      </div>
    </form>
  )
}