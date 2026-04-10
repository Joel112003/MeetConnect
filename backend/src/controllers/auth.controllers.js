import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { sendOtpEmail } from "../services/email.service.js";

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

const getUserResponse = (userDoc) => ({
  _id: userDoc._id,
  username: userDoc.username,
  email: userDoc.email,
});

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email already exists",
      });
    }

    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, tokenVersion: newUser.tokenVersion || 0 },
      process.env.JWT_SECRET,
      {
      expiresIn: "1h",
      },
    );

    res.cookie("token", token, getCookieOptions());

    const userResponse = getUserResponse(newUser);

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
    const { email, password } = req.body || {};
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, tokenVersion: user.tokenVersion || 0 },
      process.env.JWT_SECRET,
      {
      expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      ...getCookieOptions(),
      maxAge: 3600000,
    });

    const userResponse = getUserResponse(user);

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
    res.clearCookie("token", getCookieOptions());
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

    // Avoid account enumeration by always returning success response.
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
      // Roll back OTP state if email sending fails.
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpVerified = false;
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
    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid or expired OTP",
      });
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpVerified = false;
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
    user.resetPasswordOtpHash = null;
    user.resetPasswordOtpExpiresAt = null;
    user.resetPasswordOtpVerified = false;
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
