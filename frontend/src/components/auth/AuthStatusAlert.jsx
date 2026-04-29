import React from "react";
import { AppIcon } from "../../assets/icons/AppIcons";

const toneClassMap = {
  error: "border-red-400/35 bg-red-500/10 text-red-300",
  success: "border-emerald-400/35 bg-emerald-500/10 text-emerald-300",
};

const iconMap = {
  error: "alert",
  success: "check",
};

export default function AuthStatusAlert({ tone = "error", message }) {
  if (!message) return null;

  const classes = toneClassMap[tone] || toneClassMap.error;
  const iconName = iconMap[tone] || iconMap.error;

  return (
    <div className={`mb-5 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${classes}`}>
      <AppIcon
        name={iconName}
        size={16}
        className={tone === "error" ? "mt-0.5 shrink-0" : "shrink-0"}
      />
      <span>{message}</span>
    </div>
  );
}
