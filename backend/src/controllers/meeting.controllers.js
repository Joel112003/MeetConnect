import crypto from "crypto";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import ScheduledMeeting from "../models/scheduledMeeting.model.js";
import userModel from "../models/user.model.js";
import {
  createGoogleOAuthClient,
  createCalendarEventForUser,
  updateCalendarEventForUser,
  deleteCalendarEventForUser,
  cancelCalendarEventForUser,
  getGoogleCredentialForUser,
  storeGoogleTokensForUser,
} from "../services/googleCalendar.service.js";
import { registerRoom, isRoomRegistered } from "./SocketManager.js";

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

// google oauth

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

// create instant meeting

export const createRoom = async (req, res) => {
  try {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }

    const roomKey = `meeting:${code}`;
    await registerRoom(roomKey);

    res.status(201).json({ success: true, code, roomKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// validate meeting code

export const validateMeetingCode = async (req, res) => {
  try {
    const code = String(req.params.code || "").trim();
    if (!code) {
      return res.json({ success: true, valid: false, type: null });
    }

    // check memory registry
    const roomKey = `meeting:${code.toUpperCase()}`;
    if (await isRoomRegistered(roomKey)) {
      return res.json({ success: true, valid: true, type: "instant" });
    }

    // check db
    const scheduled = await ScheduledMeeting.findOne({
      meetingCode: { $regex: new RegExp(`^${code}$`, "i") },
    }).lean();

    if (scheduled) {
      const scheduledRoomKey = `meeting:${scheduled.meetingCode.toUpperCase()}`;
      await registerRoom(scheduledRoomKey);
      return res.json({ success: true, valid: true, type: "scheduled" });
    }

    return res.json({ success: true, valid: false, type: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// schedule meeting

export const scheduleMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, attendees, addToCalendar } =
      req.body;

    if (!title || !startTime || !endTime)
      return res
        .status(400)
        .json({ error: "Title, startTime and endTime are required" });

    const meetingId = crypto.randomBytes(6).toString("hex");
    const meetingLink = `${FRONTEND_URL}/meet/${meetingId}`;

    const meeting = await ScheduledMeeting.create({
      user_id: req.user.id,
      title,
      description,
      meetingCode: meetingId,
      meetingLink,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendees: attendees || [],
      status: "scheduled",
    });

    // register room
    await registerRoom(`meeting:${meetingId.toUpperCase()}`);

    let googleEvent = null;

    if (Boolean(addToCalendar)) {
      try {
        googleEvent = await createCalendarEventForUser(req.user.id, {
          ...meeting.toObject(),
          meetingLink: meeting.meetingLink,
          startTime,
          endTime,
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

// update meeting

export const updateMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, attendees } = req.body;

    const meeting = await ScheduledMeeting.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });


    if (title !== undefined) meeting.title = title;
    if (description !== undefined) meeting.description = description;
    if (startTime !== undefined) meeting.startTime = new Date(startTime);
    if (endTime !== undefined) meeting.endTime = new Date(endTime);
    if (attendees !== undefined) meeting.attendees = attendees;

    await meeting.save();

    // sync to calendar
    let googleEvent = null;
    if (meeting.googleEventId) {
      try {
        googleEvent = await updateCalendarEventForUser(
          req.user.id,
          meeting.googleEventId,
          meeting,
        );
      } catch (calendarErr) {
        // log error without failing
        console.error("Failed to sync update to Google Calendar:", calendarErr.message);
      }
    }

    res.json({ success: true, meeting, googleEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete meeting

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await ScheduledMeeting.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // delete from calendar
    if (meeting.googleEventId) {
      try {
        await deleteCalendarEventForUser(req.user.id, meeting.googleEventId);
      } catch (calendarErr) {
        // best effort deletion
        console.error("Failed to delete from Google Calendar:", calendarErr.message);
      }
    }


    await ScheduledMeeting.deleteOne({ _id: meeting._id });

    res.json({ success: true, message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// mark completed or cancelled

export const completeMeeting = async (req, res) => {
  try {
    const { status } = req.body; // "completed" or "cancelled"
    const validStatuses = ["completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const meeting = await ScheduledMeeting.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    meeting.status = status;
    await meeting.save();

    // cancel calendar event
    if (meeting.googleEventId) {
      try {
        await cancelCalendarEventForUser(req.user.id, meeting.googleEventId);
      } catch (calendarErr) {
        console.error("Failed to cancel in Google Calendar:", calendarErr.message);
      }
    }

    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// add to calendar

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

// get scheduled meetings

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
