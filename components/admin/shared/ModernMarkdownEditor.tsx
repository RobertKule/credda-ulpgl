"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heading1, Heading2, Type, Link as LinkIcon, Eye, PenLine } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModernMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function ModernMarkdownEditor({ 
  value, 
  onChange, 
  label = "Description", 
  placeholder = "# Votre contenu ici..." 
}: ModernMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);
    const newValue = 
      value.substring(0, start) + 
      before + (selection || "") + after + 
      value.substring(end);

    onChange(newValue);
    
    // Defer focusing back to maintain cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + (selection.length || 0);
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</Label>
        <span className="text-[9px] font-bold text-blue-600/50 uppercase tracking-tighter">Markdown supporté</span>
      </div>

      <div className="border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-950/50 shadow-sm transition-all focus-within:border-blue-600/50 min-h-[400px] flex flex-col">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as "write" | "preview")} 
          className="w-full flex-1 flex flex-col"
        >
          <div className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] px-4 py-2 border-b border-slate-100 dark:border-white/5">
            <TabsList className="bg-transparent h-8 p-0 gap-4">
              <TabsTrigger value="write" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-blue-600 font-black uppercase text-[9px] tracking-[0.2em] shadow-none">
                <PenLine size={14} className="mr-2" /> Écrire
              </TabsTrigger>
              <TabsTrigger value="preview" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-blue-600 font-black uppercase text-[9px] tracking-[0.2em] shadow-none">
                <Eye size={14} className="mr-2" /> Aperçu
              </TabsTrigger>
            </TabsList>

            {activeTab === "write" && (
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-white/5" onClick={() => insertText("# ")} title="Titre">
                  <Heading1 size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-white/5" onClick={() => insertText("## ")} title="Sous-titre">
                  <Heading2 size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-white/5" onClick={() => insertText("\n\n")} title="Paragraphe">
                  <Type size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-white/5" onClick={() => insertText("[", "](url)")} title="Lien">
                  <LinkIcon size={14} />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="write" className="mt-0 outline-none flex-1 flex">
            <Textarea 
              ref={textareaRef}
              className="flex-1 min-h-[350px] border-0 rounded-none bg-transparent font-mono text-xs leading-relaxed p-6 focus-visible:ring-0 text-slate-900 dark:text-white resize-none"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 outline-none flex-1 overflow-auto bg-white/5 backdrop-blur-sm">
            <div className="p-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-blue-600 prose-p:leading-relaxed prose-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || "*Aucun contenu à prévisualiser*"}
              </ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
