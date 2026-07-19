"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  label: string;
  copiedLabel: string;
}

export default function ShareButton({ title, label, copiedLabel }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="w-full border-border rounded-md py-7 font-bold uppercase tracking-widest text-[11px] flex gap-3 hover:bg-foreground hover:text-background transition-all"
    >
      {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
