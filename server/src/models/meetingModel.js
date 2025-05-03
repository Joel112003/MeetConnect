import { Schema } from "mongoose";
import mongoose from "mongoose";

const MeetingSchema = new Schema({
  user_id: { type: String, required: true },
  meetingCode: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
export default Meeting