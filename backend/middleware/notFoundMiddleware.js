import fs from "fs";

/*
=========================
OPTIONAL: LOG UNKNOWN ROUTES
=========================
*/
const logNotFound = (req) => {
  const log = {
    message: "Route Not Found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip:
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress,
  };

  fs.appendFileSync(
    "not-found.log",
    JSON.stringify(log) + "\n"
  );
};

/*
=========================
404 MIDDLEWARE
=========================
*/

const notFoundMiddleware = (
  req,
  res,
  next
) => {
  /*
  =========================
  LOG UNKNOWN ROUTES
  =========================
  */
  logNotFound(req);

  /*
  =========================
  RESPONSE
  =========================
  */
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
};

export default notFoundMiddleware;