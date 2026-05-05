"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  Mail,
  HardDrive,
  Zap,
  Sun,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/inbox", label: "Inbox", icon: Mail, badge: 3 },
  { href: "/files", label: "Drive", icon: HardDrive },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-slate-900 text-slate-100 transition-all duration-300 z-40 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-slate-800", collapsed && "px-3 justify-center")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 shrink-0">
          <Sun className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight text-white truncate">Shorebreak</p>
            <p className="text-xs text-orange-400 font-medium leading-tight">Electric & Solar</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group",
                active
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {badge && !collapsed && (
                <span className="ml-auto bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {badge}
                </span>
              )}
              {badge && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              )}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-2 space-y-1">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors group relative"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
              Settings
            </span>
          )}
        </Link>

        {/* User */}
        <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", collapsed && "justify-center")}>
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">JM</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">Jake Mercer</p>
              <p className="text-xs text-slate-500 truncate">Project Manager</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
