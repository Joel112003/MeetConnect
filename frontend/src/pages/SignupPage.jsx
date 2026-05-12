import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignupForm, formatValidationError } from "../utils/validators";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import AuthPageShell from "../components/auth/AuthPageShell";
import AuthInputField from "../components/auth/AuthInputField";
import AuthStatusAlert from "../components/auth/AuthStatusAlert";
import AuthActionButton from "../components/auth/AuthActionButton";

const USERNAME_STATUS = {
  IDLE: "idle",
  CHECKING: "checking",
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  ERROR: "validation-error",
};

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
  const [usernameStatus, setUsernameStatus] = useState({
    state: USERNAME_STATUS.IDLE,
    message: "",
  });
  const [usernameTouched, setUsernameTouched] = useState(false);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "username") {
      setUsernameTouched(true);
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < 2) {
        setUsernameStatus({ state: USERNAME_STATUS.IDLE, message: "" });
      } else {
        setUsernameStatus({ state: USERNAME_STATUS.CHECKING, message: "" });
      }
    }
  };

  useEffect(() => {
    if (!usernameTouched) return;

    const trimmed = formData.username.trim();

    if (!trimmed || trimmed.length < 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await api.checkUsernameAvailability(trimmed);
        if (result?.available) {
          setUsernameStatus({
            state: USERNAME_STATUS.AVAILABLE,
            message: "Username is available",
          });
        } else {
          setUsernameStatus({
            state: USERNAME_STATUS.UNAVAILABLE,
            message: "Username is already taken",
          });
        }
      } catch (err) {
        setUsernameStatus({
          state: USERNAME_STATUS.ERROR,
          message: err.message || "Unable to validate username",
        });
      }
    }, 450);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData.username, usernameTouched]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      usernameStatus.state === USERNAME_STATUS.CHECKING ||
      usernameStatus.state === USERNAME_STATUS.UNAVAILABLE ||
      usernameStatus.state === USERNAME_STATUS.ERROR
    ) {
      setError(usernameStatus.message || "Please choose a valid username");
      return;
    }

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
        if (result.status === 400 && /username/i.test(result.error || "")) {
          setUsernameStatus({
            state: USERNAME_STATUS.UNAVAILABLE,
            message: result.error,
          });
        }
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    }
  };

  const trimmedUsername = formData.username.trim();
  const syncUsernameError =
    !trimmedUsername
      ? "Username is required"
      : trimmedUsername.length < 2
        ? "Username must be at least 2 characters"
        : "";

  const derivedStatus = syncUsernameError
    ? { state: USERNAME_STATUS.ERROR, message: syncUsernameError }
    : usernameStatus;

  const isChecking = derivedStatus.state === USERNAME_STATUS.CHECKING;
  const isUnavailable = derivedStatus.state === USERNAME_STATUS.UNAVAILABLE;
  const isValidationError = derivedStatus.state === USERNAME_STATUS.ERROR;
  const isAvailable = derivedStatus.state === USERNAME_STATUS.AVAILABLE;

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
              <div>
                <AuthInputField
                  label="Username"
                  id="username"
                  name="username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={authLoading}
                  icon="user"
                />
                {usernameTouched && (
                  <p
                    className={`mt-1 text-xs ${
                      isAvailable
                        ? "text-emerald-300"
                        : isChecking
                          ? "text-white/50"
                          : "text-red-300"
                    }`}
                  >
                    {isChecking && "Checking username availability..."}
                    {isAvailable && "Username is available"}
                    {(isUnavailable || isValidationError) &&
                      (derivedStatus.message || "Username is unavailable")}
                  </p>
                )}
              </div>

              <AuthInputField label="Email address" id="email" name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} disabled={authLoading} icon="mail" />

              <AuthInputField label="Password" id="password" name="password" type="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} disabled={authLoading} icon="lock" />

              <AuthInputField label="Confirm password" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange} disabled={authLoading} icon="shield" />

              <AuthActionButton
                type="submit"
                disabled={authLoading || isChecking || isUnavailable || isValidationError}
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