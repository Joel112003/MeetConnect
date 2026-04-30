import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error(" REDIS_URL is missing in environment variables");
}

export const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,                
    rejectUnauthorized: false 
  }
});

client.on("connect", () => console.log("Redis connected "));
client.on("error", (err) => console.log("Redis error in", err.message));

await client.connect();