"use client";

import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { RefreshCw, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

const integrations = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync email threads with customers and projects. Reply directly from Shorebreak CRM.",
    connected: false,
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
    scopes: ["Read emails", "Send emails", "Manage labels"],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync site visits, inspections, and installations. Create events directly from projects.",
    connected: false,
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3 4.9 3 6v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        <path fill="#34A853" d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2z"/>
      </svg>
    ),
    scopes: ["View calendar events", "Create & edit events", "Manage calendars"],
  },
  {
    id: "drive",
    name: "Google Drive",
    description: "Store and organize project files, permits, site photos, and engineering drawings.",
    connected: false,
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 87.3 78">
        <path fill="#0066da" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/>
        <path fill="#00ac47" d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 00-1.2 4.5h27.5z"/>
        <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z"/>
        <path fill="#00832d" d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"/>
        <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
        <path fill="#ffba00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
      </svg>
    ),
    scopes: ["View files", "Upload files", "Manage folders"],
  },
];

const teamMembers = [
  { name: "Jake Mercer", email: "jake@shorebreakelectric.com", role: "Project Manager", initials: "JM" },
  { name: "Ana Torres", email: "ana@shorebreakelectric.com", role: "Lead Installer", initials: "AT" },
  { name: "Ryan Nguyen", email: "ryan@shorebreakelectric.com", role: "Electrician", initials: "RN" },
  { name: "Sarah Kim", email: "sarah@shorebreakelectric.com", role: "Sales Rep", initials: "SK" },
  { name: "Tom Walsh", email: "tom@shorebreakelectric.com", role: "Site Assessor", initials: "TW" },
];

export default function SettingsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Manage integrations and team" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
        {/* Company */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Company</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Company Name", value: "Shorebreak Electric & Solar" },
              { label: "License Number", value: "C-10 #1082477" },
              { label: "Phone", value: "(760) 555-0100" },
              { label: "Email", value: "info@shorebreakelectric.com" },
              { label: "Address", value: "1250 Industry Rd, Carlsbad, CA 92008" },
              { label: "Time Zone", value: "America/Los_Angeles" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{label}</label>
                <input
                  defaultValue={value}
                  className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300 transition"
                />
              </div>
            ))}
          </div>
          <button className="mt-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </Card>

        {/* Google Integrations */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Google Integrations</h2>
              <p className="text-sm text-slate-500 mt-0.5">Connect your Google Workspace account to enable syncing.</p>
            </div>
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Google Console
            </a>
          </div>
          <div className="space-y-3">
            {integrations.map(integration => {
              const isConnected = connected[integration.id];
              return (
                <div key={integration.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="shrink-0 mt-0.5">{integration.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">{integration.name}</p>
                      {isConnected
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</span>
                        : <span className="text-xs text-slate-400">Not connected</span>
                      }
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{integration.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.scopes.map(s => (
                        <span key={s} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setConnected(prev => ({ ...prev, [integration.id]: !isConnected }))}
                    className={`shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors
                      ${isConnected
                        ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        : "bg-orange-500 hover:bg-orange-600 text-white"}`}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Env var hint */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Required Environment Variables</p>
            <div className="space-y-1 font-mono text-xs text-slate-500">
              <div><span className="text-orange-500">GOOGLE_CLIENT_ID</span>=your-client-id</div>
              <div><span className="text-orange-500">GOOGLE_CLIENT_SECRET</span>=your-client-secret</div>
              <div><span className="text-orange-500">NEXTAUTH_SECRET</span>=your-random-secret</div>
              <div><span className="text-orange-500">NEXTAUTH_URL</span>=http://localhost:3000</div>
            </div>
          </div>
        </Card>

        {/* Team */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Team Members</h2>
            <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">+ Invite</button>
          </div>
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div key={member.email} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{member.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">{member.role}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
