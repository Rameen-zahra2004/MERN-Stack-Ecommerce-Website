import { createActivityLogService } from "./activityLog.service.js";

const REDACT_FIELDS = [
  "password",
  "newPassword",
  "confirmPassword",
  "token",
  "refreshToken",
];


const activityLogger = (moduleName, actionName) => async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    // FIX (L5): redact sensitive fields before persisting request body
    const safeBody = { ...req.body };
    REDACT_FIELDS.forEach((f) => {
      if (f in safeBody) safeBody[f] = "[REDACTED]";
    });

    createActivityLogService({
      user: req.user?._id,
      action: actionName,
      module: moduleName,
      method: req.method,
      endpoint: req.originalUrl,
      // FIX (L4): req.connection is deprecated, prefer req.socket
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      statusCode: res.statusCode,
      metadata: {
        body: safeBody,
        params: req.params,
        query: req.query,
      },
    }).catch(console.error);

    return originalSend.call(this, body);
  };

  next();
};

export default activityLogger;
