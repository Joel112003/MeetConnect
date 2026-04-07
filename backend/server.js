//Import necessary modules and configurations
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { InitializeSocketIO } from "./src/controllers/SocketManager.js";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/users.routes.js";

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = InitializeSocketIO(httpServer);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb" }));
app.use(cors());

// Routes
app.use("/api/v1/users", userRoutes);

// Initialize DB
connectDB();

// Server
const PORT = process.env.PORT || 8000;

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
