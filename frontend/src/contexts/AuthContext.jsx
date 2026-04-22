import  { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

const USER_CACHE_KEY = "userProfile";

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const decodeTokenPayload = (token) => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const normalizeUser = (payload, token) => {
  const tokenClaims = decodeTokenPayload(token);

  const raw =
    payload?.user || payload?.data?.user || payload?.data || payload || tokenClaims || null;

  if (!raw || typeof raw !== "object") return null;

  const displayName =
    raw.username ||
    raw.userName ||
    raw.preferred_username ||
    raw.name ||
    raw.fullName ||
    raw.fullname ||
    raw.displayName ||
    raw.display_name ||
    raw.given_name ||
    [raw.firstName, raw.lastName].filter(Boolean).join(" ") ||
    raw.email?.split("@")[0] ||
    raw.upn?.split("@")[0] ||
    raw.sub ||
    "";

  return {
    ...raw,
    username: raw.username || raw.userName || raw.preferred_username || displayName,
    name: raw.name || raw.displayName || displayName,
    email: raw.email || raw.upn || "",
  };
};

const setUserWithCache = (setUser, payload, token) => {
  const normalized = normalizeUser(payload, token);
  setUser(normalized);
  if (normalized) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(normalized));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readCachedUser);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      if (!user) {
        setUserWithCache(setUser, null, token);
      }
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const data = await api.getCurrentUser();
      setUserWithCache(setUser, data, token);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(err.message);
      if (err.status === 401) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem(USER_CACHE_KEY);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateUserInContext = (payload) => {
    setUserWithCache(setUser, payload, token);
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUserWithCache(setUser, data, data.token);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, status: err.status };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.signup(username, email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUserWithCache(setUser, data, data.token);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem(USER_CACHE_KEY);
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const getHistoryOfUser = async () => {
    const data = await api.getHistoryOfUser();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.history)) return data.history;
    if (Array.isArray(data?.meetings)) return data.meetings;
    return [];
  };

  const addMeetingToHistory = async (meetingCode) => {
    if (!meetingCode) return;
    await api.addMeetingToHistory(meetingCode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        refreshUser,
        updateUserInContext,
        getHistoryOfUser,
        addMeetingToHistory,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
