import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import Toast from "../components/common/Toast";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

const getSafeValue = (value) => (typeof value === "string" ? value : "");

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, updateUserInContext, refreshUser, logout } = useAuth();

  const [toast, setToast] = useState("");
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingSecurity, setSubmittingSecurity] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setProfileForm({
      username: getSafeValue(user?.username),
      email: getSafeValue(user?.email),
    });
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "N/A";
    const date = new Date(user.createdAt);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  }, [user?.createdAt]);

  const handleProfileChange = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();

    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      setToast("Username and email are required");
      return;
    }

    setSubmittingProfile(true);
    try {
      const response = await api.updateProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim().toLowerCase(),
      });

      if (response?.user) {
        updateUserInContext({ user: response.user });
      }
      await refreshUser();
      setToast(response?.message || "Profile updated successfully");
    } catch (err) {
      setToast(err.message || "Failed to update profile");
    } finally {
      setSubmittingProfile(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setToast("Please fill all password fields");
      return;
    }

    setSubmittingPassword(true);
    try {
      const response = await api.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword,
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setToast(response?.message || "Password changed successfully");
    } catch (err) {
      setToast(err.message || "Failed to change password");
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setSubmittingSecurity(true);
    try {
      const response = await api.logoutAllDevices();
      await logout();
      sessionStorage.setItem("postLogoutToast", "1");
      navigate("/?logout=1", { replace: true });
      setToast(response?.message || "Logged out from all devices");
    } catch (err) {
      setToast(err.message || "Failed to logout all devices");
    } finally {
      setSubmittingSecurity(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Toast message={toast} />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
          <button
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <AppIcon name="arrowLeft" size={14} />
            Back to dashboard
          </button>

          <p className="text-sm font-semibold">Account settings</p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-5 py-8 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-5">
          <form
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
            onSubmit={submitProfile}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400">
                <AppIcon name="user" size={16} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile details</h2>
                <p className="text-xs text-white/45">Update your public account information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs text-white/60">Username</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none ring-blue-500/40 transition focus:ring"
                  value={profileForm.username}
                  onChange={(e) => handleProfileChange("username", e.target.value)}
                  type="text"
                  placeholder="Your username"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs text-white/60">Email</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none ring-blue-500/40 transition focus:ring"
                  value={profileForm.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                />
              </label>

            </div>

            <button
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submittingProfile}
              type="submit"
            >
              <AppIcon name="check" size={14} />
              {submittingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>

          <form
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
            onSubmit={submitPassword}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-300">
                <AppIcon name="lock" size={16} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Change password</h2>
                <p className="text-xs text-white/45">Use a strong password with at least 6 characters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-1.5">
                <span className="text-xs text-white/60">Current password</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none ring-amber-400/30 transition focus:ring"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  type="password"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs text-white/60">New password</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none ring-amber-400/30 transition focus:ring"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  type="password"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs text-white/60">Confirm new password</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none ring-amber-400/30 transition focus:ring"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  type="password"
                />
              </label>
            </div>

            <button
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submittingPassword}
              type="submit"
            >
              <AppIcon name="shield" size={14} />
              {submittingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white/85">Security status</h3>
            <div className="space-y-2 text-sm text-white/65">
              <p>Member since: {memberSince}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5">
            <h3 className="mb-2 text-sm font-semibold text-red-300">Logout all devices</h3>
            <p className="mb-4 text-sm text-red-200/80">
              This will revoke all active sessions and require login again on every device.
            </p>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submittingSecurity}
              onClick={handleLogoutAllDevices}
              type="button"
            >
              <AppIcon name="logout" size={14} />
              {submittingSecurity ? "Processing..." : "Logout all devices"}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
