import fs from "fs";
import path from "path";


const isProduction = process.env.NODE_ENV === "production";
const LOG_FILE = path.resolve("logs/error.log");

const ensureLogDir = () => {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

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
      console.error(
        `\n[${entry.timestamp}] ${entry.method} ${entry.path} → ${entry.statusCode}`,
        `\nMessage: ${entry.message}`,
        `\nStack: ${entry.stack}\n`,
      );
    } else if (entry.statusCode >= 500) {
      console.error(
        `[ERROR] ${entry.timestamp} | ${entry.statusCode} | ${entry.method} ${entry.path} | ${entry.message}`,
      );
    }
  } catch (loggingErr) {
    // Last resort — logging itself broke
    console.error("[Logger] Critical logging failure:", loggingErr.message);
  }
};

const normaliseError = (err) => {
  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: `Invalid value for field "${err.path}".`,
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field];
    return {
      statusCode: 409,
      message: `"${value}" is already in use. Please use a different ${field}.`,
    };
  }

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

  if (err.name === "JsonWebTokenError") {
    return {
      statusCode: 401,
      message: "Invalid token. Please log in again.",
      code: "TOKEN_INVALID",
    };
  }

  if (err.name === "TokenExpiredError") {
    return {
      statusCode: 401,
      message: "Session expired. Please log in again.",
      code: "TOKEN_EXPIRED",
    };
  }

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

  return {
    statusCode: err.statusCode || 500,
    message: err.message || "An unexpected error occurred.",
    ...(err.errors && { errors: err.errors }),
    ...(err.code && { code: err.code }),
  };
};

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

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export { errorMiddleware, notFoundMiddleware };
export default errorMiddleware;
