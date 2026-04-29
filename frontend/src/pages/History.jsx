import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import { useAuth } from "../hooks/useAuth";

const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getHistoryList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.history)) return payload.history;
  if (Array.isArray(payload?.meetings)) return payload.meetings;
  return [];
};

function HistorySkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-5">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
    </div>
  );
}

function MeetingCard({ item, index }) {
  const meetingCode = item?.meetingCode || item?.code || "-";
  const meetingDate = item?.date || item?.createdAt;

  return (
    <article className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-5 transition hover:border-white/20 hover:bg-zinc-800">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-semibold text-white/40">
        {index + 1}
      </div>

      <div className="min-w-[140px] flex-1">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/35">Meeting code</p>
        <p className="font-mono text-sm font-bold tracking-wider text-white">{meetingCode}</p>
      </div>

      <div className="min-w-[170px] flex-1">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/35">Date</p>
        <div className="flex items-center gap-2 text-sm font-medium text-white/65">
          <AppIcon name="calendar" size={14} />
          <span>{formatDate(meetingDate)}</span>
        </div>
      </div>

    </article>
  );
}

export default function History() {
  const navigate = useNavigate();
  const { getHistoryOfUser } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await getHistoryOfUser();
        if (!active) return;
        setMeetings(getHistoryList(payload));
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Unable to load meeting history.");
        setMeetings([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      active = false;
    };
  }, [getHistoryOfUser]);

  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => {
      const left = new Date(a?.date || a?.createdAt || 0).getTime();
      const right = new Date(b?.date || b?.createdAt || 0).getTime();
      return right - left;
    });
  }, [meetings]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="sticky top-0 z-40 h-14 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg">
              <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
            </div>
            <span className="text-sm font-semibold tracking-tight">MeetConnect</span>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <AppIcon name="arrowLeft" size={14} />
            Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12">
        <section className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/35">History</p>
          <h1 className="text-4xl font-bold tracking-tight">Meeting history</h1>
          <p className="mt-1 text-sm text-white/45">Track your recent sessions.</p>
        </section>

        {loading ? (
          <section className="space-y-3">
            <HistorySkeletonRow />
            <HistorySkeletonRow />
            <HistorySkeletonRow />
          </section>
        ) : null}

        {!loading && error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-start gap-3 text-red-300">
              <AppIcon name="alert" size={16} className="mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Failed to load history</p>
                <p className="text-sm text-red-200/80">{error}</p>
              </div>
            </div>
          </section>
        ) : null}

        {!loading && !error && sortedMeetings.length === 0 ? (
          <section className="rounded-2xl border border-white/10 bg-zinc-900 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/25">
              <AppIcon name="clock" size={24} />
            </div>
            <p className="text-base font-semibold text-white/55">No meetings yet</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-white/30">
              Start a new meeting from your dashboard to see it here.
            </p>
            <button
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              <img src={meetConnectLogo} alt="MeetConnect logo" className="h-3.5 w-3.5 scale-225 object-contain" />
              Go to Dashboard
            </button>
          </section>
        ) : null}

        {!loading && !error && sortedMeetings.length > 0 ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/45">
                <span className="font-semibold text-white">{sortedMeetings.length}</span>{" "}
                session{sortedMeetings.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="space-y-3">
              {sortedMeetings.map((item, index) => (
                <MeetingCard
                  key={`${item?.meetingCode || item?.code || "meeting"}-${index}`}
                  index={index}
                  item={item}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
