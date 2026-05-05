"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import {
  FileText, Image, Film, Archive, Folder, FolderOpen,
  Upload, Search, Grid3X3, List, RefreshCw, ExternalLink,
  Download, MoreHorizontal, ChevronRight, AlertCircle, Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

interface DriveData {
  jobsFolderId?: string;
  projectFolders?: DriveFile[];
  files?: DriveFile[];
  error?: string;
}

function fileIcon(mimeType: string) {
  const cls = "w-7 h-7 shrink-0";
  if (mimeType === "application/vnd.google-apps.folder") return <Folder className={`${cls} text-amber-400`} />;
  if (mimeType === "application/pdf") return <FileText className={`${cls} text-red-500`} />;
  if (mimeType.startsWith("image/")) return <Image className={`${cls} text-blue-500`} />;
  if (mimeType.startsWith("video/")) return <Film className={`${cls} text-purple-500`} />;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return <Archive className={`${cls} text-amber-500`} />;
  return <FileText className={`${cls} text-slate-400`} />;
}

function formatSize(bytes?: string): string {
  if (!bytes) return "—";
  const n = parseInt(bytes);
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function parseProjectName(folderName: string) {
  // "OP - Flores, Justin" -> { code: "OP", name: "Flores, Justin" }
  const match = folderName.match(/^([A-Z]+)\s*-\s*(.+)$/);
  if (match) return { code: match[1], name: match[2] };
  return { code: null, name: folderName };
}

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DriveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null);
  const [folderFiles, setFolderFiles] = useState<DriveFile[]>([]);
  const [folderLoading, setFolderLoading] = useState(false);

  const loadDrive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drive/folders");
      const json = await res.json();
      setData(json);
    } catch {
      setData({ error: "Failed to connect to Google Drive" });
    } finally {
      setLoading(false);
    }
  };

  const openFolder = async (folder: DriveFile) => {
    setSelectedFolder({ id: folder.id, name: folder.name });
    setFolderLoading(true);
    try {
      const res = await fetch(`/api/drive/folders?folderId=${folder.id}`);
      const json = await res.json();
      setFolderFiles(json.files ?? []);
    } catch {
      setFolderFiles([]);
    } finally {
      setFolderLoading(false);
    }
  };

  useEffect(() => { loadDrive(); }, []);

  const displayFiles = selectedFolder ? folderFiles : (data?.files ?? []);
  const displayFolders = selectedFolder ? [] : (data?.projectFolders ?? []);

  const filtered = [...displayFolders, ...displayFiles].filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <span>
          Connected to <strong>shorebreakelectric / Shorebreak Jobs</strong>
        </span>
        <button onClick={loadDrive} className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium text-xs">
          <RefreshCw className="w-3 h-3" /> Sync
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <button
              onClick={() => { setSelectedFolder(null); setFolderFiles([]); }}
              className="hover:text-orange-500 transition-colors font-medium"
            >
              Shorebreak Jobs
            </button>
            {selectedFolder && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-800 font-semibold">{selectedFolder.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 ml-auto max-w-xs flex-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>

          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
            <button onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading your Google Drive...</span>
          </div>
        )}

        {/* Error */}
        {!loading && data?.error && (
          <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not load Drive</p>
              <p className="text-sm mt-1">{data.error}</p>
              <p className="text-sm mt-2 text-red-600">Make sure you&apos;re signed in with Google and the Drive API is enabled.</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !data?.error && (
          view === "list" ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Modified</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {folderLoading && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...
                    </td></tr>
                  )}
                  {!folderLoading && filtered.map(file => {
                    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                    const { code, name } = parseProjectName(file.name);
                    return (
                      <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {fileIcon(file.mimeType)}
                            <div>
                              {isFolder ? (
                                <button
                                  onClick={() => openFolder(file)}
                                  className="text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors text-left"
                                >
                                  {name}
                                </button>
                              ) : (
                                <span className="text-sm font-medium text-slate-800">{file.name}</span>
                              )}
                              {code && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">
                                  {code}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{isFolder ? "—" : formatSize(file.size)}</td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {file.modifiedTime ? formatDate(file.modifiedTime) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            {file.webViewLink && (
                              <a href={file.webViewLink} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!folderLoading && filtered.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">No files found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(file => {
                const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                return (
                  <div key={file.id}
                    onClick={() => isFolder && openFolder(file)}
                    className={`bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group ${isFolder ? "cursor-pointer" : ""}`}>
                    <div className="flex justify-center mb-3">{fileIcon(file.mimeType)}</div>
                    <p className="text-xs font-medium text-slate-700 text-center truncate" title={file.name}>{file.name}</p>
                    {file.modifiedTime && (
                      <p className="text-xs text-slate-400 text-center mt-1">{formatDate(file.modifiedTime)}</p>
                    )}
                    {file.webViewLink && !isFolder && (
                      <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={file.webViewLink} target="_blank" rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-100 text-slate-400">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
