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
import { motion } from "framer-motion";

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
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-3">
        <ImageIcon size={14} className="text-primary" /> {label}
      </Label>

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as "upload" | "url")} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-10 bg-muted p-1 rounded-xl mb-4 text-muted-foreground">
          <TabsTrigger value="upload" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground shadow-sm">
            <Upload size={12} className="mr-2" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground shadow-sm">
            <LinkIcon size={12} className="mr-2" /> URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0 outline-none">
          <div className="relative aspect-video bg-muted/20 dark:bg-card border-2 border-dashed border-border/60 flex flex-col items-center justify-center overflow-hidden group rounded-[2rem] shadow-inner transition-all hover:border-primary/50 hover:bg-muted/30">
            {value && activeTab === "upload" ? (
              <>
                <Image src={value} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onChange("")}
                    className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-black/50"
                  >
                    <X size={14} className="mr-2" /> Supprimer l'image
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-8 w-full">
                {uploading ? (
                  <div className="space-y-6 px-10">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border/20 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="bg-primary h-full transition-all duration-300" 
                      />
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Chargement : {progress}%</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                     <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110 duration-500">
                        <Upload size={24} className="text-primary/40" />
                     </div>
                     <Button
                       type="button"
                       variant="outline"
                       className="border-border/60 hover:bg-background px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2 mx-auto shadow-sm"
                       onClick={() => fileInputRef.current?.click()}
                     >
                       Sélectionner un fichier
                     </Button>
                     <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest pl-2">
                        JPG, PNG ou WEBP • Maximum 4.5MB
                     </p>
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
                className="rounded-xl bg-muted/20 border-border font-bold text-xs h-12 text-foreground focus:ring-primary/20 transition-all"
              />
              {value && activeTab === 'url' && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted">
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
