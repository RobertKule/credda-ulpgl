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
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</Label>
        <span className="text-[9px] font-bold text-primary/50 uppercase tracking-tighter">Markdown supporté</span>
      </div>

      <div className="border border-border/60 rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm shadow-inner transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 min-h-[450px] flex flex-col group/editor">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as "write" | "preview")} 
          className="w-full flex-1 flex flex-col"
        >
          <div className="flex items-center justify-between bg-muted/40 dark:bg-muted/20 px-6 py-3 border-b border-border/40">
            <TabsList className="bg-transparent h-9 p-0 gap-6">
              <TabsTrigger value="write" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary font-black uppercase text-[10px] tracking-[0.25em] shadow-none p-0 h-auto">
                <PenLine size={16} className="mr-2.5" /> Écrire
              </TabsTrigger>
              <TabsTrigger value="preview" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary font-black uppercase text-[10px] tracking-[0.25em] shadow-none p-0 h-auto">
                <Eye size={16} className="mr-2.5" /> Aperçu
              </TabsTrigger>
            </TabsList>

            {activeTab === "write" && (
              <div className="flex items-center gap-1.5 p-1 bg-background/50 rounded-xl border border-border/20 shadow-sm">
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => insertText("# ")} title="Titre">
                  <Heading1 size={16} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => insertText("## ")} title="Sous-titre">
                  <Heading2 size={16} />
                </Button>
                <div className="w-px h-6 bg-border/40 mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => insertText("\n\n")} title="Paragraphe">
                  <Type size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" onClick={() => insertText("[", "](url)")} title="Lien">
                  <LinkIcon size={16} />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="write" className="mt-0 outline-none flex-1 flex">
            <Textarea 
              ref={textareaRef}
              className="flex-1 min-h-[380px] border-0 rounded-none bg-transparent font-mono text-[13px] leading-relaxed p-8 focus-visible:ring-0 text-foreground resize-none selection:bg-primary/20"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 outline-none flex-1 overflow-auto bg-muted/[0.02]">
            <div className="p-10 prose prose-slate dark:prose-invert max-w-none prose-headings:font-fraunces prose-headings:font-black prose-headings:text-primary prose-a:text-primary prose-p:leading-relaxed prose-lg animate-in fade-in duration-500">
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
