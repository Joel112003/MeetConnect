import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import { api } from "../services/api";
import {
  formatValidationError,
  normalizeEmail,
  validateEmail,
  validateOtp,
  validateResetPasswordForm,
} from "../utils/validators";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = useMemo(() => {
    if (step === 1) return "Forgot password";
    if (step === 2) return "Verify OTP";
    return "Set new password";
  }, [step]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    resetMessages();

    const normalizedEmail = normalizeEmail(email);
    const emailValidation = validateEmail(normalizedEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    try {
      setLoading(true);
      const data = await api.requestPasswordOtp(normalizedEmail);
      setEmail(normalizedEmail);
      setSuccess("OTP sent successfully. Please check your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();

    const otpValidation = validateOtp(otp);
    if (!otpValidation.isValid) {
      setError(otpValidation.error);
      return;
    }

    try {
      setLoading(true);
      await api.verifyPasswordOtp(email, otp.trim());
      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();

    const validation = validateResetPasswordForm({
      newPassword,
      confirmPassword,
    });
    if (!validation.isValid) {
      setError(formatValidationError(validation.errors));
      return;
    }

    try {
      setLoading(true);
      await api.resetPassword(email, newPassword);
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <AppIcon name="lock" size={19} className="text-white" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/95 p-8 shadow-2xl shadow-black/50 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-sm text-white/50">Recover your MeetConnect account access</p>
          </div>

          {error ? (
            <div className="mb-5 rounded-xl border border-red-400/35 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
              {success}
            </div>
          ) : null}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <label className="block text-sm text-white/70" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2" aria-hidden="true">
                    <span className="h-4 w-4 animate-pulse rounded-full bg-white/40" />
                    <span className="h-3 w-24 animate-pulse rounded bg-white/40" />
                  </span>
                ) : "Send OTP"}
              </button>
            </form>
          ) : null}

          {step === 2 ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <label className="block text-sm text-white/70" htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm tracking-[0.2em] text-white outline-none placeholder:tracking-normal placeholder:text-white/30 focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2" aria-hidden="true">
                    <span className="h-4 w-4 animate-pulse rounded-full bg-white/40" />
                    <span className="h-3 w-24 animate-pulse rounded bg-white/40" />
                  </span>
                ) : "Verify OTP"}
              </button>
            </form>
          ) : null}

          {step === 3 ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <label className="block text-sm text-white/70" htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                disabled={loading}
              />

              <label className="block text-sm text-white/70" htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2" aria-hidden="true">
                    <span className="h-4 w-4 animate-pulse rounded-full bg-white/40" />
                    <span className="h-3 w-24 animate-pulse rounded bg-white/40" />
                  </span>
                ) : "Reset Password"}
              </button>
            </form>
          ) : null}

          <button
            type="button"
            className="mt-6 w-full text-center text-sm font-medium text-blue-300 hover:text-blue-200"
            onClick={() => navigate("/login")}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
