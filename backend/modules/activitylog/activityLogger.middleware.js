import {
  createActivityLogService,
} from "./activityLog.service.js";

/*
=========================
AUTO ACTIVITY LOGGER
=========================
*/

const activityLogger =
  (moduleName, actionName) =>
  async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
      createActivityLogService({
        user: req.user?._id,

        action: actionName,

        module: moduleName,

        method: req.method,

        endpoint: req.originalUrl,

        ipAddress:
          req.ip ||
          req.connection.remoteAddress,

        userAgent:
          req.headers["user-agent"],

        statusCode: res.statusCode,

        metadata: {
          body: req.body,
          params: req.params,
          query: req.query,
        },
      }).catch(console.error);

      return originalSend.call(
        this,
        body
      );
    };

    next();
  };

export default activityLogger;