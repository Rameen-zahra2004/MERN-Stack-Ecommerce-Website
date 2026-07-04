import express from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";

import {
  createApiKeyController,
  deleteApiKeyController,
  getApiKeysController,
  getSingleApiKeyController,
} from "./apiKey.controller.js";

const router = express.Router();


// FIX (C10/C11): require admin auth for all API key management
router.use(protect, restrictTo("admin"));

router.get("/", getApiKeysController);
router.get("/:id", getSingleApiKeyController);
router.post("/", createApiKeyController);
router.delete("/:id", deleteApiKeyController);

export default router;
