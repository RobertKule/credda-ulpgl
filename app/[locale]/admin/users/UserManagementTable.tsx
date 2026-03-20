// app/[locale]/admin/users/UserManagementTable.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  Shield, Mail, Calendar, Trash2, 
  CheckCircle2, XCircle, MoreVertical,
  ShieldCheck, UserPlus, Search, Filter, Loader2,
  Edit2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  updateUserStatus, 
  updateUserRole, 
  deleteUser 
} from "@/services/user-actions";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  requestedRole?: string | null;
}

export default function UserManagementTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const result = await updateUserStatus(id, newStatus);
      if (result.success) {
        toast.success(`Account ${newStatus.toLowerCase()} successfully`);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleRoleUpdate = async (id: string, newRole: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "USER") => {
    startTransition(async () => {
      const result = await updateUserRole(id, newRole);
      if (result.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        toast.error(result.error || "Failed to update role");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    startTransition(async () => {
      const result = await deleteUser(id);
      if (result.success) {
        toast.success("User deleted");
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Information</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      u.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                      u.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{u.name || "N/A"}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} /> {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`
                    rounded-none text-[8px] font-black tracking-widest uppercase px-2 py-1
                    ${u.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      u.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                      'bg-red-100 text-red-700 border-red-200'}
                  `}>
                    {u.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleUpdate(u.id, e.target.value as any)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 px-2 py-1 cursor-pointer focus:ring-1 focus:ring-blue-500/20"
                    disabled={isPending}
                  >
                    <option value="USER">USER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {u.status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-8 text-[10px] font-black uppercase"
                          onClick={() => handleStatusUpdate(u.id, 'APPROVED')}
                          disabled={isPending}
                        >
                          <CheckCircle2 size={14} className="mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50 rounded-none h-8 text-[10px] font-black uppercase"
                          onClick={() => handleStatusUpdate(u.id, 'REJECTED')}
                          disabled={isPending}
                        >
                          <XCircle size={14} className="mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-slate-300 hover:text-red-600 h-8 w-8"
                      onClick={() => handleDelete(u.id)}
                      disabled={isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-400 italic text-sm">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
