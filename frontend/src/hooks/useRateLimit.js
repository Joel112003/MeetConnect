import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "rl_block";

export const useRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {

  const getInitialBlock = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const blockedUntil = JSON.parse(saved);

      if (Date.now() > blockedUntil) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return blockedUntil;
    } catch {
      return null;
    }
  };

  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(getInitialBlock());
  const [timeLeft, setTimeLeft] = useState(
    blockedUntil
      ? Math.max(0, Math.floor((blockedUntil - Date.now()) / 1000))
      : 0
  );

  const timerRef = useRef(null);

  useEffect(() => {
    if (!blockedUntil) return;

    timerRef.current = setInterval(() => {
      const remaining = Math.floor((blockedUntil - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setBlockedUntil(null);
        setAttempts(0);
        setTimeLeft(0);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [blockedUntil]);

  const registerAttempt = useCallback(() => {
    if (blockedUntil) return; // already blocked

    setAttempts((prev) => {
      const next = prev + 1;

      if (next >= maxAttempts) {
        const blockTime = Date.now() + windowMs;

        setBlockedUntil(blockTime);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blockTime));
      }

      return next;
    });
  }, [blockedUntil, maxAttempts, windowMs]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setAttempts(0);
    setBlockedUntil(null);
    setTimeLeft(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    attempts,
    isBlocked: !!blockedUntil,
    timeLeft,
    registerAttempt,
    reset,
  };
};