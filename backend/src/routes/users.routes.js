import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
  googleLogin,
  checkUsernameAvailability
} from "../controllers/auth.controllers.js";
import {
  getUserHistory,
  addMeetingToHistory,
} from "../controllers/history.controllers.js";
import { getMyProfileController } from "../controllers/account.controllers.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  authLimiter,
  loginIpLimiter,
  loginEmailLimiter,
} from "../middleware/rateLimiter.middleware.js";

const router = Router();


router.post("/register", authLimiter, registerUser);
router.post("/login", loginIpLimiter, loginEmailLimiter, loginUser);
router.post("/forgot-password", requestPasswordResetOtp);
router.post("/verify-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/google-login", googleLogin);
router.get("/username-available", authLimiter, checkUsernameAvailability);


router.use(authenticateToken);

router.get("/me", getMyProfileController);

router.get("/history", getUserHistory);
router.post("/history", addMeetingToHistory);

router.post("/logout", logoutUser);

export default router;
