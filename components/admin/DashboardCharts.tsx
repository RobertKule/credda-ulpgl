"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { useTheme } from "@/components/shared/ThemeProvider";

const data = [
  { name: "Jan", total: 400 },
  { name: "Feb", total: 300 },
  { name: "Mar", total: 600 },
  { name: "Apr", total: 800 },
  { name: "May", total: 500 },
  { name: "Jun", total: 900 },
  { name: "Jul", total: 1000 },
];

const pieData = [
  { name: "Articles", value: 45, color: "#2563eb" },
  { name: "Publications", value: 25, color: "#10b981" },
  { name: "Médias", value: 20, color: "#f59e0b" },
  { name: "Membres", value: 10, color: "#64748b" },
];

export default function DashboardCharts() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Graphique d'Évolution (Area Chart) */}
      <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-3xl shadow-sm transition-colors duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Évolution de l'Audience</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Données consolidées • 7 derniers mois</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-md" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Croissance</span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
                  backgroundColor: isDark ? "#0f172a" : "#fff", 
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#2563eb" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition des Contenus (Pie Chart) */}
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-3xl shadow-sm transition-colors duration-500 flex flex-col">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">Structure des Données</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Répartition par catégorie</p>

        <div className="h-[220px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#0f172a" : "#fff", 
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  borderRadius: "12px" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Total</span>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
           {pieData.map((item) => (
             <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-md" style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">{item.value}%</span>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
