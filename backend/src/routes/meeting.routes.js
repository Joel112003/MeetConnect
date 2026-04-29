import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js"; // ← your existing middleware
import {
  scheduleMeeting,
  addToGoogleCalendar,
  getScheduledMeetings,
  deleteMeeting,
  connectGoogleCalendar,
  googleCalendarCallback,
  getGoogleCalendarConnectionStatus,
} from "../controllers/meeting.controllers.js";

const router = express.Router();

router.get("/google/callback", googleCalendarCallback);

router.get("/",                 authenticateToken, getScheduledMeetings);
router.post("/schedule",        authenticateToken, scheduleMeeting);
router.post("/add-to-calendar", authenticateToken, addToGoogleCalendar);
router.delete("/:id",           authenticateToken, deleteMeeting);
router.get("/google/connect",   authenticateToken, connectGoogleCalendar);
router.get("/google/status",    authenticateToken, getGoogleCalendarConnectionStatus);

export default router;