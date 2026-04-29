import React from "react";
import { Skeleton } from "boneyard-js/react";

export default function AuthActionButton({
  type = "button",
  disabled,
  loading,
  label,
  loadingLabel,
  onClick,
  variant = "primary",
  className = "",
  children,
}) {
  const baseClassName = "mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm transition disabled:cursor-not-allowed";

  const variantClassName =
    variant === "secondary"
      ? "border border-white/10 bg-white/5 font-medium text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-50"
      : "bg-blue-600 font-semibold text-white hover:bg-blue-500 disabled:bg-blue-800";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClassName} ${variantClassName} ${className}`.trim()}
    >
      {loading ? (
        <Skeleton
          name="auth-action-button"
          loading
          className="w-full"
          fallback={
            <span className="flex w-full items-center justify-center gap-2" aria-hidden="true">
              <span className="h-4 w-4 animate-pulse rounded-full bg-white/40" />
              <span className="h-3 w-28 animate-pulse rounded bg-white/40" />
            </span>
          }
        >
          <span className="inline-flex items-center justify-center gap-2.5 leading-none">{children || label}</span>
        </Skeleton>
      ) : (
        <span className="inline-flex items-center justify-center gap-2.5 leading-none">{children || label}</span>
      )}
      {loading ? <span className="sr-only">{loadingLabel || "Loading"}</span> : null}
    </button>
  );
}
