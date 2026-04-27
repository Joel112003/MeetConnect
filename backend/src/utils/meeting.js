export const normalizeMeetingCode = (meetingCode) =>
  String(meetingCode || "").trim().toUpperCase();
