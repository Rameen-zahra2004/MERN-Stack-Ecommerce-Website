import express from "express";

import { protect } from "../auth/auth.middleware.js";
import {
  getRevenueController,
  createRevenueSnapshotController,
} from "./revenue.controller.js";

const router = express.Router();


router.get("/", protect, getRevenueController);

router.post("/snapshot", protect, createRevenueSnapshotController);

export default router;
