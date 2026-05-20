"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/services/calendarWrite";
import { syncTasksAction } from "@/app/actions/syncTasks";
import { RefreshCw } from "lucide-react";

const COLOR_OPTIONS = [
  { label: "Deep Work", colorId: "11", bg: "#ef4444" },
  { label: "Medium Effort", colorId: "6", bg: "#f97316" },
  { label: "Light Task", colorId: "9", bg: "#3b82f6" },
  { label: "Sleep", colorId: "3", bg: "#a855f7" },
  { label: "Other (no analytics)", colorId: "", bg: "#64748b" },
];

const COLOR_MAP: Record<string, string> = {
  hard: "#ef4444",
  medium: "#f97316",
  easy: "#3b82f6",
  sleep: "#a855f7",
};

function CalendarSkeleton() {
  return (
    <div className="h-[650px] w-full rounded-2xl glass-card border border-white/5 animate-pulse flex items-center justify-center">
      <p className="text-white/30 text-sm">Loading calendar...</p>
    </div>
  );
}

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  event?: any;
  startStr?: string;
  endStr?: string;
}

export default function CalendarView({ initialEvents }: { initialEvents: any[] }) {
  const { providerToken } = useAuth();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create" });
  const [form, setForm] = useState({ title: "", colorId: "11" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [FC, setFC] = useState<any>(null);
  const [plugins, setPlugins] = useState<any[]>([]);

  // Dynamically load FullCalendar on client only
  useEffect(() => {
    Promise.all([
      import("@fullcalendar/react"),
      import("@fullcalendar/daygrid"),
      import("@fullcalendar/timegrid"),
      import("@fullcalendar/interaction"),
    ]).then(([fcReact, dayGrid, timeGrid, interaction]) => {
      setFC(() => fcReact.default);
      setPlugins([dayGrid.default, timeGrid.default, interaction.default]);
    });
  }, []);

  const fcEvents = initialEvents.map(t => ({
    id: t.id,
    title: t.title,
    start: t.start_time,
    end: t.end_time,
    backgroundColor: COLOR_MAP[t.color_indicator] || "#64748b",
    borderColor: "transparent",
    textColor: "#fff",
    extendedProps: { googleEventId: t.google_event_id, colorIndicator: t.color_indicator },
  }));

  const handleSync = async () => {
    if (!providerToken) return;
    setIsSyncing(true);
    await syncTasksAction(providerToken);
    router.refresh();
    setIsSyncing(false);
  };

  const handleSelect = (selectInfo: any) => {
    setForm({ title: "", colorId: "11" });
    setModal({ open: true, mode: "create", startStr: selectInfo.startStr, endStr: selectInfo.endStr });
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    setForm({ title: clickInfo.event.title, colorId: "" });
    setModal({ open: true, mode: "edit", event: clickInfo.event });
  };

  const handleEventDrop = async (dropInfo: any) => {
    if (!providerToken) { dropInfo.revert(); return; }
    const gId = dropInfo.event.extendedProps.googleEventId;
    if (!gId) { dropInfo.revert(); return; }
    try {
      await updateCalendarEvent(providerToken, gId, { start: dropInfo.event.startStr, end: dropInfo.event.endStr });
      await syncTasksAction(providerToken);
      router.refresh();
    } catch { dropInfo.revert(); }
  };

  const handleEventResize = async (resizeInfo: any) => {
    if (!providerToken) { resizeInfo.revert(); return; }
    const gId = resizeInfo.event.extendedProps.googleEventId;
    if (!gId) { resizeInfo.revert(); return; }
    try {
      await updateCalendarEvent(providerToken, gId, { start: resizeInfo.event.startStr, end: resizeInfo.event.endStr });
      await syncTasksAction(providerToken);
      router.refresh();
    } catch { resizeInfo.revert(); }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerToken || !form.title.trim()) return;
    setIsSubmitting(true);
    try {
      await createCalendarEvent(providerToken, {
        summary: form.title,
        start: modal.startStr!,
        end: modal.endStr!,
        colorId: form.colorId || undefined,
      });
      await syncTasksAction(providerToken);
      router.refresh();
      setModal({ open: false, mode: "create" });
    } catch (e: any) {
      alert("Failed to create: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!providerToken || !modal.event) return;
    const gId = modal.event.extendedProps.googleEventId;
    if (!gId) { alert("Cannot delete: event not linked to Google Calendar."); return; }
    setIsSubmitting(true);
    try {
      await deleteCalendarEvent(providerToken, gId);
      await syncTasksAction(providerToken);
      router.refresh();
      setModal({ open: false, mode: "create" });
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Calendar</h1>
          <p className="mt-1 text-sm text-white/40">Plan intentionally. Execute honestly.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing || !providerToken}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-all disabled:opacity-40"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Calendar"}
        </button>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-4 pb-1">
        {[
          { label: "Deep Work", color: "#ef4444" },
          { label: "Medium", color: "#f97316" },
          { label: "Light", color: "#3b82f6" },
          { label: "Sleep", color: "#a855f7" },
          { label: "Other (no analytics)", color: "#64748b" },
        ].map(c => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-xs text-white/40">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      {!FC ? (
        <CalendarSkeleton />
      ) : (
        <div className="fc-dark rounded-2xl overflow-hidden border border-white/5 bg-card/20">
          <FC
            plugins={plugins}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={650}
            events={fcEvents}
            selectable={true}
            selectMirror={true}
            editable={true}
            select={handleSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventDisplay="block"
            expandRows={true}
          />
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-3xl border border-white/10 p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">
                {modal.mode === "create" ? "New Calendar Event" : `Edit: ${modal.event?.title}`}
              </h2>
              <button
                onClick={() => setModal({ open: false, mode: "create" })}
                className="text-white/40 hover:text-white/70 transition-colors text-xl leading-none"
              >×</button>
            </div>

            {modal.mode === "create" ? (
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                  autoFocus
                  required
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white/40 font-medium uppercase tracking-wider">Task Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_OPTIONS.map(opt => (
                      <button
                        key={opt.colorId}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, colorId: opt.colorId }))}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          form.colorId === opt.colorId ? "border-white/30 scale-[1.02]" : "border-white/8 opacity-60 hover:opacity-80"
                        }`}
                        style={{ backgroundColor: opt.bg + "18", color: opt.bg }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-1">
                  <button type="button" onClick={() => setModal({ open: false, mode: "create" })}
                    className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || !form.title.trim()}
                    className="px-5 py-2 rounded-xl bg-white/10 text-sm font-medium text-white/90 hover:bg-white/20 transition-colors disabled:opacity-40">
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-white/50">
                  This event was synced from Google Calendar.<br/>
                  Drag it on the calendar to reschedule, or delete it below.
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setModal({ open: false, mode: "create" })}
                    className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors">
                    Close
                  </button>
                  <button onClick={handleDelete} disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                    {isSubmitting ? "Deleting..." : "Delete Event"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
