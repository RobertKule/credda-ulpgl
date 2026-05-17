"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { m as motion } from "framer-motion";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background md:bg-muted/10 relative overflow-hidden selection:bg-primary/30 font-outfit transition-colors duration-700">
      
      {/* Extremely subtle minimal background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 w-full flex justify-center px-4 py-8">
        <LoginForm />
      </div>
      
    </div>
  );
}