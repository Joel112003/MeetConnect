const TOKEN_KEY = "token";
const USER_CACHE_KEY = "userProfile";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_CACHE_KEY);
    return;
  }
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
};

export const clearCachedUser = () => {
  localStorage.removeItem(USER_CACHE_KEY);
};

export const clearAuthStorage = () => {
  clearStoredToken();
  clearCachedUser();
};
