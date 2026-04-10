const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      headers,
      ...options,
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const error = new Error(data.message || "Something went wrong");
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export const api = {
  login: (email, password) =>
    request("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => request("/api/v1/users/me"),

  updateProfile: (payload) =>
    request("/api/v1/users/update-profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    request("/api/v1/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    }),

  logoutAllDevices: () =>
    request("/api/v1/users/logout-all-devices", {
      method: "POST",
    }),

  signup: (username, email, password) =>
    request("/api/v1/users/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  logout: () =>
    request("/api/v1/users/logout", {
      method: "POST",
    }),

  getHistoryOfUser: () => request("/api/v1/users/history"),

  addMeetingToHistory: (meetingCode) =>
    request("/api/v1/users/history", {
      method: "POST",
      body: JSON.stringify({ meetingCode }),
    }),

  requestPasswordOtp: (email) =>
    request("/api/v1/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyPasswordOtp: (email, otp) =>
    request("/api/v1/users/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email, newPassword) =>
    request("/api/v1/users/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    }),
};
