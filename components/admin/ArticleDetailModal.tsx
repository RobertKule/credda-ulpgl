"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  X, Calendar, User2, Globe, Eye, 
  FileText, ExternalLink, Edit, Copy, 
  Link as LinkIcon  // ← Renommé
} from "lucide-react"
import { Link } from "@/navigation"

import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { fr, enUS } from 'date-fns/locale'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleDetailModalProps {
  isOpen: boolean
  onClose: () => void
  article: any
  locale: string
}

const locales = {
  fr,
  en: enUS
}

// ... (garder les imports et interfaces)

export function ArticleDetailModal({ isOpen, onClose, article, locale }: ArticleDetailModalProps) {
  const [activeTab, setActiveTab] = useState("fr")
  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-none shadow-2xl bg-white">
        <div className="flex flex-col h-[90vh]">
          {/* Header style Manuscrit/Archive */}
          <div className="bg-[#050a15] text-white p-8 space-y-4">
            <div className="flex justify-between items-start">
              <Badge className="bg-blue-600 rounded-none uppercase text-[9px] tracking-widest px-3">
                {article.domain} DOCUMENT
              </Badge>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <h2 className="text-3xl font-serif font-bold italic leading-tight">
              {article.translations?.find((t: any) => t.language === locale)?.title || "Untitled Document"}
            </h2>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User2 size={14} /> Secrétariat Scientifique</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
               <TabsList className="bg-white border w-fit mb-8">
                  {['fr', 'en', 'sw'].map(l => (
                    <TabsTrigger key={l} value={l} className="uppercase text-[10px] font-black px-6">{l}</TabsTrigger>
                  ))}
               </TabsList>

               {['fr', 'en', 'sw'].map(lang => {
                 const trans = article.translations?.find((t: any) => t.language === lang)
                 return (
                   <TabsContent key={lang} value={lang} className="space-y-8 animate-in slide-in-from-bottom-2">
                     {trans ? (
                       <div className="bg-white p-8 border border-slate-200 shadow-sm space-y-8">
                         <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase text-blue-600">Titre Officiel</span>
                           <p className="text-2xl font-serif font-bold text-slate-900">{trans.title}</p>
                         </div>
                         <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase text-blue-600">Abstract / Résumé</span>
                           <p className="text-slate-600 italic leading-relaxed bg-slate-50 p-4 border-l-4 border-blue-600">{trans.excerpt}</p>
                         </div>
                         <div className="prose prose-slate max-w-none prose-p:text-sm">
                            <Markdown remarkPlugins={[remarkGfm]}>{trans.content}</Markdown>
                         </div>
                       </div>
                     ) : (
                       <div className="h-40 flex items-center justify-center text-slate-400 italic">Version non disponible.</div>
                     )}
                   </TabsContent>
                 )
               })}
            </Tabs>
          </div>

          {/* Footer Actions Sticky */}
          <div className="p-6 bg-white border-t flex justify-end gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <Button variant="outline" onClick={onClose} className="rounded-none">Fermer</Button>
            <Button asChild className="bg-slate-900 hover:bg-blue-600 rounded-none px-8">
              <Link href={`/admin/articles/edit/${article.id}`}>
                <Edit size={16} className="mr-2" /> Modifier l'archive
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}