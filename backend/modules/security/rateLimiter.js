import rateLimit from "express-rate-limit";

/*
=========================
GLOBAL API RATE LIMIT
=========================
*/

export const apiRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min

    max: 200, // limit per IP

    message: {
      success: false,
      message:
        "Too many requests, try again later",
    },

    standardHeaders: true,

    legacyHeaders: false,
  });

/*
=========================
STRICT AUTH LIMITER
=========================
*/

export const authRateLimiter =
  rateLimit({
    windowMs: 10 * 60 * 1000,

    max: 10,

    message: {
      success: false,
      message:
        "Too many login attempts",
    },
  });