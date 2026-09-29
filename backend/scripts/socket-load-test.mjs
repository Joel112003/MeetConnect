import "dotenv/config";
import { createClient } from "redis";
import { io } from "socket.io-client";

const serverUrl = process.env.LOAD_TEST_SERVER_URL || "http://localhost:8000";
const levels = [2, 5, 10, 20, 30, 50, 100];
const timeoutMs = Number(process.env.LOAD_TEST_TIMEOUT_MS || 10000);

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is required");
}

const redisUrl = process.env.REDIS_URL.includes(".upstash.io")
  ? process.env.REDIS_URL.replace(/^redis:\/\//, "rediss://")
  : process.env.REDIS_URL;

const redis = createClient({
  url: redisUrl,
  socket: {
    tls: redisUrl.startsWith("rediss://"),
    rejectUnauthorized: false,
  },
});

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function connectParticipant(room, index) {
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const socket = io(serverUrl, {
      transports: ["websocket"],
      reconnection: false,
      timeout: timeoutMs,
    });
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve({ socket, ...result });
    };

    socket.on("connect", () => {
      socket.emit("join-call", {
        path: room,
        username: `load-test-${index}`,
      });
    });

    socket.on("user-joined", (payload) => {
      if (payload?.id === socket.id) {
        finish({
          connected: true,
          joinMs: Math.round(performance.now() - startedAt),
        });
      }
    });

    socket.on("join-error", (error) => {
      finish({ connected: false, error: error?.code || "JOIN_ERROR" });
    });

    socket.on("connect_error", (error) => {
      finish({ connected: false, error: error.message || "CONNECT_ERROR" });
    });

    setTimeout(() => {
      finish({ connected: false, error: "TIMEOUT" });
    }, timeoutMs);
  });
}

async function runLevel(participantCount) {
  const room = `meeting:load-test-${Date.now()}-${participantCount}`;
  await redis.sAdd("activeRooms", room);
  await redis.expire("activeRooms", 600);

  const startedAt = performance.now();
  const participants = await Promise.all(
    Array.from({ length: participantCount }, (_, index) =>
      connectParticipant(room, index + 1),
    ),
  );
  const elapsedMs = Math.round(performance.now() - startedAt);
  const successful = participants.filter((participant) => participant.connected);
  const failed = participants.filter((participant) => !participant.connected);
  const joinTimes = successful.map((participant) => participant.joinMs);

  for (const participant of participants) {
    participant.socket.disconnect();
  }
  await wait(250);
  await redis.del(room);

  return {
    requested: participantCount,
    successful: successful.length,
    failed: failed.length,
    successRate: `${((successful.length / participantCount) * 100).toFixed(1)}%`,
    medianJoinMs: joinTimes.length
      ? Math.round(joinTimes.sort((a, b) => a - b)[Math.floor(joinTimes.length / 2)])
      : null,
    elapsedMs,
    errors: [...new Set(failed.map((participant) => participant.error))],
  };
}

try {
  await redis.connect();
  console.log(`Signaling load test: ${serverUrl}`);
  console.log("Scope: Socket.IO connect/join only; no camera, microphone, WebRTC media, or real users.");

  for (const level of levels) {
    const result = await runLevel(level);
    console.log(JSON.stringify(result));
    if (result.successful < result.requested) break;
  }
} finally {
  if (redis.isOpen) await redis.quit();
}
