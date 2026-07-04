import rateLimit from "express-rate-limit";


const windowMs =
  Number(process.env.RATE_LIMIT_WINDOW_MS) ||
  15 * 60 * 1000; // 15 min default

const maxRequests =
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) ||
  100; // safe default


const limiter = rateLimit({
  windowMs,

  max: maxRequests,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests, please try again later.",
  },

  skip: (req) =>
    req.path === "/health",

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Rate limit exceeded. Slow down your requests.",
    });
  },
});

export default limiter;