import { randomUUID } from "crypto";
import { client as redisClient } from "../config/redisClient.js";

const SESSION_TTL_SECONDS = 60 * 60;

const sessionKey = (sessionId) => `session:${sessionId}`;
const userSessionKey = (userId) => `user-session:${userId}`;

export const createSession = async (userId) => {
  const userKey = userSessionKey(userId);
  const previousSessionId = await redisClient.get(userKey);
  if (previousSessionId) {
    await redisClient.del(sessionKey(previousSessionId));
  }

  const sessionId = randomUUID();
  await redisClient.set(sessionKey(sessionId), String(userId), {
    EX: SESSION_TTL_SECONDS,
  });
  await redisClient.set(userKey, sessionId, { EX: SESSION_TTL_SECONDS });

  return sessionId;
};

export const validateSession = async (userId, sessionId) => {
  if (!userId || !sessionId) return false;

  const [storedUserId, storedSessionId] = await Promise.all([
    redisClient.get(sessionKey(sessionId)),
    redisClient.get(userSessionKey(userId)),
  ]);

  return String(storedUserId) === String(userId) && storedSessionId === sessionId;
};

export const clearSession = async (userId, sessionId) => {
  if (sessionId) {
    await redisClient.del(sessionKey(sessionId));
  }
  if (userId) {
    await redisClient.del(userSessionKey(userId));
  }
};

export const clearAllSessions = async (userId) => {
  const storedSessionId = await redisClient.get(userSessionKey(userId));
  if (storedSessionId) {
    await redisClient.del(sessionKey(storedSessionId));
  }
  await redisClient.del(userSessionKey(userId));
};
