"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { useTheme } from "@/components/shared/ThemeProvider";

interface DashboardChartsProps {
  areaData: { name: string; research: number; clinical: number }[];
  pieData: { name: string; value: number; color: string }[];
}

export default function DashboardCharts({ areaData, pieData }: DashboardChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fallback data if empty
  const displayAreaData = areaData?.length > 0 ? areaData : [
    { name: "Jan", research: 0, clinical: 0 },
    { name: "Feb", research: 0, clinical: 0 },
    { name: "Mar", research: 0, clinical: 0 },
  ];

  const displayPieData = pieData?.length > 0 ? pieData : [
    { name: "No Data", value: 100, color: "#cbd5e1" }
  ];

  const totalValue = pieData?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Graphique d'Évolution (Area Chart) */}
      <div className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm transition-colors duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Évolution du Contenu</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Données réelles • 7 derniers mois</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-md shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recherche</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-md shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clinique</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayAreaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClinical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? "#475569" : "#94a3b8" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? "#475569" : "#94a3b8" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "hsl(var(--card))" : "#fff", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="research" 
                stroke="var(--primary)" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorResearch)" 
              />
              <Area 
                type="monotone" 
                dataKey="clinical" 
                stroke="#3B82F6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorClinical)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition des Contenus (Pie Chart) */}
      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm transition-colors duration-500 flex flex-col">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Structure du Hub</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">Répartition des ressources</p>

        <div className="h-[220px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {displayPieData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color === "#C9A84C" ? "var(--primary)" : entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "hsl(var(--card))" : "#fff", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-black text-foreground">{totalValue}</span>
             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Items</span>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-6 border-t border-border">
           {displayPieData.map((item) => (
             <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-md" style={{ backgroundColor: item.color === "#C9A84C" ? "var(--primary)" : item.color }} />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-foreground">
                  {totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0}%
                </span>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
