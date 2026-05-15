import {
  getCache,
  setCache,
} from "./cacheService.js";

import logger from "./logger.js";

/*
=========================
CACHE MIDDLEWARE FACTORY
=========================
*/

const cacheMiddleware = (
  keyGenerator,
  ttl = 3600
) => {
  return async (req, res, next) => {
    try {
      /*
      =========================
      GENERATE DYNAMIC CACHE KEY
      =========================
      */
      const key = keyGenerator(req);

      /*
      =========================
      CHECK CACHE
      =========================
      */
      const cachedData =
        await getCache(key);

      if (cachedData) {
        return res.json({
          success: true,
          source: "cache",
          data: cachedData,
        });
      }

      /*
      =========================
      OVERRIDE res.json SAFELY
      =========================
      */
      const originalJson =
        res.json.bind(res);

      res.json = async (body) => {
        try {
          /*
          =========================
          ONLY CACHE SUCCESSFUL RESPONSES
          =========================
          */
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
      /*
      =========================
      FAIL SAFE (NEVER BREAK REQUEST)
      =========================
      */
      logger.error(
        "Cache middleware error",
        error
      );
      next();
    }
  };
};

export default cacheMiddleware;