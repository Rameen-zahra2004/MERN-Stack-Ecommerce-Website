import winston from "winston";
import env from "./env.js";


const level =
  env.NODE_ENV === "production"
    ? "info"
    : "debug";


const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({
    stack: true,
  }),
  winston.format.json()
);


const logger = winston.createLogger({
  level,
  format,

  defaultMeta: {
    service: "ecommerce-api",
  },

  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === "development"
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : winston.format.json(),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});


logger.exceptions.handle(
  new winston.transports.File({
    filename: "logs/exceptions.log",
  })
);


logger.rejections.handle(
  new winston.transports.File({
    filename: "logs/rejections.log",
  })
);

export default logger;