import * as authService from "./auth.service.js";
import {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

/**
 * auth.controller.js
 * Thin controllers for The 999 Boxs auth module.
 *
 * Controllers ONLY:
 *   1. Validate request input
 *   2. Call service layer
 *   3. Return standardised JSON response
 *
 * Zero business logic here.
 */

// ─── CONSISTENT RESPONSE HELPER ───────────────────────────────────────────────

const respond = (res, statusCode, success, message, data = undefined) =>
  res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
  });

// ─── REGISTER ─────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { errors, value } = validate(registerSchema, req.body);
    if (errors) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed.", errors });
    }

    const user = await authService.registerUser(value);

    return respond(
      res,
      201,
      true,
      "Account created successfully! Please check your email to verify your account.",
      { user },
    );
  } catch (err) {
    next(err);
  }
};

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string" || token.length !== 64) {
      return respond(res, 400, false, "Invalid verification token.");
    }

    await authService.verifyEmail(token);

    return respond(
      res,
      200,
      true,
      "Email verified successfully! You can now log in.",
    );
  } catch (err) {
    next(err);
  }
};

// ─── RESEND VERIFICATION EMAIL ────────────────────────────────────────────────

export const resendVerification = async (req, res, next) => {
  try {
    const { errors, value } = validate(forgotPasswordSchema, req.body); // reuse email schema
    if (errors) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed.", errors });
    }

    await authService.resendVerificationEmail(value.email);

    // Always return success to prevent email enumeration
    return respond(
      res,
      200,
      true,
      "If an unverified account exists for this email, a new verification link has been sent.",
    );
  } catch (err) {
    next(err);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { errors, value } = validate(loginSchema, req.body);
    if (errors) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed.", errors });
    }

    const user = await authService.loginUser(res, value);

    return respond(res, 200, true, "Logged in successfully.", { user });
  } catch (err) {
    next(err);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

export const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    const user = await authService.refreshAccessToken(
      res,
      incomingRefreshToken,
    );

    return respond(res, 200, true, "Token refreshed.", { user });
  } catch (err) {
    next(err);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(res, req.user?._id);
    return respond(res, 200, true, "Logged out successfully.");
  } catch (err) {
    next(err);
  }
};

// ─── GET ME (auto-login on refresh) ──────────────────────────────────────────

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    return respond(res, 200, true, "User fetched.", { user });
  } catch (err) {
    next(err);
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { errors, value } = validate(forgotPasswordSchema, req.body);
    if (errors) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed.", errors });
    }

    await authService.forgotPassword(value.email);

    return respond(
      res,
      200,
      true,
      "If an account with that email exists, a password reset link has been sent.",
    );
  } catch (err) {
    next(err);
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

export const resetPassword = async (req, res, next) => {
  try {
    const { errors, value } = validate(resetPasswordSchema, req.body);
    if (errors) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed.", errors });
    }

    await authService.resetPassword(res, {
      rawToken: value.token,
      password: value.password,
    });

    return respond(
      res,
      200,
      true,
      "Password reset successfully. Please log in.",
    );
  } catch (err) {
    next(err);
  }
};
