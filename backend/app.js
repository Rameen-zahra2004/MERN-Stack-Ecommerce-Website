import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import corsOptions from "./config/corsOptions.js";

/*
=========================
SECURITY MODULES (YOUR CUSTOM LAYER)
=========================
*/
import {
  securityMiddleware,
  ipBlocker,
  apiRateLimiter,
} from "./modules/security/index.js";

/*
=========================
ERROR HANDLERS
=========================
*/
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

/*
=========================
ROUTES
=========================
*/
import routes from "./routes/index.js";

/*
=========================
APP INIT
=========================
*/
const app = express();

/*
=========================
TRUST PROXY (IMPORTANT FOR RAILWAY / NGINX / PRODUCTION)
=========================
*/
app.set("trust proxy", 1);

/*
=========================
CORE SECURITY HEADERS
=========================
*/
app.use(helmet());

/*
=========================
CORS CONFIG
=========================
*/
app.use(cors(corsOptions));

/*
=========================
GLOBAL RATE LIMITING (DDOS + ABUSE PROTECTION)
=========================
*/
app.use(apiRateLimiter);

/*
=========================
BODY PARSERS
=========================
*/
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/*
=========================
DATA SANITIZATION
=========================
*/
app.use(mongoSanitize());
app.use(xss());

/*
=========================
COMPRESSION (PERFORMANCE)
=========================
*/
app.use(compression());

/*
=========================
REQUEST LOGGING
=========================
*/
app.use(
  morgan("dev", {
    skip: (req) => req.url === "/health",
  })
);

/*
=========================
CUSTOM SECURITY LAYER (YOUR MODULE)
=========================
*/
app.use(ipBlocker);
app.use(securityMiddleware);

/*
=========================
API ROUTES
=========================
*/
app.use("/api", routes);

/*
=========================
HEALTH CHECK (IMPORTANT FOR PRODUCTION DEPLOYMENTS)
=========================
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/*
=========================
404 HANDLER
=========================
*/
app.use(notFoundMiddleware);

/*
=========================
GLOBAL ERROR HANDLER
=========================
*/
app.use(errorMiddleware);

export default app;