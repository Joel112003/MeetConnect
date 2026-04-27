import meetingModel from "../models/meeting.model.js";
import httpStatus from "http-status";
import { sendError, sendSuccess } from "../utils/responses.js";
import { normalizeMeetingCode } from "../utils/meeting.js";

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await meetingModel
      .find({ user_id: userId })
      .sort({ date: -1 })
      .limit(100);

    return sendSuccess(res, httpStatus.OK, {
      message: "User history retrieved successfully",
      history,
    });
  } catch (err) {
    console.error("Error retrieving user history:", err.message);
    return sendError(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving user history",
    );
  }
};

export const addMeetingToHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { meetingCode } = req.body || {};

    if (!meetingCode || typeof meetingCode !== "string") {
      return sendError(res, httpStatus.BAD_REQUEST, "meetingCode is required");
    }

    const normalizedMeetingCode = normalizeMeetingCode(meetingCode);

    await meetingModel.create({
      user_id: userId,
      meetingCode: normalizedMeetingCode,
      date: new Date(),
    });

    return sendSuccess(res, httpStatus.CREATED, {
      message: "Meeting added to history",
      meetingCode: normalizedMeetingCode,
    });
  } catch (err) {
    console.error("Error adding meeting to history:", err.message);
    return sendError(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add meeting to history",
    );
  }
};
