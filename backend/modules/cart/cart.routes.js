import express from "express";

import { protect } from "../auth/auth.middleware.js";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";

const router = express.Router();

/*
=========================
CART ROUTES
=========================
*/

router.use(protect);

router.get("/", getCartController);

router.post("/", addToCartController);

router.put("/:productId", updateCartItemController);

router.delete("/:productId", removeCartItemController);

router.delete("/", clearCartController);

export default router;
