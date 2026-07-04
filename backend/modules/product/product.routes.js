import express from "express";

import { protect } from "../auth/auth.middleware.js"; // adjust path if needed
import upload, { uploadErrorHandler } from "../../middleware/upload.js"; // adjust path to your actual upload.js location

import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "./product.controller.js";

import {
  uploadProductImagesController,
  deleteProductImageController,
  reorderProductImagesController,
} from "./product.image.controller.js";

const router = express.Router();


router.get("/", getProductsController);

router.get("/:id", getProductController);


router.post("/", protect, createProductController);

router.put("/:id", protect, updateProductController);

router.delete("/:id", protect, deleteProductController);

// Helper to wrap multer so its errors are catchable
const runMulter = (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) return uploadErrorHandler(err, req, res, next);
    next();
  });
};

// Replace the old route:
router.post(
  "/:id/images",
  protect,
  runMulter, // ← replaces upload.array + uploadErrorHandler
  uploadProductImagesController,
);
router.delete("/:id/images/:imageId", protect, deleteProductImageController);

router.patch("/:id/images/reorder", protect, reorderProductImagesController);

export default router;
