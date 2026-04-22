import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("connect", () => console.log("Redis connected ✅"));
client.on("error",   (err) => console.log("Redis error ❌", err));

await client.connect();