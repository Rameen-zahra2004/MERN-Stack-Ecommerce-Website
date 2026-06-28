// import jwt from "jsonwebtoken";
// import crypto from "crypto";

// // ─── ACCESS TOKEN ─────────────────────────────────────────────────────────────

// /**
//  * Generate a signed JWT access token.
//  * @param {{ id: string, role: string }} payload
//  * @returns {string} signed JWT
//  */
// export const generateAccessToken = (payload) =>
//   jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
//     expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
//     issuer: "the999boxs",
//     audience: "the999boxs-client",
//   });

// /**
//  * Verify and decode an access token.
//  * Throws JsonWebTokenError / TokenExpiredError on failure.
//  */
// export const verifyAccessToken = (token) =>
//   jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
//     issuer: "the999boxs",
//     audience: "the999boxs-client",
//   });

// // ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

// /**
//  * Generate a signed JWT refresh token.
//  */
// export const generateRefreshToken = (payload) =>
//   jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
//     issuer: "the999boxs",
//     audience: "the999boxs-client",
//   });

// /**
//  * Verify and decode a refresh token.
//  */
// export const verifyRefreshToken = (token) =>
//   jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
//     issuer: "the999boxs",
//     audience: "the999boxs-client",
//   });

// // ─── CRYPTO TOKENS (email verification / password reset) ─────────────────────

// /**
//  * Generate a secure random hex token (e.g. for email verification).
//  * Returns { rawToken, hashedToken }
//  * Store ONLY hashedToken in DB. Send rawToken in email link.
//  */
// export const generateCryptoToken = () => {
//   const rawToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(rawToken)
//     .digest("hex");
//   return { rawToken, hashedToken };
// };

// /**
//  * Hash an incoming raw token for DB comparison.
//  */
// export const hashToken = (rawToken) =>
//   crypto.createHash("sha256").update(rawToken).digest("hex");

// // ─── COOKIE OPTIONS ───────────────────────────────────────────────────────────

// const isProduction = process.env.NODE_ENV === "production";

// export const accessTokenCookieOptions = {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? "strict" : "lax",
//   maxAge: 15 * 60 * 1000, // 15 minutes in ms
//   path: "/",
// };

// export const refreshTokenCookieOptions = {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? "strict" : "lax",
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
//   path: "/api/auth/refresh", // Scoped: refresh endpoint only
// };

// /**
//  * Attach both tokens as HTTP-only cookies to the response.
//  */
// export const attachAuthCookies = (res, { accessToken, refreshToken }) => {
//   res.cookie("accessToken", accessToken, accessTokenCookieOptions);
//   res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
// };

// /**
//  * Clear both auth cookies (used on logout).
//  */
// export const clearAuthCookies = (res) => {
//   res.clearCookie("accessToken", { path: "/" });
//   res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
// };
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * authUtils.js
 * Token utilities for The 999 Boxs authentication system.
 * Shared by both User auth (auth.service.js) and Admin auth (admin.service.js).
 *
 * TOKEN STRATEGY
 * ─────────────
 * Access Token  → short-lived (15 min), stored in HTTP-only cookie
 * Refresh Token → long-lived (7 days), stored in HTTP-only cookie + hashed in DB
 * Email/Reset   → crypto random hex token, hashed before DB storage (never stored raw)
 *
 * COOKIE NAMING
 * ─────────────
 * User session   → "accessToken" / "refreshToken"     (path: /api/auth/refresh)
 * Admin session  → "adminAccessToken" / "adminRefreshToken" (path: /api/admins/refresh)
 * These never collide — both can be active in the same browser simultaneously.
 */

// ─── ACCESS TOKEN ─────────────────────────────────────────────────────────────

export const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    issuer: "the999boxs",
    audience: "the999boxs-client",
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "the999boxs",
    audience: "the999boxs-client",
  });

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: "the999boxs",
    audience: "the999boxs-client",
  });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: "the999boxs",
    audience: "the999boxs-client",
  });

// ─── CRYPTO TOKENS (email verification / password reset) ─────────────────────

export const generateCryptoToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return { rawToken, hashedToken };
};

export const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

// ─── COOKIE OPTIONS ───────────────────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === "production";

const baseAccessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: "/",
};

// refresh-cookie path is determined per-caller (see attachAuthCookies below),
// since User and Admin refresh endpoints live at different routes
const baseRefreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Attach access + refresh tokens as HTTP-only cookies.
 * Pass accessCookieName/refreshCookieName to namespace Admin sessions
 * separately from User sessions — defaults to the User names.
 */
export const attachAuthCookies = (
  res,
  {
    accessToken,
    refreshToken,
    accessCookieName = "accessToken",
    refreshCookieName = "refreshToken",
  },
) => {
  res.cookie(accessCookieName, accessToken, baseAccessCookieOptions);

  const refreshPath =
    refreshCookieName === "adminRefreshToken"
      ? "/api/admins/refresh"
      : "/api/auth/refresh";

  res.cookie(refreshCookieName, refreshToken, {
    ...baseRefreshCookieOptions,
    path: refreshPath,
  });
};

/**
 * Clear access + refresh cookies. Must use the SAME names/paths they were
 * set with, or the browser will not remove them.
 */
export const clearAuthCookies = (
  res,
  { accessCookieName = "accessToken", refreshCookieName = "refreshToken" } = {},
) => {
  const refreshPath =
    refreshCookieName === "adminRefreshToken"
      ? "/api/admins/refresh"
      : "/api/auth/refresh";

  res.clearCookie(accessCookieName, { path: "/" });
  res.clearCookie(refreshCookieName, { path: refreshPath });
};
