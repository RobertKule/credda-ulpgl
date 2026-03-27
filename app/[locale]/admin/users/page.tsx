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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <ShieldPlus size={18} className="text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest transition-colors">
              Access Control & Permissions
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight transition-colors">
            User <span className="text-muted-foreground/40 font-light italic">Management</span>
          </h1>
          <p className="text-sm text-muted-foreground/60 font-medium transition-colors">
            Manage account requests, assign roles, and control access to the administrative portal.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-md shadow-xl transition-all">
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