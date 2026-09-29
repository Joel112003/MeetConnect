import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalLimiter } from "./src/middleware/rateLimiter.middleware.js";
import userRoutes from "./src/routes/users.routes.js";
import accountRoutes from "./src/routes/account.routes.js";
import meetingRoutes from "./src/routes/meeting.routes.js";

const app = express();

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

app.use(globalLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb" }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", accountRoutes);
app.use("/api/v1/meetings", meetingRoutes);

export default app;
export { app };
