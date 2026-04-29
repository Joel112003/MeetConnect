import { useEffect, useState } from "react";
import { api } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 opacity-35"
    >
      <rect
        x="1"
        y="2"
        width="14"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 1v3M11 1v3M1 6h14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DateTimePicker({ value, onChange }) {
  const today = new Date();
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const [hour, setHour] = useState("09");
  const [min, setMin] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const prevDays = new Date(view.y, view.m, 0).getDate();

  const changeMonth = (delta) =>
    setView((v) => {
      let m = v.m + delta,
        y = v.y;
      if (m > 11) {
        m = 0;
        y++;
      }
      if (m < 0) {
        m = 11;
        y--;
      }
      return { y, m };
    });

  const confirmDay = (day) => {
    let h = parseInt(hour) || 12;
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const pad = (n) => String(n).padStart(2, "0");
    const localISO = `${view.y}-${pad(view.m + 1)}-${pad(day)}T${pad(h)}:${pad(parseInt(min) || 0)}:00`;
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    const tz = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
    onChange(localISO + tz);
  };

  const blurHour = () => {
    let v = parseInt(hour) || 1;
    if (v < 1) v = 1;
    if (v > 12) v = 12;
    setHour(String(v).padStart(2, "0"));
  };

  const blurMin = () => {
    let v = parseInt(min) || 0;
    if (v < 0) v = 0;
    if (v > 59) v = 59;
    setMin(String(v).padStart(2, "0"));
  };

  const sel = value ? new Date(value) : null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden mt-1.5">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05]">
        <span className="text-sm font-semibold text-white">
          {MONTHS[view.m]} {view.y}
        </span>
        <div className="flex gap-1">
          {["‹", "›"].map((ch, i) => (
            <button
              key={ch}
              onClick={() => changeMonth(i ? 1 : -1)}
              className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-white/50
                         hover:text-white hover:bg-white/10 transition text-xs
                         flex items-center justify-center"
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 px-2.5 pt-2 pb-1">
        {DAYS.map((d) => (
          <span
            key={d}
            className="text-center text-[10px] text-white/25 font-medium tracking-wide"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px px-2.5 pb-2">
        {/* Padding days from previous month */}
        {Array.from({ length: firstDay }, (_, i) => (
          <span
            key={`prev-${i}`}
            className="aspect-square flex items-center justify-center text-xs text-white/15"
          >
            {prevDays - firstDay + i + 1}
          </span>
        ))}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const isToday =
            view.y === today.getFullYear() &&
            view.m === today.getMonth() &&
            d === today.getDate();
          const isSelected =
            sel &&
            sel.getFullYear() === view.y &&
            sel.getMonth() === view.m &&
            sel.getDate() === d;

          return (
            <button
              key={d}
              onClick={() => confirmDay(d)}
              className={`aspect-square flex items-center justify-center text-xs rounded-lg transition
                ${
                  isSelected
                    ? "bg-white text-black font-semibold"
                    : isToday
                      ? "text-white font-semibold border border-white/25 hover:bg-white/10"
                      : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
            >
              {d}
            </button>
          );
        })}

        {/* Padding days for next month */}
        {Array.from({ length: 42 - firstDay - daysInMonth }, (_, i) => (
          <span
            key={`next-${i}`}
            className="aspect-square flex items-center justify-center text-xs text-white/15"
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Time selector */}
      <div className="flex items-center gap-2 px-1.5 py-2.5 border-t border-white/[0.05]">
        <span className="text-[11px] text-white/30 mr-1">Time</span>

        <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
          <input
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            onBlur={blurHour}
            maxLength={2}
            className="w-4 bg-transparent text-center text-sm font-mono font-semibold text-white outline-none"
          />
          <span className="text-white/40 font-bold text-sm">:</span>
          <input
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={blurMin}
            maxLength={2}
            className="w-4 bg-transparent text-center text-sm font-mono font-semibold text-white outline-none"
          />
        </div>

        {["AM", "PM"].map((ap) => (
          <button
            key={ap}
            onClick={() => setAmpm(ap)}
            className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition border
              ${
                ampm === ap
                  ? "bg-white/15 text-white border-white/25"
                  : "text-white/35 bg-white/5 border-white/[0.08] hover:text-white/60"
              }`}
          >
            {ap}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDisplay(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ScheduleMeetingModal({ onClose, onScheduled }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    attendees: "",
  });
  const [openPicker, setOpenPicker] = useState(null); // "start" | "end" | null
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const setDateTime = (field, iso) => {
    setForm((prev) => ({ ...prev, [field]: iso }));
    setOpenPicker(null);
  };

  useEffect(() => {
    let active = true;
    const loadStatus = async () => {
      setStatusLoading(true);
      try {
        const data = await api.getGoogleCalendarStatus();
        if (active) setGoogleConnected(Boolean(data?.connected));
      } catch {
        if (active) setGoogleConnected(false);
      } finally {
        if (active) setStatusLoading(false);
      }
    };

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const handleConnectGoogle = () => {
    const popup = window.open(
      `${API_BASE_URL}/api/v1/meetings/google/connect`,
      "google-oauth",
      "width=500,height=600,scrollbars=yes",
    );

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        api
          .getGoogleCalendarStatus()
          .then((data) => setGoogleConnected(Boolean(data?.connected)))
          .catch(() => setGoogleConnected(false));
      }
    }, 500);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { meeting } = await api.scheduleMeeting({
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        attendees: form.attendees
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
        addToCalendar,
      });

      onScheduled?.(meeting);
      onClose();
    } catch (err) {
      if (err?.status === 409 && err?.data?.code === "GOOGLE_NOT_CONNECTED") {
        const connectPath =
          err?.data?.connectPath || "/api/v1/meetings/google/connect";
        window.location.assign(`${API_BASE_URL}${connectPath}`);
        return;
      }

      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = () => {
    if (!form.title || !form.startTime || !form.endTime)
      return setError("Title, start and end time are required");
    if (addToCalendar && !googleConnected) {
      return setError("Connect Google Calendar before adding events.");
    }
    handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Schedule a Meeting
            </h2>
            <p className="text-xs text-white/30 mt-0.5">
              Set up a new meeting room
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10
                       text-white/40 hover:text-white hover:bg-white/10 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-3">
          {error && (
            <div className="rounded-xl bg-red-500/[0.08] border border-red-500/20 px-4 py-3 text-xs text-red-400 leading-relaxed">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1.5">
              Title
            </label>
            <input
              name="title"
              placeholder="e.g. Weekly team sync"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5
                         text-sm text-white placeholder-white/20 outline-none
                         focus:border-white/20 focus:bg-white/[0.05] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              placeholder="What's this meeting about? (optional)"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5
                         text-sm text-white placeholder-white/20 outline-none resize-none
                         focus:border-white/20 focus:bg-white/[0.05] transition"
            />
          </div>

          {/* ── Date & Time pickers ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start */}
            <div>
              <label className="block text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1.5">
                Start
              </label>
              <button
                onClick={() =>
                  setOpenPicker(openPicker === "start" ? null : "start")
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-left
                            flex items-center gap-2 transition
                            ${
                              openPicker === "start"
                                ? "border-white/25 bg-white/[0.05]"
                                : "border-white/[0.07] bg-white/[0.03] hover:border-white/15"
                            }`}
              >
                <CalendarIcon />
                <span
                  className={form.startTime ? "text-white" : "text-white/20"}
                >
                  {formatDisplay(form.startTime) ?? "Pick date & time"}
                </span>
              </button>
              {openPicker === "start" && (
                <DateTimePicker
                  value={form.startTime}
                  onChange={(iso) => setDateTime("startTime", iso)}
                />
              )}
            </div>

            {/* End */}
            <div>
              <label className="block text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1.5">
                End
              </label>
              <button
                onClick={() =>
                  setOpenPicker(openPicker === "end" ? null : "end")
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-left
                            flex items-center gap-2 transition
                            ${
                              openPicker === "end"
                                ? "border-white/25 bg-white/[0.05]"
                                : "border-white/[0.07] bg-white/[0.03] hover:border-white/15"
                            }`}
              >
                <CalendarIcon />
                <span className={form.endTime ? "text-white" : "text-white/20"}>
                  {formatDisplay(form.endTime) ?? "Pick date & time"}
                </span>
              </button>
              {openPicker === "end" && (
                <DateTimePicker
                  value={form.endTime}
                  onChange={(iso) => setDateTime("endTime", iso)}
                />
              )}
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1.5">
              Attendees
            </label>
            <input
              name="attendees"
              placeholder="john@gmail.com, jane@gmail.com"
              value={form.attendees}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5
                         text-sm text-white placeholder-white/20 outline-none
                         focus:border-white/20 focus:bg-white/[0.05] transition"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05] my-1" />

          {/* Google Calendar toggle */}
          <label
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
              addToCalendar
                ? "border-green-500/20 bg-green-500/[0.04]"
                : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                addToCalendar
                  ? "bg-green-600 border-green-600"
                  : "border-white/20 bg-white/5"
              }`}
            >
              {addToCalendar && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={addToCalendar}
              onChange={(e) => setAddToCalendar(e.target.checked)}
              className="sr-only"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80">
                Add to Google Calendar
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                You'll be asked for calendar permission
              </p>
            </div>
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </label>

          {addToCalendar ? (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs text-white/45">
              {statusLoading ? (
                <span>Checking Google Calendar connection...</span>
              ) : googleConnected ? (
                <span>Google Calendar is connected.</span>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span>Google Calendar is not connected.</span>
                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.07] py-2.5 text-sm
                       text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || (addToCalendar && !googleConnected)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition
                        disabled:opacity-40 disabled:cursor-not-allowed ${
                          addToCalendar
                            ? "bg-green-700 hover:bg-green-600"
                            : "bg-white/10 hover:bg-white/15 border border-white/10"
                        }`}
          >
            {loading
              ? "Scheduling..."
              : addToCalendar
                ? "Schedule & Add to Calendar"
                : "Schedule Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
