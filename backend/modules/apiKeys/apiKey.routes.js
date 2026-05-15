import express from "express";

import {
  createApiKeyController,
  deleteApiKeyController,
  getApiKeysController,
  getSingleApiKeyController,
} from "./apiKey.controller.js";

const router = express.Router();

/*
=========================
API KEY ROUTES
=========================
*/

router.get(
  "/",
  getApiKeysController
);

router.get(
  "/:id",
  getSingleApiKeyController
);

router.post(
  "/",
  createApiKeyController
);

router.delete(
  "/:id",
  deleteApiKeyController
);

export default router;