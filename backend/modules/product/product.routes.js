import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "./product.controller.js";

const router = express.Router();

/*
=========================
PUBLIC ROUTES
=========================
*/

router.get(
  "/",
  getProductsController
);

router.get(
  "/:id",
  getProductController
);

/*
=========================
ADMIN ROUTES (PROTECTED)
=========================
*/

router.post(
  "/",
  authenticate,
  createProductController
);

router.put(
  "/:id",
  authenticate,
  updateProductController
);

router.delete(
  "/:id",
  authenticate,
  deleteProductController
);

export default router;