import React, { useEffect, useState } from "react";
import { AppIcon } from "../assets/icons/AppIcons";

const Tip = ({ label, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show ? (
        <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-white/80">
          {label}
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-zinc-800" />
        </div>
      ) : null}
    </div>
  );
};

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex w-20 items-center gap-2 border-r border-white/10 pr-3">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
      <span className="text-xs font-medium tracking-wide text-white/60">
        {hours > 0 ? `${hours}:` : ""}
        {minutes}:{secs}
      </span>
    </div>
  );
};

const CircleButton = ({ onClick, title, active = true, danger = false, highlight = false, iconName }) => {
  const base = danger
    ? "bg-rose-600 text-white hover:bg-rose-500"
    : active
      ? "bg-white/10 text-white/90 hover:bg-white/20"
      : "bg-white/10 text-rose-300 hover:bg-white/20";

  return (
    <Tip label={title}>
      <button
        onClick={onClick}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${base} ${highlight ? "ring-2 ring-blue-500/70" : ""}`}
        aria-label={title}
      >
        <AppIcon name={iconName} size={18} />
        {!active && !danger ? (
          <span className="pointer-events-none absolute inset-[-1px] rounded-full border border-rose-400/60" />
        ) : null}
      </button>
    </Tip>
  );
};

const Controls = ({
  videoEnabled,
  audioEnabled,
  screenSharing,
  screenAvailable,
  chatOpen,
  unreadCount,
  onToggleVideo,
  onToggleAudio,
  onToggleScreen,
  onToggleChat,
  onEndCall,
}) => {
  return (
    <div className="fixed bottom-5 left-1/2 z-[200] flex min-w-[500px] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-zinc-900/90 px-4 py-2 shadow-2xl shadow-black/60 backdrop-blur-xl max-sm:min-w-[90vw] max-sm:flex-wrap max-sm:justify-center max-sm:rounded-2xl">
      <Timer />

      <div className="flex items-center gap-1">
        <CircleButton
          onClick={onToggleAudio}
          active={audioEnabled}
          title={audioEnabled ? "Mute" : "Unmute"}
          iconName={audioEnabled ? "mic" : "micOff"}
        />

        <CircleButton
          onClick={onToggleVideo}
          active={videoEnabled}
          title={videoEnabled ? "Stop video" : "Start video"}
          iconName={videoEnabled ? "camera" : "cameraOff"}
        />

        <span className="mx-1 h-6 w-px bg-white/10" />

        {screenAvailable ? (
          <CircleButton
            onClick={onToggleScreen}
            active={!screenSharing}
            highlight={screenSharing}
            title={screenSharing ? "Stop share" : "Share screen"}
            iconName={screenSharing ? "screenOff" : "screen"}
          />
        ) : null}

        <div className="relative">
          <CircleButton
            onClick={onToggleChat}
            active
            highlight={chatOpen}
            title="Chat"
            iconName="chat"
          />
          {unreadCount > 0 && !chatOpen ? (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-900 bg-blue-500 px-1 text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </div>

        <span className="mx-1 h-6 w-px bg-white/10" />

        <Tip label="Leave meeting">
          <button
            onClick={onEndCall}
            className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:bg-rose-500"
          >
            <AppIcon name="phoneOff" size={15} />
            <span>Leave</span>
          </button>
        </Tip>
      </div>

      <div className="w-20 max-sm:hidden" />
    </div>
  );
};

export default Controls;
