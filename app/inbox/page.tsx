"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { emailThreads } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import {
  Search, Star, StarOff, Mail, MailOpen, Inbox, Tag,
  RefreshCw, Pencil, Send, Archive, Trash2,
  ChevronDown, Circle,
} from "lucide-react";

const labelColors: Record<string, string> = {
  project:        "bg-blue-100 text-blue-700",
  installation:   "bg-green-100 text-green-700",
  permitting:     "bg-orange-100 text-orange-700",
  "internal":     "bg-slate-100 text-slate-600",
  lead:           "bg-violet-100 text-violet-700",
  inquiry:        "bg-pink-100 text-pink-700",
  inspection:     "bg-cyan-100 text-cyan-700",
  referral:       "bg-amber-100 text-amber-700",
  utility:        "bg-red-100 text-red-700",
  interconnection:"bg-red-100 text-red-700",
  assessment:     "bg-purple-100 text-purple-700",
};

const folders = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 3 },
  { id: "starred", label: "Starred", icon: Star, count: 3 },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: Pencil },
  { id: "archive", label: "Archive", icon: Archive },
];

const labelList = ["project", "installation", "permitting", "lead", "inspection", "referral", "utility"];

export default function InboxPage() {
  const [selected, setSelected] = useState<string | null>(emailThreads[0]?.id || null);
  const [folder, setFolder] = useState("inbox");
  const [search, setSearch] = useState("");

  const filtered = emailThreads.filter(t => {
    if (folder === "starred") return t.starred;
    const matchSearch = !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.snippet.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const selectedThread = emailThreads.find(t => t.id === selected);

  return (
    <div className="flex flex-col h-full">
      <Header title="Inbox" subtitle="Connected to Gmail" googleSync />

      {/* Gmail sync banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-3 text-sm text-slate-600">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
        <span>Gmail connected — showing project-related threads. <span className="text-blue-600 cursor-pointer hover:underline">View all in Gmail</span></span>
        <button className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium text-xs">
          <RefreshCw className="w-3 h-3" /> Sync now
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Folder sidebar */}
        <div className="w-48 shrink-0 border-r border-slate-200 bg-white p-3 space-y-0.5">
          {folders.map(f => (
            <button key={f.id} onClick={() => setFolder(f.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                ${folder === f.id ? "bg-orange-50 text-orange-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
              <f.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{f.label}</span>
              {f.count && (
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center
                  ${folder === f.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">Labels</p>
            {labelList.map(label => (
              <button key={label} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors capitalize">
                <div className={`w-2 h-2 rounded-full ${labelColors[label]?.split(" ")[0] || "bg-slate-300"}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div className="w-80 shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search mail..."
                className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(thread => (
              <button
                key={thread.id}
                onClick={() => setSelected(thread.id)}
                className={`w-full text-left p-4 hover:bg-white transition-colors ${selected === thread.id ? "bg-white border-l-2 border-orange-500" : ""}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center gap-1.5 pt-0.5">
                    {thread.unread
                      ? <Circle className="w-2 h-2 text-orange-500 fill-orange-500 shrink-0" />
                      : <div className="w-2 h-2 shrink-0" />
                    }
                    {thread.starred
                      ? <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                      : <Star className="w-3 h-3 text-slate-200 shrink-0" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className={`text-sm truncate ${thread.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                        {thread.from}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">{formatRelativeTime(thread.date)}</span>
                    </div>
                    <p className={`text-xs truncate mb-1 ${thread.unread ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                      {thread.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{thread.snippet}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {thread.labels.slice(0, 2).map(l => (
                        <span key={l} className={`text-xs px-1.5 py-0.5 rounded-md font-medium capitalize ${labelColors[l] || "bg-slate-100 text-slate-500"}`}>
                          {l}
                        </span>
                      ))}
                      {thread.messageCount > 1 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">{thread.messageCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread detail */}
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedThread ? (
            <div className="p-6">
              {/* Thread header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedThread.subject}</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedThread.labels.map(l => (
                      <span key={l} className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${labelColors[l] || "bg-slate-100 text-slate-500"}`}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">
                        {selectedThread.from.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedThread.from}</p>
                      <p className="text-xs text-slate-400">&lt;{selectedThread.fromEmail}&gt;</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selectedThread.date))}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <p className="leading-relaxed">{selectedThread.snippet}</p>
                  <p className="leading-relaxed mt-3 text-slate-500">
                    [This is a preview. Connect your Gmail account to view the full email thread and reply directly from Shorebreak CRM.]
                  </p>
                </div>
              </div>

              {/* Link to project/customer */}
              {(selectedThread.projectId || selectedThread.customerId) && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-xs font-semibold text-orange-700 mb-2">Linked Records</p>
                  <div className="flex gap-3 flex-wrap">
                    {selectedThread.projectId && (
                      <a href="/projects" className="text-xs text-orange-600 hover:text-orange-800 underline font-medium">
                        → View Project
                      </a>
                    )}
                    {selectedThread.customerId && (
                      <a href="/customers" className="text-xs text-orange-600 hover:text-orange-800 underline font-medium">
                        → View Customer
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Reply box */}
              <div className="mt-6 border border-slate-200 rounded-xl">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-xs text-slate-400">Reply to {selectedThread.fromEmail}</p>
                </div>
                <textarea
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full p-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none"
                />
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 transition-colors"><Tag className="w-4 h-4" /></button>
                  </div>
                  <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                    <Send className="w-4 h-4" /> Send via Gmail
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Mail className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a thread to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
