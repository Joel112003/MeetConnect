import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  scheduleMeeting,
  updateMeeting,
  deleteMeeting,
  completeMeeting,
  addToGoogleCalendar,
  getScheduledMeetings,
  connectGoogleCalendar,
  googleCalendarCallback,
  getGoogleCalendarConnectionStatus,
  generateGoogleConnectToken,
  createRoom,
  validateMeetingCode,
} from "../controllers/meeting.controllers.js";

const router = express.Router();

// google oauth
router.get("/google/callback", googleCalendarCallback);

// meeting crud
router.get("/",                 authenticateToken, getScheduledMeetings);
router.post("/schedule",        authenticateToken, scheduleMeeting);
router.put("/:id",              authenticateToken, updateMeeting);
router.delete("/:id",           authenticateToken, deleteMeeting);
router.patch("/:id/complete",   authenticateToken, completeMeeting);

// room access
router.post("/create-room",     authenticateToken, createRoom);
router.get("/validate/:code",   authenticateToken, validateMeetingCode);

// google calendar
router.post("/add-to-calendar",       authenticateToken, addToGoogleCalendar);
router.get("/google/connect-token",   authenticateToken, generateGoogleConnectToken);
router.get("/google/connect",         connectGoogleCalendar);
router.get("/google/status",          authenticateToken, getGoogleCalendarConnectionStatus);

export default router;