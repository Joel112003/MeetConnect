import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import httpStatus from "http-status";
import { sendOtpEmail } from "../services/email.service.js";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from "crypto";
import {
  signAppToken,
  attachAuthCookie,
  clearAuthCookie,
} from "../utils/authToken.js";
import { toPublicUser } from "../utils/userMapper.js";
import {
  createSession,
  clearSession,
} from "../utils/sessionStore.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const OTP_EXPIRY_MINUTES = 10;
const LOGIN_MAX_FAILED_ATTEMPTS = 5;
const LOGIN_BLOCK_WINDOW_MS = 15 * 60 * 1000;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// clear OTP fields
const clearOtpState = (user) => {
  user.resetPasswordOtpHash = null;
  user.resetPasswordOtpExpiresAt = null;
  user.resetPasswordOtpVerified = false;
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const normalizedUsername = String(username || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email already exists",
      });
    }

    const existingUsername = await userModel.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const sessionId = await createSession(newUser._id);
    const token = signAppToken(newUser, sessionId);
    attachAuthCookie(res, token);

    const userResponse = toPublicUser(newUser);

    res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Error registering user:", err.message);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    const user = await userModel.findOne({ email });

    if (user?.loginBlockedUntil && user.loginBlockedUntil > new Date()) {
      return res.status(httpStatus.TOO_MANY_REQUESTS).json({
        message:
          "Too many failed login attempts. Please try again after 15 minutes.",
      });
    }

    if (user?.loginBlockedUntil && user.loginBlockedUntil <= new Date()) {
      user.failedLoginAttempts = 0;
      user.loginBlockedUntil = null;
      await user.save();
    }

    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= LOGIN_MAX_FAILED_ATTEMPTS) {
        user.loginBlockedUntil = new Date(Date.now() + LOGIN_BLOCK_WINDOW_MS);
        user.failedLoginAttempts = 0;
      }

      await user.save();

      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    user.failedLoginAttempts = 0;
    user.loginBlockedUntil = null;
    await user.save();

    const sessionId = await createSession(user._id);
    const token = signAppToken(user, sessionId);
    attachAuthCookie(res, token);

    const userResponse = toPublicUser(user);

    res.status(httpStatus.OK).json({
      message: "User logged in successfully",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Error logging in user:", err.message);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while logging in",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await clearSession(req.user?.id, req.user?.sessionId);
    clearAuthCookie(res);
    res.status(httpStatus.OK).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    console.error("Error logging out user:", err.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error during logout",
    });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    // prevent account enumeration
    if (!user) {
      return res.status(httpStatus.OK).json({
        message: "If an account exists, an OTP has been sent to the email",
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.resetPasswordOtpHash = otpHash;
    user.resetPasswordOtpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    );
    user.resetPasswordOtpVerified = false;
    await user.save();

    try {
      await sendOtpEmail(email, otp);
    } catch (mailErr) {
      // rollback on failure
      clearOtpState(user);
      await user.save();

      console.error("Failed to send reset OTP email:", mailErr.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "OTP sent successfully to your email",
    });
  } catch (err) {
    console.error("Error generating reset OTP:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to generate OTP",
    });
  }
};

export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();

    if (!email || !otp) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (
      !user ||
      !user.resetPasswordOtpHash ||
      !user.resetPasswordOtpExpiresAt
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid or expired OTP",
      });
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      clearOtpState(user);
      await user.save();

      return res.status(httpStatus.BAD_REQUEST).json({
        message: "OTP has expired. Please request a new one",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtpHash);
    if (!isOtpValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid OTP",
      });
    }

    user.resetPasswordOtpVerified = true;
    await user.save();

    return res.status(httpStatus.OK).json({
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("Error verifying reset OTP:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to verify OTP",
    });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const newPassword = String(req.body?.newPassword || "").trim();

    if (!email || !newPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Unable to reset password",
      });
    }

    if (!user.resetPasswordOtpVerified || !user.resetPasswordOtpExpiresAt) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "OTP verification required before password reset",
      });
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpVerified = false;
      await user.save();

      return res.status(httpStatus.BAD_REQUEST).json({
        message: "OTP session expired. Please request a new OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    clearOtpState(user);
    await user.save();

    return res.status(httpStatus.OK).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to reset password",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google client not configured" });
    }

    // verify google token
    let payload = null;
    const isIdToken =
      typeof credential === "string" && credential.split(".").length === 3;

    if (isIdToken) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      const tokenInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(credential)}`,
      );
      if (!tokenInfoResponse.ok) {
        return res.status(401).json({ message: "Invalid Google token" });
      }
      const tokenInfo = await tokenInfoResponse.json();

      const audience =
        tokenInfo.aud || tokenInfo.audience || tokenInfo.issued_to;
      if (audience !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ message: "Invalid Google audience" });
      }

      if (Number(tokenInfo.expires_in) <= 0) {
        return res.status(401).json({ message: "Google token expired" });
      }

      const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      });

      if (!userInfoResponse.ok) {
        return res.status(401).json({ message: "Failed to fetch Google user profile" });
      }

      const userInfo = await userInfoResponse.json();

      payload = {
        sub: userInfo.sub || tokenInfo.sub || tokenInfo.user_id,
        email: userInfo.email || tokenInfo.email,
        email_verified:
          userInfo.email_verified === true ||
          tokenInfo.email_verified === "true" ||
          tokenInfo.email_verified === true,
        name: userInfo.name || tokenInfo.name,
        iss: tokenInfo.iss,
      };
    }

    // security checks
    if (!payload.email_verified)
      return res.status(401).json({ message: "Email not verified by Google" });

    if (
      isIdToken &&
      !["accounts.google.com", "https://accounts.google.com"].includes(
        payload.iss,
      )
    )
      return res.status(401).json({ message: "Invalid token issuer" });

    const { sub: googleId, email, name } = payload;
    if (!email) {
      return res.status(400).json({ message: "Google account email is missing" });
    }

    if (!googleId) {
      return res.status(400).json({ message: "Google account id is missing" });
    }

    const existingGoogleUser = await userModel.findOne({ googleId });
    if (existingGoogleUser && String(existingGoogleUser.email).toLowerCase() !== email.toLowerCase()) {
      return res.status(409).json({ message: "Google account is linked to another user" });
    }

    // find or create user
    let user = await userModel.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "No account found for this Google email. Please sign up first.",
      });
    } else if (!user.googleId) {
      // link existing account
      user.googleId = googleId;
      user.authProvider = "google";
      await user.save();
    }

    // issue jwt
    const sessionId = await createSession(user._id);
    const token = signAppToken(user, sessionId);
    attachAuthCookie(res, token);

    res.json({
      message: "Google login successful",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  try {
    const username = String(req.query?.username || "").trim();

    if (!username || username.length < 2) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Username must be at least 2 characters",
      });
    }

    const existing = await userModel.findOne({
      username: { $regex: `^${username.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    return res.status(httpStatus.OK).json({
      available: !existing,
    });
  } catch (err) {
    console.error("Username availability error:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to validate username",
    });
  }
};
