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
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index(
  { email: 1, resetPasswordOtpExpiresAt: 1 },
  { sparse: true, name: "idx_email_otp_expiry" }
);
userSchema.index(
  { username: 1 },
  { collation: { locale: "en", strength: 2 }, name: "idx_username_ci" }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
