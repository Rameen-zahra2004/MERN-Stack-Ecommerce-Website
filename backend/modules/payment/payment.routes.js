import express from "express";

import {
  stripeCreateIntent,
  stripeVerifyPayment,
  stripeRefund,
  paypalCreateOrder,
  paypalCaptureOrder,
  paypalRefund,
} from "./payment.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
=========================
STRIPE ROUTES
=========================
*/

router.post("/stripe/intent",  protect, stripeCreateIntent);

router.post("/stripe/verify",  protect, stripeVerifyPayment);

router.post("/stripe/refund",  protect, authorizeRoles("ADMIN", "SUPER_ADMIN"), stripeRefund);

/*
=========================
PAYPAL ROUTES
=========================
*/

router.post("/paypal/create-order", protect, paypalCreateOrder);

router.post("/paypal/capture",      protect, paypalCaptureOrder);

router.post("/paypal/refund",       protect, authorizeRoles("ADMIN", "SUPER_ADMIN"), paypalRefund);

export default router;