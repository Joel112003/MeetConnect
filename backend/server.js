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
import accountRoutes from "./src/routes/account.routes.js";
import { globalLimiter } from "./src/middleware/rateLimiter.middleware.js";

const app = express();
const httpServer = createServer(app);
const io = InitializeSocketIO(httpServer);

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// Middleware
app.use(globalLimiter); // Apply global rate limiter to all routes in this router
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb" }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", accountRoutes);

const PORT = process.env.PORT || 8000;
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
