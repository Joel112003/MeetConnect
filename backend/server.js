
import "dotenv/config";
import { createServer } from "node:http";
import { InitializeSocketIO } from "./src/controllers/SocketManager.js";
import connectDB from "./src/config/db.js";
import app from "./app.js";

const httpServer = createServer(app);
const io = InitializeSocketIO(httpServer);


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
