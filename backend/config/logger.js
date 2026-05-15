import winston from "winston";
import env from "./env.js";

/*
=========================
LOG LEVEL CONFIG
=========================
*/

const level =
  env.NODE_ENV === "production"
    ? "info"
    : "debug";

/*
=========================
LOG FORMATTER
=========================
*/

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({
    stack: true,
  }),
  winston.format.json()
);

/*
=========================
LOGGER INSTANCE
=========================
*/

const logger = winston.createLogger({
  level,
  format,

  defaultMeta: {
    service: "ecommerce-api",
  },

  transports: [
    /*
    =========================
    CONSOLE (DEV ONLY)
    =========================
    */
    new winston.transports.Console({
      format:
        env.NODE_ENV === "development"
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : winston.format.json(),
    }),

    /*
    =========================
    ERROR LOG FILE
    =========================
    */
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    /*
    =========================
    COMBINED LOG FILE
    =========================
    */
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

/*
=========================
GLOBAL EXCEPTION HANDLING
=========================
*/

logger.exceptions.handle(
  new winston.transports.File({
    filename: "logs/exceptions.log",
  })
);

/*
=========================
GLOBAL REJECTION HANDLING
=========================
*/

logger.rejections.handle(
  new winston.transports.File({
    filename: "logs/rejections.log",
  })
);

export default logger;