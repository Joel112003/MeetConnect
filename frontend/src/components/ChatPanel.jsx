import React, { useEffect, useRef } from "react";
import { AppIcon } from "../assets/icons/AppIcons";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const avatarVariants = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

const avatarClassForName = (name = "") => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return avatarVariants[Math.abs(hash) % avatarVariants.length];
};

const ChatPanel = ({ messages, messageInput, onMessageChange, onSend, onClose }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInputChange = (e) => {
    onMessageChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
  };

  return (
    <aside className="fixed inset-0 z-[150] flex flex-col bg-zinc-900 pb-20 shadow-2xl shadow-black/50 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-80 sm:border-l sm:border-white/10 sm:pb-0">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="text-sm font-semibold text-white/90">In-meeting chat</h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Close chat"
        >
          <AppIcon name="x" size={14} />
        </button>
      </header>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/40">
              <AppIcon name="chat" size={22} />
            </div>
            <p className="text-sm font-semibold text-white/55">No messages yet</p>
            <p className="mt-1 text-xs text-white/35">Messages are visible to everyone in the meeting</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
            return (
              <div key={index} className={`flex gap-2.5 ${showAvatar ? "mt-4" : "mt-1"}`}>
                <div className="w-8 shrink-0 pt-0.5">
                  {showAvatar ? (
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarClassForName(msg.sender)}`}
                    >
                      {getInitials(msg.sender)}
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  {showAvatar ? (
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-white/85">{msg.sender}</span>
                      <span className="text-[10px] text-white/35">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ) : null}
                  <p className="break-words text-sm leading-relaxed text-white/70">{msg.data}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <footer className="border-t border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <textarea
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Send a message to everyone"
            className="max-h-24 min-h-[22px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
          <button
            onClick={onSend}
            disabled={!messageInput.trim()}
            className="rounded-lg p-2 text-white transition enabled:bg-blue-600 enabled:hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/45"
            aria-label="Send message"
          >
            <AppIcon name="send" size={15} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-white/30">Press Enter to send</p>
      </footer>
    </aside>
  );
};

export default ChatPanel;
