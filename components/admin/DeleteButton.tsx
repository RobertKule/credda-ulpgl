"use client"

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteArticle } from "@/services/article-actions";
import { deletePublication } from "@/services/publication-actions";
import { deleteMember } from "@/services/member-actions";

export default function DeleteButton({ id, type }: { id: string, type: 'article' | 'publication' | 'member' }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Cette action est irréversible. Confirmer la suppression ?")) return;
    
    setLoading(true);
    if (type === 'article') await deleteArticle(id);
    if (type === 'publication') await deletePublication(id);
    if (type === 'member') await deleteMember(id);
    setLoading(false);
  };

  return (
    <Button 
      variant="ghost" size="icon" 
      onClick={handleDelete}
      disabled={loading}
      className="h-8 w-8 text-slate-300 hover:text-red-600 transition-colors"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}