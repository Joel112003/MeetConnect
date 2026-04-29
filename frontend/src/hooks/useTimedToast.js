import { useEffect, useState, useCallback } from "react";

export const useTimedToast = (durationMs = 1800) => {
  const [message, setMessage] = useState("");

  const showToast = useCallback((nextMessage) => {
    setMessage(nextMessage || "");
  }, []);

  const clearToast = useCallback(() => {
    setMessage("");
  }, []);

  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(() => {
      setMessage("");
    }, durationMs);

    return () => clearTimeout(timeoutId);
  }, [message, durationMs]);

  return {
    message,
    showToast,
    clearToast,
  };
};
