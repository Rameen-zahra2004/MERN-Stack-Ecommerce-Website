import { logSecurityEvent } from "./security.logger.js";

const NOSQL_OPERATORS = [
  "$where",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$in",
  "$nin",
  "$regex",
  "$or",
  "$and",
];

const containsNoSqlInjection = (obj) => {
  if (obj === null || typeof obj !== "object") return false;
  for (const key of Object.keys(obj)) {
    if (NOSQL_OPERATORS.includes(key)) return true;
    if (typeof obj[key] === "object" && containsNoSqlInjection(obj[key]))
      return true;
  }
  return false;
};

export const securityMiddleware = (req, res, next) => {
  try {
    const ip = req.ip;

    const suspicious =
      containsNoSqlInjection(req.body) ||
      containsNoSqlInjection(req.query) ||
      containsNoSqlInjection(req.params);

    if (suspicious) {
      logSecurityEvent("SUSPICIOUS_ACTIVITY", {
        ip,
        body: req.body,
        query: req.query,
      });
      return res.status(400).json({
        success: false,
        message: "Suspicious request blocked",
      });
    }

    next();
  } catch (error) {
    console.error("[Security] Middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Security middleware error",
    });
  }
};
