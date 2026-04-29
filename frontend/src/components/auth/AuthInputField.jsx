import React from "react";
import { AppIcon } from "../../assets/icons/AppIcons";

export default function AuthInputField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  icon,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
          <AppIcon name={icon} size={16} />
        </span>
        <input
          id={id}
          name={name || id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
