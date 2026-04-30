import React, { useEffect, useState } from "react";
import { AppIcon } from "../../assets/icons/AppIcons";
import { isValidMeetingCode } from "../../utils/meetingUtils";
import { api } from "../../services/api";

export default function JoinMeetingModal({ open, onClose, onJoin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);


  useEffect(() => {
    if (open) {
      setCode("");
      setError("");
      setValidating(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    const normalized = code.trim();

    if (!normalized) {
      setError("Enter a meeting code to continue");
      return;
    }

    if (!isValidMeetingCode(normalized)) {
      setError("Enter a valid alphanumeric meeting code");
      return;
    }

    // validate code
    setValidating(true);
    setError("");
    try {
      const result = await api.validateMeetingCode(normalized);
      if (!result?.valid) {
        setError("Meeting not found. Check the code and try again.");
        setValidating(false);
        return;
      }
      setError("");
      onJoin(normalized);
    } catch (err) {
      setError(err?.message || "Unable to verify meeting code. Try again.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Join a meeting</h2>
            <p className="mt-1 text-sm text-white/45">Enter the code shared with you.</p>
          </div>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <AppIcon name="x" size={14} />
          </button>
        </div>

        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/35" htmlFor="meeting-code">
          Meeting code
        </label>
        <input
          id="meeting-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !validating) handleSubmit();
          }}
          maxLength={20}
          disabled={validating}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-lg font-bold tracking-[0.25em] text-white outline-none placeholder:text-white/35 focus:border-blue-500 disabled:opacity-50"
          placeholder="e.g. A1B2C3"
        />

        {error ? <p className="mt-2 text-sm font-medium text-red-400">{error}</p> : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            type="button"
            disabled={validating}
            className="rounded-xl border border-white/15 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={validating}
            className="rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {validating ? "Checking..." : "Join meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
