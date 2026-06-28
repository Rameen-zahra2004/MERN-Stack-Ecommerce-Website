// export const AUTH_MESSAGES = {
//   REGISTER_SUCCESS:
//     "User registered successfully",

//   LOGIN_SUCCESS:
//     "Login successful",

//   LOGOUT_SUCCESS:
//     "Logout successful",

//   PROFILE_SUCCESS:
//     "Profile fetched successfully",

//   INVALID_CREDENTIALS:
//     "Invalid email or password",

//   USER_NOT_FOUND:
//     "User not found",

//   EMAIL_ALREADY_EXISTS:
//     "Email already exists",

//   UNAUTHORIZED:
//     "Unauthorized access",

//   TOKEN_REQUIRED:
//     "Access token required",

//   INVALID_TOKEN:
//     "Invalid or expired token",

//   ACCOUNT_DISABLED:
//     "Account is disabled",
// };

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
