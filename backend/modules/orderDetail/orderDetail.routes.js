import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import {
  getOrderDetailsController,
  getUserOrderDetailsController,
} from "./orderDetail.controller.js";

const router = express.Router();

/*
=========================
MIDDLEWARE
=========================
*/

router.use(authenticate);

/*
=========================
ROUTES
=========================
*/

router.get(
  "/order/:orderId",
  getOrderDetailsController
);

router.get(
  "/me",
  getUserOrderDetailsController
);

export default router;