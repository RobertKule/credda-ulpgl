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
import { createArticle, updateArticle } from "@/services/article-actions"
import { toast } from "react-hot-toast"
import { Save, Globe, Settings2, Image as ImageIcon, Video, Upload, X } from "lucide-react"
import axios from "axios";
import Image from "next/image";
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ArticleForm({ categories, initialData, isEditing = false }: any) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "image");

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data.url) {
        setBaseData({ ...baseData, mainImage: res.data.url });
        toast.success("Image téléchargée !");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

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
      {/* Barre d'action collante (Offset par rapport au TopBar) */}
      <div className="sticky top-20 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/5 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 mb-8 transition-colors">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Configuration de l'article</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest rounded-xl">Annuler</Button>
          <Button disabled={uploading} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            <Save className="mr-2" size={16} />
            {isEditing ? "Enregistrer" : "Publier"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonne Principale : Contenu Multi-langue */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
              {LANGUAGES.map(l => (
                <TabsTrigger key={l.code} value={l.code} className="font-black uppercase text-[9px] tracking-[0.2em] rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm">
                  <Globe size={14} className="mr-2" /> {l.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(l => (
              <TabsContent key={l.code} value={l.code} className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
                <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre Scientifique ({l.code})</Label>
                    <Input 
                      className="text-3xl font-serif font-black border-0 border-b border-slate-100 dark:border-white/5 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-600 bg-transparent text-slate-900 dark:text-white transition-colors"
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Corps de l'article (Markdown)</Label>
                       <span className="text-[9px] font-bold text-blue-600/50 uppercase tracking-tighter">Supporte le formatage enrichi</span>
                    </div>
                    <Textarea 
                      className="min-h-[500px] rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] font-mono text-sm leading-relaxed p-6 focus:border-blue-600 transition-all text-slate-900 dark:text-white"
                      placeholder="# Votre contenu scientifique ici..."
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
          <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-white/5 pb-6">Paramètres</h3>
            
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

            <div className="flex items-center justify-between p-5 bg-blue-600/5 dark:bg-blue-600/10 rounded-2xl border border-blue-600/10">
              <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 cursor-pointer" htmlFor="pub-switch">Publier immédiatement</Label>
              <Switch 
                id="pub-switch"
                checked={baseData.published}
                onCheckedChange={(val) => setBaseData({...baseData, published: val})}
              />
            </div>
          </Card>

          <Card className="p-8 space-y-8 rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] shadow-sm">
             <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5 pb-6">Ressources Médias</h3>
             
             <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                 <ImageIcon size={14} className="text-blue-600" /> Couverture Principale
               </Label>
               
               <div className="relative aspect-video bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center overflow-hidden group rounded-2xl shadow-inner">
                 {baseData.mainImage ? (
                   <>
                     <Image src={baseData.mainImage} alt="Preview" fill className="object-cover" />
                     <button
                       type="button"
                       onClick={() => setBaseData({ ...baseData, mainImage: "" })}
                       className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                     >
                       <X size={16} />
                     </button>
                   </>
                 ) : (
                   <div className="text-center p-6 w-full">
                     {uploading ? (
                       <div className="space-y-4 px-6">
                         <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                         <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                           <div 
                             className="bg-blue-600 h-full transition-all duration-300" 
                             style={{ width: `${uploadProgress}%` }}
                           />
                         </div>
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Calcul: {uploadProgress}%</p>
                       </div>
                     ) : (
                       <div className="space-y-4">
                          <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 mx-auto"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload size={14} /> Sélectionner un fichier
                          </button>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">JPG, PNG ou WEBP • Max 5MB</p>
                       </div>
                     )}
                   </div>
                 )}
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
               </div>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                  <Video size={14} className="text-blue-600" /> Lien Vidéo Immergeant
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