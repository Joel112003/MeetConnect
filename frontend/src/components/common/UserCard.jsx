import React from "react";
import Skeleton from "./Skeleton";

export default function UserCard({ loading = false, user }) {
  if (loading) {
    return <Skeleton type="avatar" />;
  }

  const safeUser = {
    name: user?.name || "Unknown User",
    role: user?.role || "Member",
    email: user?.email || "unknown@example.com",
    avatarUrl: user?.avatarUrl || "",
  };

  return (
    <article className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-800">
          {safeUser.avatarUrl ? (
            <img
              src={safeUser.avatarUrl}
              alt={`${safeUser.name} avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
              {safeUser.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-white">{safeUser.name}</h3>
          <p className="mt-0.5 text-sm text-blue-300">{safeUser.role}</p>
          <p className="mt-1 truncate text-sm text-white/55">{safeUser.email}</p>
        </div>
      </div>
    </article>
  );
}
