import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateLoginForm, formatValidationError } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import AuthPageShell from "../components/auth/AuthPageShell";
import AuthInputField from "../components/auth/AuthInputField";
import AuthStatusAlert from "../components/auth/AuthStatusAlert";
import AuthActionButton from "../components/auth/AuthActionButton";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validation = validateLoginForm({ email, password });
    if (!validation.isValid) {
      setError(formatValidationError(validation.errors));
      return;
    }
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

  const handleGoogleSuccess = async (response) => {
    const googleToken = response?.credential || response?.access_token;
    if (!googleToken) {
      setError("Google sign-in failed");
      return;
    }

    setError("");
    setSuccess("");
    const result = await googleLogin(googleToken);
    if (result.success) {
      setSuccess("Google login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 300);
    } else {
      setError(result.error || "Google login failed");
    }
  };

  const triggerGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google sign-in failed"),
  });

  return (
    <AuthPageShell
      heading="Welcome back"
      subheading="Sign in to your MeetConnect account"
      rightActionLabel="Create account"
      rightActionTo="/signup"
    >

            <AuthStatusAlert tone="error" message={error} />
            <AuthStatusAlert tone="success" message={success} />

            <form onSubmit={handleLogin} className="space-y-4">
              <AuthInputField
                label="Email address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authLoading}
                icon="mail"
              />

              <AuthInputField
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                icon="lock"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={authLoading}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </a>
              </div>

              <AuthActionButton
                type="submit"
                disabled={authLoading}
                loading={authLoading}
                loadingLabel="Signing in..."
                label="Sign in"
              >
                Sign in
              </AuthActionButton>
            </form>


            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/30 font-medium tracking-wider uppercase">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <AuthActionButton
              type="button"
              onClick={() => triggerGoogle()}
              disabled={authLoading}
              loading={authLoading}
              loadingLabel="Connecting Google..."
              variant="secondary"
              className="mb-5 mt-0 py-3"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </AuthActionButton>

            <p className="mt-6 text-center text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Create one
              </a>
            </p>
    </AuthPageShell>
  );
}
