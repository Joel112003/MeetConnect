import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import Toast from "../components/common/Toast";

const KEYFRAMES = `
  @keyframes slideDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeUp    { from { opacity:0; transform:translateY(22px)  } to { opacity:1; transform:translateY(0) } }
  @keyframes floatIn   { from { opacity:0; transform:translateX(18px)  } to { opacity:1; transform:translateX(0) } }
  @keyframes bob       { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-6px) } }
  @keyframes barPulse  { 0%,100% { transform:scaleY(0.3) } 50% { transform:scaleY(1) } }
`;

const MicIcon = ({ stroke = "rgba(200,220,255,0.6)" }) => (
  <svg
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="h-[17px] w-[17px]"
  >
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
);
const CamIcon = ({ stroke = "rgba(200,220,255,0.6)" }) => (
  <svg
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="h-[17px] w-[17px]"
  >
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
  </svg>
);
const MoreIcon = () => (
  <svg
    fill="none"
    stroke="rgba(200,220,255,0.6)"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="h-[17px] w-[17px]"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
const MutedMic = () => (
  <svg
    fill="none"
    stroke="#f87171"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    className="h-[11px] w-[11px]"
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" />
  </svg>
);

const Tile = ({
  initials,
  name,
  gradFrom,
  gradTo,
  textCol,
  isSpeaking,
  delay,
  badge,
}) => (
  <div
    className={`relative flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl bg-[#071120] ${isSpeaking ? "border border-blue-500/50" : "border border-white/[0.06]"}`}
    style={{
      animation: `fadeUp 0.45s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
    }}
  >
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradFrom} ${gradTo} text-[13px] font-bold ${textCol}`}
      style={{ fontFamily: "'Syne',sans-serif" }}
    >
      {initials}
    </div>
    <span className="text-[11px] text-white/45">{name}</span>
    {isSpeaking && (
      <div className="absolute bottom-2 left-2.5 flex items-end gap-[2px] h-3.5">
        {[5, 10, 7, 13].map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-sm bg-blue-400"
            style={{
              height: h,
              transformOrigin: "bottom",
              animation: `barPulse 0.65s ${i * 0.08}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    )}
    {badge && (
      <div className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-white/[0.05]">
        {badge}
      </div>
    )}
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    const params = new URLSearchParams(window.location.search);
    const show =
      params.get("logout") === "1" ||
      sessionStorage.getItem("postLogoutToast") === "1";
    if (show) {
      setToastMessage("Logged out successfully");
      sessionStorage.removeItem("postLogoutToast");
      if (params.get("logout") === "1") {
        params.delete("logout");
        const next = params.toString();
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`,
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(""), 1800);
    return () => clearTimeout(t);
  }, [toastMessage]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#03080f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{KEYFRAMES}</style>
      <Toast message={toastMessage} />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[-200px] h-[660px] w-[660px] -translate-x-1/2 rounded-full animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.17) 0%, transparent 65%)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute bottom-[-60px] right-[-80px] h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)",
          }}
        />
        {/* subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="fixed inset-x-0 top-0 z-50 h-[62px] backdrop-blur-xl"
        style={{
          animation: "slideDown 0.55s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Glass layer */}
        <div className="absolute inset-0 bg-[#03080f]/80" />

        {/* Bottom border that fades left and right */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(59,130,246,0.18) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
          }}
        />

        <div className="relative flex h-full items-center justify-between px-10">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[9px] border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.07]">
              {/* subtle glow behind logo on hover */}
              <div
                className="absolute inset-0 rounded-[9px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(59,130,246,0.25), transparent 70%)",
                }}
              />
              <img
                src={meetConnectLogo}
                alt="MeetConnect"
                className="relative h-full w-full scale-[2] object-contain"
              />
            </div>

            <div className="flex flex-col gap-0">
              <span
                className="text-[18px] font-bold leading-none tracking-[-0.02em] text-white transition-colors duration-200 group-hover:text-blue-100"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                MeetConnect
              </span>
            </div>
          </button>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="relative rounded-lg px-4 py-1.5 text-[13px] font-medium text-white/40 transition-all duration-200 hover:text-white/85 after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-blue-500/50 after:transition-all after:duration-200 after:-translate-x-1/2 hover:after:w-3/4"
            >
              Sign in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="group relative flex items-center gap-2 overflow-hidden rounded-[9px] bg-blue-600 px-5 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-blue-500 active:scale-[0.97]"
              style={{
                boxShadow:
                  "0 2px 16px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {/* shine sweep on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <svg
                width="11"
                height="11"
                fill="white"
                viewBox="0 0 24 24"
                className="opacity-80"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Get started
            </button>
          </div>
        </div>
      </header>
      {/* ── Hero ── */}
      <main className="relative z-10 flex min-h-screen items-center pt-16">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 items-center gap-16 px-10 py-20">
          {/* Copy */}
          <div
            style={{
              animation: "fadeUp 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3.5 py-1.5">
              <span className="h-[6px] w-[6px] rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.1em] text-blue-300/75 uppercase">
                Secure video collaboration
              </span>
            </div>

            <h1
              className="mb-5 leading-[0.93] tracking-[-0.04em]"
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(46px,5.4vw,72px)",
              }}
            >
              Meetings
              <br />
              that{" "}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                actually
              </span>
              <br />
              <span className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-transparent">
                work.
              </span>
            </h1>

            <p className="mb-9 max-w-[390px] text-[14.5px] leading-relaxed text-white/38 font-light">
              Crystal-clear calls, enterprise-grade security, and instant room
              joins from any browser — no downloads required.
            </p>

            <div className="mb-12 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95"
                style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.4)" }}
              >
                <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Start for free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-7 py-3 text-sm font-medium text-white/65 transition-all hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5"
              >
                Sign in
              </button>
            </div>

            <div className="flex items-stretch gap-8">
              {[
                ["50M+", "Users"],
                ["99.9%", "Uptime"],
                ["150+", "Countries"],
              ].map(([n, l], i) => (
                <React.Fragment key={l}>
                  {i > 0 && (
                    <div className="w-px self-stretch bg-white/[0.07]" />
                  )}
                  <div>
                    <p
                      className="text-[22px] font-bold tracking-tight"
                      style={{ fontFamily: "'Syne',sans-serif" }}
                    >
                      {n}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/22">
                      {l}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mock meeting UI */}
          <div
            className="relative"
            style={{
              animation: "fadeUp 0.7s 0.25s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Badge: joined */}
            <div
              className="absolute right-3 top-0 z-20 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#071120] px-3.5 py-2.5"
              style={{
                animation:
                  "floatIn 0.5s 0.65s cubic-bezier(0.22,1,0.36,1) both, bob 4.5s 1.8s ease-in-out infinite",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-[10px] font-bold text-emerald-100"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                MR
              </div>
              <div>
                <p className="text-[10px] text-white/30 leading-none mb-0.5">
                  Just joined
                </p>
                <p className="text-[12px] font-medium text-white/80">
                  Maya Rodriguez
                </p>
              </div>
              <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Badge: encrypted */}
            <div
              className="absolute bottom-16 right-[-14px] z-10 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#071120] px-3.5 py-2.5"
              style={{
                animation:
                  "floatIn 0.5s 0.85s cubic-bezier(0.22,1,0.36,1) both, bob 5s 2.2s ease-in-out infinite",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <svg className="h-3.5 w-3.5 fill-blue-400" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-white/80">
                  End-to-end encrypted
                </p>
                <p className="text-[10px] text-white/30 leading-none mt-0.5">
                  All calls secured
                </p>
              </div>
            </div>

            {/* Card */}
            <div
              className="overflow-hidden rounded-2xl border border-blue-200/[0.09] bg-[#0b1a30] p-5"
              style={{
                boxShadow:
                  "0 0 80px rgba(37,99,235,0.09), 0 40px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* Room header */}
              <div className="mb-3.5 flex items-center justify-between">
                <span
                  className="text-[13px] font-semibold text-white/45"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  Design Review · 4B
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-2.5 w-2.5 rounded-full border border-emerald-400/40 animate-ping" />
                    <span className="relative h-[7px] w-[7px] rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold tracking-widest text-emerald-400">
                    LIVE
                  </span>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                    4 joined
                  </span>
                </div>
              </div>

              {/* Audio visualiser */}
              <div className="mb-3.5 flex h-7 items-center justify-between gap-3 overflow-hidden rounded-lg border border-white/[0.05] bg-white/[0.025] px-3">
                <div className="flex items-end gap-[3px] h-4">
                  {[4, 9, 6, 13, 5, 10, 12, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-sm bg-blue-400/60"
                      style={{
                        height: h,
                        transformOrigin: "bottom",
                        animation: `barPulse 0.62s ${i * 0.07}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] tracking-wide text-white/20">
                  Alex speaking…
                </span>
              </div>

              {/* 2 × 2 tiles */}
              <div className="mb-3.5 grid grid-cols-2 gap-2.5">
                <Tile
                  initials="AK"
                  name="Alex Kim"
                  gradFrom="from-blue-900"
                  gradTo="to-blue-600"
                  textCol="text-blue-200"
                  isSpeaking
                  delay={0.38}
                  badge={<MicIcon stroke="#60a5fa" />}
                />
                <Tile
                  initials="SR"
                  name="Sara R."
                  gradFrom="from-emerald-900"
                  gradTo="to-emerald-600"
                  textCol="text-emerald-200"
                  delay={0.46}
                  badge={<MutedMic />}
                />
                <Tile
                  initials="JP"
                  name="James P."
                  gradFrom="from-violet-900"
                  gradTo="to-violet-600"
                  textCol="text-violet-200"
                  delay={0.54}
                  badge={<CamIcon stroke="rgba(200,200,255,0.25)" />}
                />
                <Tile
                  initials="LN"
                  name="Luna N."
                  gradFrom="from-orange-900"
                  gradTo="to-orange-600"
                  textCol="text-orange-200"
                  delay={0.62}
                  badge={
                    <span
                      className="text-base animate-bounce"
                      style={{ animationDuration: "2.2s" }}
                    >
                      👍
                    </span>
                  }
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                {[
                  {
                    icon: <MicIcon />,
                    cls: "border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.09]",
                  },
                  {
                    icon: <CamIcon />,
                    cls: "border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.09]",
                  },
                  {
                    icon: (
                      <svg
                        className="h-[17px] w-[17px]"
                        fill="#ef4444"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                      </svg>
                    ),
                    cls: "border-red-500/20 bg-red-500/12 hover:bg-red-500/22",
                  },
                  {
                    icon: <MoreIcon />,
                    cls: "border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.09]",
                  },
                ].map((b, i) => (
                  <button
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition-all duration-150 hover:scale-105 active:scale-95 ${b.cls}`}
                  >
                    {b.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#071120]/60 px-10 py-7">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between text-xs text-white/22">
          <p style={{ fontFamily: "'Syne',sans-serif" }}>
            © 2026 MeetConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="/privacy-policy"
              className="transition hover:text-white/55"
            >
              Privacy Policy
            </a>
            <span className="text-white/10">·</span>
            <a
              href="/terms-and-conditions"
              className="transition hover:text-white/55"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
