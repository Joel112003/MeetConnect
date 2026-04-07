import { Server } from "socket.io";

let connection = {};
let message = {};
let timeOnline = {};
export function InitializeSocketIO(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join-call", (path) => {
      if (connection[path] === undefined) {
        connection[path] = [];
      }
      connection[path].push(socket.id);
    });
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      io.to(data.roomId).emit("chat-message", data, sender);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  return io;
}
