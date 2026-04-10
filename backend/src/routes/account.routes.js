import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  updateProfileController,
  changePasswordController,
  logoutAllDevicesController,
} from "../controllers/account.controllers.js";

const accountRouter = express.Router();

accountRouter.put("/update-profile", authenticateToken, updateProfileController);
accountRouter.put("/change-password", authenticateToken, changePasswordController);
accountRouter.post(
  "/logout-all-devices",
  authenticateToken,
  logoutAllDevicesController,
);

export default accountRouter;
