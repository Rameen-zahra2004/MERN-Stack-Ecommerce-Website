/**
 * ─────────────────────────────────────────────────────────────
 * APP ENTRYPOINT — Express Application Configuration
 * ─────────────────────────────────────────────────────────────
 * This file ONLY configures and exports the Express app instance.
 * Server lifecycle (listen, DB connection, graceful shutdown) lives
 * in server.js — keeping app.js fully testable in isolation
 * (e.g. with supertest) without binding to a port or touching the DB.
 * ─────────────────────────────────────────────────────────────
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";

import corsOptions from "./config/corsOptions.js";

import {
  securityMiddleware,
  ipBlocker,
  apiRateLimiter,
} from "./modules/security/index.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware.js";

import routes from "./routes/index.js";
import { stripeWebhook } from "./modules/payment/payment.controller.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";

/**
 * ─────────────────────────────────────────────
 * 1. PROXY TRUST
 * ─────────────────────────────────────────────
 */
app.set("trust proxy", 1);
app.disable("x-powered-by");

/**
 * ─────────────────────────────────────────────
 * 2. SECURITY HEADERS
 * ─────────────────────────────────────────────
 */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

/**
 * ─────────────────────────────────────────────
 * 3. CORS
 * ─────────────────────────────────────────────
 */
app.use(cors(corsOptions));

/**
 * ─────────────────────────────────────────────
 * 4. RATE LIMITING
 * ─────────────────────────────────────────────
 */
app.use(apiRateLimiter);

/**
 * ─────────────────────────────────────────────
 * 5. STRIPE WEBHOOK
 * MUST be mounted before express.json().
 * ─────────────────────────────────────────────
 */
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

/**
 * ─────────────────────────────────────────────
 * 6. BODY PARSERS
 * ─────────────────────────────────────────────
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/**
 * ─────────────────────────────────────────────
 * 7. NOSQL INJECTION SANITIZATION
 * ─────────────────────────────────────────────
 */
app.use(mongoSanitize({ skipQuery: true }));

/**
 * ─────────────────────────────────────────────
 * 8. CUSTOM SECURITY LAYER
 * ─────────────────────────────────────────────
 */
app.use(ipBlocker);
app.use(securityMiddleware);

/**
 * ─────────────────────────────────────────────
 * 9. STATIC FILES
 * ─────────────────────────────────────────────
 */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: isProduction ? "7d" : 0,
    immutable: isProduction,
  }),
);

/**
 * ─────────────────────────────────────────────
 * 10. COMPRESSION
 * ─────────────────────────────────────────────
 */
app.use(compression());

/**
 * ─────────────────────────────────────────────
 * 11. REQUEST LOGGING
 * ─────────────────────────────────────────────
 */
app.use(
  morgan(isProduction ? "combined" : "dev", {
    skip: (req) => req.originalUrl === "/health",
  }),
);

/**
 * ─────────────────────────────────────────────
 * 12. ROUTES
 * ─────────────────────────────────────────────
 */
app.use("/api", routes);

/**
 * ─────────────────────────────────────────────
 * 13. HEALTH CHECK
 * ─────────────────────────────────────────────
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * ─────────────────────────────────────────────
 * 14. 404 HANDLER
 * ─────────────────────────────────────────────
 */
app.use(notFoundMiddleware);

/**
 * ─────────────────────────────────────────────
 * 15. GLOBAL ERROR HANDLER
 * ─────────────────────────────────────────────
 */
app.use(errorMiddleware);

export default app;
