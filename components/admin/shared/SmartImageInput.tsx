"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

interface SmartImageInputProps {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  label?: string;
}

export function SmartImageInput({ value, onChange, folder = "gallery", label = "Image" }: SmartImageInputProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">(
    value?.startsWith("http") && !value.includes("supabase") && !value.includes("localhost") ? "url" : "upload"
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "image");
    formData.append("folder", folder);

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setProgress(percentCompleted);
        }
      });

      if (res.data.url) {
        onChange(res.data.url);
        toast.success("Image téléchargée !");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
        <ImageIcon size={14} className="text-blue-600" /> {label}
      </Label>

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as "upload" | "url")} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-4 text-slate-500">
          <TabsTrigger value="upload" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
            <Upload size={12} className="mr-2" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
            <LinkIcon size={12} className="mr-2" /> URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0 outline-none">
          <div className="relative aspect-video bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden group rounded-2xl shadow-inner transition-all hover:border-blue-600/50">
            {value && activeTab === "upload" ? (
              <>
                <Image src={value} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onChange("")}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest"
                  >
                    <X size={14} className="mr-2" /> Supprimer
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 w-full">
                {uploading ? (
                  <div className="space-y-4 px-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Envoi: {progress}%</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <Button
                       type="button"
                       variant="outline"
                       className="border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 px-6 py-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 mx-auto"
                       onClick={() => fileInputRef.current?.click()}
                     >
                       <Upload size={14} /> Sélectionner un fichier
                     </Button>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">JPG, PNG ou WEBP • Max 4.5MB</p>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-0 outline-none">
           <div className="space-y-4">
              <Input 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..." 
                className="rounded-xl bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 font-bold text-xs h-12"
              />
              {value && activeTab === 'url' && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5">
                  <Image 
                    src={value} 
                    alt="URL Preview" 
                    fill 
                    className="object-cover"
                    onError={() => toast.error("Impossible de charger l'image depuis cette URL")}
                  />
                </div>
              )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
