import {
  logSecurityEvent,
} from "./security.logger.js";

/*
=========================
REQUEST SECURITY MIDDLEWARE
=========================
*/

export const securityMiddleware =
  (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

      /*
      =========================
      BASIC HEADER HARDENING
      =========================
      */

      res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
      );

      res.setHeader(
        "X-Frame-Options",
        "DENY"
      );

      res.setHeader(
        "X-XSS-Protection",
        "1; mode=block"
      );

      /*
      =========================
      SUSPICIOUS PATTERN DETECTION
      =========================
      */

      const suspiciousPatterns = [
        "../",
        "<script>",
        "SELECT *",
        "DROP TABLE",
      ];

      const bodyString =
        JSON.stringify(req.body);

      if (
        suspiciousPatterns.some(
          (pattern) =>
            bodyString.includes(
              pattern
            )
        )
      ) {
        logSecurityEvent(
          "SUSPICIOUS_ACTIVITY",
          {
            ip,
            body: req.body,
          }
        );

        return res.status(400).json({
          success: false,
          message:
            "Suspicious request blocked",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Security middleware error",
      });
    }
  };