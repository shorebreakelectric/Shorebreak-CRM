"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { calendarEvents } from "@/lib/mock-data";
import { CalendarEvent } from "@/lib/types";
import {
  ChevronLeft, ChevronRight, Plus, Zap, Sun, CheckCircle2,
  CalendarDays, Clock, MapPin, Users, RefreshCw,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const eventTypeStyle: Record<string, string> = {
  installation: "bg-green-500",
  inspection:   "bg-cyan-500",
  assessment:   "bg-amber-500",
  meeting:      "bg-blue-500",
  other:        "bg-slate-400",
};

const eventTypeIcon: Record<string, React.ReactNode> = {
  installation: <Zap className="w-3.5 h-3.5" />,
  inspection:   <CheckCircle2 className="w-3.5 h-3.5" />,
  assessment:   <Sun className="w-3.5 h-3.5" />,
  meeting:      <CalendarDays className="w-3.5 h-3.5" />,
  other:        <Clock className="w-3.5 h-3.5" />,
};

function formatTime(dt: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(dt));
}

function EventChip({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={`text-xs text-white px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 ${eventTypeStyle[event.type]} opacity-90 hover:opacity-100 cursor-pointer`}
      title={event.title}
    >
      {eventTypeIcon[event.type]}
      <span className="truncate">{event.title}</span>
    </div>
  );
}

function EventDetail({ event }: { event: CalendarEvent }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors`}>
      <div className={`p-2 rounded-lg text-white shrink-0 ${eventTypeStyle[event.type]}`}>
        {eventTypeIcon[event.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{event.title}</p>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTime(event.start)} – {formatTime(event.end)}
        </p>
        {event.location && (
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
        {event.attendees && event.attendees.length > 0 && (
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 shrink-0" />
            {event.attendees.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const today = new Date("2026-05-05");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const eventsForDay = (day: number | null) => {
    if (!day) return [];
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter(e => e.start.startsWith(prefix));
  };

  const selectedEvents = eventsForDay(selectedDay);
  const upcomingAll = calendarEvents
    .filter(e => new Date(e.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="flex flex-col h-full">
      <Header title="Calendar" subtitle="Synced with Google Calendar" googleSync />

      <div className="flex flex-1 overflow-hidden">
        {/* Main calendar */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Google sync banner */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Connected to Google Calendar — events sync automatically. Last synced 2 min ago.</span>
            <button className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* Month header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-900">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAYS.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {cells.map((day, i) => {
                const dayEvents = eventsForDay(day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selectedDay;
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                    className={`min-h-[90px] p-2 cursor-pointer transition-colors
                      ${day ? "hover:bg-orange-50" : "bg-slate-50/50"}
                      ${isSelected ? "bg-orange-50 ring-1 ring-inset ring-orange-300" : ""}`}
                  >
                    {day && (
                      <>
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm mb-1 font-medium
                          ${isToday ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map(ev => <EventChip key={ev.id} event={ev} />)}
                          {dayEvents.length > 2 && (
                            <p className="text-xs text-slate-400 pl-1">+{dayEvents.length - 2} more</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              {selectedDay
                ? `${MONTHS[month].slice(0, 3)} ${selectedDay}`
                : "Upcoming"}
            </h3>
            <button className="flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /> Event
            </button>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-5 pb-4 border-b border-slate-100">
            {[
              { type: "installation", label: "Installation" },
              { type: "inspection", label: "Inspection" },
              { type: "assessment", label: "Assessment" },
              { type: "meeting", label: "Meeting" },
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className={`w-2.5 h-2.5 rounded-sm ${eventTypeStyle[type]}`} />
                {label}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {(selectedDay ? selectedEvents : upcomingAll).map(ev => (
              <EventDetail key={ev.id} event={ev} />
            ))}
            {(selectedDay ? selectedEvents : upcomingAll).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
