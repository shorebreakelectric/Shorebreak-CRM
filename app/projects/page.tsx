"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { StageBadge, TypeBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MilestoneTracker } from "@/components/ui/MilestoneTracker";
import { projects as allProjects } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Project, ProjectStage } from "@/lib/types";
import {
  Sun, MapPin, Calendar,
  LayoutGrid, List, Filter, ArrowUpDown, FileText,
  CheckSquare, DollarSign,
} from "lucide-react";

const stages: { key: ProjectStage; label: string; color: string; bg: string }[] = [
  { key: "lead",             label: "Lead",            color: "#3b82f6", bg: "#eff6ff" },
  { key: "proposal",         label: "Proposal",        color: "#d97706", bg: "#fffbeb" },
  { key: "site-assessment",  label: "Site Assessment", color: "#7c3aed", bg: "#f5f3ff" },
  { key: "engineering",      label: "Engineering",     color: "#db2777", bg: "#fdf2f8" },
  { key: "permitting",       label: "Permitting",      color: "#ea580c", bg: "#fff7ed" },
  { key: "installation",     label: "Installation",    color: "#16a34a", bg: "#f0fdf4" },
  { key: "inspection",       label: "Inspection",      color: "#0891b2", bg: "#ecfeff" },
  { key: "complete",         label: "Complete",        color: "#059669", bg: "#ecfdf5" },
];

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const completedTasks = project.tasks.filter(t => t.completed).length;
  const totalTasks = project.tasks.length;
  const track = project.type === "electrical" ? "electrical" : "solar";
  const currentStage = project.stage.replace("-", " ");

  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="kanban-card bg-white rounded-xl border border-slate-200 p-4 shadow-sm transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-slate-400">{project.projectNumber}</span>
        <TypeBadge type={project.type} />
      </div>

      <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1">{project.title}</h3>

      <div className="flex items-center gap-1 mb-2">
        <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
        <p className="text-xs text-slate-400 truncate">{project.address.split(",")[0]}</p>
      </div>

      {/* Compact milestone tracker */}
      <div onClick={e => e.stopPropagation()}>
        <MilestoneTracker
          track={track}
          currentStage={currentStage}
          compact
          readonly
        />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap mt-1">
        {project.value > 0 && (
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <DollarSign className="w-3 h-3" />
            {formatCurrency(project.value)}
          </span>
        )}
        {project.systemSize && (
          <span className="flex items-center gap-1 text-amber-600">
            <Sun className="w-3 h-3" />
            {project.systemSize}kW
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(project.targetDate)}</span>
        </div>
        {totalTasks > 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${completedTasks === totalTasks ? "text-emerald-500" : "text-slate-400"}`}>
            <CheckSquare className="w-3 h-3" />
            {completedTasks}/{totalTasks}
          </div>
        )}
        {project.permits.some(p => p.status === "pending" || p.status === "submitted") && (
          <div className="flex items-center gap-1 text-xs text-orange-500">
            <FileText className="w-3 h-3" />
            <span>Permits</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100">
      <td className="px-4 py-3">
        <div>
          <p className="text-xs font-mono text-slate-400 mb-0.5">{project.projectNumber}</p>
          <p className="text-sm font-semibold text-slate-800">{project.title}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            {project.address}
          </p>
        </div>
      </td>
      <td className="px-4 py-3"><StageBadge stage={project.stage} /></td>
      <td className="px-4 py-3"><TypeBadge type={project.type} /></td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{project.value > 0 ? formatCurrency(project.value) : "—"}</td>
      <td className="px-4 py-3">
        <ProgressBar value={project.progress} showLabel />
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(project.targetDate)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
          ${project.priority === "high" ? "bg-red-100 text-red-600" :
            project.priority === "medium" ? "bg-amber-100 text-amber-600" :
            "bg-slate-100 text-slate-500"}`}>
          {project.priority}
        </span>
      </td>
    </tr>
  );
}

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filter, setFilter] = useState<"all" | ProjectStage>("all");

  const filtered = filter === "all" ? allProjects : allProjects.filter(p => p.stage === filter);

  const totalValue = allProjects.filter(p => p.stage !== "complete").reduce((s, p) => s + p.value, 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Projects"
        subtitle={`${allProjects.length} total · ${formatCurrency(totalValue)} in pipeline`}
        action={{ label: "New Project", onClick: () => {} }}
      />

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${view === "kanban" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
          <button onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${view === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            <List className="w-4 h-4" /> List
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowUpDown className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        {view === "kanban" ? (
          /* Kanban Board */
          <div className="flex gap-3 h-full min-w-max pb-4">
            {stages.map(stage => {
              const stageProjects = allProjects.filter(p => p.stage === stage.key);
              const stageValue = stageProjects.reduce((s, p) => s + p.value, 0);
              return (
                <div key={stage.key} className="flex flex-col w-72 shrink-0">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
                    <span className="text-sm font-semibold text-slate-700">{stage.label}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 ml-auto">
                      {stageProjects.length}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-xs text-slate-400 mb-2 px-1">{formatCurrency(stageValue)}</p>
                  )}
                  {/* Cards */}
                  <div
                    className="flex-1 rounded-xl p-2 space-y-2 min-h-32"
                    style={{ background: stage.bg }}
                  >
                    {stageProjects.map(p => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                    {stageProjects.length === 0 && (
                      <div className="flex items-center justify-center h-24 text-xs text-slate-300">
                        No projects
                      </div>
                    )}
                    <button className="w-full text-xs text-slate-400 hover:text-slate-600 py-2 flex items-center justify-center gap-1 hover:bg-white/50 rounded-lg transition-colors">
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stage</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">Progress</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Due</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => <ProjectRow key={p.id} project={p} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
