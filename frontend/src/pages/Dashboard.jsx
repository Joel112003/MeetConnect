import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import ActionCard from "../components/dashboard/ActionCard";
import JoinMeetingModal from "../components/dashboard/JoinMeetingModal";
import ProfileMenu from "../components/dashboard/ProfileMenu";
import StatCard from "../components/dashboard/StatCard";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import Skeleton from "../components/common/Skeleton";
import { formatDate, formatTimeOnly, formatDateOnly } from "../utils/dateFormatters";


function MobileActionMenu({ onNew, onSchedule }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);


  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">

      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        aria-label="Meeting actions"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all"
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="h-4 w-4 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>


      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        >
          <button
            type="button"
            onClick={() => { setOpen(false); onNew(); }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.06] active:bg-white/10 transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <AppIcon name="plus" size={15} />
            </span>
            New Meeting
          </button>

          <div className="mx-4 h-px bg-white/[0.06]" />

          <button
            type="button"
            onClick={() => { setOpen(false); onSchedule(); }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.06] active:bg-white/10 transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
              <AppIcon name="calendar" size={15} />
            </span>
            Schedule Meeting
          </button>
        </div>
      )}
    </div>
  );
}


export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, getHistoryOfUser } = useAuth();

  const [isProfileOpen, setIsProfileOpen]   = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showModal, setShowModal]           = useState(false);
  const [history, setHistory]               = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [loadingScheduled, setLoadingScheduled]   = useState(true);
  const [deletingId, setDeletingId]         = useState(null);
  const [scheduledError, setScheduledError] = useState(null);
  const [activeTab, setActiveTab]           = useState("upcoming");


  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const payload = await getHistoryOfUser();
        if (!active) return;
        setHistory(Array.isArray(payload) ? payload : []);
      } catch {
        if (!active) return;
        setHistory([]);
      } finally {
        if (active) setLoadingHistory(false);
      }
    };
    loadHistory();
    return () => { active = false; };
  }, [getHistoryOfUser]);

  const loadScheduledMeetings = async () => {
    setLoadingScheduled(true);
    setScheduledError(null);
    try {
      const data = await api.getScheduledMeetings();
      setScheduledMeetings(Array.isArray(data?.meetings) ? data.meetings : []);
    } catch (err) {
      console.error("scheduled meetings error:", err);
      setScheduledError(err?.message || "Failed to load");
      setScheduledMeetings([]);
    } finally {
      setLoadingScheduled(false);
    }
  };

  useEffect(() => { loadScheduledMeetings(); }, []);

  const handleDeleteMeeting = async (meetingId) => {
    setDeletingId(meetingId);
    try {
      await api.deleteMeeting(meetingId);
      setScheduledMeetings((prev) => prev.filter((m) => m._id !== meetingId));
    } catch (err) { console.error("delete error:", err); }
    finally { setDeletingId(null); }
  };

  const sortedHistory = useMemo(() =>
    [...history].sort((a, b) => {
      const left  = new Date(a?.date || a?.createdAt || 0).getTime();
      const right = new Date(b?.date || b?.createdAt || 0).getTime();
      return right - left;
    }),
  [history]);

  const stats = useMemo(() => {
    const total       = sortedHistory.length;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek    = sortedHistory.filter((item) => {
      const time = new Date(item?.date || item?.createdAt || 0).getTime();
      return Number.isFinite(time) && time >= sevenDaysAgo;
    }).length;
    const latestDate  = sortedHistory[0]?.date || sortedHistory[0]?.createdAt || null;
    return { total, thisWeek, latestDate };
  }, [sortedHistory]);

  const handleLogout = async () => {
    await logout();
    sessionStorage.setItem("postLogoutToast", "1");
    navigate("/?logout=1", { replace: true });
  };

  const handleCreateMeeting = async () => {
    try {
      const { code } = await api.createRoom();
      navigate(`/videomeet?code=${code}`);
    } catch (err) { console.error("Failed to create meeting room:", err); }
  };

  const handleJoinMeeting = (code) => {
    setIsJoinModalOpen(false);
    navigate(`/videomeet?code=${code}`);
  };

  const upcomingMeetings     = scheduledMeetings.filter((m) => new Date(m.startTime) >= new Date()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const pastScheduledMeetings = scheduledMeetings.filter((m) => new Date(m.startTime) < new Date()).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  const tabMeetings          = activeTab === "upcoming" ? upcomingMeetings : pastScheduledMeetings;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">


      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">


          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
            </div>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">MeetConnect</span>
          </div>


          <div className="flex items-center gap-1.5 sm:gap-2">


            <button
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 px-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 sm:px-3"
              onClick={() => navigate("/history")}
              type="button"
              aria-label="History"
            >
              <AppIcon name="clock" size={13} />
              <span className="hidden sm:inline">History</span>
            </button>


            <button
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              onClick={handleCreateMeeting}
              type="button"
            >
              <AppIcon name="plus" size={13} />
              New Meeting
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              type="button"
            >
              <AppIcon name="plus" size={13} />
              Schedule Meeting
            </button>


            <MobileActionMenu
              onNew={handleCreateMeeting}
              onSchedule={() => setShowModal(true)}
            />


            <div className="relative">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/90 ring-1 ring-white/15 hover:bg-white/20 transition-colors"
                onClick={() => setIsProfileOpen((c) => !c)}
                type="button"
                aria-label="Profile menu"
              >
                {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
              </button>
              {isProfileOpen && (
                <ProfileMenu
                  user={user}
                  onClose={() => setIsProfileOpen(false)}
                  onLogout={handleLogout}
                  onOpenSettings={() => { setIsProfileOpen(false); navigate("/account-settings"); }}
                />
              )}
            </div>
          </div>
        </div>
      </header>


      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10 sm:pb-12">


        <section className="mb-6 sm:mb-8">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35 sm:mb-2 sm:text-xs">Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {user?.username || "there"}
            </span>
          </h1>
          <p className="mt-1 text-xs text-white/45 sm:text-sm">Start, join, and manage your meetings from one place.</p>
        </section>


        <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
          <StatCard value={stats.total}                  label="Total meetings" loading={loadingHistory} icon={<img src={meetConnectLogo} alt="" className="h-4 w-4 scale-225 object-contain" />} />
          <StatCard value={stats.thisWeek}               label="This week"      loading={loadingHistory} icon={<AppIcon name="calendar" size={16} />} />
          <StatCard value={formatDate(stats.latestDate)} label="Last meeting"   loading={loadingHistory} icon={<AppIcon name="clock"    size={16} />} />
        </section>


        <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 md:grid-cols-3 md:gap-4">
          <ActionCard icon={<img src={meetConnectLogo} alt="" className="h-5 w-5 scale-225 object-contain" />}
            title="Start instant meeting" description="Create a room and join immediately with your own secure meeting code."
            cta="Start now" onClick={handleCreateMeeting} accentClass="bg-blue-500/15" loading={loadingHistory} />
          <ActionCard icon={<AppIcon name="link" size={20} className="text-emerald-300" />}
            title="Join with code" description="Enter a 6-character code and jump directly into an existing meeting."
            cta="Join meeting" onClick={() => setIsJoinModalOpen(true)} accentClass="bg-emerald-500/15" loading={loadingHistory} />
          <ActionCard icon={<AppIcon name="user" size={20} className="text-amber-300" />}
            title="Account settings" description="Update your profile details, password, and account security options."
            cta="Open settings" onClick={() => navigate("/account-settings")} accentClass="bg-amber-500/15" loading={loadingHistory} />
        </section>


        <section className="mb-6 rounded-2xl border border-white/10 bg-zinc-900 p-4 sm:mb-8 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">Scheduled meetings</h2>
              <p className="text-[11px] text-white/40 mt-0.5 sm:text-xs">Manage your upcoming and past meetings</p>
            </div>
          </div>


          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 mb-4 w-fit sm:mb-5">
            {[
              { key: "upcoming", label: "Upcoming", count: upcomingMeetings.length },
              { key: "past",     label: "Past",     count: pastScheduledMeetings.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition sm:gap-2 sm:px-4
                  ${activeTab === tab.key ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
              >
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.key ? "bg-black/10 text-black" : "bg-white/10 text-white/50"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {scheduledError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400 mb-3 sm:px-4 sm:py-3 sm:mb-4">
              {scheduledError} —{" "}
              <button onClick={loadScheduledMeetings} className="underline">retry</button>
            </div>
          )}

          {loadingScheduled ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton type="card" count={4} />
            </div>
          ) : tabMeetings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center sm:px-6 sm:py-12">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-white/30">
                  <rect x="1" y="2" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 1v3M11 1v3M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white/50">
                {activeTab === "upcoming" ? "No upcoming meetings" : "No past meetings"}
              </p>
              <p className="mt-1 text-xs text-white/30">
                {activeTab === "upcoming" ? "Tap the + button above to schedule a meeting." : "Completed meetings will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tabMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  deleting={deletingId === meeting._id}
                  onDelete={() => handleDeleteMeeting(meeting._id)}
                  formatDateOnly={formatDateOnly}
                  formatTimeOnly={formatTimeOnly}
                  upcoming={activeTab === "upcoming"}
                />
              ))}
            </div>
          )}
        </section>


        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-base font-semibold sm:text-lg">Recent meetings</h2>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              onClick={() => navigate("/history")} type="button">
              View all
            </button>
          </div>
          {loadingHistory ? (
            <Skeleton type="row" count={3} srLabel="Loading recent meetings" />
          ) : sortedHistory.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-center sm:py-10">
              <p className="text-sm font-semibold text-white/60">No meetings yet</p>
              <p className="mt-1 text-xs text-white/40">Create your first meeting to see activity here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedHistory.slice(0, 5).map((meeting, index) => {
                const code = meeting?.meetingCode || meeting?.code || "-";
                const date = meeting?.date || meeting?.createdAt;
                return (
                  <div key={`${code}-${index}`}
                    className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">Code</p>
                      <p className="font-mono text-sm font-semibold tracking-[0.16em]">{code}</p>
                    </div>
                    <div className="text-xs text-white/60 sm:text-sm">{formatDate(date)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <JoinMeetingModal open={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} onJoin={handleJoinMeeting} />

      {showModal && (
        <ScheduleMeetingModal
          onClose={() => setShowModal(false)}
          onScheduled={(newMeeting) => {
            setScheduledMeetings((prev) => [...prev, newMeeting]);
            setActiveTab("upcoming");
          }}
        />
      )}
    </div>
  );
}


function MeetingCard({ meeting, deleting, onDelete, formatDateOnly, formatTimeOnly, upcoming }) {
  const [shareState, setShareState] = React.useState("idle");

  const handleShare = async () => {
    const code  = meeting.meetingCode || "";
    const link  = meeting.meetingLink || "";
    const title = meeting.title || "MeetConnect Meeting";
    const timeInfo = formatDateOnly(meeting.startTime)
      ? `${formatDateOnly(meeting.startTime)}, ${formatTimeOnly(meeting.startTime)} – ${formatTimeOnly(meeting.endTime)}`
      : "";
    const shareText = [
      `Join my meeting: ${title}`,
      timeInfo ? `📅 ${timeInfo}` : "",
      code ? `Meeting Code: ${code}` : "",
      link ? `Join here: ${link}` : "",
    ].filter(Boolean).join("\n");
    const shareData = { title, text: shareText, url: link || undefined };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      setShareState("shared");
      setTimeout(() => setShareState("idle"), 2000);
    } catch (err) {
      if (err?.name !== "AbortError") console.error("Share failed:", err);
    }
  };

  return (
    <div className={`relative rounded-2xl border p-3 transition group sm:p-4
      ${upcoming
        ? "border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] to-transparent"
        : "border-white/[0.06] bg-zinc-950/60"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{meeting.title}</p>
          {meeting.description && (
            <p className="text-[11px] text-white/40 mt-0.5 truncate sm:text-xs">{meeting.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 sm:gap-1.5">
          <button
            onClick={handleShare}
            title={shareState === "shared" ? "Shared!" : "Share meeting"}
            className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition min-h-[32px] sm:px-2.5
              ${shareState === "shared"
                ? "border-green-500/20 bg-green-500/[0.06] text-green-400"
                : "border-blue-500/20 bg-blue-500/[0.06] text-blue-400 hover:bg-blue-500/20"}`}
          >
            {shareState === "shared" ? "✓" : "Share"}
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-2 py-1 min-h-[32px]
                       text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition
                       disabled:opacity-40 disabled:cursor-not-allowed sm:px-2.5"
          >
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>

      {meeting.meetingCode && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/25">Code</span>
          <span className="font-mono text-xs font-semibold tracking-[0.12em] text-white/70">{meeting.meetingCode}</span>
        </div>
      )}

      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2 flex items-center gap-3">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-white/30 flex-shrink-0">
          <rect x="1" y="2" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5 1v3M11 1v3M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-xs font-medium text-white/70">{formatDateOnly(meeting.startTime)}</p>
          <p className="text-[11px] text-white/40 mt-0.5">{formatTimeOnly(meeting.startTime)} → {formatTimeOnly(meeting.endTime)}</p>
        </div>
      </div>

      {meeting.attendees?.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-white/25 flex-shrink-0">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p className="text-[11px] text-white/35 truncate">{meeting.attendees.join(", ")}</p>
        </div>
      )}

      {meeting.googleEventId && (
        <div className="mt-2 flex items-center gap-1.5">
          <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <p className="text-[11px] text-white/35">Added to Google Calendar</p>
        </div>
      )}
    </div>
  );
}