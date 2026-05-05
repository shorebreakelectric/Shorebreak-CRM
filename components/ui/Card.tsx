import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        hover && "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, changeLabel, icon, iconBg = "bg-orange-100", subtitle }: StatCardProps) {
  const positive = change !== undefined && change >= 0;
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className={cn("p-2.5 rounded-xl shrink-0", iconBg)}>
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span className={cn("font-semibold", positive ? "text-emerald-600" : "text-red-500")}>
              {positive ? "+" : ""}{change}%
            </span>
            <span className="text-slate-400">{changeLabel || "vs last month"}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
