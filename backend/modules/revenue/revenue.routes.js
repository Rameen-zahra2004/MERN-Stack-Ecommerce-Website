import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import {
  getRevenueController,
  createRevenueSnapshotController,
} from "./revenue.controller.js";

const router = express.Router();

/*
=========================
ADMIN ONLY (YOU SHOULD ADD ROLE CHECK LATER)
=========================
*/

router.get(
  "/",
  authenticate,
  getRevenueController
);

router.post(
  "/snapshot",
  authenticate,
  createRevenueSnapshotController
);

export default router;