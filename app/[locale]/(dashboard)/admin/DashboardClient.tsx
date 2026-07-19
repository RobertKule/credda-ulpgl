"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  FileText,
  Scale,
  Users,
  Image as ImageIcon,
  PenTool,
  Camera,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  History,
  AlertTriangle,
  ChevronRight
} from "lucide-react";


interface Props {
  kpis: {
    publications: { value: number; trend: string };
    cases: { value: number; trend: string };
    members: { value: number; trend: string };
    media: { value: number; trend: string };
  };
  caseStatusBreakdown: {
    pending: number;
    inProgress: number;
    resolved: number;
  };
  recentLogs: Array<{
    action: string;
    entity: string;
    timestamp: string;
    userName: string;
  }>;
  monthlyArticles: Array<{ month: string; count: number }>;
  monthlyCases: Array<{ month: string; count: number }>;
  monthlyGallery: Array<{ month: string; count: number }>;
  userRole: string;
  locale: string;
}

// Stagger Animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } }
} as const;

// ─── Custom Interactive SVG Doughnut Chart ───────────────────────────
function StatusDoughnutChart({ 
  pending, 
  inProgress, 
  resolved, 
  labels 
}: { 
  pending: number; 
  inProgress: number; 
  resolved: number; 
  labels: { pending: string; inProgress: string; resolved: string; total: string }
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = pending + inProgress + resolved;
  const segments = [
    { value: pending,    color: "#D4AF37", label: labels.pending },    // Gold — En attente
    { value: inProgress, color: "#1A7A3B", label: labels.inProgress }, // Forest Green — En cours
    { value: resolved,   color: "#166534", label: labels.resolved }    // Deep Green — Résolus
  ];

  const radius = 38;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const cx = 50;
  const cy = 50;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
          {/* Base Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-zinc-800"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {segments.map((seg, i) => {
            if (seg.value === 0 || total === 0) return null;
            const percent = seg.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPercent * circumference);
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === i;

            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: isHovered ? 1.04 : 1,
                }}
                style={{ originX: "50px", originY: "50px" }}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
            {hoveredIndex !== null ? segments[hoveredIndex].value : total}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mt-1">
            {hoveredIndex !== null ? segments[hoveredIndex].label : labels.total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        {segments.map((seg, i) => (
          <div 
            key={i} 
            className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
              hoveredIndex === i 
                ? "bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700" 
                : "border-transparent"
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider truncate max-w-[60px]">
                {seg.label}
              </span>
            </div>
            <span className="text-sm font-black text-slate-800 dark:text-zinc-200 mt-0.5 tabular-nums">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Custom Interactive SVG Bezier Plot Chart ───────────────────────
function DynamicPlotChart({ 
  data, 
  color = "#166534", 
  noDataLabel 
}: { 
  data: Array<{ month: string; count: number }>; 
  color?: string;
  noDataLabel: string;
}) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 dark:text-zinc-600 text-xs font-bold italic">
        {noDataLabel}
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.count), 1);
  const W = 600, H = 200, PADDING_X = 40, PADDING_Y = 20;
  const GAP = (W - PADDING_X * 2) / (data.length - 1 || 1);

  // Map coordinates
  const points = data.map((d, i) => ({
    x: PADDING_X + i * GAP,
    y: H - PADDING_Y - (d.count / max) * (H - PADDING_Y * 2),
    value: d.count,
    month: d.month
  }));

  // Path generator (Bezier curves)
  const getPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const lineD = getPath(points);
  const areaD = lineD + ` L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full overflow-visible" aria-label="Evolution plot chart">
        <defs>
          <linearGradient id="dynamicGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((v, i) => {
          const y = H - PADDING_Y - v * (H - PADDING_Y * 2);
          return (
            <line
              key={i}
              x1={PADDING_X}
              y1={y}
              x2={W - PADDING_X}
              y2={y}
              className="stroke-slate-100 dark:stroke-zinc-800/80"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Gradient Area Fill */}
        <motion.path
          d={areaD}
          fill="url(#dynamicGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Smooth Bezier Line */}
        <motion.path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Data points */}
        {points.map((p, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Invisible interactive zone */}
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
              
              {/* Point Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 7 : 4.5}
                fill="#ffffff"
                stroke={color}
                strokeWidth={isHovered ? 4 : 2.5}
                className="transition-all duration-200"
              />

              {/* Month label below */}
              <text
                x={p.x}
                y={H + 12}
                textAnchor="middle"
                className="fill-slate-400 dark:fill-zinc-500 text-[10px] font-black uppercase tracking-wider"
              >
                {p.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bg-slate-900/95 dark:bg-zinc-800/95 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg pointer-events-none flex flex-col items-center border border-slate-700/50"
            style={{
              left: `${(points[hoveredPoint].x / W) * 100}%`,
              top: `${(points[hoveredPoint].y / (H + 20)) * 100 - 20}%`,
              transform: "translate(-50%, -100%)"
            }}
          >
            <span className="uppercase tracking-widest text-[8px] text-slate-400 leading-none">
              {points[hoveredPoint].month}
            </span>
            <span className="text-sm font-black mt-0.5 leading-none">
              {points[hoveredPoint].value}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardClient({
  kpis,
  caseStatusBreakdown,
  recentLogs,
  monthlyArticles,
  monthlyCases,
  monthlyGallery,
  userRole,
  locale
}: Props) {
  const t = useTranslations("AdminDashboard.home");
  const router = useRouter();
  const [activeChartTab, setActiveChartTab] = useState<"publications" | "cases" | "gallery">("publications");

  // Selection list for evolution chart
  const activeChartData = 
    activeChartTab === "publications" ? monthlyArticles :
    activeChartTab === "cases" ? monthlyCases :
    monthlyGallery;

  const chartColor = 
    activeChartTab === "publications" ? "#166534" : // Forest Green — primary
    activeChartTab === "cases" ? "#1A7A3B" :         // Dark Forest Green
    "#D4AF37";                                       // Gold accent

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t("title")}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{t("subtitle")}</p>
        </div>

        {/* Display current system status */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-2xl w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            System Online
          </span>
        </div>
      </div>

      {/* ── Section 1 : KPI Cards ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* KPI 1 : Publications */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 bg-green-50 dark:bg-green-800/10 rounded-2xl text-green-800 dark:text-green-500">
                <FileText className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-800/20 py-1 px-2.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                {kpis.publications.trend}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                {kpis.publications.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
                {t("kpis.publications")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
            <button 
              onClick={() => router.push(`/${locale}/admin/publications?action=new`)}
              className="flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 transition-colors cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              {t("quick_actions.new_publication")}
            </button>
          </div>
        </motion.div>

        {/* KPI 2 : Clinical Cases */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-700 dark:text-green-400">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20 py-1 px-2.5 rounded-full uppercase tracking-wider">
                {kpis.cases.trend}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                {kpis.cases.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
                {t("kpis.cases")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
            <button 
              onClick={() => router.push(`/${locale}/admin/clinique?action=new`)}
              className="flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              {t("quick_actions.new_case")}
            </button>
          </div>
        </motion.div>

        {/* KPI 3 : Members */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-800 dark:text-green-300">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-green-800 bg-green-50 dark:text-green-300 dark:bg-green-900/20 py-1 px-2.5 rounded-full uppercase tracking-wider">
                {kpis.members.trend}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                {kpis.members.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
                {t("kpis.members")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
            <button 
              onClick={() => router.push(`/${locale}/admin/users?action=new`)}
              className="flex items-center gap-2 text-xs font-bold text-green-800 dark:text-green-300 hover:text-green-900 dark:hover:text-green-200 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {t("quick_actions.invite_researcher")}
            </button>
          </div>
        </motion.div>

        {/* KPI 4 : Media */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 rounded-2xl text-[#b8932a] dark:text-[#D4AF37]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-[#b8932a] bg-[#D4AF37]/10 dark:text-[#D4AF37] dark:bg-[#D4AF37]/10 py-1 px-2.5 rounded-full uppercase tracking-wider">
                {kpis.media.trend}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                {kpis.media.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
                {t("kpis.media")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
            <button 
              onClick={() => router.push(`/${locale}/admin/gallery?action=new`)}
              className="flex items-center gap-2 text-xs font-bold text-[#b8932a] dark:text-[#D4AF37] hover:text-[#9e7d23] dark:hover:text-[#F3CD59] transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              {t("quick_actions.add_media")}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Section 3 : Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart (2/3) : Evolution */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                6 derniers mois
              </p>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">
                {t("analytics.publications_evolution")}
              </h3>
            </div>

            {/* Toggle tabs for data evolutions */}
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200/50 dark:border-zinc-700/50 w-fit shrink-0">
              <button 
                onClick={() => setActiveChartTab("publications")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeChartTab === "publications"
                    ? "bg-white dark:bg-zinc-700 text-green-800 dark:text-green-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
                }`}
              >
                Recherche
              </button>
              <button 
                onClick={() => setActiveChartTab("cases")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeChartTab === "cases"
                    ? "bg-white dark:bg-zinc-700 text-green-700 dark:text-green-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
                }`}
              >
                Clinique
              </button>
              <button 
                onClick={() => setActiveChartTab("gallery")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeChartTab === "gallery"
                    ? "bg-white dark:bg-zinc-700 text-[#b8932a] dark:text-[#D4AF37] shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
                }`}
              >
                Médiathèque
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <DynamicPlotChart 
              data={activeChartData} 
              color={chartColor} 
              noDataLabel={t("analytics.no_data")}
            />
          </div>
        </div>

        {/* Secondary Chart (1/3) : Doughnut breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="mb-6">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              Clinique de Droit Environnemental
            </p>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">
              {t("analytics.cases_distribution")}
            </h3>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <StatusDoughnutChart 
              pending={caseStatusBreakdown.pending}
              inProgress={caseStatusBreakdown.inProgress}
              resolved={caseStatusBreakdown.resolved}
              labels={{
                pending: t("analytics.cases_statuses.pending"),
                inProgress: t("analytics.cases_statuses.in_progress"),
                resolved: t("analytics.cases_statuses.resolved"),
                total: t("analytics.cases_total")
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Section 4 : Audit Log / Recent Activity ── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl">
              <History className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t("activity.title")}
            </h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-zinc-800 py-1 px-3 rounded-full uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {recentLogs.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 gap-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest shrink-0">
                    {log.userName?.[0] || "—"}
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {userRole === "RESEARCHER" ? t("activity.you") : log.userName}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-zinc-400"> · {log.action.toLowerCase()} </span>
                    <span className="text-xs font-black text-green-700 bg-green-50 dark:bg-green-800/20 py-0.5 px-2 rounded-md uppercase tracking-wider ml-1">
                      {log.entity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0 font-medium">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-zinc-600 text-sm py-8 font-medium">
            <AlertTriangle className="w-4 h-4" />
            {t("activity.empty")}
          </div>
        )}
      </div>

    </div>
  );
}
