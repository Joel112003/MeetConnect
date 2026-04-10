import React from "react";

export default function StatCard({ value, label, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/35">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="text-xs font-medium text-white/45">{label}</p>
      </div>
    </div>
  );
}
