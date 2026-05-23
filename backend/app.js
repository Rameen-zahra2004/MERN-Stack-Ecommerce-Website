import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import corsOptions from "./config/corsOptions.js";

import {
  securityMiddleware,
  ipBlocker,
  apiRateLimiter,
} from "./modules/security/index.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

import routes from "./routes/index.js";
import paymentRoutes from "./routes/payment.routes.js";
import { stripeWebhook } from "./controllers/payment.controller.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors(corsOptions));

app.use(apiRateLimiter);

// ─── Stripe Webhook ────────────────────────────────────────────────────────────
// MUST come before express.json() — Stripe signature verification
// requires the raw, unparsed request body.
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize({ skipQuery: true }));

app.use(compression());

app.use(
  morgan("dev", {
    skip: (req) => req.url === "/health",
  })
);

app.use(ipBlocker);
app.use(securityMiddleware);

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", routes);
app.use("/api/payments", paymentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;