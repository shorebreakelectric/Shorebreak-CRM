"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { projects as allProjects } from "@/lib/mock-data";
import { MilestoneTracker, getMilestones, type MilestoneTrack } from "@/components/ui/MilestoneTracker";
import { StageBadge, TypeBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, MapPin, DollarSign, Sun, Calendar, User,
  CheckSquare, FileText, CheckCircle2, Circle, Tag,
} from "lucide-react";
import type { Project } from "@/lib/types";

const permitStatusStyle = {
  pending:   "bg-slate-100 text-slate-500",
  submitted: "bg-amber-100 text-amber-700",
  approved:  "bg-green-100 text-green-700",
  rejected:  "bg-red-100 text-red-700",
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const original = allProjects.find(p => p.id === id);
  const [project, setProject] = useState<Project | null>(original ?? null);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Project not found.
      </div>
    );
  }

  const track: MilestoneTrack =
    project.type === "electrical" ? "electrical" : "solar";

  const milestones = getMilestones(track);

  const handleStageChange = (milestone: string) => {
    const progress = Math.round(
      (milestones.indexOf(milestone) / (milestones.length - 1)) * 100
    );
    setProject(prev => prev ? { ...prev, currentStage: milestone, progress } : prev);
  };

  const toggleTask = (taskId: string) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
  };

  const currentStage = (project as Project & { currentStage?: string }).currentStage
    ?? project.stage.replace("-", " ");

  const completedTasks = project.tasks.filter(t => t.completed).length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono text-slate-400">{project.projectNumber}</span>
              <TypeBadge type={project.type} />
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                ${project.priority === "high" ? "bg-red-100 text-red-600" :
                  project.priority === "medium" ? "bg-amber-100 text-amber-600" :
                  "bg-slate-100 text-slate-500"}`}>
                {project.priority} priority
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {project.address}
            </p>
          </div>
          <div className="text-right">
            {project.value > 0 && (
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(project.value)}</p>
            )}
            {project.systemSize && (
              <p className="text-sm text-amber-600 flex items-center gap-1 justify-end mt-0.5">
                <Sun className="w-3.5 h-3.5" /> {project.systemSize} kW system
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-4xl w-full mx-auto">

        {/* Milestone Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Project Milestones</h2>
            <span className="text-xs text-slate-400 capitalize">
              {track === "electrical" ? "Electrical track" : "Solar track"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-5">Click a milestone to update the project stage</p>
          <MilestoneTracker
            track={track}
            currentStage={currentStage}
            onStageChange={handleStageChange}
          />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <ProgressBar value={project.progress} size="md" showLabel color="orange" />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Details</h2>
            <div className="space-y-3">
              {[
                { icon: <User className="w-4 h-4 text-slate-400" />, label: "Assigned to", value: project.assignedTo },
                { icon: <Calendar className="w-4 h-4 text-slate-400" />, label: "Start date", value: formatDate(project.startDate) },
                { icon: <Calendar className="w-4 h-4 text-slate-400" />, label: "Target date", value: formatDate(project.targetDate) },
                project.completedDate ? { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, label: "Completed", value: formatDate(project.completedDate) } : null,
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item!.icon}
                  <span className="text-sm text-slate-500 w-24 shrink-0">{item!.label}</span>
                  <span className="text-sm font-medium text-slate-700">{item!.value}</span>
                </div>
              ))}
            </div>

            {project.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Permits */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Permits</h2>
            {project.permits.length === 0 ? (
              <p className="text-sm text-slate-400">No permits added yet</p>
            ) : (
              <div className="space-y-2">
                {project.permits.map(permit => (
                  <div key={permit.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{permit.type}</p>
                        {permit.number && (
                          <p className="text-xs text-slate-400 font-mono">{permit.number}</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${permitStatusStyle[permit.status]}`}>
                      {permit.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tasks */}
        {project.tasks.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Tasks</h2>
              <span className="text-xs text-slate-400">{completedTasks}/{project.tasks.length} complete</span>
            </div>
            <div className="space-y-2">
              {project.tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  {task.completed
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    : <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  }
                  <span className={`text-sm flex-1 ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {task.title}
                  </span>
                  {task.dueDate && !task.completed && (
                    <span className="text-xs text-slate-400 shrink-0">{formatDate(task.dueDate)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {project.notes && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Notes</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{project.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
