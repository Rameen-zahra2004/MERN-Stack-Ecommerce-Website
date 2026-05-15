import redisClient from "./redis.js";
import logger from "./logger.js";

/*
=========================
SET CACHE
=========================
*/

export const setCache = async (
  key,
  data,
  ttl = 3600
) => {
  try {
    if (!redisClient.isOpen) return;

    await redisClient.setEx(
      key,
      ttl,
      JSON.stringify(data)
    );
  } catch (error) {
    logger.error(
      "Redis SET cache error",
      error
    );
  }
};

/*
=========================
GET CACHE
=========================
*/

export const getCache = async (
  key
) => {
  try {
    if (!redisClient.isOpen) return null;

    const data = await redisClient.get(
      key
    );

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (err) {
      logger.error(
        "Redis JSON parse error",
        err
      );
      return null;
    }
  } catch (error) {
    logger.error(
      "Redis GET cache error",
      error
    );
    return null;
  }
};

/*
=========================
DELETE CACHE
=========================
*/

export const deleteCache = async (
  key
) => {
  try {
    if (!redisClient.isOpen) return;

    await redisClient.del(key);
  } catch (error) {
    logger.error(
      "Redis DELETE cache error",
      error
    );
  }
};

/*
=========================
DELETE MULTIPLE CACHE KEYS (PATTERN BASED)
=========================
*/

export const deleteCacheByPattern =
  async (pattern) => {
    try {
      if (!redisClient.isOpen) return;

      const keys =
        await redisClient.keys(
          pattern
        );

      if (keys.length) {
        await redisClient.del(keys);
      }
    } catch (error) {
      logger.error(
        "Redis PATTERN delete error",
        error
      );
    }
  };