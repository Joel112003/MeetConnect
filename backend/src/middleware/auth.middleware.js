import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import userModel from "../models/user.model.js";
import { sendError } from "../utils/responses.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const queryToken = typeof req.query?.token === "string" ? req.query.token : null;
  const token = req.cookies?.token || bearerToken || queryToken;

  if (!token) {
    return sendError(
      res,
      httpStatus.UNAUTHORIZED,
      "Access denied. No token provided.",
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("_id tokenVersion");
    if (!user) {
      return sendError(res, httpStatus.UNAUTHORIZED, "Invalid token.");
    }

    const tokenVersion = Number(decoded.tokenVersion || 0);
    const userTokenVersion = Number(user.tokenVersion || 0);
    if (tokenVersion !== userTokenVersion) {
      return sendError(
        res,
        httpStatus.UNAUTHORIZED,
        "Session expired. Please login again.",
      );
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return sendError(res, httpStatus.UNAUTHORIZED, "Invalid token.");
  }
};
