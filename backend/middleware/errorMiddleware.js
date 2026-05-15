import fs from "fs";

/*
=========================
LOG ERROR (FILE / OBSERVABILITY READY)
=========================
*/
const logError = (err, req) => {
  const log = {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip:
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress,
  };

  fs.appendFileSync(
    "error.log",
    JSON.stringify(log) + "\n"
  );
};

/*
=========================
GLOBAL ERROR HANDLER
=========================
*/

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  /*
  =========================
  LOG ALL ERRORS (IMPORTANT)
  =========================
  */
  logError(err, req);

  /*
  =========================
  HANDLE MONGOOSE ERRORS
  =========================
  */
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message =
      "Duplicate field value entered";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(
      err.errors
    )
      .map((val) => val.message)
      .join(", ");
  }

  /*
  =========================
  RESPONSE FORMAT (CONSISTENT API)
  =========================
  */

  const response = {
    success: false,
    message,
  };

  /*
  =========================
  DEVELOPMENT STACK TRACE ONLY
  =========================
  */

  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    response.stack = err.stack;
  }

  return res
    .status(statusCode)
    .json(response);
};

export default errorMiddleware;