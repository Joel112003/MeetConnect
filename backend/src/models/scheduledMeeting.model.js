import mongoose from "mongoose";

const scheduledMeetingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    meetingCode: { type: String, required: true, unique: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    attendees: [{ type: String }],
    googleEventId: { type: String, default: null },
  },
  { timestamps: true },
);

scheduledMeetingSchema.index({ user_id: 1, startTime: 1 });

export default mongoose.model("ScheduledMeeting", scheduledMeetingSchema);
