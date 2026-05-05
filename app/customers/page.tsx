"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { customers as allCustomers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search, SlidersHorizontal, Mail, Phone, MapPin,
  Building2, Home, Star, ChevronRight, Users, TrendingUp,
  DollarSign, UserPlus,
} from "lucide-react";

const statusConfig = {
  lead:     { label: "Lead",     variant: "info" as const },
  active:   { label: "Active",   variant: "success" as const },
  complete: { label: "Complete", variant: "muted" as const },
  inactive: { label: "Inactive", variant: "warning" as const },
};

const sourceConfig = {
  referral:     "Referral",
  google:       "Google",
  website:      "Website",
  "door-to-door": "D2D",
  other:        "Other",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = allCustomers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totals = {
    leads: allCustomers.filter(c => c.status === "lead").length,
    active: allCustomers.filter(c => c.status === "active").length,
    revenue: allCustomers.reduce((s, c) => s + c.totalValue, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Customers"
        subtitle={`${allCustomers.length} total customers & leads`}
        action={{ label: "Add Customer", onClick: () => {} }}
      />

      {/* Summary strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-8">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-500">Leads:</span>
          <span className="font-semibold text-slate-800">{totals.leads}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-500">Active:</span>
          <span className="font-semibold text-slate-800">{totals.active}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500">Total billed:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(totals.revenue)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="all">All Status</option>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="complete">Complete</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <span className="text-sm text-slate-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Projects</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Value</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Contact</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => {
                const status = statusConfig[customer.status];
                const initials = customer.name.split(" ").map(n => n[0]).slice(0, 2).join("");
                return (
                  <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">{initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                          <p className="text-xs text-slate-400">{customer.type === "commercial" ? "Commercial" : "Residential"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-orange-500 transition-colors">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[140px]">{customer.email}</span>
                        </a>
                        <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 transition-colors">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-600">{customer.address}</p>
                          <p className="text-xs text-slate-400">{customer.city}, {customer.state} {customer.zip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        {customer.type === "commercial" ? <Building2 className="w-3.5 h-3.5 text-blue-400" /> : <Home className="w-3.5 h-3.5 text-green-400" />}
                        {customer.type === "commercial" ? "Commercial" : "Residential"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="font-semibold text-slate-700">{customer.projectCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-slate-700">
                        {customer.totalValue > 0 ? formatCurrency(customer.totalValue) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="muted">{sourceConfig[customer.source]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatDate(customer.lastContact)}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
