import React from "react";
import { Skeleton } from "boneyard-js/react";

export default function StatCard({ value, label, icon, loading = false }) {
  return (
    <Skeleton
      name="dashboard-stat-card"
      loading={loading}
      animate="shimmer"
      transition={220}
      className="w-full"
      fallback={
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-7 w-14 rounded bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/10" />
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/35">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
          <p className="text-xs font-medium text-white/45">{label}</p>
        </div>
      </div>
    </Skeleton>
  );
}
