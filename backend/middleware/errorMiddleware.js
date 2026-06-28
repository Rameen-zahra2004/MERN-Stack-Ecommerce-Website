// import fs from "fs";

// /*
// =========================
// LOG ERROR (FILE / OBSERVABILITY READY)
// =========================
// */
// const logError = (err, req) => {
//   const log = {
//     message: err.message,
//     stack: err.stack,
//     statusCode: err.statusCode || 500,
//     path: req.originalUrl,
//     method: req.method,
//     timestamp: new Date().toISOString(),
//     ip:
//       req.headers["x-forwarded-for"] ||
//       req.socket.remoteAddress,
//   };

//   fs.appendFileSync(
//     "error.log",
//     JSON.stringify(log) + "\n"
//   );
// };

// /*
// =========================
// GLOBAL ERROR HANDLER
// =========================
// */

// const errorMiddleware = (
//   err,
//   req,
//   res,
//   next
// ) => {
//   let statusCode =
//     err.statusCode || 500;

//   let message =
//     err.message ||
//     "Internal Server Error";

//   /*
//   =========================
//   LOG ALL ERRORS (IMPORTANT)
//   =========================
//   */
//   logError(err, req);

//   /*
//   =========================
//   HANDLE MONGOOSE ERRORS
//   =========================
//   */
//   if (err.name === "CastError") {
//     statusCode = 400;
//     message = "Invalid ID format";
//   }

//   if (err.code === 11000) {
//     statusCode = 400;
//     message =
//       "Duplicate field value entered";
//   }

//   if (err.name === "ValidationError") {
//     statusCode = 400;
//     message = Object.values(
//       err.errors
//     )
//       .map((val) => val.message)
//       .join(", ");
//   }

//   /*
//   =========================
//   RESPONSE FORMAT (CONSISTENT API)
//   =========================
//   */

//   const response = {
//     success: false,
//     message,
//   };

//   /*
//   =========================
//   DEVELOPMENT STACK TRACE ONLY
//   =========================
//   */

//   if (
//     process.env.NODE_ENV ===
//     "development"
//   ) {
//     response.stack = err.stack;
//   }

//   return res
//     .status(statusCode)
//     .json(response);
// };

// export default errorMiddleware;
import fs from "fs";
import path from "path";

/*
=========================
ERROR MIDDLEWARE
The 999 Boxs — Production-grade global error handler.

MOUNT ORDER IN app.js (MUST BE LAST):
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

USAGE IN CONTROLLERS:
  try { ... } catch (err) { next(err); }

RESPONSE SHAPE:
  { success, message, errors?, code?, stack? }
=========================
*/

const isProduction = process.env.NODE_ENV === "production";
const LOG_FILE = path.resolve("logs/error.log");

/*
=========================
ENSURE LOG DIRECTORY EXISTS
=========================
*/
const ensureLogDir = () => {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/*
=========================
LOG ERROR TO FILE + CONSOLE
Swap fs.appendFile for Winston / Sentry in production.
Non-blocking — a logging failure must NEVER crash the app.
=========================
*/
const logError = (err, req) => {
  try {
    ensureLogDir();

    const entry = {
      timestamp: new Date().toISOString(),
      level: "error",
      statusCode: err.statusCode || 500,
      message: err.message,
      method: req.method,
      path: req.originalUrl,
      ip:
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      userId: req.user?._id?.toString() || null,
      stack: err.stack,
    };

    // Non-blocking write
    fs.appendFile(LOG_FILE, JSON.stringify(entry) + "\n", (writeErr) => {
      if (writeErr) {
        console.error("[Logger] Failed to write error log:", writeErr.message);
      }
    });

    if (!isProduction) {
      // Development: full stack trace to console
      console.error(
        `\n[${entry.timestamp}] ${entry.method} ${entry.path} → ${entry.statusCode}`,
        `\nMessage: ${entry.message}`,
        `\nStack: ${entry.stack}\n`,
      );
    } else if (entry.statusCode >= 500) {
      // Production: only log 5xx — 4xx are expected client errors
      console.error(
        `[ERROR] ${entry.timestamp} | ${entry.statusCode} | ${entry.method} ${entry.path} | ${entry.message}`,
      );
    }
  } catch (loggingErr) {
    // Last resort — logging itself broke
    console.error("[Logger] Critical logging failure:", loggingErr.message);
  }
};

/*
=========================
NORMALISE ERROR
Translates known error types into clean { statusCode, message, errors?, code? }.
Pure function — independently testable, keeps main handler thin.
=========================
*/
const normaliseError = (err) => {
  // Mongoose: bad ObjectId — e.g. /api/users/not-an-id
  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: `Invalid value for field "${err.path}".`,
    };
  }

  // Mongoose: unique index violation (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field];
    return {
      statusCode: 409,
      message: `"${value}" is already in use. Please use a different ${field}.`,
    };
  }

  // Mongoose: schema validation failed
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return {
      statusCode: 422,
      message: "Validation failed.",
      errors,
    };
  }

  // JWT: token signature invalid or tampered
  if (err.name === "JsonWebTokenError") {
    return {
      statusCode: 401,
      message: "Invalid token. Please log in again.",
      code: "TOKEN_INVALID",
    };
  }

  // JWT: token has expired
  if (err.name === "TokenExpiredError") {
    return {
      statusCode: 401,
      message: "Session expired. Please log in again.",
      code: "TOKEN_EXPIRED",
    };
  }

  // Multer: uploaded file exceeds size limit
  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      statusCode: 413,
      message: "File too large. Maximum upload size exceeded.",
    };
  }

  // Express body-parser: malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return {
      statusCode: 400,
      message: "Malformed JSON in request body.",
    };
  }

  // Default: pass through statusCode + message set by service layer
  return {
    statusCode: err.statusCode || 500,
    message: err.message || "An unexpected error occurred.",
    ...(err.errors && { errors: err.errors }),
    ...(err.code && { code: err.code }),
  };
};

/*
=========================
GLOBAL ERROR HANDLER
4-parameter signature = Express error middleware.
Every next(err) in the app lands here.
=========================
*/
const errorMiddleware = (err, req, res, next) => {
  // Always log first — before any transformation
  logError(err, req);

  // Normalise into clean shape
  const { statusCode, message, errors, code } = normaliseError(err);

  // Build response — never leak stack traces or internals in production
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(code && { code }),
    // Stack trace: development only, 5xx errors only
    ...(!isProduction && statusCode >= 500 && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

/*
=========================
404 NOT FOUND HANDLER
Mount AFTER all routes, BEFORE errorMiddleware.
=========================
*/
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export { errorMiddleware, notFoundMiddleware };
export default errorMiddleware;
