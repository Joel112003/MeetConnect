
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
import meetingRoutes from "./src/routes/meeting.routes.js";

const app = express();
const httpServer = createServer(app);
const io = InitializeSocketIO(httpServer);

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}


const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(globalLimiter); // rate limiting
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb" }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", accountRoutes);
app.use("/api/v1/meetings", meetingRoutes);


const PORT = process.env.PORT || 8000;

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
