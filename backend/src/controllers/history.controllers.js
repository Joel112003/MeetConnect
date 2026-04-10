import meetingModel from "../models/meeting.model.js";
import httpStatus from "http-status";

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await meetingModel.find({ user_id: userId }).sort({ date: -1 }).limit(100);

    res.status(httpStatus.OK).json({
      message: "User history retrieved successfully",
      history,
    });
  } catch (err) {
    console.error("Error retrieving user history:", err.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving user history",
    });
  }
};

export const addMeetingToHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { meetingCode } = req.body || {};

    if (!meetingCode || typeof meetingCode !== "string") {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "meetingCode is required",
      });
    }

    const normalizedMeetingCode = meetingCode.trim().toUpperCase();

    await meetingModel.create({
      user_id: userId,
      meetingCode: normalizedMeetingCode,
      date: new Date(),
    });

    return res.status(httpStatus.CREATED).json({
      message: "Meeting added to history",
      meetingCode: normalizedMeetingCode,
    });
  } catch (err) {
    console.error("Error adding meeting to history:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to add meeting to history",
    });
  }
};
