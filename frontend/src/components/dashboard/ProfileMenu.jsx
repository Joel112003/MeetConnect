import React, { useEffect } from "react";
import { AppIcon } from "../../assets/icons/AppIcons";

export default function ProfileMenu({ user, onLogout, onClose, onOpenSettings }) {
  useEffect(() => {
    const onDown = (event) => {
      if (!event.target.closest("#profile-menu")) onClose();
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return (
    <div
      id="profile-menu"
      className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
    >
      <div className="border-b border-white/10 px-4 py-3">
        <p className="truncate text-sm font-semibold text-white">{user?.username || "User"}</p>
        <p className="truncate text-xs text-white/45">{user?.email || ""}</p>
      </div>

      <div className="p-1.5">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          onClick={onOpenSettings}
          type="button"
        >
          <AppIcon name="user" size={14} />
          Profile settings
        </button>
      </div>

      <div className="border-t border-white/10 p-1.5">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/15"
          onClick={onLogout}
          type="button"
        >
          <AppIcon name="logout" size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}
