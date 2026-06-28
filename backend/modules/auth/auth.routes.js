import { Router } from "express";
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { protect } from "./auth.middleware.js";

/**
 * auth.routes.js
 * All authentication routes for The 999 Boxs.
 *
 * Mounted at: /api/auth
 *
 * Public routes (no auth required):
 *   POST   /api/auth/register
 *   GET    /api/auth/verify-email?token=<raw_token>
 *   POST   /api/auth/resend-verification
 *   POST   /api/auth/login
 *   POST   /api/auth/refresh          ← cookie-based, scoped path
 *   POST   /api/auth/forgot-password
 *   POST   /api/auth/reset-password
 *
 * Protected routes (access token required):
 *   POST   /api/auth/logout
 *   GET    /api/auth/me               ← auto-login check on React refresh
 */

const router = Router();

// ── Public ──────────────────────────────────────────────────────────────────
router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/refresh", refreshToken); // Refresh token cookie scoped to this path
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── Protected ────────────────────────────────────────────────────────────────
router.use(protect); // All routes below require valid access token
router.post("/logout", logout);
router.get("/me", getMe);

export default router;

