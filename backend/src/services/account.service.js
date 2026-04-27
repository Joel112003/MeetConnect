import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { sendSecurityNotificationEmail } from "./email.service.js";
import { toPublicUser } from "../utils/userMapper.js";

export const updateProfileService = async (userId, payload) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const nextUsername = payload.username?.trim();
  const nextEmail = payload.email?.trim().toLowerCase();

  if (nextUsername && nextUsername !== user.username) {
    const existingUsername = await userModel.findOne({
      username: nextUsername,
      _id: { $ne: user._id },
    });
    if (existingUsername) {
      throw new Error("Username already in use");
    }
    user.username = nextUsername;
  }

  if (nextEmail && nextEmail !== user.email) {
    const existingEmail = await userModel.findOne({
      email: nextEmail,
      _id: { $ne: user._id },
    });
    if (existingEmail) {
      throw new Error("Email already in use");
    }

    const previousEmail = user.email;
    user.email = nextEmail;

    try {
      await sendSecurityNotificationEmail({
        toEmail: previousEmail,
        subject: "MeetConnect Email Updated",
        message: `Your MeetConnect account email was changed to ${nextEmail}. If this was not you, contact support immediately.`,
      });
      await sendSecurityNotificationEmail({
        toEmail: nextEmail,
        subject: "MeetConnect Email Change Confirmation",
        message: "Your MeetConnect email address was updated successfully.",
      });
    } catch (err) {
      console.error("Email notification failed:", err.message);
    }
  }

  await user.save();
  return toPublicUser(user);
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  try {
    await sendSecurityNotificationEmail({
      toEmail: user.email,
      subject: "MeetConnect Password Changed",
      message: "Your MeetConnect account password was changed successfully. If this was not you, reset password immediately.",
    });
  } catch (err) {
    console.error("Password change email failed:", err.message);
  }

  return { message: "Password changed successfully" };
};

export const getAccountSecurityInfoService = async (userId) => {
  const user = await userModel.findById(userId).select(
    "_id username email createdAt",
  );

  if (!user) {
    throw new Error("User not found");
  }

  return toPublicUser(user);
};

export const logoutAllDevicesService = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  return { message: "Logged out from all devices successfully" };
};
