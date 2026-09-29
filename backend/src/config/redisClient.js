import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error(" REDIS_URL is missing in environment variables");
}

const redisUrl = process.env.REDIS_URL.includes(".upstash.io")
  ? process.env.REDIS_URL.replace(/^redis:\/\//, "rediss://")
  : process.env.REDIS_URL;

export const client = createClient({
  url: redisUrl,
  socket: {
    tls: redisUrl.startsWith("rediss://"),
    rejectUnauthorized: false,
  }
});

client.on("connect", () => console.log("Redis connected "));
client.on("error", (err) => console.log("Redis error in", err.message));

await client.connect();

