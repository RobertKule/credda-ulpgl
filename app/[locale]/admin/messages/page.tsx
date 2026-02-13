import { db } from "@/lib/db";
import MessageItem from "@/components/admin/MessageItem";
import { Inbox, Filter } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Inbox size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Communications Hub</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Boîte de réception</h1>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Filter size={14} />
           <span className="text-blue-600 border-b border-blue-600">Tous les messages ({messages.length})</span>
           <span className="hover:text-slate-600 cursor-pointer">Non-lus</span>
        </div>
      </div>
      
      {messages.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-slate-50 border-2 border-dashed border-slate-100">
          <Inbox size={64} className="mx-auto text-slate-200 mb-6" />
          <p className="text-slate-400 font-serif italic text-lg">Votre boîte de réception est vide.</p>
        </div>
      )}
    </div>
  );
}