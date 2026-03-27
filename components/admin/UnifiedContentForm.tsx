"use client"

import { useState, useTransition } from "react"
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
import { Stepper } from "./shared/Stepper"
import { createArticle, updateArticle } from "@/services/article-actions"
import { createPublication, updatePublication } from "@/services/publication-actions"
import { toast } from "react-hot-toast"
import { Save, Globe, Settings2, Video, ChevronRight, ChevronLeft, FileText, BookOpen, AlertCircle } from "lucide-react"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

const STEPS = [
  { id: 1, label: "Général", description: "Type et classification" },
  { id: 2, label: "Contenu", description: "Textes multilingues" },
  { id: 3, label: "Médias", description: "Images et documents" },
  { id: 4, label: "Révision", description: "Finalisation" }
]

export function UnifiedContentForm({ categories, initialData, isEditing = false, initialType = "ARTICLE" }: any) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [contentType, setContentType] = useState(initialType) // ARTICLE or PUBLICATION
  
  const [baseData, setBaseData] = useState({
    slug: initialData?.slug || "",
    domain: initialData?.domain || "RESEARCH",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    videoUrl: initialData?.videoUrl || "",
    mainImage: initialData?.mainImage || "",
    published: initialData?.published ?? true,
    // Publication specific
    year: initialData?.year || new Date().getFullYear(),
    doi: initialData?.doi || "",
    pdfUrl: initialData?.pdfUrl || ""
  })

  const [translations, setTranslations] = useState(() => {
    const t: any = {}
    LANGUAGES.forEach(l => {
      const existing = initialData?.translations?.find((ex: any) => ex.language === l.code)
      t[l.code] = {
        title: existing?.title || "",
        excerpt: existing?.excerpt || (existing?.description || ""),
        content: existing?.content || ""
      }
    })
    return t
  })

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    const payload = {
      id: initialData?.id,
      ...baseData,
      translations: LANGUAGES.map(l => ({
        language: l.code,
        ...translations[l.code]
      }))
    }
    
    try {
      let res;
      if (contentType === "ARTICLE") {
        res = isEditing ? await updateArticle(payload) : await createArticle(payload)
      } else {
        res = isEditing ? await updatePublication(initialData.id, payload) : await createPublication(payload)
      }

      if (res.success) {
        toast.success("Enregistré avec succès")
        router.push("/admin/articles")
        router.refresh()
      } else {
        toast.error(res.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    }
  }

  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} currentStep={currentStep} />

      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <Card className="p-8 space-y-8 rounded-[2.5rem] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm">
                <div className="space-y-6">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">Nature du Contenu</Label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setContentType("ARTICLE")}
                        className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${contentType === "ARTICLE" ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10"}`}
                      >
                         <div className={`p-3 rounded-xl ${contentType === "ARTICLE" ? "bg-[#C9A84C] text-[#0C0C0A]" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                            <FileText size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-[11px] font-black uppercase tracking-widest">Article Scientifique</p>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase">Recherche & Clinique</p>
                         </div>
                      </button>
                      <button 
                         type="button"
                         onClick={() => setContentType("PUBLICATION")}
                         className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${contentType === "PUBLICATION" ? "border-indigo-500 bg-indigo-500/5" : "border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10"}`}
                      >
                         <div className={`p-3 rounded-xl ${contentType === "PUBLICATION" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                            <BookOpen size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-[11px] font-black uppercase tracking-widest">Publication PDF</p>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase">Rapports & Archives</p>
                         </div>
                      </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-white/5">
                   <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domaine</Label>
                      <select 
                         className="w-full h-14 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 px-4 text-xs font-black uppercase tracking-widest rounded-xl outline-none focus:border-[#C9A84C]"
                         value={baseData.domain}
                         onChange={(e) => setBaseData({...baseData, domain: e.target.value})}
                      >
                         <option value="RESEARCH">Recherche Scientifique</option>
                         <option value="CLINICAL">Clinique Juridique</option>
                      </select>
                   </div>
                   {contentType === "ARTICLE" && (
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</Label>
                        <select 
                           className="w-full h-14 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 px-4 text-xs font-black uppercase tracking-widest rounded-xl outline-none focus:border-[#C9A84C]"
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
                   )}
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug de l'URL</Label>
                  <Input 
                    value={baseData.slug}
                    onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
                    placeholder="titre-de-l-article" 
                    className="rounded-xl h-14 bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 font-bold text-xs"
                  />
                </div>
             </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl mb-8">
                  {LANGUAGES.map(l => (
                    <TabsTrigger key={l.code} value={l.code} className="font-black uppercase text-[9px] tracking-[0.2em] rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 shadow-none">
                      <Globe size={14} className="mr-2" /> {l.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {LANGUAGES.map(l => (
                  <TabsContent key={l.code} value={l.code} className="space-y-6 outline-none">
                    <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre Scientifique ({l.code})</Label>
                        <Input 
                          className="text-3xl font-serif font-black border-0 border-b border-slate-100 dark:border-white/5 rounded-md px-0 focus-visible:ring-0 focus-visible:border-[#C9A84C] bg-transparent text-slate-900 dark:text-white"
                          placeholder="Entrez le titre..."
                          value={translations[l.code].title}
                          onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], title: e.target.value}})}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Résumé / Excerpt</Label>
                        <Textarea 
                          className="rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] italic font-medium min-h-[100px] focus:border-[#C9A84C] transition-all text-slate-900 dark:text-white"
                          placeholder="Court résumé de l'article pour les cartes d'aperçu..."
                          value={translations[l.code].excerpt}
                          onChange={(e) => setTranslations({...translations, [l.code]: {...translations[l.code], excerpt: e.target.value}})}
                        />
                      </div>

                      {contentType === "ARTICLE" && (
                        <ModernMarkdownEditor 
                          label="Corps de l'article (Markdown)"
                          value={translations[l.code].content}
                          onChange={(val) => setTranslations({...translations, [l.code]: {...translations[l.code], content: val}})}
                        />
                      )}
                    </Card>
                  </TabsContent>
                ))}
             </Tabs>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-8 space-y-8 rounded-[2.5rem] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm">
                   <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-[#C9A84C] border-b border-slate-100 dark:border-white/5 pb-6">Identité Visuelle</h3>
                   <SmartImageInput 
                      label="Image Principale"
                      value={baseData.mainImage}
                      onChange={(val) => setBaseData({...baseData, mainImage: val})}
                      folder="content"
                   />
                   <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                        <Video size={14} className="text-[#C9A84C]" /> Lien Vidéo (Optionnel)
                      </Label>
                      <Input 
                        value={baseData.videoUrl}
                        onChange={(e) => setBaseData({...baseData, videoUrl: e.target.value})}
                        placeholder="Lien YouTube ou Vimeo" 
                        className="rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-xs font-bold h-12"
                      />
                   </div>
                </Card>

                {contentType === "PUBLICATION" && (
                   <Card className="p-8 space-y-8 rounded-[2.5rem] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm">
                      <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-indigo-500 border-b border-slate-100 dark:border-white/5 pb-6">Attributs de Publication</h3>
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Année</Label>
                               <Input 
                                 type="number"
                                 value={baseData.year}
                                 onChange={(e) => setBaseData({...baseData, year: parseInt(e.target.value)})}
                                 className="rounded-xl h-12 font-bold"
                               />
                            </div>
                            <div className="space-y-3">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">DOI / Référence</Label>
                               <Input 
                                 value={baseData.doi}
                                 onChange={(e) => setBaseData({...baseData, doi: e.target.value})}
                                 placeholder="10.1234/..."
                                 className="rounded-xl h-12 font-bold"
                               />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL du Document PDF</Label>
                            <Input 
                              value={baseData.pdfUrl}
                              onChange={(e) => setBaseData({...baseData, pdfUrl: e.target.value})}
                              placeholder="https://..."
                              className="rounded-xl h-12 font-bold"
                            />
                         </div>
                      </div>
                   </Card>
                )}
             </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <Card className="p-12 space-y-12 rounded-[3rem] bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-2xl text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center p-6">
                   <Save size={48} className="animate-pulse" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-4xl font-serif font-black text-slate-900 dark:text-white">Presque prêt.</h2>
                   <p className="text-slate-500 font-light max-w-sm mx-auto">
                      Vérifiez que toutes les traductions sont correctes avant de confirmer la publication sur le portail public.
                   </p>
                </div>

                <div className="w-full max-w-md p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6 text-left">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-slate-400">Nature</span>
                      <span className={contentType === "ARTICLE" ? "text-[#C9A84C]" : "text-indigo-500"}>{contentType}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-slate-400">Domaine</span>
                      <span className="text-slate-900 dark:text-white">{baseData.domain}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-slate-400">Visibilité</span>
                      <div className="flex items-center gap-3">
                         <span className={baseData.published ? "text-emerald-500" : "text-amber-500"}>{baseData.published ? "Live" : "Brouillon"}</span>
                         <Switch 
                            checked={baseData.published}
                            onCheckedChange={(val) => setBaseData({...baseData, published: val})}
                         />
                      </div>
                   </div>
                </div>
             </Card>
          </div>
        )}
      </div>

      {/* Button Navigation */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-10">
         <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1}
            className="h-14 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-0"
         >
            <ChevronLeft size={16} className="mr-2" /> Retour
         </Button>

         {currentStep < STEPS.length ? (
           <Button 
              onClick={handleNext}
              className="bg-[#0C0C0A] dark:bg-white text-white dark:text-[#0C0C0A] h-14 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
           >
              Suivant <ChevronRight size={16} className="ml-2" />
           </Button>
         ) : (
            <Button 
               onClick={handleSubmit}
               className="bg-[#C9A84C] text-[#0C0C0A] h-14 px-12 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#C9A84C]/20"
            >
               Confirmer la Publication
            </Button>
         )}
      </div>
    </div>
  )
}
