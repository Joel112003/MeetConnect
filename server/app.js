import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";
import connectToSocket from "./src/controllers/socketManager.js";
import userRoutes from "./src/routes/userRoutes.js";
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MongoDB URI not found in environment variables");
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));

//Routes
app.use("/api/v1/users", userRoutes);

// // Socket.io connection
// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// Start server
const start = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

start();
