import React from "react";
import { Skeleton } from "boneyard-js/react";

export default function ActionCard({
  icon,
  title,
  description,
  cta,
  onClick,
  accentClass,
  loading = false,
}) {
  return (
    <Skeleton
      name="dashboard-action-card"
      loading={loading}
      animate="shimmer"
      transition={220}
      className="w-full"
      fallback={
        <div className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-7 text-left">
          <div className="mb-5 h-12 w-12 rounded-xl bg-white/10" />
          <div className="mb-2 h-5 w-44 rounded bg-white/10" />
          <div className="mb-2 h-3 w-full rounded bg-white/10" />
          <div className="mb-5 h-3 w-11/12 rounded bg-white/10" />
          <div className="h-4 w-24 rounded bg-white/10" />
        </div>
      }
    >
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
    </Skeleton>
  );
}
