
/**
 * auth.constants.js
 * Centralised constants for The 999 Boxs auth module.
 * Import from here — never hardcode these values.
 */

export const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
});

export const TOKEN_EXPIRY = Object.freeze({
  ACCESS: "15m",
  REFRESH: "7d",
  EMAIL_VERIFICATION_HOURS: 24,
  PASSWORD_RESET_HOURS: 1,
});

export const COOKIE_NAMES = Object.freeze({
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
});

export const ERROR_CODES = Object.freeze({
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
});
