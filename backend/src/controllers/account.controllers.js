import {
  updateProfileService,
  changePasswordService,
  getAccountSecurityInfoService,
  logoutAllDevicesService,
} from "../services/account.service.js";
import httpStatus from "http-status";
import { clearAuthCookie } from "../utils/authToken.js";

export const getMyProfileController = async (req, res) => {
  try {
    const user = await getAccountSecurityInfoService(req.user.id);
    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username && !email) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, message: "No profile fields provided" });
    }

    const user = await updateProfileService(req.user.id, {
      username,
      email,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const result = await changePasswordService(
      req.user.id,
      currentPassword,
      newPassword,
    );

    return res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

export const logoutAllDevicesController = async (req, res) => {
  try {
    const result = await logoutAllDevicesService(req.user.id);
    clearAuthCookie(res);
    return res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
