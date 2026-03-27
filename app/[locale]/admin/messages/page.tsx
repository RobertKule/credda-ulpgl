// app/[locale]/admin/messages/page.tsx
import { db } from "@/lib/db";
import { Inbox, MessageSquare, MailOpen, Clock } from "lucide-react";
import InboxTable from "./InboxTable";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "UNREAD").length,
    read: messages.filter(m => m.status === "READ").length,
    replied: messages.filter(m => m.repliedAt !== null).length
  };

  return (
    <div className="space-y-12 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background transition-colors min-h-screen">
      
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-border pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" />
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
              Centre de Communications
            </span>
          </div>
          <h1 className="text-5xl font-serif font-black text-foreground tracking-tighter uppercase leading-none transition-colors">
            Boîte de <span className="text-primary italic font-light">Réception</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-xl transition-colors">
            Gérez les demandes publiques, les sollicitations de recherche et les partenariats stratégiques du CREDDA.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-card border border-border p-6 flex flex-col items-center justify-center min-w-[120px] rounded-3xl shadow-sm transition-all hover:border-primary/20">
            <span className="text-2xl font-black text-foreground leading-none mb-1 transition-colors">{stats.unread}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Non lus</span>
          </div>
          <div className="bg-card border border-border p-6 flex flex-col items-center justify-center min-w-[120px] rounded-3xl shadow-sm transition-all hover:border-emerald-500/20">
            <span className="text-2xl font-black text-foreground leading-none mb-1 transition-colors">{stats.replied}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Répondus</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Application */}
      <div className="max-w-6xl">
         <InboxTable initialMessages={messages as any} />
      </div>
    </div>
  );
}