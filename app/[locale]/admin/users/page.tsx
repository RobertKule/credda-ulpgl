// app/[locale]/admin/users/page.tsx
import { db } from "@/lib/db";
import { UserPlus, ShieldPlus } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import UserManagementTable from "./UserManagementTable";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ 
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      requestedRole: true
    }
  });

  return (
    <div className="space-y-10 pb-10">
      {/* Header section with premium design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600/10 p-1.5 rounded-lg">
              <ShieldPlus size={18} className="text-blue-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Access Control & Permissions
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            User <span className="text-slate-400 font-light italic">Management</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage account requests, assign roles, and control access to the administrative portal.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-none shadow-xl transition-all">
            <Link href="/admin/users/new" className="flex items-center gap-2">
              <UserPlus size={18} /> Invite User
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <UserManagementTable initialUsers={users} />
    </div>
  );
}