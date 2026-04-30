import React from "react";
import Skeleton from "../common/Skeleton";

export default function ActionCard({
  icon,
  title,
  description,
  cta,
  onClick,
  accentClass,
  loading = false,
}) {
  if (loading) {
    return <Skeleton type="action" />;
  }

  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-2xl border border-white/10 bg-zinc-900 p-7 text-left transition hover:border-white/20 hover:bg-zinc-800"
      type="button"
    >
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accentClass}`}>
        {icon}
      </div>
      <p className="mb-1 text-base font-semibold text-white">{title}</p>
      <p className="mb-5 text-sm leading-6 text-white/45">{description}</p>
      <span className="text-sm font-semibold text-blue-400">{cta} -&gt;</span>
    </button>
  );
}
