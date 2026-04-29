import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { client } from "../config/redisClient.js";

const loginWindowMs = 15 * 60 * 1000;

const createRedisStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
    prefix,
  });

const getNormalizedEmail = (req) =>
  String(req.body?.email || "").trim().toLowerCase();

const commonLoginLimiterOptions = {
  windowMs: loginWindowMs,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: false,
  message: {
    message: "Too many failed login attempts. Please try again after 15 minutes.",
  },
};

// Blocks bursts from the same client IP (IPv4/IPv6 safe key).
export const loginIpLimiter = rateLimit({
  ...commonLoginLimiterOptions,
  store: createRedisStore("rl:login-ip:"),
  keyGenerator: (req) => `login:ip:${ipKeyGenerator(req.ip)}`,
});

// Blocks repeated guessing against the same email/account.
export const loginEmailLimiter = rateLimit({
  ...commonLoginLimiterOptions,
  store: createRedisStore("rl:login-email:"),
  keyGenerator: (req) => {
    const email = getNormalizedEmail(req);
    return `login:email:${email || "unknown"}`;
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  store: createRedisStore("rl:auth:"),
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: false,
});

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  store: createRedisStore("rl:global:"),
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: false,
  skip: (req) =>
    req.method === "OPTIONS" || req.path === "/api/v1/meetings/google/callback",
});