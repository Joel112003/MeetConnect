// components/EmojiOverlay.jsx
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function EmojiOverlay() {
  const { socket } = useSocket();
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const spawnEmoji = ({ emoji, senderName }) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 70 + 10;
    setFloatingEmojis((prev) => [...prev, { id, emoji, senderName, x }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2500);
  };

  useEffect(() => {
    if (!socket) return;

    const handleShowEmoji = (e) => spawnEmoji(e.detail);

    socket.on("receive-emoji", spawnEmoji);
    window.addEventListener("show-emoji", handleShowEmoji);

    return () => {
      socket.off("receive-emoji", spawnEmoji);
      window.removeEventListener("show-emoji", handleShowEmoji);
    };
  }, [socket]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
      {floatingEmojis.map(({ id, emoji, senderName, x }) => (
        <div key={id} style={{
          position: "absolute", bottom: "15%", left: `${x}%`,
          animation: "floatUp 2.5s ease-out forwards",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "36px" }}>{emoji}</div>
          <div style={{ fontSize: "12px", color: "#fff", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "2px 6px" }}>
            {senderName}
          </div>
        </div>
      ))}
    </div>
  );
}