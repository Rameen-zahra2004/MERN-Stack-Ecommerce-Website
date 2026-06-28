import express from "express";

import {
  stripeCreateIntent,
  stripeVerifyPayment,
  stripeRefund,
  stripeWebhook,
  paypalCreateOrder,
  paypalCaptureOrder,
  paypalRefund,
} from "./payment.controller.js";

import { protect } from "../auth/auth.middleware.js";
import authorizeRoles from "../roles/role.middleware.js";

const router = express.Router();

/*
=========================
STRIPE ROUTES
=========================
*/

// IMPORTANT: Stripe needs the RAW request body to verify the webhook
// signature. This must be registered with express.raw() and must NOT
// pass through express.json() first — mount this route before any
// app.use(express.json()) call in your main app, or scope express.json()
// to skip this path. Example in app.js:
//
//   app.post(
//     "/api/payments/stripe/webhook",
//     express.raw({ type: "application/json" }),
//     stripeWebhook
//   );
//   app.use(express.json()); // mount AFTER the webhook route
//
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

router.post("/stripe/intent", protect, stripeCreateIntent);

router.post("/stripe/verify", protect, stripeVerifyPayment);

router.post(
  "/stripe/refund",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  stripeRefund,
);

/*
=========================
PAYPAL ROUTES
=========================
*/

router.post("/paypal/create-order", protect, paypalCreateOrder);

router.post("/paypal/capture", protect, paypalCaptureOrder);

router.post(
  "/paypal/refund",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  paypalRefund,
);

export default router;

