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


router.post("/", createOrderController);

router.get("/", getOrdersController);

router.get("/:id", getSingleOrderController);

router.patch("/:id/cancel", cancelOrderController);


router.get("/admin/:id", restrictTo("admin"), getSingleOrderAdminController);

export default router;
