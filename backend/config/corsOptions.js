import logger from "./logger.js";


const allowedOrigins = (
  process.env.CORS_ORIGIN || ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


const corsOptions = {
  origin: (origin, callback) => {
    try {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

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
      logger.error(
        "CORS middleware error",
        error
      );

      return callback(null, false);
    }
  },

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

  maxAge: 86400, // 24 hours

  optionsSuccessStatus: 200,
};

export default corsOptions;