import { createClient } from "redis";
import logger from "./logger.js";


const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error(
          "Redis max retry attempts reached"
        );
        return new Error(
          "Redis retry limit exceeded"
        );
      }

      return Math.min(
        retries * 200,
        3000
      );
    },
  },
});


redisClient.on("connect", () => {
  logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
  logger.info("Redis connected & ready");
});

redisClient.on("error", (err) => {
  logger.error(
    "Redis error",
    err
  );
});

redisClient.on("end", () => {
  logger.warn("Redis connection closed");
});


export const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      logger.warn(
        "REDIS_URL not provided, skipping Redis connection"
      );
      return;
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    logger.info("🚀 Redis Connected Successfully");
  } catch (error) {
    logger.error(
      "Redis connection failed",
      error
    );
  }
};


export default redisClient;