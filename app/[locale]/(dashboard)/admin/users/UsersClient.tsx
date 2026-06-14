"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  Mail, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ChevronRight, 
  Upload, 
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  ShieldAlert,
  Eye,
  EyeOff,
  User,
  Calendar,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  createUserAccount,
  updateUserAccount,
  updateUserRole, 
  updateUserStatus, 
  deleteUserAccount,
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember,
  uploadTeamMemberImage 
} from "./actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EDITOR' | 'USER';
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string;
  order: number;
  slug: string;
  userId?: string;
  titleFr: string;
  titleEn: string;
  titleSw: string;
  bioFr: string;
  bioEn: string;
  bioSw: string;
}

type MainTab = "ACCOUNTS" | "TEAM";
type StatusFilter = "ALL" | "PENDING" | "ACTIVE" | "SUSPENDED";

export default function UsersClient({
  locale,
  initialUsers,
  initialMembers
}: {
  locale: string;
  initialUsers: UserAccount[];
  initialMembers: TeamMember[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tab State
  const [activeTab, setActiveTab] = useState<MainTab>("ACCOUNTS");

  // Accounts Filters
  const [accountStatusFilter, setAccountStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Team Search
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Selection / Modals State
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [emailNotification, setEmailNotification] = useState<{ isOpen: boolean; email: string; name: string } | null>(null);

  // Form States (Slide-over)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "USER" as 'SUPERADMIN' | 'ADMIN' | 'EDITOR' | 'USER',
    status: "PENDING" as 'PENDING' | 'ACTIVE' | 'SUSPENDED',
    password: ""
  });

  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberFormStep, setMemberFormStep] = useState<1 | 2 | 3>(1);
  const [memberFormLangTab, setMemberFormLangTab] = useState<"fr" | "en" | "sw">("fr");
  const [uploadProgress, setUploadProgress] = useState(false);

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    email: "",
    imageUrl: "",
    order: 0,
    slug: "",
    userId: "",
    titleFr: "",
    titleEn: "",
    titleSw: "",
    bioFr: "",
    bioEn: "",
    bioSw: "",
  });

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Field setters
  const setUserField = (key: string, val: any) => {
    setUserFormData(prev => ({ ...prev, [key]: val }));
  };

  const setMemberField = (key: string, val: any) => {
    setMemberFormData(prev => {
      const next = { ...prev, [key]: val };
      if (key === "name" && !editingMemberId) {
        next.slug = val
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return next;
    });
  };

  // User CRUD - Save
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userFormData.name || !userFormData.email) {
      showToast("Veuillez renseigner le nom et l'adresse e-mail.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const dbStatus = userFormData.status === 'ACTIVE' ? 'APPROVED' : userFormData.status === 'SUSPENDED' ? 'REJECTED' : 'PENDING';
        if (editingUserId) {
          const res = await updateUserAccount(editingUserId, {
            name: userFormData.name,
            email: userFormData.email,
            role: userFormData.role,
            status: dbStatus
          });
          if (res.success) {
            showToast("Compte utilisateur mis à jour.");
            setIsUserFormOpen(false);
            router.refresh();
          }
        } else {
          const res = await createUserAccount({
            name: userFormData.name,
            email: userFormData.email,
            role: userFormData.role,
            status: dbStatus,
            password: userFormData.password
          });
          if (res.success) {
            showToast("Compte utilisateur créé avec succès.");
            setIsUserFormOpen(false);
            router.refresh();
          }
        }
      } catch (err: any) {
        showToast(err.message || "Erreur lors de la sauvegarde.", "error");
      }
    });
  };

  // User Actions
  const handleEditUser = (user: UserAccount) => {
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ""
    });
    setEditingUserId(user.id);
    setIsUserFormOpen(true);
  };

  const handleCreateNewUser = () => {
    setUserFormData({
      name: "",
      email: "",
      role: "USER",
      status: "PENDING",
      password: ""
    });
    setEditingUserId(null);
    setIsUserFormOpen(true);
  };

  // Actions trigger: status update
  const handleStatusChange = (userId: string, newStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED', name: string, email: string) => {
    const dbStatus = newStatus === 'ACTIVE' ? 'APPROVED' : newStatus === 'SUSPENDED' ? 'REJECTED' : 'PENDING';
    
    startTransition(async () => {
      try {
        const res = await updateUserStatus(userId, dbStatus);
        if (res.success) {
          showToast(`Statut mis à jour.`);
          if (res.emailSent) {
            setEmailNotification({ isOpen: true, name, email });
          }
          router.refresh();
        }
      } catch (err: any) {
        showToast(err.message || "Erreur de mise à jour.", "error");
      }
    });
  };

  // Action trigger: delete account
  const handleConfirmDeleteUser = () => {
    if (!deletingUserId) return;
    startTransition(async () => {
      try {
        const res = await deleteUserAccount(deletingUserId);
        if (res.success) {
          showToast("Compte supprimé définitivement.");
          setDeletingUserId(null);
          router.refresh();
        }
      } catch (err: any) {
        showToast(err.message || "Erreur de suppression.", "error");
      }
    });
  };

  // Member upload picture
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("L'image est trop volumineuse (max 5MB).", "error");
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      showToast("Le fichier doit être une image.", "error");
      return;
    }

    setUploadProgress(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      console.log("Uploading file:", file.name, file.size, file.type);
      const res = await uploadTeamMemberImage(uploadData);
      console.log("Upload response:", res);

      if (res.error) {
        showToast(res.error, "error");
      } else if (res.url) {
        setMemberField("imageUrl", res.url);
        showToast("Image importée avec succès !");
      } else {
        showToast("Erreur lors de l'upload: réponse invalide", "error");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Erreur lors de l'envoi de l'image.", "error");
    } finally {
      setUploadProgress(false);
    }
  };

  // Member CRUD - Save
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberFormData.name || !memberFormData.titleFr || !memberFormData.bioFr) {
      showToast("Veuillez remplir les informations requises (Nom, Titre FR, Bio FR).", "error");
      return;
    }

    startTransition(async () => {
      try {
        if (editingMemberId) {
          const res = await updateTeamMember(editingMemberId, memberFormData);
          if (res.success) {
            showToast("Membre mis à jour.");
            setIsMemberFormOpen(false);
            router.refresh();
          }
        } else {
          const res = await createTeamMember(memberFormData);
          if (res.success) {
            showToast("Membre ajouté à l'équipe.");
            setIsMemberFormOpen(false);
            router.refresh();
          }
        }
      } catch (err: any) {
        showToast(err.message || "Erreur de sauvegarde.", "error");
      }
    });
  };

  const handleEditMember = (m: TeamMember) => {
    setMemberFormData({
      name: m.name,
      email: m.email || "",
      imageUrl: m.imageUrl || "",
      order: m.order,
      slug: m.slug,
      userId: m.userId || "",
      titleFr: m.titleFr,
      titleEn: m.titleEn,
      titleSw: m.titleSw,
      bioFr: m.bioFr,
      bioEn: m.bioEn,
      bioSw: m.bioSw,
    });
    setEditingMemberId(m.id);
    setMemberFormStep(1);
    setMemberFormLangTab("fr");
    setIsMemberFormOpen(true);
  };

  const handleCreateNewMember = () => {
    setMemberFormData({
      name: "",
      email: "",
      imageUrl: "",
      order: initialMembers.length + 1,
      slug: "",
      userId: "",
      titleFr: "",
      titleEn: "",
      titleSw: "",
      bioFr: "",
      bioEn: "",
      bioSw: "",
    });
    setEditingMemberId(null);
    setMemberFormStep(1);
    setMemberFormLangTab("fr");
    setIsMemberFormOpen(true);
  };

  const handleConfirmDeleteMember = () => {
    if (!deletingMemberId) return;
    startTransition(async () => {
      try {
        const res = await deleteTeamMember(deletingMemberId);
        if (res.success) {
          showToast("Membre retiré de l'équipe.");
          setDeletingMemberId(null);
          router.refresh();
        }
      } catch (err: any) {
        showToast(err.message || "Erreur de suppression.", "error");
      }
    });
  };

  // Filter lists
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(u => {
      const matchStatus = accountStatusFilter === "ALL" || u.status === accountStatusFilter;
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [initialUsers, accountStatusFilter, searchQuery]);

  const filteredMembers = useMemo(() => {
    return initialMembers.filter(m => {
      return m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) || 
             m.titleFr.toLowerCase().includes(teamSearchQuery.toLowerCase());
    });
  }, [initialMembers, teamSearchQuery]);

  return (
    <div className="w-full relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-[60] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-white font-semibold text-sm",
              toast.type === "success" ? "bg-emerald-600 dark:bg-emerald-700" : "bg-rose-600 dark:bg-rose-700"
            )}
          >
            <Sparkles size={16} />
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-8 relative">
        {(["ACCOUNTS", "TEAM"] as MainTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-4.5 text-sm font-black uppercase tracking-wider transition-all relative z-10",
              activeTab === tab 
                ? "text-emerald-700 dark:text-emerald-500 font-extrabold" 
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
            )}
          >
            {tab === "ACCOUNTS" ? "Comptes & Accès" : "Équipe & Visibilité"}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 dark:bg-emerald-500"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "ACCOUNTS" ? (
          <motion.div
            key="accounts-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 shadow-sm">
              {/* Status Selectors */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(["ALL", "PENDING", "ACTIVE", "SUSPENDED"] as StatusFilter[]).map(st => (
                  <button
                    key={st}
                    onClick={() => setAccountStatusFilter(st)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      accountStatusFilter === st
                        ? "bg-slate-100 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                    )}
                  >
                    {st === "ALL" && "Tous"}
                    {st === "PENDING" && "En attente"}
                    {st === "ACTIVE" && "Actifs"}
                    {st === "SUSPENDED" && "Suspendus"}
                  </button>
                ))}
              </div>

              {/* Search and Action */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative max-w-md flex-1 lg:w-64">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, e-mail..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleCreateNewUser}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Nouveau compte</span>
                </button>
              </div>
            </div>

            {/* Accounts Table */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10">
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Rôle
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Statut
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-zinc-500">
                          Aucun compte ne correspond aux filtres.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {user.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                                {user.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                              user.role === "SUPERADMIN" && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900",
                              user.role === "ADMIN" && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
                              user.role === "EDITOR" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
                              user.role === "USER" && "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                            )}>
                              {user.role === "SUPERADMIN" && "Super-Admin"}
                              {user.role === "ADMIN" && "Admin"}
                              {user.role === "EDITOR" && "Chercheur"}
                              {user.role === "USER" && "Utilisateur"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                            {new Date(user.createdAt).toLocaleDateString(locale, {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              user.status === "ACTIVE" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400",
                              user.status === "PENDING" && "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
                              user.status === "SUSPENDED" && "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                            )}>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                user.status === "ACTIVE" && "bg-emerald-500",
                                user.status === "PENDING" && "bg-amber-500",
                                user.status === "SUSPENDED" && "bg-rose-500"
                              )} />
                              {user.status === "ACTIVE" && "Actif"}
                              {user.status === "PENDING" && "En attente"}
                              {user.status === "SUSPENDED" && "Suspendu"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setViewingUser(user)}
                                title="Détails"
                                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Edit Account */}
                              <button
                                onClick={() => handleEditUser(user)}
                                title="Modifier"
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>

                              {/* Status Action Buttons */}
                              {user.status === "PENDING" && (
                                <button
                                  onClick={() => handleStatusChange(user.id, "ACTIVE", user.name, user.email)}
                                  title="Approuver"
                                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <UserCheck size={14} />
                                </button>
                              )}
                              
                              {user.status === "ACTIVE" ? (
                                <button
                                  onClick={() => handleStatusChange(user.id, "SUSPENDED", user.name, user.email)}
                                  title="Suspendre"
                                  className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <UserX size={14} />
                                </button>
                              ) : user.status === "SUSPENDED" ? (
                                <button
                                  onClick={() => handleStatusChange(user.id, "ACTIVE", user.name, user.email)}
                                  title="Réactiver"
                                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <UserCheck size={14} />
                                </button>
                              ) : null}

                              {/* Delete Account */}
                              <button
                                onClick={() => setDeletingUserId(user.id)}
                                title="Supprimer"
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="team-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 shadow-sm">
              {/* Search Bar */}
              <div className="relative max-w-md w-full lg:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={teamSearchQuery}
                  onChange={e => setTeamSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
                />
              </div>

              {/* Add Member Button */}
              <button
                onClick={handleCreateNewMember}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                <Plus size={14} />
                <span>Ajouter un membre</span>
              </button>
            </div>

            {/* Team Grid */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10">
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Membre
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Titre académique (FR)
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        Ordre d'affichage
                      </th>
                      <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-zinc-500">
                          Aucun membre dans l'équipe.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map(member => (
                        <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 flex items-center justify-center shrink-0">
                                {member.imageUrl ? (
                                  <img 
                                    src={member.imageUrl} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-black text-slate-500 dark:text-zinc-400">
                                    {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {member.name}
                                </span>
                                {member.email && (
                                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                                    {member.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-zinc-300 font-medium">
                            {member.titleFr}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-400">
                              Rang : {member.order}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Member details */}
                              <button
                                onClick={() => setViewingMember(member)}
                                title="Visualiser le profil"
                                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Edit Member */}
                              <button
                                onClick={() => handleEditMember(member)}
                                title="Modifier le profil"
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>

                              {/* Delete Member */}
                              <button
                                onClick={() => setDeletingMemberId(member.id)}
                                title="Retirer de l'équipe"
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- USER ACCOUNT EDIT/CREATE FORM SLIDE-OVER --- */}
      <AnimatePresence>
        {isUserFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserFormOpen(false)}
              className="fixed inset-0 bg-black/60 z-[110]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 z-[120] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {editingUserId ? "Modifier le compte" : "Créer un compte"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Gérez les accès et rôles administratifs de la console.
                  </p>
                </div>
                <button
                  onClick={() => setIsUserFormOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Nom Complet <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={e => setUserField("name", e.target.value)}
                    placeholder="Ex: Prof. Jean-Baptiste Mukanire"
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Adresse E-mail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={e => setUserField("email", e.target.value)}
                    placeholder="Ex: dir@credda-ulpgl.org"
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  />
                </div>

                {!editingUserId && (
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                      Mot de passe d'initialisation
                    </label>
                    <input
                      type="password"
                      value={userFormData.password}
                      onChange={e => setUserField("password", e.target.value)}
                      placeholder="Laisser vide pour la valeur par défaut"
                      className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Valeur par défaut : <code>credda2026admin</code>
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Rôle de l'utilisateur
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserField("role", e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-semibold"
                  >
                    <option value="SUPERADMIN">Super-Admin</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="EDITOR">Chercheur / Éditeur</option>
                    <option value="USER">Utilisateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Statut du compte
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={e => setUserField("status", e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-semibold"
                  >
                    <option value="PENDING">En attente d'approbation</option>
                    <option value="ACTIVE">Actif (Approuvé)</option>
                    <option value="SUSPENDED">Suspendu</option>
                  </select>
                </div>
              </form>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-zinc-900 flex items-center gap-3 bg-slate-50/30 dark:bg-zinc-900/10">
                <button
                  type="button"
                  onClick={() => setIsUserFormOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveUser}
                  disabled={isPending}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isPending ? "Enregistrement..." : editingUserId ? "Enregistrer" : "Créer le compte"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- FORM SLIDE-OVER (Team Member addition / modifications) --- */}
      <AnimatePresence>
        {isMemberFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMemberFormOpen(false)}
              className="fixed inset-0 bg-black/60 z-[110]"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 z-[120] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {editingMemberId ? "Modifier le membre" : "Ajouter un membre"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Configurez le profil et l'ordre d'affichage public.
                  </p>
                </div>
                <button
                  onClick={() => setIsMemberFormOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Steps Indicators */}
              <div className="px-6 py-4.5 bg-slate-50/30 dark:bg-zinc-900/5 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                {[1, 2, 3].map(step => (
                  <button
                    key={step}
                    onClick={() => setMemberFormStep(step as 1 | 2 | 3)}
                    className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
                  >
                    <span className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all",
                      memberFormStep === step
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : memberFormStep > step
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-zinc-550"
                    )}>
                      {step}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider hidden sm:inline",
                      memberFormStep === step ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400"
                    )}>
                      {step === 1 && "Identité"}
                      {step === 2 && "Biographie"}
                      {step === 3 && "Visuels"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* STEP 1: Identité */}
                {memberFormStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-150/40 dark:border-emerald-900/20 flex gap-3">
                      <Info size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        L'identité principale définit le nom tel qu'il apparaîtra sur les publications et l'organigramme officiel du CREDDA.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Nom complet <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={memberFormData.name}
                        onChange={e => setMemberField("name", e.target.value)}
                        placeholder="Ex: Prof. Jean-Baptiste Mukanire"
                        className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Adresse E-mail (Professionnelle)
                      </label>
                      <input
                        type="email"
                        value={memberFormData.email}
                        onChange={e => setMemberField("email", e.target.value)}
                        placeholder="Ex: dir@credda-ulpgl.org"
                        className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Slug de profil public (Auto-généré)
                      </label>
                      <input
                        type="text"
                        required
                        value={memberFormData.slug}
                        onChange={e => setMemberField("slug", e.target.value)}
                        className="w-full px-3.5 py-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-855 rounded-xl text-sm text-slate-500 dark:text-zinc-400 font-mono font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Associer à un compte utilisateur
                      </label>
                      <select
                        value={memberFormData.userId}
                        onChange={e => setMemberField("userId", e.target.value)}
                        className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-semibold"
                      >
                        <option value="">-- Aucun compte utilisateur --</option>
                        {initialUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Biographie Multilingue */}
                {memberFormStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    {/* Language Tabs inside Step 2 */}
                    <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl p-1">
                      {(["fr", "en", "sw"] as const).map(lang => (
                        <button
                          type="button"
                          key={lang}
                          onClick={() => setMemberFormLangTab(lang)}
                          className={cn(
                            "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            memberFormLangTab === lang
                              ? "bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350"
                          )}
                        >
                          {lang === "fr" && "Français"}
                          {lang === "en" && "English"}
                          {lang === "sw" && "Kiswahili"}
                        </button>
                      ))}
                    </div>

                    {/* Language fields */}
                    <AnimatePresence mode="wait">
                      {memberFormLangTab === "fr" && (
                        <motion.div
                          key="lang-fr"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Titre / Fonction (FR) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={memberFormData.titleFr}
                              onChange={e => setMemberField("titleFr", e.target.value)}
                              placeholder="Ex: Directeur de Recherche, Spécialiste Foncier"
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Biographie publique (FR) <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              rows={5}
                              value={memberFormData.bioFr}
                              onChange={e => setMemberField("bioFr", e.target.value)}
                              placeholder="Courte description de ses travaux de recherche au CREDDA..."
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white leading-relaxed font-medium"
                            />
                          </div>
                        </motion.div>
                      )}

                      {memberFormLangTab === "en" && (
                        <motion.div
                          key="lang-en"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Title / Role (EN)
                            </label>
                            <input
                              type="text"
                              value={memberFormData.titleEn}
                              onChange={e => setMemberField("titleEn", e.target.value)}
                              placeholder="Ex: Research Director, Land Law Specialist"
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Public Biography (EN)
                            </label>
                            <textarea
                              rows={5}
                              value={memberFormData.bioEn}
                              onChange={e => setMemberField("bioEn", e.target.value)}
                              placeholder="Short description of research work..."
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white leading-relaxed font-medium"
                            />
                          </div>
                        </motion.div>
                      )}

                      {memberFormLangTab === "sw" && (
                        <motion.div
                          key="lang-sw"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Kazi / Cheo (SW)
                            </label>
                            <input
                              type="text"
                              value={memberFormData.titleSw}
                              onChange={e => setMemberField("titleSw", e.target.value)}
                              placeholder="Mfano: Mkurugenzi wa Utafiti"
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                              Wasifu wa Umma (SW)
                            </label>
                            <textarea
                              rows={5}
                              value={memberFormData.bioSw}
                              onChange={e => setMemberField("bioSw", e.target.value)}
                              placeholder="Maelezo mafupi ya kazi ya utafiti..."
                              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white leading-relaxed font-medium"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* STEP 3: Photo & Classement */}
                {memberFormStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Photo de profil
                      </label>
                      <div className="mt-1 flex items-center gap-5 p-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/30 transition-colors bg-slate-50/50 dark:bg-zinc-900/10">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-zinc-800">
                          {memberFormData.imageUrl ? (
                            <img 
                              src={memberFormData.imageUrl} 
                              alt="Profil" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="relative cursor-pointer bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors">
                            <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-350">
                              {uploadProgress ? "Envoi..." : "Parcourir..."}
                            </span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileUpload} 
                              disabled={uploadProgress}
                            />
                          </label>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-2">
                            PNG, JPG ou WEBP. Max 2Mo.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Ordre d'affichage public (Priorité)
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={memberFormData.order}
                        onChange={e => setMemberField("order", parseInt(e.target.value) || 1)}
                        className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-extrabold"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1.5">
                        Les chiffres les plus bas s'affichent en premier sur l'annuaire (ex: 1 pour le Directeur, 2 pour les adjoints).
                      </p>
                    </div>
                  </motion.div>
                )}

              </form>

              {/* Footer Buttons */}
              <div className="p-6 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between bg-slate-50/30 dark:bg-zinc-900/10">
                {memberFormStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setMemberFormStep((memberFormStep - 1) as 1 | 2 | 3)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
                  >
                    Précédent
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  {memberFormStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setMemberFormStep((memberFormStep + 1) as 1 | 2 | 3)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Suivant</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveMember}
                      disabled={isPending}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
                    >
                      <span>{isPending ? "Enregistrement..." : editingMemberId ? "Mettre à jour" : "Ajouter au Staff"}</span>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DETAILS MODAL: USER ACCOUNT --- */}
      <AnimatePresence>
        {viewingUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingUser(null)}
              className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[151] w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-850 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-slate-250/20 dark:border-zinc-800">
                    <User size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Détails de l'utilisateur
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-550">
                      ID: {viewingUser.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Nom complet</span>
                  <p className="font-extrabold text-slate-900 dark:text-white">{viewingUser.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Adresse E-mail</span>
                  <p className="font-semibold text-slate-800 dark:text-zinc-350">{viewingUser.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Rôle assigné</span>
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border mt-1",
                    viewingUser.role === "SUPERADMIN" && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900",
                    viewingUser.role === "ADMIN" && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
                    viewingUser.role === "EDITOR" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
                    viewingUser.role === "USER" && "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                  )}>
                    {viewingUser.role === "SUPERADMIN" && "Super-Admin"}
                    {viewingUser.role === "ADMIN" && "Administrateur"}
                    {viewingUser.role === "EDITOR" && "Chercheur"}
                    {viewingUser.role === "USER" && "Utilisateur"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Statut du compte</span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1",
                    viewingUser.status === "ACTIVE" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400",
                    viewingUser.status === "PENDING" && "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
                    viewingUser.status === "SUSPENDED" && "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      viewingUser.status === "ACTIVE" && "bg-emerald-500",
                      viewingUser.status === "PENDING" && "bg-amber-500",
                      viewingUser.status === "SUSPENDED" && "bg-rose-500"
                    )} />
                    {viewingUser.status === "ACTIVE" && "Actif"}
                    {viewingUser.status === "PENDING" && "En attente"}
                    {viewingUser.status === "SUSPENDED" && "Suspendu"}
                  </span>
                </div>
                <div className="space-y-1 col-span-2 border-t border-slate-100 dark:border-zinc-900 pt-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Date de création du compte</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-350 mt-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="font-semibold">
                      {new Date(viewingUser.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900">
                <button
                  onClick={() => setViewingUser(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DETAILS MODAL: TEAM MEMBER --- */}
      <AnimatePresence>
        {viewingMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingMember(null)}
              className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[151] w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-850 p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-zinc-800">
                    {viewingMember.imageUrl ? (
                      <img 
                        src={viewingMember.imageUrl} 
                        alt={viewingMember.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-black text-slate-500 dark:text-zinc-400">
                        {viewingMember.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {viewingMember.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-550">
                      Slug: {viewingMember.slug} | Rang: {viewingMember.order}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingMember(null)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Grid content */}
              <div className="space-y-5 text-xs">
                {viewingMember.email && (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-550 block">Adresse E-mail</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-350">{viewingMember.email}</p>
                  </div>
                )}

                {/* Multilingual translations details */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-900">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Traductions multilingues
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Français */}
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-850 space-y-2">
                      <span className="font-black text-[10px] text-emerald-700 dark:text-emerald-400">🇫🇷 FRANÇAIS</span>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">TITRE</span>
                        <p className="font-bold text-slate-800 dark:text-white">{viewingMember.titleFr || "Non traduit"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">BIO</span>
                        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{viewingMember.bioFr || "Non traduit"}</p>
                      </div>
                    </div>

                    {/* Anglais */}
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-850 space-y-2">
                      <span className="font-black text-[10px] text-emerald-700 dark:text-emerald-400">🇬🇧 ENGLISH</span>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">TITLE</span>
                        <p className="font-bold text-slate-800 dark:text-white">{viewingMember.titleEn || "Non traduit"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">BIO</span>
                        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{viewingMember.bioEn || "Non traduit"}</p>
                      </div>
                    </div>

                    {/* Swahili */}
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-850 space-y-2">
                      <span className="font-black text-[10px] text-emerald-700 dark:text-emerald-400">🇹🇿 KISWAHILI</span>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">KAZI</span>
                        <p className="font-bold text-slate-800 dark:text-white">{viewingMember.titleSw || "Non traduit"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">WASIFU</span>
                        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{viewingMember.bioSw || "Non traduit"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900">
                <button
                  onClick={() => setViewingMember(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE USER ACCOUNT MODAL --- */}
      <AnimatePresence>
        {deletingUserId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingUserId(null)}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-850 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Supprimer ce compte ?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-550 mt-1">
                    Cette action est définitive et révoquera tous les accès de l'utilisateur.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingUserId(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE TEAM MEMBER MODAL --- */}
      <AnimatePresence>
        {deletingMemberId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMemberId(null)}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-850 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Retirer de l'équipe ?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-550 mt-1">
                    Ce chercheur ne sera plus visible sur la partie publique du site.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingMemberId(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDeleteMember}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- SIMULATED EMAIL NOTIFICATION MODAL --- */}
      <AnimatePresence>
        {emailNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailNotification(null)}
              className="fixed inset-0 bg-black/60 z-[210] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[211] w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-850 p-6 shadow-2xl space-y-5"
            >
              <div className="flex flex-col items-center text-center space-y-3.5">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <UserCheck size={26} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Compte activé avec succès !
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-550 mt-1 max-w-xs">
                    Un e-mail d'approbation et de bienvenue a été simulé et transmis à l'utilisateur.
                  </p>
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-900/80 space-y-2.5">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Destinataire: {emailNotification.name}</span>
                  <span>À: {emailNotification.email}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-zinc-800 pt-2 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5">
                  <p className="font-extrabold text-slate-800 dark:text-zinc-350">
                    Sujet: Votre demande d'accès au CREDDA a été approuvée
                  </p>
                  <p className="leading-relaxed">
                    Bonjour <strong>{emailNotification.name}</strong>, votre demande d'accès à la console d'administration du CREDDA a été approuvée par un administrateur. Vous pouvez désormais vous connecter en toute sécurité.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEmailNotification(null)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Fermer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
