"use client";

import { Header } from "@/components/layout/Header";
import { Card, StatCard } from "@/components/ui/Card";
import { StageBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, Folder, Zap, Sun, TrendingUp, CalendarDays,
  AlertCircle, CheckCircle2, Clock, MapPin,
} from "lucide-react";
import { dashboardStats, monthlyRevenue, pipelineByStage, projects, calendarEvents } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const PIE_COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#22c55e"];

const urgentProjects = projects
  .filter(p => p.stage !== "complete" && p.priority === "high")
  .slice(0, 4);

const upcomingEvents = calendarEvents
  .filter(e => new Date(e.start) >= new Date("2026-05-05"))
  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  .slice(0, 5);

const eventTypeIcon: Record<string, React.ReactNode> = {
  installation: <Zap className="w-4 h-4 text-green-500" />,
  inspection:   <CheckCircle2 className="w-4 h-4 text-cyan-500" />,
  assessment:   <Sun className="w-4 h-4 text-amber-500" />,
  meeting:      <CalendarDays className="w-4 h-4 text-blue-500" />,
  other:        <Clock className="w-4 h-4 text-slate-400" />,
};

function formatEventTime(start: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(start));
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back, Jake — here's your overview for May 2026"
        googleSync
      />

      <div className="p-6 space-y-6 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pipeline Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            change={dashboardStats.revenueChange}
            icon={<DollarSign className="w-5 h-5 text-orange-500" />}
            iconBg="bg-orange-50"
          />
          <StatCard
            title="Active Projects"
            value={dashboardStats.activeProjects}
            change={dashboardStats.activeProjectsChange}
            subtitle={`${dashboardStats.pendingInstalls} pending installs`}
            icon={<Folder className="w-5 h-5 text-blue-500" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Completed This Month"
            value={dashboardStats.completedThisMonth}
            change={dashboardStats.completedChange}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="kW Installed (YTD)"
            value={`${dashboardStats.installedKW} kW`}
            icon={<Sun className="w-5 h-5 text-amber-500" />}
            iconBg="bg-amber-50"
            subtitle={`${dashboardStats.leadsThisMonth} new leads this month`}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue trend */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 6 months — billed & contracted</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +18.4%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5}
                  fill="url(#revGrad)" dot={{ fill: "#f97316", r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Pipeline by stage */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-1">Pipeline by Stage</h3>
            <p className="text-xs text-slate-400 mb-4">Project count per stage</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pipelineByStage} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="count" nameKey="stage" paddingAngle={2}>
                  {pipelineByStage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v, _name, props) => [
                    `${v} project${Number(v) !== 1 ? "s" : ""}`,
                    (props.payload as { stage?: string })?.stage
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Urgent projects */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">High-Priority Projects</h3>
              <a href="/projects" className="text-xs text-orange-500 hover:text-orange-600 font-medium">View all →</a>
            </div>
            <div className="space-y-3">
              {urgentProjects.map(p => (
                <a key={p.id} href={`/projects`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{p.projectNumber}</span>
                      <StageBadge stage={p.stage} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                      <p className="text-xs text-slate-400 truncate">{p.address}</p>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={p.progress} showLabel />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{formatCurrency(p.value)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Due {formatDate(p.targetDate)}</p>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          {/* Upcoming events */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Upcoming Events</h3>
              <a href="/calendar" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Open Calendar →</a>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-slate-50 shrink-0">
                    {eventTypeIcon[ev.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ev.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatEventTime(ev.start)}</p>
                    {ev.location && (
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                      ${ev.type === "installation" ? "bg-green-100 text-green-700" :
                        ev.type === "inspection" ? "bg-cyan-100 text-cyan-700" :
                        ev.type === "assessment" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"}`}>
                      {ev.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
