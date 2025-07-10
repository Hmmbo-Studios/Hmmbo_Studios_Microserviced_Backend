import { Router } from "express";
import {
  register,
  login,
  me,
  resendOtp,
  verifyOtp,
} from "../controller/authcontroller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/me", requireAuth, me);
router.post("/resend-otp", requireAuth, resendOtp);
router.post("/verify-otp", requireAuth, verifyOtp);

export default router;
