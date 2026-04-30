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
    <div className="hidden items-center gap-2 border-r border-white/10 pr-3 sm:flex sm:w-20">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
      <span className="text-xs font-medium tracking-wide text-white/60">
        {hours > 0 ? `${hours}:` : ""}
        {minutes}:{secs}
      </span>
    </div>
  );
};

const CircleButton = ({ onClick, title, active = true, danger = false, highlight = false, iconName, children }) => {
  const base = danger
    ? "bg-rose-600 text-white hover:bg-rose-500"
    : active
      ? "bg-white/10 text-white/90 hover:bg-white/20"
      : "bg-white/10 text-rose-300 hover:bg-white/20";

  return (
    <Tip label={title}>
      <button
        onClick={onClick}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition sm:h-11 sm:w-11 ${base} ${highlight ? "ring-2 ring-blue-500/70" : ""}`}
        aria-label={title}
      >
        {children || <AppIcon name={iconName} size={18} />}
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
  emojiOpen,
  unreadCount,
  onToggleVideo,
  onToggleAudio,
  onToggleScreen,
  onToggleChat,
  onToggleEmoji,
  onEndCall,
}) => {
  return (
    <div className="fixed bottom-3 left-1/2 z-[200] flex w-[calc(100%-1.5rem)] max-w-[540px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/90 px-3 py-2 shadow-2xl shadow-black/60 backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
      <Timer />

      <div className="flex items-center gap-1 sm:gap-1.5">
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

        <span className="mx-0.5 h-5 w-px bg-white/10 sm:mx-1 sm:h-6" />

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

        <CircleButton
          onClick={onToggleEmoji}
          active
          highlight={emojiOpen}
          title="Reactions"
        >
          <span className="text-base leading-none sm:text-lg">😊</span>
        </CircleButton>

        <span className="mx-0.5 h-5 w-px bg-white/10 sm:mx-1 sm:h-6" />

        <Tip label="Leave meeting">
          <button
            onClick={onEndCall}
            className="flex h-10 items-center gap-1.5 rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-900/30 transition hover:bg-rose-500 sm:h-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <AppIcon name="phoneOff" size={15} />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </Tip>
      </div>
    </div>
  );
};

export default Controls;
