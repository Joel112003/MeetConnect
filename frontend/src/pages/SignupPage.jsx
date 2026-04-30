import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignupForm, formatValidationError } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import AuthPageShell from "../components/auth/AuthPageShell";
import AuthInputField from "../components/auth/AuthInputField";
import AuthStatusAlert from "../components/auth/AuthStatusAlert";
import AuthActionButton from "../components/auth/AuthActionButton";

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
      const result = await signup(formData.username, formData.email, formData.password);
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
    <AuthPageShell
      heading="Create account"
      subheading="Join MeetConnect - it only takes a moment"
      rightActionLabel="Sign in"
      rightActionTo="/login"
    >

            <AuthStatusAlert tone="error" message={error} />
            <AuthStatusAlert tone="success" message={success} />

            <form onSubmit={handleSignup} className="space-y-4">
              <AuthInputField label="Username" id="username" name="username" placeholder="john_doe"
                value={formData.username} onChange={handleChange} disabled={authLoading} icon="user" />

              <AuthInputField label="Email address" id="email" name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} disabled={authLoading} icon="mail" />

              <AuthInputField label="Password" id="password" name="password" type="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} disabled={authLoading} icon="lock" />

              <AuthInputField label="Confirm password" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange} disabled={authLoading} icon="shield" />

              <AuthActionButton
                type="submit"
                disabled={authLoading}
                loading={authLoading}
                loadingLabel="Creating account..."
                label="Create account"
              >
                Create account
              </AuthActionButton>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                Sign in
              </a>
            </p>
    </AuthPageShell>
  );
}