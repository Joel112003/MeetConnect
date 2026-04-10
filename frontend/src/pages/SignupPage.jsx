import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignupForm, formatValidationError } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";

function Field({
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
      <label htmlFor={id} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
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

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validation = validateSignupForm(formData);
    if (!validation.isValid) {
      setError(formatValidationError(validation.errors));
      return;
    }
    try {
      const result = await signup(
        formData.username,
        formData.email,
        formData.password,
      );
      if (result.success) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
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
            onClick={() => navigate("/login")}
            type="button"
          >
            Sign in
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
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">Create account</h1>
            <p className="text-sm text-white/50">Join MeetConnect - it only takes a moment</p>
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

          <form onSubmit={handleSignup} className="space-y-4">
            <Field
              label="Username"
              id="username"
              name="username"
              placeholder="john_doe"
              value={formData.username}
              onChange={handleChange}
              disabled={authLoading}
              icon="user"
            />

            <Field
              label="Email address"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={authLoading}
              icon="mail"
            />

            <Field
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={authLoading}
              icon="lock"
            />

            <Field
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={authLoading}
              icon="shield"
            />

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
            >
              {authLoading ? (
                <>
                  <span className="animate-spin">
                    <AppIcon name="refresh" size={16} />
                  </span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
