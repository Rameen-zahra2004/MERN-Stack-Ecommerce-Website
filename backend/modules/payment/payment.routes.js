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


router.post("/paypal/create-order", protect, paypalCreateOrder);

router.post("/paypal/capture", protect, paypalCaptureOrder);

router.post(
  "/paypal/refund",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  paypalRefund,
);

export default router;

