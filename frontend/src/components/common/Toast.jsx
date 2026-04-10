import React from "react";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-4 z-[300] -translate-x-1/2 rounded-xl border border-white/15 bg-zinc-900/95 px-4 py-2.5 text-sm font-semibold text-white shadow-2xl">
      {message}
    </div>
  );
}
