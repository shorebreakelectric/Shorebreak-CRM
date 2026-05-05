"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type MilestoneTrack = "solar" | "electrical" | "solar+electrical";

const solarMilestones = [
  "Lead",
  "Proposal",
  "Site Assessment",
  "Engineering",
  "Permitting",
  "Installation",
  "Inspection",
  "Complete",
];

const electricalMilestones = [
  "Quote",
  "Approval",
  "Work Performed",
  "Invoicing",
  "Review",
  "Complete",
];

export function getMilestones(track: MilestoneTrack): string[] {
  if (track === "electrical") return electricalMilestones;
  return solarMilestones;
}

interface MilestoneTrackerProps {
  track: MilestoneTrack;
  currentStage: string;
  onStageChange?: (stage: string) => void;
  readonly?: boolean;
  compact?: boolean;
}

export function MilestoneTracker({
  track,
  currentStage,
  onStageChange,
  readonly = false,
  compact = false,
}: MilestoneTrackerProps) {
  const milestones = getMilestones(track);
  const currentIndex = milestones.findIndex(
    m => m.toLowerCase() === currentStage.toLowerCase()
  );

  return (
    <div className={cn("w-full", compact ? "py-2" : "py-4")}>
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

        {/* Progress line */}
        {currentIndex >= 0 && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-orange-400 z-0 transition-all duration-500"
            style={{
              width: currentIndex === 0
                ? "0%"
                : `${(currentIndex / (milestones.length - 1)) * 100}%`,
            }}
          />
        )}

        {/* Milestone dots */}
        {milestones.map((milestone, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = !readonly && onStageChange;

          return (
            <div
              key={milestone}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <button
                onClick={() => isClickable && onStageChange(milestone)}
                disabled={readonly}
                title={milestone}
                className={cn(
                  "rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  compact ? "w-6 h-6" : "w-8 h-8",
                  isDone
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isCurrent
                    ? "bg-white border-orange-500 ring-4 ring-orange-100"
                    : "bg-white border-slate-300",
                  isClickable && !isDone && !isCurrent
                    ? "hover:border-orange-300 hover:bg-orange-50 cursor-pointer"
                    : "",
                  isClickable && isDone
                    ? "hover:bg-orange-400 cursor-pointer"
                    : "",
                  isCurrent && isClickable ? "cursor-pointer" : "",
                  readonly ? "cursor-default" : ""
                )}
              >
                {isDone && <Check className={cn(compact ? "w-3 h-3" : "w-4 h-4")} strokeWidth={3} />}
                {isCurrent && (
                  <div className={cn(
                    "rounded-full bg-orange-500",
                    compact ? "w-2 h-2" : "w-3 h-3"
                  )} />
                )}
              </button>

              {!compact && (
                <span className={cn(
                  "text-xs font-medium text-center leading-tight max-w-[64px] whitespace-normal",
                  isDone ? "text-orange-500" :
                  isCurrent ? "text-slate-900 font-semibold" :
                  "text-slate-400"
                )}>
                  {milestone}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current stage label for compact mode */}
      {compact && currentIndex >= 0 && (
        <p className="text-xs text-center text-slate-500 mt-2">
          <span className="font-semibold text-orange-500">{milestones[currentIndex]}</span>
          <span className="text-slate-400"> · Step {currentIndex + 1} of {milestones.length}</span>
        </p>
      )}
    </div>
  );
}
