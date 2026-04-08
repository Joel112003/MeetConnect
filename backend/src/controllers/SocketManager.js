import { Server } from "socket.io";

const rooms = new Map();
const messages = new Map();
const socketJoinTime = new Map();
const socketToRoom = new Map();

export function InitializeSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    //  join-call 
    socket.on("join-call", (path) => {
      if (typeof path !== "string" || !path.trim()) {
        console.warn(`[join-call] invalid path from ${socket.id}`);
        return;
      }

      // Prevent a socket from joining multiple rooms simultaneously
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

      // Notify everyone in the room (including the new user) about the join
      const roomList = [...room];
      for (const id of room) {
        io.to(id).emit("user-joined", socket.id, roomList);
      }

      // Replay chat history only to the newcomer
      const history = messages.get(path) ?? [];
      for (const { data, sender, socketId } of history) {
        io.to(socket.id).emit("chat-message", data, sender, socketId);
      }
    });

    // signal 
    socket.on("signal", (toId, payload) => {
      io.to(toId).emit("signal", socket.id, payload);
    });

    // chat-message 
    socket.on("chat-message", (data, sender) => {
      const path = socketToRoom.get(socket.id);
      if (!path) {
        console.warn(`[chat-message] ${socket.id} is not in any room`);
        return;
      }

      // Save to history
      messages.get(path).push({ data, sender, socketId: socket.id });
      console.log(`[chat-message] room="${path}" sender="${sender}":`, data);

      // Broadcast to everyone in the room
      const room = rooms.get(path);
      if (room) {
        for (const id of room) {
          io.to(id).emit("chat-message", data, sender, socket.id);
        }
      }
    });

    // disconnect 
    socket.on("disconnect", () => {
      const path = socketToRoom.get(socket.id);

      if (path) {
        const room = rooms.get(path);

        if (room) {
          // Notify remaining users first, then remove the socket
          for (const id of room) {
            if (id !== socket.id) {
              io.to(id).emit("user-disconnected", socket.id);
            }
          }

          room.delete(socket.id);

          // Clean up empty room and its message history
          if (room.size === 0) {
            rooms.delete(path);
            messages.delete(path);
          }
        }

        socketToRoom.delete(socket.id);
      }

      // Log time spent online
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