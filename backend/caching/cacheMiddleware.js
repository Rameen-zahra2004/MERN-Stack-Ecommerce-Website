import {
  getCache,
  setCache,
} from "./cacheService.js";

import logger from "./logger.js";


const cacheMiddleware = (
  keyGenerator,
  ttl = 3600
) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);

      const cachedData =
        await getCache(key);

      if (cachedData) {
        return res.json({
          success: true,
          source: "cache",
          data: cachedData,
        });
      }

      const originalJson =
        res.json.bind(res);

      res.json = async (body) => {
        try {
          if (body?.success) {
            await setCache(
              key,
              body.data,
              ttl
            );
          }
        } catch (err) {
          logger.error(
            "Cache SET failed in middleware",
            err
          );
        }

        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error(
        "Cache middleware error",
        error
      );
      next();
    }
  };
};

export default cacheMiddleware;