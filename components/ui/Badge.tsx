import { cn } from "@/lib/utils";
import type { ProjectStage, ProjectType } from "@/lib/types";

const stageConfig: Record<ProjectStage, { label: string; className: string }> = {
  lead:            { label: "Lead",           className: "bg-blue-100 text-blue-700" },
  proposal:        { label: "Proposal",       className: "bg-amber-100 text-amber-700" },
  "site-assessment": { label: "Site Assessment", className: "bg-purple-100 text-purple-700" },
  engineering:     { label: "Engineering",    className: "bg-pink-100 text-pink-700" },
  permitting:      { label: "Permitting",     className: "bg-orange-100 text-orange-700" },
  installation:    { label: "Installation",   className: "bg-green-100 text-green-700" },
  inspection:      { label: "Inspection",     className: "bg-cyan-100 text-cyan-700" },
  complete:        { label: "Complete",       className: "bg-emerald-100 text-emerald-700" },
};

const typeConfig: Record<ProjectType, { label: string; className: string }> = {
  solar:            { label: "Solar",          className: "bg-yellow-100 text-yellow-700" },
  electrical:       { label: "Electrical",     className: "bg-blue-100 text-blue-700" },
  "solar+electrical": { label: "Solar + Electric", className: "bg-violet-100 text-violet-700" },
  maintenance:      { label: "Maintenance",    className: "bg-slate-100 text-slate-600" },
};

interface StageBadgeProps { stage: ProjectStage; className?: string }
export function StageBadge({ stage, className }: StageBadgeProps) {
  const cfg = stageConfig[stage];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", cfg.className, className)}>
      {cfg.label}
    </span>
  );
}

interface TypeBadgeProps { type: ProjectType; className?: string }
export function TypeBadge({ type, className }: TypeBadgeProps) {
  const cfg = typeConfig[type];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", cfg.className, className)}>
      {cfg.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}
const variantMap = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger:  "bg-red-100 text-red-700",
  info:    "bg-blue-100 text-blue-700",
  muted:   "bg-slate-100 text-slate-500",
};
export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", variantMap[variant], className)}>
      {children}
    </span>
  );
}
