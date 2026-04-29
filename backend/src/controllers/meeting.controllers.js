import crypto from "crypto";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import ScheduledMeeting from "../models/scheduledMeeting.model.js";
import userModel from "../models/user.model.js";
import {
  createGoogleOAuthClient,
  createCalendarEventForUser,
  getGoogleCredentialForUser,
  storeGoogleTokensForUser,
} from "../services/googleCalendar.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const popupMsg = (msg) =>
  `<script>window.opener&&window.opener.postMessage('${msg}','*');window.close();</script>`;

const encodeState = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });

const decodeState = (value) => {
  try {
    return jwt.verify(String(value), process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export const connectGoogleCalendar = async (req, res) => {
  const oauth2Client = createGoogleOAuthClient();

  const user = await userModel.findById(req.user.id).select("email");
  if (!user?.email) {
    return res.send(popupMsg("gcal-error"));
  }

  const statePayload = {
    nonce: crypto.randomBytes(12).toString("hex"),
    userId: req.user.id,
    expectedEmail: user.email.toLowerCase(),
  };

  const state = encodeState(statePayload);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent select_account",
    include_granted_scopes: true,
    login_hint: user.email,
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    state,
  });

  return res.redirect(authUrl);
};

export const googleCalendarCallback = async (req, res) => {
  const code = String(req.query?.code || "");
  const state = String(req.query?.state || "");

  if (!code || !state) {
    return res.send(popupMsg("gcal-error"));
  }

  const parsed = decodeState(state);
  if (!parsed?.userId) {
    return res.send(popupMsg("gcal-error"));
  }

  try {
    const oauth2Client = createGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const me = await oauth2.userinfo.get();

    const googleEmail = String(me?.data?.email || "").toLowerCase();
    if (parsed?.expectedEmail && googleEmail !== parsed.expectedEmail) {
      return res.send(popupMsg("gcal-error"));
    }

    await storeGoogleTokensForUser({
      userId: parsed.userId,
      providerUserId: me?.data?.id || null,
      tokens,
      preserveExistingRefreshToken: true,
    });

    return res.send(popupMsg("gcal-connected"));
  } catch (err) {
    console.error("Google calendar callback error:", err.message);
    return res.send(popupMsg("gcal-error"));
  }
};

export const getGoogleCalendarConnectionStatus = async (req, res) => {
  const credential = await getGoogleCredentialForUser(req.user.id);
  return res.json({
    success: true,
    connected: Boolean(credential?.refreshTokenEnc),
  });
};

// Schedule a meeting
export const scheduleMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, attendees, addToCalendar } =
      req.body;

    if (!title || !startTime || !endTime)
      return res
        .status(400)
        .json({ error: "Title, startTime and endTime are required" });

    const meeting = await ScheduledMeeting.create({
      user_id: req.user.id,
      title,
      description,
      meetingCode: crypto.randomBytes(4).toString("hex"),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendees: attendees || [],
    });

    let googleEvent = null;

    if (Boolean(addToCalendar)) {
      try {
        googleEvent = await createCalendarEventForUser(req.user.id, {
          ...meeting.toObject(),
          startTime: startTime,
          endTime: endTime,
        });
        meeting.googleEventId = googleEvent.id;
        await meeting.save();
      } catch (calendarErr) {
        if (calendarErr?.code === "GOOGLE_NOT_CONNECTED") {
          return res.status(409).json({
            success: false,
            code: "GOOGLE_NOT_CONNECTED",
            message: "Google Calendar is not connected.",
            connectPath: "/api/v1/meetings/google/connect",
            meeting,
          });
        }
        throw calendarErr;
      }
    }

    res.status(201).json({ success: true, meeting, googleEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add meeting to Google Calendar
export const addToGoogleCalendar = async (req, res) => {
  try {
    const { meetingId } = req.body;

    if (!meetingId)
      return res.status(400).json({ error: "meetingId is required" });

    const meeting = await ScheduledMeeting.findOne({
      _id: meetingId,
      user_id: req.user.id,
    });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    const response = await createCalendarEventForUser(req.user.id, meeting);

    meeting.googleEventId = response.id;
    await meeting.save();

    res.json({ success: true, googleEvent: response });
  } catch (err) {
    if (err?.code === "GOOGLE_NOT_CONNECTED") {
      return res.status(409).json({
        success: false,
        code: "GOOGLE_NOT_CONNECTED",
        message: "Google Calendar is not connected.",
        connectPath: "/api/v1/meetings/google/connect",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all scheduled meetings for logged-in user
export const getScheduledMeetings = async (req, res) => {
  try {
    const meetings = await ScheduledMeeting.find({ user_id: req.user.id }).sort(
      { startTime: 1 },
    );

    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a scheduled meeting
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await ScheduledMeeting.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    res.json({ success: true, message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};