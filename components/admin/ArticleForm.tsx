// components/admin/ArticleForm.tsx
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createArticle } from "@/services/article-actions"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
]

export function ArticleForm({ categories }: { categories: any[] }) {
  const [loading, setLoading] = useState(false)
  const [baseData, setBaseData] = useState({
    slug: "",
    domain: "RESEARCH",
    categoryId: categories[0]?.id || "",
    videoUrl: ""
  })

  const [translations, setTranslations] = useState(
    LANGUAGES.reduce((acc, lang) => ({
      ...acc,
      [lang.code]: { title: "", content: "", excerpt: "" }
    }), {})
  )

  const handleSubmit = async () => {
    setLoading(true)
    const payload = {
      ...baseData,
      translations: LANGUAGES.map(lang => ({
        language: lang.code,
        ...translations[lang.code as keyof typeof translations]
      }))
    }
    
    const res = await createArticle(payload)
    if (res.success) alert("Article publié avec succès !")
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <Card className="p-6 space-y-4 border-slate-200 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-blue-900">Paramètres Généraux</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Slug unique (ex: impact-democratie-rdc)" 
            onChange={(e) => setBaseData({...baseData, slug: e.target.value})}
          />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3"
            onChange={(e) => setBaseData({...baseData, domain: e.target.value})}
          >
            <option value="RESEARCH">Domaine Recherche</option>
            <option value="CLINICAL">Domaine Clinique</option>
          </select>
          <Input 
            placeholder="Lien Vidéo (YouTube / Vimeo)" 
            onChange={(e) => setBaseData({...baseData, videoUrl: e.target.value})}
          />
        </div>
      </Card>

      <Tabs defaultValue="fr" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          {LANGUAGES.map(lang => (
            <TabsTrigger key={lang.code} value={lang.code}>{lang.label}</TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map(lang => (
          <TabsContent key={lang.code} value={lang.code}>
            <Card className="p-6 space-y-4">
              <Input 
                placeholder={`Titre en ${lang.label}`} 
                className="text-lg font-bold"
                onChange={(e) => setTranslations({
                  ...translations,
                  [lang.code]: { ...translations[lang.code as keyof typeof translations], title: e.target.value }
                })}
              />
              <Textarea 
                placeholder="Résumé court (Excerpt)..." 
                onChange={(e) => setTranslations({
                  ...translations,
                  [lang.code]: { ...translations[lang.code as keyof typeof translations], excerpt: e.target.value }
                })}
              />
              <Textarea 
                placeholder="Contenu de l'article (Markdown supporté)..." 
                className="min-h-[300px] font-mono text-sm"
                onChange={(e) => setTranslations({
                  ...translations,
                  [lang.code]: { ...translations[lang.code as keyof typeof translations], content: e.target.value }
                })}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Enregistrer comme brouillon</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-blue-900 hover:bg-blue-800"
        >
          {loading ? "Publication..." : "Publier sur la plateforme"}
        </Button>
      </div>
    </div>
  )
}