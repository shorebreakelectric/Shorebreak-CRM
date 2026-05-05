import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "orange" | "blue" | "green" | "purple";
  size?: "sm" | "md";
  showLabel?: boolean;
}

const colorMap = {
  orange: "bg-orange-500",
  blue:   "bg-blue-500",
  green:  "bg-emerald-500",
  purple: "bg-violet-500",
};

export function ProgressBar({ value, max = 100, className, color = "orange", size = "sm", showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 bg-slate-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5")}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-slate-500 shrink-0 w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
