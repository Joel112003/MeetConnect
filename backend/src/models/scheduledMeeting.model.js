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
    meetingLink: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

scheduledMeetingSchema.index({ user_id: 1, startTime: 1 });

scheduledMeetingSchema.index(
  { meetingCode: 1 },
  { collation: { locale: "en", strength: 2 }, name: "idx_meetingCode_ci" }
);

scheduledMeetingSchema.index(
  { user_id: 1, _id: 1 },
  { name: "idx_userId_id" }
);

scheduledMeetingSchema.index(
  { user_id: 1, status: 1, startTime: 1 },
  { name: "idx_userId_status_startTime" }
);

export default mongoose.model("ScheduledMeeting", scheduledMeetingSchema);
