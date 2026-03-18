// app/[locale]/admin/messages/page.tsx
import { db } from "@/lib/db";
import { Inbox, MailOpen, AlertCircle, MessageSquare } from "lucide-react";
import InboxTable from "./InboxTable";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-10 pb-10">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600/10 p-1.5 rounded-lg">
              <Inbox size={18} className="text-blue-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Communications Center
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Message <span className="text-slate-400 font-light italic">Inbox</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage public inquiries, research collaboration requests, and partnership messages.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 p-3 flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-lg font-black text-slate-900">{stats.unread}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">Unread</span>
          </div>
          <div className="bg-white border border-slate-200 p-3 flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-lg font-black text-slate-900">{stats.replied}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-purple-600">Replied</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Application */}
      <InboxTable initialMessages={messages as any} />
    </div>
  );
}