import express from "express";

import { protect, restrictTo } from "../auth/auth.middleware.js";
import {
  cancelOrderController,
  createOrderController,
  getOrdersController,
  getSingleOrderController,
  getSingleOrderAdminController,
} from "./order.controller.js";

const router = express.Router();

router.use(protect);

/*
=========================
CUSTOMER ORDER ROUTES
=========================
*/

router.post("/", createOrderController);

router.get("/", getOrdersController);

router.get("/:id", getSingleOrderController);

router.patch("/:id/cancel", cancelOrderController);

/*
=========================
ADMIN ORDER ROUTES
=========================
protect already applied globally above via router.use(protect).
restrictTo("admin") is layered on top of this specific route only.
*/

router.get("/admin/:id", restrictTo("admin"), getSingleOrderAdminController);

export default router;
