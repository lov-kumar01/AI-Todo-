import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updatePreferences,
  getPublicProfile
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile/:userId", getPublicProfile);

// PROTECTED ROUTES
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/preferences", authMiddleware, updatePreferences);

export default router;