import { Router } from "express";
import { registerUser , loginUser } from "../controllers/auth.controllers.js";
const router = Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);
// router.post("/add_to_activity");
// router.get("/get_all_activities");
// router.post("/logout");

export default router;
