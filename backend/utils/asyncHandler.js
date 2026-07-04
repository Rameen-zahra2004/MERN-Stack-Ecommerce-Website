import logger from "../config/logger.js";


const asyncHandler = (fn) => {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(
      (error) => {
        logger.error(
          "Async Handler Error",
          {
            message: error.message,
            stack: error.stack,
            url: req.originalUrl,
            method: req.method,
          }
        );

        next(error);
      }
    );
  };
};

export default asyncHandler;