import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import Toast from "../components/common/Toast";

const Landing = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldShowLogoutToast =
      params.get("logout") === "1" ||
      sessionStorage.getItem("postLogoutToast") === "1";

    if (shouldShowLogoutToast) {
      setToastMessage("Logged out successfully");
      sessionStorage.removeItem("postLogoutToast");
      if (params.get("logout") === "1") {
        params.delete("logout");
        const nextSearch = params.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
        window.history.replaceState({}, "", nextUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 1800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#03080f] text-white">
      <style>{`
        @keyframes pulse-slow { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slide-down { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float-in-right { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes float-in-left { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes bob-delayed { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes speak-ring { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} 50%{box-shadow:0 0 0 4px rgba(59,130,246,0.35)} }
        @keyframes bar { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
        @keyframes ping-ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.4);opacity:0} }
        @keyframes live-flash { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes avatar-glow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.22) saturate(1.3)} }
        @keyframes hand-raise { 0%,80%,100%{opacity:0;transform:translateY(8px) scale(0.85)} 30%,60%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes notif-slide { from{opacity:0;transform:translateX(-24px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes screen-shimmer { 0%,100%{opacity:0.15} 60%{opacity:0.32} }
        @keyframes new-user-in { from{opacity:0;transform:scale(0.6) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes reaction-pop { 0%,75%,100%{opacity:0;transform:scale(0.7) translateY(6px)} 30%,60%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes tile-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wave-scan { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes count-in { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

        .anim-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .anim-slide-down { animation: slide-down 0.6s cubic-bezier(0.23,1,0.32,1) both; }
        .anim-fade-up { animation: fade-up 0.7s cubic-bezier(0.23,1,0.32,1) both; }
        .anim-fade-up-delay { animation: fade-up 0.7s 0.3s cubic-bezier(0.23,1,0.32,1) both; }

        .badge-top { animation: float-in-right 0.6s 0.4s cubic-bezier(0.23,1,0.32,1) both, bob 4s 1.5s ease-in-out infinite; }
        .badge-bottom { animation: float-in-right 0.6s 0.7s cubic-bezier(0.23,1,0.32,1) both, bob-delayed 4.5s 2s ease-in-out infinite; }
        .badge-hand { animation: notif-slide 0.5s 3.5s cubic-bezier(0.23,1,0.32,1) both, hand-raise 8s 3.5s ease-in-out infinite; }

        .speaking-tile { animation: tile-in 0.5s 0.2s both, speak-ring 1.4s ease-in-out infinite; border: 1.5px solid rgba(59,130,246,0.5); }
        .silent-tile { border: 1px solid rgba(255,255,255,0.07); }
        .tile-2 { animation: tile-in 0.5s 0.35s both; }
        .tile-3 { animation: tile-in 0.5s 0.5s both; }
        .tile-4 { animation: tile-in 0.5s 0.65s both; }

        .bar-anim { animation: bar 0.7s ease-in-out infinite; transform-origin: bottom; }
        .dot-pulse { animation: dot-pulse 1.2s ease-in-out infinite; }
        .live-dot { animation: live-flash 1.1s ease-in-out infinite; }
        .avatar-glow { animation: avatar-glow 2.4s ease-in-out infinite; }
        .new-user-in { animation: new-user-in 0.5s 1s both; }
        .reaction-pop { animation: reaction-pop 6s 4s ease-in-out infinite; }
        .screen-shimmer { animation: screen-shimmer 3s ease-in-out infinite; }
        .ping-ring { animation: ping-ripple 1.8s ease-out infinite; }
        .count-in { animation: count-in 0.4s 0.8s both; }
      `}</style>

      <Toast message={toastMessage} />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="anim-pulse-slow absolute left-1/2 top-[-200px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 right-[-100px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_65%)]" />
      </div>

      <header className="anim-slide-down fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-blue-200/10 bg-[#03080f]/80 px-10 backdrop-blur-xl">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[9px]">
            <img
              src={meetConnectLogo}
              alt="MeetConnect logo"
              className="h-full w-full scale-200 object-contain"
            />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight">
            MeetConnect
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="rounded-[9px] bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(37,99,235,0.3)] transition hover:bg-blue-500 hover:-translate-y-px"
          >
            Get started
          </button>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center pt-16">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 items-center gap-16 px-10 py-20">
          <div className="anim-fade-up">
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium text-blue-300">
              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-blue-500" />
              Secure video collaboration
            </span>
            <h1 className="font-display mb-6 text-[clamp(40px,5vw,66px)] font-extrabold leading-[1.0] tracking-[-0.03em]">
              Meetings
              <br />
              that{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                actually
                <br />
                work.
              </span>
            </h1>
            <p className="mb-9 max-w-[420px] text-base leading-relaxed text-white/50">
              Crystal-clear calls, enterprise-grade security, and instant room
              joins from any browser — no downloads required.
            </p>
            <div className="mb-12 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 rounded-[11px] bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(37,99,235,0.45)]"
              >
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Start for free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-[11px] border border-white/15 bg-white/5 px-7 py-3 text-sm font-medium text-white/85 transition hover:bg-white/9 hover:-translate-y-0.5"
              >
                Sign in
              </button>
            </div>
            <div className="flex gap-8">
              {[
                ["50M+", "Users"],
                ["99.9%", "Uptime"],
                ["150+", "Countries"],
              ].map(([num, label], i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <div className="w-px self-stretch bg-blue-200/10" />
                  )}
                  <div>
                    <p className="font-display text-2xl font-bold tracking-tight">
                      {num}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/30">
                      {label}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="anim-fade-up-delay relative mt-[-40px] p-4">
            <div className="badge-top absolute right-[18px] top-6 z-20  flex items-center gap-2.5 rounded-xl border border-blue-200/15 bg-[#071120] px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="new-user-in flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-[11px] font-bold text-white">
                MR
              </div>
              <div>
                <p className="text-[11px] text-white/40">Just joined</p>
                <p className="text-xs font-medium text-white">Maya Rodriguez</p>
              </div>
              <span className="dot-pulse h-[7px] w-[7px] flex-shrink-0 rounded-full bg-emerald-400" />
            </div>

            <div className="badge-bottom absolute bottom-14 right-[-22px] z-10 flex items-center gap-2 rounded-xl border border-blue-200/15 bg-[#071120] px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                <svg className="h-3.5 w-3.5 fill-blue-400" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  End-to-end encrypted
                </p>
                <p className="text-[11px] text-white/40">All calls secured</p>
              </div>
            </div>

            <div className="badge-hand absolute left-[-10px] top-1/2 z-10 flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-[#071120] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              <span className="text-[15px]">✋</span>
              <p className="text-[11px] font-semibold text-yellow-400">
                Sara R. raised hand
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[20px] border border-blue-200/15 bg-[#0b1a30] p-8 shadow-[0_0_80px_rgba(37,99,235,0.12),0_40px_80px_rgba(0,0,0,0.4)]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />

              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-display text-[13px] font-semibold text-white/65">
                  Design Review · Room 4B
                </span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    <span className="ping-ring absolute inline-flex h-[10px] w-[10px] rounded-full border border-emerald-400/50" />
                    <span className="live-dot relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    Live
                  </span>

                  <span className="count-in ml-1 rounded-full border border-blue-500/25 bg-blue-500/15 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                    4 joined
                  </span>
                </div>
              </div>

              <div className="relative mb-3 flex h-6 items-center overflow-hidden rounded-lg border border-white/5 bg-white/[0.03] px-2">
                <svg
                  width="100%"
                  height="18"
                  viewBox="0 0 400 18"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="wg" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop
                        offset="40%"
                        stopColor="#60a5fa"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="60%"
                        stopColor="#60a5fa"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>
                  {[
                    [0, 6],
                    [7, 3],
                    [14, 5],
                    [21, 2],
                    [28, 7],
                    [35, 1],
                    [42, 4],
                    [49, 6],
                    [56, 2],
                    [63, 5],
                    [70, 7],
                    [77, 3],
                    [84, 1],
                    [91, 5],
                    [98, 6],
                    [105, 2],
                    [112, 4],
                    [119, 7],
                    [126, 1],
                    [133, 5],
                  ].map(([x, y], i) => (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width="4"
                      height={18 - y * 1.1}
                      rx="2"
                      fill="url(#wg)"
                      className="bar-anim"
                      style={{ animationDelay: `${(i % 5) * 0.08}s` }}
                    />
                  ))}
                </svg>
                <span className="absolute right-2 text-[10px] text-white/25">
                  Alex speaking
                </span>
              </div>

              <div className="mb-2.5 grid grid-cols-2 gap-2.5">
                <div className="speaking-tile relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl bg-[#071120]">
                  <div className="avatar-glow flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] font-display text-base font-bold text-[#93c5fd]">
                    AK
                  </div>
                  <span className="text-[11px] font-medium text-white/60">
                    Alex Kim
                  </span>

                  <div className="absolute bottom-2 left-2 flex h-3.5 items-end gap-0.5">
                    {[4, 10, 7, 12].map((h, i) => (
                      <div
                        key={i}
                        className="bar-anim w-[3px] rounded-sm bg-blue-400"
                        style={{ height: h, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>

                  <div className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-blue-500/25">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                    </svg>
                  </div>
                </div>

                <div className="tile-2 silent-tile relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl bg-[#071120]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#064e3b] to-[#059669] font-display text-base font-bold text-[#6ee7b7]">
                    SR
                  </div>
                  <span className="text-[11px] font-medium text-white/60">
                    Sara R.
                  </span>

                  <div className="absolute bottom-2 left-2 flex h-[20px] w-[20px] items-center justify-center rounded-[6px] bg-red-500/18">
                    <svg
                      width="10"
                      height="10"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" />
                    </svg>
                  </div>
                </div>

                <div className="tile-3 silent-tile relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl bg-[#071120]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] font-display text-base font-bold text-[#c4b5fd]">
                    JP
                  </div>
                  <span className="text-[11px] font-medium text-white/60">
                    James P.
                  </span>

                  <div className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-white/5">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="rgba(200,200,255,0.35)"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14" />
                      <rect x="1" y="6" width="15" height="12" rx="2" />
                    </svg>
                  </div>
                </div>

                <div className="tile-4 silent-tile relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl bg-[#071120]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7c2d12] to-[#ea580c] font-display text-base font-bold text-[#fdba74]">
                    LN
                  </div>
                  <span className="text-[11px] font-medium text-white/60">
                    Luna N.
                  </span>

                  <span className="reaction-pop absolute right-2 top-2 text-[15px]">
                    👍
                  </span>
                </div>
              </div>

              <div className="relative mb-0 flex aspect-[16/5.5] items-center justify-center overflow-hidden rounded-xl border border-blue-600/20 bg-gradient-to-br from-[#071827] to-[#0c1f3a]">
                <div
                  className="screen-shimmer pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg,transparent 40%,rgba(59,130,246,0.08) 50%,transparent 60%)",
                    width: "200%",
                    animation: "wave-scan 3s linear infinite",
                  }}
                />
                <div className="flex flex-col items-center gap-1.5 text-blue-200/30">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                  <span className="text-[11px]">
                    Your screen · sharing paused
                  </span>
                </div>
                <div className="absolute bottom-2 left-2.5 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/50">
                  You
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2 py-0.5">
                  <span className="dot-pulse h-[5px] w-[5px] rounded-full bg-red-500" />
                  <span className="text-[9px] font-bold text-red-400">REC</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-2.5 pb-0.5">
                {[
                  <svg
                    key="mic"
                    fill="none"
                    stroke="rgba(200,220,255,0.7)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                  </svg>,
                  <svg
                    key="cam"
                    fill="none"
                    stroke="rgba(200,220,255,0.7)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                  </svg>,
                  null,
                  <svg
                    key="more"
                    fill="none"
                    stroke="rgba(200,220,255,0.7)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>,
                ].map((icon, i) => (
                  <div
                    key={i}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border transition hover:scale-105 ${
                      i === 2
                        ? "border-red-500/30 bg-red-500/15"
                        : "border-blue-200/15 bg-white/[0.04] hover:bg-white/9"
                    }`}
                  >
                    {i === 2 ? (
                      <svg
                        className="h-[17px] w-[17px]"
                        fill="#ef4444"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                      </svg>
                    ) : (
                      <span className="h-[17px] w-[17px]">{icon}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-blue-200/10 bg-[#071120]/70 px-10 py-7">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between text-xs text-white/35">
          <p>© 2026 MeetConnect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/privacy-policy"
              className="text-white/45 transition hover:text-white/80"
            >
              Privacy Policy
            </a>
            <span className="text-white/15">|</span>
            <a
              href="/terms-and-conditions"
              className="text-white/45 transition hover:text-white/80"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
