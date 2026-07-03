import express from "express";

import { protectAdmin } from "../admin/admin.middleware.js";

import {
  getAllCartsController,
  getCartByUserIdController,
  adminAddToCartController,
  adminUpdateCartItemController,
  adminRemoveCartItemController,
  adminClearCartController,
} from "./cart.admin.controller.js";

const router = express.Router();

// Admin-only — separate from cart.routes.js (which is protect + user-scoped).
// Same lesson as dashboard.routes.js: admin auth uses protectAdmin, not protect.
router.use(protectAdmin);

router.get("/", getAllCartsController);
router.get("/:userId", getCartByUserIdController);
router.post("/:userId/items", adminAddToCartController);
router.put("/:userId/items/:productId", adminUpdateCartItemController);
router.delete("/:userId/items/:productId", adminRemoveCartItemController);
router.delete("/:userId", adminClearCartController);

export default router;
