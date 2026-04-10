import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateLoginForm, formatValidationError } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";

function Field({ label, id, type = "text", placeholder, value, onChange, disabled, icon }) {
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

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const validation = validateLoginForm({ email, password });
    if (!validation.isValid) { setError(formatValidationError(validation.errors)); return; }
    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_55%)]" />

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-blue-200/10 bg-[#03080f]/80 px-10 backdrop-blur-xl animate-slide-down">
        <button
          className="flex items-center gap-2.5"
          onClick={() => navigate("/")}
          type="button"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[9px]">
            <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-white">MeetConnect</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            onClick={() => navigate("/")}
            type="button"
          >
            Home
          </button>
          <button
            className="rounded-[9px] bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(37,99,235,0.3)] transition hover:bg-blue-500 hover:-translate-y-px"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Create account
          </button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen items-center justify-center pt-16">
        <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl">
            <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/95 p-8 shadow-2xl shadow-black/50 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-white/50">Sign in to your MeetConnect account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/35 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
              <AppIcon name="alert" size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
              <AppIcon name="check" size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email address" id="email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              disabled={authLoading} icon="mail" />

            <Field label="Password" id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading} icon="lock" />

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox" checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={authLoading}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit" disabled={authLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
            >
              {authLoading ? (
                <>
                  <span className="animate-spin">
                    <AppIcon name="refresh" size={16} />
                  </span>
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
              Create one
            </a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}