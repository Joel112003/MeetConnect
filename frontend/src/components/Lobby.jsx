import React, { useEffect, useRef, useState } from "react";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import Toast from "./common/Toast";

const Lobby = ({ username, onJoin, localStream, meetingCode }) => {
  const localVideoRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-6 py-10 lg:flex-row lg:gap-12">
      <Toast message={toastMessage} />

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

      <section className="w-full max-w-[360px] space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-white">
            <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">MeetConnect</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ready to join?</h1>
          <p className="mt-1 text-sm text-white/55">Your account username is used automatically</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/35" htmlFor="lobby-user">
            Username
          </label>
          <input
            id="lobby-user"
            type="text"
            readOnly
            value={username}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        {meetingCode ? (
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-[0.12em] text-white/35">Meeting ID</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
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
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Join now
        </button>

        <p className="text-center text-xs text-white/35">By joining, you agree to our terms of service</p>
      </section>
    </div>
  );
};

export default Lobby;
