"use client"

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/services/article-actions";
import { useState } from "react";

export default function DeleteArticleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Êtes-vous certain de vouloir supprimer définitivement cet article ?")) {
      setLoading(true);
      await deleteArticle(id);
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={loading}
      className="h-8 w-8 text-slate-300 hover:text-red-600 transition-colors"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}