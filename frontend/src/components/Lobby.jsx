import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import Toast from "./common/Toast";

const Lobby = ({ username, onJoin, localStream, meetingCode }) => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    // release video element
    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
        localVideoRef.current.pause();
      }
    };
  }, [localStream]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleCopy = async () => {
    if (!meetingCode) return;

    try {
      await navigator.clipboard.writeText(meetingCode);
      setCopied(true);
      setToastMessage("Meeting code copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage("Unable to copy meeting code");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:flex-row lg:gap-12">
      <Toast message={toastMessage} />


      <button
        onClick={() => navigate("/dashboard")}
        className="absolute left-4 top-4 inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:left-6 sm:top-6"
        type="button"
      >
        <AppIcon name="arrowLeft" size={16} />
        <span className="hidden sm:inline">Back</span>
      </button>


      <section className="w-full max-w-[440px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full scale-x-[-1] object-cover"
          />

          {!localStream ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white/20">
              <AppIcon name="camera" size={32} />
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
            {username || "You"}
          </div>
        </div>
      </section>


      <section className="w-full max-w-[360px] space-y-5 sm:space-y-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl text-white sm:h-10 sm:w-10">
            <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">MeetConnect</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to join?</h1>
          <p className="mt-1 text-xs text-white/55 sm:text-sm">Your account username is used automatically</p>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-white/35 sm:mb-2 sm:text-xs" htmlFor="lobby-user">
            Username
          </label>
          <input
            id="lobby-user"
            type="text"
            readOnly
            value={username}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none sm:px-4 sm:py-3"
          />
        </div>

        {meetingCode ? (
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-white/35 sm:text-xs">Meeting ID</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white min-h-[32px]"
              >
                <AppIcon name={copied ? "check" : "link"} size={13} />
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="font-mono text-left text-sm font-semibold tracking-[0.1em] text-white underline-offset-4 transition hover:text-blue-300 hover:underline"
            >
              {meetingCode}
            </button>
          </div>
        ) : null}

        <button
          onClick={onJoin}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 min-h-[44px]"
        >
          Join now
        </button>

        <p className="text-center text-[11px] text-white/35 sm:text-xs">By joining, you agree to our terms of service</p>
      </section>
    </div>
  );
};

export default Lobby;
