import React from "react";
import { useNavigate } from "react-router-dom";
import meetConnectLogo from "../../assets/images/MeetConnect.png";

export default function AuthPageShell({
  heading,
  subheading,
  rightActionLabel,
  rightActionTo,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_55%)]" />

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-blue-200/10 bg-[#03080f]/80 px-10 backdrop-blur-xl animate-slide-down">
        <button
          className="flex items-center gap-2.5"
          onClick={() => navigate("/")}
          type="button"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[9px]">
            <img
              src={meetConnectLogo}
              alt="MeetConnect logo"
              className="h-full w-full scale-225 object-contain"
            />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-white">
            MeetConnect
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            onClick={() => navigate("/")}
            type="button"
          >
            Home
          </button>
          <button
            className="rounded-[9px] bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(37,99,235,0.3)] transition hover:bg-blue-500 hover:-translate-y-px"
            onClick={() => navigate(rightActionTo)}
            type="button"
          >
            {rightActionLabel}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen items-center justify-center pt-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl">
              <img
                src={meetConnectLogo}
                alt="MeetConnect logo"
                className="h-full w-full scale-225 object-contain"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/95 p-8 shadow-2xl shadow-black/50 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">
                {heading}
              </h1>
              <p className="text-sm text-white/50">{subheading}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
