"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { projects } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  FileText, Image, Film, Archive, FolderOpen, Folder,
  Upload, Search, Grid3X3, List, RefreshCw, ExternalLink,
  Download, MoreHorizontal, Plus, ChevronRight,
} from "lucide-react";

const driveFiles = [
  { id: "d1", name: "Chen Residence — Site Survey.pdf", type: "pdf", size: 2400000, project: "SBE-2026-041", modified: "2026-03-05", driveUrl: "#" },
  { id: "d2", name: "Chen Residence — System Design v2.pdf", type: "pdf", size: 5100000, project: "SBE-2026-041", modified: "2026-03-15", driveUrl: "#" },
  { id: "d3", name: "Sunrise Surf — Structural Report.pdf", type: "pdf", size: 8700000, project: "SBE-2026-038", modified: "2026-03-28", driveUrl: "#" },
  { id: "d4", name: "Sunrise Surf — Permit Application Package.pdf", type: "pdf", size: 12400000, project: "SBE-2026-038", modified: "2026-04-01", driveUrl: "#" },
  { id: "d5", name: "Sandoval — Roof Photos.zip", type: "archive", size: 34000000, project: "SBE-2026-044", modified: "2026-04-22", driveUrl: "#" },
  { id: "d6", name: "Coastal Brew — Site Photos.jpg", type: "image", size: 4100000, project: "SBE-2026-042", modified: "2026-04-29", driveUrl: "#" },
  { id: "d7", name: "Pacific View HOA — Proposal Phase 1.pdf", type: "pdf", size: 2900000, project: "SBE-2026-039", modified: "2026-04-22", driveUrl: "#" },
  { id: "d8", name: "Pacific View HOA — Panel Upgrade Drawings.pdf", type: "pdf", size: 6200000, project: "SBE-2026-046", modified: "2026-03-10", driveUrl: "#" },
  { id: "d9", name: "Thompson — Final Inspection Report.pdf", type: "pdf", size: 1800000, project: "SBE-2026-035", modified: "2026-03-10", driveUrl: "#" },
  { id: "d10", name: "Thompson — As-Built Drawings.pdf", type: "pdf", size: 3400000, project: "SBE-2026-035", modified: "2026-03-10", driveUrl: "#" },
  { id: "d11", name: "Shorebreak — Contract Template 2026.docx", type: "doc", size: 840000, project: null, modified: "2026-01-15", driveUrl: "#" },
  { id: "d12", name: "Interconnection Guide — SDG&E.pdf", type: "pdf", size: 2100000, project: null, modified: "2026-02-01", driveUrl: "#" },
];

const driveFolders = [
  { id: "f1", name: "Active Projects", count: 8 },
  { id: "f2", name: "Completed Projects", count: 12 },
  { id: "f3", name: "Permits & Approvals", count: 24 },
  { id: "f4", name: "Proposals & Quotes", count: 17 },
  { id: "f5", name: "Templates", count: 6 },
  { id: "f6", name: "Training & Compliance", count: 9 },
];

function fileIcon(type: string) {
  const cls = "w-8 h-8 shrink-0";
  switch (type) {
    case "pdf": return <FileText className={`${cls} text-red-500`} />;
    case "image": return <Image className={`${cls} text-blue-500`} />;
    case "video": return <Film className={`${cls} text-purple-500`} />;
    case "archive": return <Archive className={`${cls} text-amber-500`} />;
    default: return <FileText className={`${cls} text-slate-400`} />;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  const filtered = driveFiles.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === "all" || f.project === projectFilter;
    return matchSearch && matchProject;
  });

  return (
    <div className="flex flex-col h-full">
      <Header title="Drive" subtitle="Synced with Google Drive" googleSync />

      {/* Drive sync banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-3 text-sm text-slate-600">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78">
          <path fill="#0066da" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/>
          <path fill="#00ac47" d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 00-1.2 4.5h27.5z"/>
          <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z"/>
          <path fill="#00832d" d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"/>
          <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
          <path fill="#ffba00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
        </svg>
        <span>Google Drive connected — files sync automatically. <span className="text-blue-600 cursor-pointer hover:underline">Open Drive</span></span>
        <button className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium text-xs">
          <RefreshCw className="w-3 h-3" /> Sync
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Folder sidebar */}
        <div className="w-56 shrink-0 border-r border-slate-200 bg-white p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 mb-2">Folders</p>
          {driveFolders.map(f => (
            <button key={f.id}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="flex-1 text-left truncate">{f.name}</span>
              <span className="text-xs text-slate-400">{f.count}</span>
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">Quick Access</p>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <FileText className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-left truncate">Recent PDFs</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Image className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-left truncate">Site Photos</span>
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search files..."
                className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
              />
            </div>

            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white outline-none"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.projectNumber} value={p.projectNumber}>{p.projectNumber}</option>
              ))}
            </select>

            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 ml-auto">
              <button onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>

          {view === "list" ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Modified</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(file => (
                    <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {fileIcon(file.type)}
                          <span className="text-sm font-medium text-slate-800">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {file.project
                          ? <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{file.project}</span>
                          : <span className="text-xs text-slate-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatSize(file.size)}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{formatDate(file.modified)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Open in Drive">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Download">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(file => (
                <div key={file.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
                  <div className="flex justify-center mb-3">
                    {fileIcon(file.type)}
                  </div>
                  <p className="text-xs font-medium text-slate-700 text-center truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-slate-400 text-center mt-1">{formatSize(file.size)}</p>
                  <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400"><ExternalLink className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
