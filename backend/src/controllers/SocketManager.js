import { Server } from "socket.io";

const rooms = new Map();
const messages = new Map();
const socketJoinTime = new Map();
const socketToRoom = new Map();

export function InitializeSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.on("join-call", (path) => {
      if (typeof path !== "string" || !path.trim()) {
        console.warn(`[join-call] invalid path from ${socket.id}`);
        return;
      }

      if (socketToRoom.has(socket.id)) {
        console.warn(`[join-call] ${socket.id} already in a room, ignoring`);
        return;
      }

      if (!rooms.has(path)) {
        rooms.set(path, new Set());
        messages.set(path, []);
      }

      const room = rooms.get(path);
      room.add(socket.id);
      socketToRoom.set(socket.id, path);
      socketJoinTime.set(socket.id, new Date());

      const roomList = [...room];
      for (const id of room) {
        io.to(id).emit("user-joined", socket.id, roomList);
      }

      const history = messages.get(path) ?? [];
      for (const { data, sender, socketId } of history) {
        io.to(socket.id).emit("chat-message", data, sender, socketId);
      }
    });

    socket.on("signal", (toId, payload) => {
      io.to(toId).emit("signal", socket.id, payload);
    });

    socket.on("chat-message", (payload) => {
      const path = socketToRoom.get(socket.id);
      if (!path) {
        console.warn(`[chat-message] ${socket.id} is not in any room`);
        return;
      }

      const data = typeof payload === "object" ? payload?.message : payload;
      const sender =
        typeof payload === "object" ? payload?.username || "Guest" : "Guest";

      if (!data || typeof data !== "string" || !data.trim()) {
        return;
      }

      messages.get(path).push({ data: data.trim(), sender, socketId: socket.id });
      console.log(`[chat-message] room="${path}" sender="${sender}":`, data);

      const room = rooms.get(path);
      if (room) {
        for (const id of room) {
          io.to(id).emit("chat-message", data, sender, socket.id);
        }
      }
    });

    socket.on("disconnect", () => {
      const path = socketToRoom.get(socket.id);

      if (path) {
        const room = rooms.get(path);

        if (room) {
          for (const id of room) {
            if (id !== socket.id) {
              io.to(id).emit("user-left", socket.id);
              io.to(id).emit("user-disconnected", socket.id);
            }
          }

          room.delete(socket.id);

          if (room.size === 0) {
            rooms.delete(path);
            messages.delete(path);
          }
        }

        socketToRoom.delete(socket.id);
      }

      const joinTime = socketJoinTime.get(socket.id);
      if (joinTime) {
        const seconds = ((Date.now() - joinTime.getTime()) / 1000).toFixed(1);
        console.log(`[socket] disconnected: ${socket.id} (online ${seconds}s)`);
        socketJoinTime.delete(socket.id);
      } else {
        console.log(`[socket] disconnected: ${socket.id}`);
      }
    });
  });

  return io;
}