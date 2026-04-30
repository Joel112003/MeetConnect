import { Server } from "socket.io";

// room registry
const activeRooms = new Set();

// register room
export function registerRoom(roomKey) {
  activeRooms.add(roomKey);
}

// check if room registered
export function isRoomRegistered(roomKey) {
  return activeRooms.has(roomKey);
}

// check if room active
export function isRoomActive(roomKey) {
  return rooms.has(roomKey) && rooms.get(roomKey).size > 0;
}

// state maps
const rooms = new Map();
const messages = new Map();
const socketJoinTime = new Map();
const socketToRoom = new Map();
const socketToName = new Map();

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

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.on("join-call", (payload) => {
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
      if (!activeRooms.has(path)) {
        console.warn(`[join-call] REJECTED ${socket.id} — room "${path}" is not registered`);
        socket.emit("join-error", { code: "ROOM_NOT_FOUND", message: "Meeting room not found." });
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
      socketToName.set(socket.id, username || "Guest");
      socketJoinTime.set(socket.id, new Date());

      const roomList = [...room];
      const participants = roomList.map((id) => ({
        id,
        name: socketToName.get(id) || "Guest",
      }));

      for (const id of room) {
        io.to(id).emit("user-joined", {
          id: socket.id,
          name: socketToName.get(socket.id) || "Guest",
          clients: participants,
        });
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

      messages
        .get(path)
        .push({ data: data.trim(), sender, socketId: socket.id });
      console.log(`[chat-message] room="${path}" sender="${sender}":`, data);

      const room = rooms.get(path);
      if (room) {
        for (const id of room) {
          io.to(id).emit("chat-message", data, sender, socket.id);
        }
      }
    });

    socket.on("send-emoji", (payload) => {
      const path = socketToRoom.get(socket.id);
      if (!path) return;

      const emoji = typeof payload?.emoji === "string" ? payload.emoji : "";
      const senderName =
        typeof payload?.senderName === "string" && payload.senderName.trim()
          ? payload.senderName.trim()
          : "Guest";

      if (!emoji.trim()) return;

      const room = rooms.get(path);
      if (!room) return;

      for (const id of room) {
        if (id !== socket.id) {
          io.to(id).emit("receive-emoji", { emoji, senderName });
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
              io.to(id).emit("user-left", {
                id: socket.id,
                name: socketToName.get(socket.id) || "Guest",
              });
              io.to(id).emit("user-disconnected", {
                id: socket.id,
                name: socketToName.get(socket.id) || "Guest",
              });
            }
          }

          room.delete(socket.id);

          if (room.size === 0) {
            rooms.delete(path);
            messages.delete(path);
            // cleanup empty room
            activeRooms.delete(path);
          }
        }

        socketToRoom.delete(socket.id);
      }

      const joinTime = socketJoinTime.get(socket.id);
      socketToName.delete(socket.id);
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
