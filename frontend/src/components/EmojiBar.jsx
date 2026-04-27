
import { useSocket } from "../hooks/useSocket";

const EMOJIS = ["❤️", "😂", "👏", "🔥", "😮", "🎉"];

export default function EmojiBar({ senderName }) {
  const { socket } = useSocket();

  const sendEmoji = (emoji) => {
    if (!socket) return;

    socket.emit("send-emoji", { emoji, senderName });


    window.dispatchEvent(new CustomEvent("show-emoji", { detail: { emoji, senderName } }));
  };

  return (
    <div className="flex items-center gap-2">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => sendEmoji(emoji)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-2xl transition hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
          aria-label={`Send ${emoji} reaction`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}