// Optionnel: utiliser les stats dans le header
// app/admin/messages/page.tsx
import { db } from "@/lib/db";
import { MessagesList } from "./MessagesList";
import { Inbox } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Calculer les stats
  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "UNREAD").length,
    read: messages.filter(m => m.status === "READ").length,
    archived: messages.filter(m => m.status === "ARCHIVED").length
  };

  return (
    <div className="space-y-8">
      {/* Header avec stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Inbox size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-serif font-bold text-slate-900">
                  Messages
                </h1>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {stats.unread} non lu{stats.unread > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Gérez les demandes de contact et les correspondances
              </p>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="flex gap-4 text-sm">
            <div className="text-center px-4 py-2 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-900">{stats.total}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
            </div>
            <div className="text-center px-4 py-2 bg-emerald-50 rounded-lg">
              <div className="font-bold text-emerald-700">{stats.read}</div>
              <div className="text-[10px] text-emerald-600 uppercase tracking-wider">Lus</div>
            </div>
            <div className="text-center px-4 py-2 bg-amber-50 rounded-lg">
              <div className="font-bold text-amber-700">{stats.unread}</div>
              <div className="text-[10px] text-amber-600 uppercase tracking-wider">Non lus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <MessagesList messages={messages} />
    </div>
  );
}