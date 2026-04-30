import { Server } from "socket.io";

import { client as redisClient } from "../config/redisClient.js";

// register room
export async function registerRoom(roomKey) {
  await redisClient.sAdd("activeRooms", roomKey);
  await redisClient.expire("activeRooms", 24 * 60 * 60); // expire after 24h
}

// check if room registered
export async function isRoomRegistered(roomKey) {
  return await redisClient.sIsMember("activeRooms", roomKey);
}

import { createAdapter } from "@socket.io/redis-adapter";

// socket setup
export function InitializeSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log("Socket.IO Redis adapter configured successfully.");
    })
    .catch((err) => {
      console.error("Redis adapter connection failed:", err.message);
    });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);
    socket.data.joinTime = new Date();

    socket.on("join-call", async (payload) => {
      const path = typeof payload === "string" ? payload : payload?.path;
      const username =
        typeof payload === "object" && typeof payload?.username === "string"
          ? payload.username.trim()
          : "";

      if (typeof path !== "string" || !path.trim()) {
        console.warn(`[join-call] invalid path from ${socket.id}`);
        return;
      }

      // block unregistered rooms
      if (!(await isRoomRegistered(path))) {
        console.warn(`[join-call] REJECTED ${socket.id} — room "${path}" is not registered`);
        socket.emit("join-error", { code: "ROOM_NOT_FOUND", message: "Meeting room not found." });
        return;
      }

      if (socket.rooms.has(path)) {
        console.warn(`[join-call] ${socket.id} already in a room, ignoring`);
        return;
      }

      socket.join(path);
      socket.data.room = path;
      socket.data.name = username || "Guest";

      const socketsInRoom = await io.in(path).fetchSockets();
      const participants = socketsInRoom.map((s) => ({
        id: s.id,
        name: s.data.name || "Guest",
      }));

      // Emit to everyone in the room
      io.in(path).emit("user-joined", {
        id: socket.id,
        name: socket.data.name,
        clients: participants,
      });

      try {
        const historyData = await redisClient.lRange(`chat:${path}`, 0, -1);
        const history = historyData.map((h) => JSON.parse(h));
        for (const msg of history) {
          socket.emit("chat-message", msg.data, msg.sender, msg.socketId);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err.message);
      }
    });

    socket.on("signal", (toId, payload) => {
      io.to(toId).emit("signal", socket.id, payload);
    });

    socket.on("chat-message", async (payload) => {
      const path = socket.data.room;
      if (!path) {
        console.warn(`[chat-message] ${socket.id} is not in any room`);
        return;
      }

      const data = typeof payload === "object" ? payload?.message : payload;
      const sender = typeof payload === "object" ? payload?.username || "Guest" : "Guest";

      if (!data || typeof data !== "string" || !data.trim()) {
        return;
      }

      const msgObj = { data: data.trim(), sender, socketId: socket.id };

      // Broadcast message to everyone in the room including sender
      io.in(path).emit("chat-message", msgObj.data, msgObj.sender, msgObj.socketId);

      try {
        await redisClient.rPush(`chat:${path}`, JSON.stringify(msgObj));
        await redisClient.expire(`chat:${path}`, 24 * 60 * 60);
      } catch (err) {
        console.error("Failed to save chat message:", err.message);
      }
    });

    socket.on("send-emoji", (payload) => {
      const path = socket.data.room;
      if (!path) return;

      const emoji = typeof payload?.emoji === "string" ? payload.emoji : "";
      const senderName =
        typeof payload?.senderName === "string" && payload.senderName.trim()
          ? payload.senderName.trim()
          : "Guest";

      if (!emoji.trim()) return;

      socket.to(path).emit("receive-emoji", { emoji, senderName });
    });

    socket.on("disconnect", () => {
      const path = socket.data.room;

      if (path) {
        socket.to(path).emit("user-left", {
          id: socket.id,
          name: socket.data.name || "Guest",
        });
        socket.to(path).emit("user-disconnected", {
          id: socket.id,
          name: socket.data.name || "Guest",
        });
      }

      const joinTime = socket.data.joinTime;
      if (joinTime) {
        const seconds = ((Date.now() - joinTime.getTime()) / 1000).toFixed(1);
        console.log(`[socket] disconnected: ${socket.id} (online ${seconds}s)`);
      } else {
        console.log(`[socket] disconnected: ${socket.id}`);
      }
    });
  });

  return io;
}
