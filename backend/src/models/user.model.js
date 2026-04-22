import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  loginBlockedUntil: {
    type: Date,
    default: null,
  },
  resetPasswordOtpHash: {
    type: String,
    default: null,
  },
  resetPasswordOtpExpiresAt: {
    type: Date,
    default: null,
  },
  resetPasswordOtpVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
