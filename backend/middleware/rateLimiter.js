import rateLimit from "express-rate-limit";

/*
=========================
RATE LIMITER CONFIG (SAFE DEFAULTS)
=========================
*/

const windowMs =
  Number(process.env.RATE_LIMIT_WINDOW_MS) ||
  15 * 60 * 1000; // 15 min default

const maxRequests =
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) ||
  100; // safe default

/*
=========================
RATE LIMITER
=========================
*/

const limiter = rateLimit({
  windowMs,

  max: maxRequests,

  /*
  =========================
  STANDARD HEADERS (PRODUCTION BEST PRACTICE)
  =========================
  */
  standardHeaders: true,
  legacyHeaders: false,

  /*
  =========================
  CUSTOM RESPONSE FORMAT
  =========================
  */
  message: {
    success: false,
    message:
      "Too many requests, please try again later.",
  },

  /*
  =========================
  SKIP HEALTH CHECK (IMPORTANT)
  =========================
  */
  skip: (req) =>
    req.path === "/health",

  /*
  =========================
  OPTIONAL: ABUSE HOOK (EXTENDABLE)
  =========================
  */
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Rate limit exceeded. Slow down your requests.",
    });
  },
});

export default limiter;