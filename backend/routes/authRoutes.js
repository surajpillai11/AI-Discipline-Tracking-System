import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerValidation, loginValidation } from "../middleware/validators/authValidators.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidation, validateRequest, registerUser);
router.post("/login", authLimiter, loginValidation, validateRequest, loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logoutUser);

export default router;
