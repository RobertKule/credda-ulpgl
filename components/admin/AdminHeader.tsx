// components/admin/AdminHeader.tsx
"use client";

interface AdminHeaderProps {
  locale: string;
}

export default function AdminHeader({ locale }: AdminHeaderProps) {
  return (
    <header className="lg:hidden bg-background border-b border-border px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            id="menu-button"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Menu"
            onClick={() => {
              const event = new CustomEvent('toggle-sidebar');
              window.dispatchEvent(event);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-serif font-bold text-foreground">CREDDA Admin</span>
          </div>
        </div>
        
        <div className="bg-emerald-500/5 text-emerald-500 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
          🔒 Sécurisé
        </div>
      </div>
    </header>
  );
}