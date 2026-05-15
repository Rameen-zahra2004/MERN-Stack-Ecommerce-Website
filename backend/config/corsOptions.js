import logger from "./logger.js";

/*
=========================
PARSE ALLOWED ORIGINS
=========================
*/

const allowedOrigins = (
  process.env.CORS_ORIGIN || ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/*
=========================
CORS OPTIONS (PRODUCTION-GRADE)
=========================
*/

const corsOptions = {
  /*
  =========================
  ORIGIN VALIDATION
  =========================
  */
  origin: (origin, callback) => {
    try {
      /*
      =========================
      ALLOW NON-BROWSER REQUESTS (POSTMAN / MOBILE / SERVER)
      =========================
      */
      if (!origin) {
        return callback(null, true);
      }

      /*
      =========================
      ALLOW IF ORIGIN IS WHITELISTED
      =========================
      */
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      /*
      =========================
      BLOCK + LOG UNAUTHORIZED ORIGIN
      =========================
      */
      logger.warn(
        `CORS BLOCKED: ${origin}`
      );

      return callback(
        new Error(
          `CORS blocked for origin: ${origin}`
        ),
        false
      );
    } catch (error) {
      /*
      =========================
      SAFETY FALLBACK (NEVER CRASH SERVER)
      =========================
      */
      logger.error(
        "CORS middleware error",
        error
      );

      return callback(null, false);
    }
  },

  /*
  =========================
  SECURITY SETTINGS
  =========================
  */
  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],

  exposedHeaders: ["Set-Cookie"],

  /*
  =========================
  PRE-FLIGHT CACHE
  =========================
  */
  maxAge: 86400, // 24 hours

  /*
  =========================
  LEGACY BROWSER SUPPORT
  =========================
  */
  optionsSuccessStatus: 200,
};

export default corsOptions;