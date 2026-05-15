import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import {
  cancelOrderController,
  createOrderController,
  getOrdersController,
  getSingleOrderController,
} from "./order.controller.js";

const router = express.Router();

router.use(authenticate);

/*
=========================
ORDER ROUTES
=========================
*/

router.post(
  "/",
  createOrderController
);

router.get(
  "/",
  getOrdersController
);

router.get(
  "/:id",
  getSingleOrderController
);

router.patch(
  "/:id/cancel",
  cancelOrderController
);

export default router;