import { verifyAccessToken } from "./authUtils.js";
import User from "../user/User.model.js";

/**
 * auth.middleware.js
 * Express middleware for The 999 Boxs authentication system.
 *
 * Usage:
 *   router.get("/profile", protect, getProfile)
 *   router.delete("/user/:id", protect, restrictTo("admin"), deleteUser)
 */

// ─── PROTECT: Verify JWT + attach user ────────────────────────────────────────

export const protect = async (req, res, next) => {
  try {
    // 1. Extract token from HTTP-only cookie (primary) or Authorization header (fallback)
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // 2. Verify signature + expiry
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      const isExpired = err.name === "TokenExpiredError";
      return res.status(401).json({
        success: false,
        message: isExpired
          ? "Session expired. Please refresh your token."
          : "Invalid token. Please log in again.",
        code: isExpired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
      });
    }

    // 3. Fetch fresh user from DB (catches deleted/deactivated users)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // 4. Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account suspended. Contact support.",
        code: "ACCOUNT_SUSPENDED",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // 5. Detect password change AFTER token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "Password recently changed. Please log in again.",
      });
    }

    // 6. Attach user to request — controllers use req.user
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// ─── RESTRICT TO: Role-based access control ────────────────────────────────────

/**
 * Restrict a route to specific roles.
 * Must be used AFTER `protect` middleware.
 *
 * @param {...string} roles - Allowed roles e.g. "admin", "moderator"
 *
 * @example
 *   router.delete("/products/:id", protect, restrictTo("admin"), deleteProduct)
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

// ─── OPTIONAL AUTH: Attach user if token present ──────────────────────────────

/**
 * Like `protect` but does NOT block unauthenticated requests.
 * Useful for routes that behave differently for logged-in users
 * (e.g. product listings showing wishlist status).
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (
      user?.isActive &&
      user?.isEmailVerified &&
      !user.changedPasswordAfter(decoded.iat)
    ) {
      req.user = user;
    }
    next();
  } catch {
    // Silently ignore invalid/expired tokens for optional auth
    next();
  }
};
