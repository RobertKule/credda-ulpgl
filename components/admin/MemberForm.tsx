"use client"

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMember, updateMember } from "@/services/member-actions";
import { useRouter } from "next/navigation";
import { Loader2, Save, Upload, User, X } from "lucide-react";
import Image from "next/image";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
];

export function MemberForm({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [baseData, setBaseData] = useState({
    image: initialData?.image || "",
    email: initialData?.email || "",
    order: initialData?.order || 0,
  });

  const [translations, setTranslations] = useState(
    LANGUAGES.reduce((acc, lang) => {
      const existing = initialData?.translations?.find((t: any) => t.language === lang.code);
      return {
        ...acc,
        [lang.code]: {
          name: existing?.name || "",
          role: existing?.role || "",
          bio: existing?.bio || ""
        }
      };
    }, {})
  );

  // Gestion de l'upload d'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setBaseData({ ...baseData, image: data.url });
      }
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...baseData,
      translations: LANGUAGES.map(lang => ({
        language: lang.code,
        ...(translations as any)[lang.code]
      }))
    };

    const res = initialData 
      ? await updateMember(initialData.id, payload)
      : await createMember(payload);

    if (res.success) {
      router.push(`/${locale}/admin/members`);
    } else {
      alert("Erreur lors de l'enregistrement");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECTION IMAGE & INFOS DE BASE */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Photo de profil</label>
          <div className="relative aspect-[4/5] bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
            {baseData.image ? (
              <>
                <Image src={baseData.image} alt="Preview" fill className="object-cover" />
                <button 
                  onClick={() => setBaseData({...baseData, image: ""})}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                {uploading ? (
                  <Loader2 className="animate-spin text-blue-600 mx-auto" />
                ) : (
                  <>
                    <User size={40} className="text-slate-300 mx-auto mb-2" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-blue-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} className="mr-2" /> Sélectionner
                    </Button>
                  </>
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

        {/* Inputs de base */}
        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6 bg-white p-6 border border-slate-200 shadow-sm self-start">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest">Email Professionnel</label>
            <Input value={baseData.email} onChange={(e) => setBaseData({...baseData, email: e.target.value})} placeholder="email@credda-ulpgl.org" className="rounded-none h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest">Priorité d'affichage</label>
            <Input type="number" value={baseData.order} onChange={(e) => setBaseData({...baseData, order: parseInt(e.target.value)})} className="rounded-none h-12" />
            <p className="text-[10px] text-slate-400 italic">0 = Premier, 99 = Dernier</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="fr" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-none w-full grid grid-cols-3 h-14">
          {LANGUAGES.map(lang => (
            <TabsTrigger key={lang.code} value={lang.code} className="rounded-none font-bold uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-white">
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map(lang => (
          <TabsContent key={lang.code} value={lang.code} className="p-8 bg-white border border-t-0 border-slate-200 space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-slate-400">Nom Complet</label>
               <Input 
                placeholder="Ex: Pr. Dr. John Doe" 
                className="rounded-none h-12 text-lg font-serif"
                value={(translations as any)[lang.code].name}
                onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], name: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-slate-400">Poste / Rôle</label>
               <Input 
                placeholder="Ex: Coordonnateur Adjoint" 
                className="rounded-none h-12"
                value={(translations as any)[lang.code].role}
                onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], role: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase text-slate-400">Biographie courte</label>
               <Textarea 
                placeholder="Décrivez le parcours académique..." 
                className="h-40 rounded-none border-slate-200"
                value={(translations as any)[lang.code].bio}
                onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], bio: e.target.value}})}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="rounded-none px-8 h-14 uppercase text-xs font-black tracking-widest"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || uploading} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-none px-12 h-14 uppercase text-xs font-black tracking-widest shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" size={16} /> Enregistrer le profil</>}
        </Button>
      </div>
    </div>
  );
}