"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

const data = [
  { name: 'Jan', articles: 4, messages: 12 },
  { name: 'Feb', articles: 7, messages: 18 },
  { name: 'Mar', articles: 5, messages: 24 },
  { name: 'Apr', articles: 12, messages: 15 },
  { name: 'May', articles: 8, messages: 30 },
  { name: 'Jun', articles: 15, messages: 45 },
];

const distributionData = [
  { name: 'Recherche', value: 45 },
  { name: 'Clinique', value: 30 },
  { name: 'Programmes', value: 25 },
];

const COLORS = ['#2563eb', '#10b981', '#0f172a'];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-10">
      {/* Article Growth Chart */}
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
              <h3 className="text-xl font-serif font-black uppercase tracking-tighter">Croissance</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Articles & Publications / 6 mois</p>
           </div>
           <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        </div>
        
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="articles" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorArticles)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Pie Chart */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[100px] rounded-full" />
         
         <div className="flex items-center justify-between mb-8 relative z-10">
           <div className="space-y-1">
              <h3 className="text-xl font-serif font-black uppercase tracking-tighter">Répartition</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Domaines d'activité</p>
           </div>
           <div className="flex gap-1">
             <div className="w-1 h-4 bg-white/20 rounded-full" />
             <div className="w-1 h-3 bg-blue-500 rounded-full" />
             <div className="w-1 h-5 bg-white/20 rounded-full" />
           </div>
        </div>

        <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <span className="text-3xl font-serif font-black">100%</span>
               <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Global</p>
            </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-4">
          {distributionData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
